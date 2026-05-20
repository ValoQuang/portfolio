"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Starfield } from "./Starfield";
import { Wormhole } from "./Wormhole";
import { Planet } from "./Planet";
import { SolarSystem } from "./SolarSystem";
import { useScrollProgressRef } from "@/lib/scroll";
import { useIntroRef } from "@/lib/intro";
import { chapters } from "@/lib/data";

type Keyframe = { at: number; pos: THREE.Vector3; look: THREE.Vector3 };

const PLANET_Z = [-58, -90, -122];

function lerpVec(a: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) {
  out.x = a.x + (b.x - a.x) * t;
  out.y = a.y + (b.y - a.y) * t;
  out.z = a.z + (b.z - a.z) * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

const INTRO_START_POS = new THREE.Vector3(0, 0, 95);
const INTRO_START_LOOK = new THREE.Vector3(0, 0, -6);
const INTRO_END_POS = new THREE.Vector3(0, 0, 9);
const INTRO_END_LOOK = new THREE.Vector3(0, 0, -2);

function CameraRig() {
  const { camera } = useThree();
  const scrollRef = useScrollProgressRef();
  const introRef = useIntroRef();
  const targetPos = useRef(new THREE.Vector3().copy(INTRO_START_POS));
  const targetLook = useRef(new THREE.Vector3().copy(INTRO_START_LOOK));
  const currentPos = useRef(new THREE.Vector3().copy(INTRO_START_POS));
  const currentLook = useRef(new THREE.Vector3().copy(INTRO_START_LOOK));

  const keyframes = useMemo<Keyframe[]>(
    () => [
      { at: 0.0,  pos: new THREE.Vector3(0, 0, 9),               look: new THREE.Vector3(0, 0, -2) },
      { at: 0.16, pos: new THREE.Vector3(0, 0, 2),               look: new THREE.Vector3(0, 0, -10) },
      { at: 0.34, pos: new THREE.Vector3(0, 0, -36),             look: new THREE.Vector3(0, 0, -52) },
      { at: 0.50, pos: new THREE.Vector3(3.6, 0.4, PLANET_Z[0] + 6), look: new THREE.Vector3(0.4, 0.0, PLANET_Z[0]) },
      { at: 0.66, pos: new THREE.Vector3(-3.4, -0.6, PLANET_Z[1] + 6), look: new THREE.Vector3(-0.4, 0.0, PLANET_Z[1]) },
      { at: 0.82, pos: new THREE.Vector3(3.0, 0.5, PLANET_Z[2] + 6), look: new THREE.Vector3(0.4, 0.0, PLANET_Z[2]) },
      { at: 1.0,  pos: new THREE.Vector3(0, 4.5, PLANET_Z[2] - 22), look: new THREE.Vector3(0, 0, PLANET_Z[2] - 6) },
    ],
    [],
  );

  useFrame((_, delta) => {
    const intro = introRef.current;

    if (intro.phase !== "done") {
      const t = intro.phase === "zoom" ? intro.progress : 0;
      lerpVec(INTRO_START_POS, INTRO_END_POS, t, targetPos.current);
      lerpVec(INTRO_START_LOOK, INTRO_END_LOOK, t, targetLook.current);
      currentPos.current.copy(targetPos.current);
      currentLook.current.copy(targetLook.current);
      camera.position.copy(currentPos.current);
      camera.lookAt(currentLook.current);
      return;
    }

    const p = scrollRef.current;
    let a = keyframes[0];
    let b = keyframes[keyframes.length - 1];
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (p >= keyframes[i].at && p <= keyframes[i + 1].at) {
        a = keyframes[i];
        b = keyframes[i + 1];
        break;
      }
    }
    if (p >= keyframes[keyframes.length - 1].at) {
      a = keyframes[keyframes.length - 2];
      b = keyframes[keyframes.length - 1];
    }
    const span = Math.max(0.0001, b.at - a.at);
    const local = smoothstep(Math.min(1, Math.max(0, (p - a.at) / span)));
    lerpVec(a.pos, b.pos, local, targetPos.current);
    lerpVec(a.look, b.look, local, targetLook.current);

    const k = Math.min(1, delta * 4.5);
    currentPos.current.lerp(targetPos.current, k);
    currentLook.current.lerp(targetLook.current, k);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#06080F"]} />
      <fog attach="fog" args={["#06080F", 24, 90]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 4, 5]} intensity={0.9} color="#FBE3CD" />
      <pointLight position={[-8, -2, -40]} intensity={1.4} color="#E8A87C" distance={40} />
      <pointLight position={[0, 0, -90]} intensity={1.1} color="#9CC4FF" distance={50} />

      <Starfield count={1400} radius={70} size={0.045} />
      <Starfield count={500} radius={140} size={0.09} color="#B7B0A1" speed={0.004} />

      <SolarSystem position={[0, 0, -6]} scale={0.85} tilt={-0.22} speedFactor={6} />

      <group position={[0, 0, -22]}>
        <Wormhole />
      </group>

      {chapters.map((c, i) => (
        <Planet
          key={c.id}
          position={[i === 1 ? -1.2 : 1.2, i === 1 ? -0.3 : 0.2, PLANET_Z[i]]}
          size={c.size}
          hue={c.hue}
          ring={!!c.ring}
        />
      ))}

      <mesh position={[0, 0, PLANET_Z[2] - 18]}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#E8A87C" wireframe transparent opacity={0.18} />
      </mesh>

      <CameraRig />
    </>
  );
}

export function Universe() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 55, near: 0.1, far: 220, position: [0, 0, 95] }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
