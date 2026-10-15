"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { City } from "./City";
import { Rain } from "./Rain";
import { Traffic } from "./Traffic";
import { DataCore, HoloGate } from "./DataCore";
import { useScrollProgressRef } from "@/lib/scroll";
import { useIntroRef } from "@/lib/intro";
import { chapters } from "@/lib/data";
import { CYAN, HAZE, MAGENTA, NEON, SKY } from "@/lib/palette";

type Keyframe = { at: number; pos: THREE.Vector3; look: THREE.Vector3 };

const CORE_Z = [-58, -90, -122];

/** World-space anchors for each chapter core — kept in sync with <Scene>. */
const CORE_XY: Array<[number, number]> = [
  [1.2, 0.2],
  [-1.2, -0.3],
  [1.2, 0.2],
];

const CORE_COLORS = [NEON, CYAN, MAGENTA];

/** Sky dome — haze glowing up from the street, fading to black overhead. */
function Sky() {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(SKY) },
      uHorizon: { value: new THREE.Color(HAZE) },
      uGlow: { value: new THREE.Color(MAGENTA) },
    }),
    [],
  );
  useFrame(({ camera }) => {
    if (ref.current) ref.current.position.copy(camera.position);
  });
  return (
    <mesh ref={ref} frustumCulled={false}>
      <sphereGeometry args={[200, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
      />
    </mesh>
  );
}

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y, -1.0, 1.0);
    vec3 col = mix(uHorizon, uTop, smoothstep(-0.05, 0.45, h));
    col += uGlow * 0.05 * exp(-abs(h) * 9.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

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
  const wasIntro = useRef(true);

  const keyframes = useMemo<Keyframe[]>(
    () => [
      { at: 0.0,  pos: new THREE.Vector3(0, 0, 9),               look: new THREE.Vector3(0, 0, -2) },
      { at: 0.16, pos: new THREE.Vector3(0, 0, 2),               look: new THREE.Vector3(0, 0, -10) },
      { at: 0.34, pos: new THREE.Vector3(0, 0, -36),             look: new THREE.Vector3(0, 0, -52) },
      { at: 0.50, pos: new THREE.Vector3(3.6, 0.4, CORE_Z[0] + 6), look: new THREE.Vector3(0.4, 0.0, CORE_Z[0]) },
      { at: 0.66, pos: new THREE.Vector3(-3.4, -0.6, CORE_Z[1] + 6), look: new THREE.Vector3(-0.4, 0.0, CORE_Z[1]) },
      { at: 0.82, pos: new THREE.Vector3(3.0, 0.5, CORE_Z[2] + 6), look: new THREE.Vector3(0.4, 0.0, CORE_Z[2]) },
      { at: 1.0,  pos: new THREE.Vector3(0, 4.5, CORE_Z[2] - 22), look: new THREE.Vector3(0, 0, CORE_Z[2] - 6) },
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

    const justHandedOff = wasIntro.current;
    if (justHandedOff) {
      wasIntro.current = false;
      currentPos.current.copy(INTRO_END_POS);
      currentLook.current.copy(INTRO_END_LOOK);
      if (typeof window !== "undefined") window.scrollTo(0, 0);
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

    const k = justHandedOff ? 1 : Math.min(1, delta * 4.5);
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
      <color attach="background" args={[SKY]} />
      <fog attach="fog" args={[HAZE, 18, 130]} />

      <Sky />
      <City />
      <Traffic />
      <Rain count={1400} />

      <HoloGate position={[0, 0.2, -6]} color={NEON} accent={CYAN} />

      {chapters.map((c, i) => (
        <DataCore
          key={c.id}
          position={[CORE_XY[i][0], CORE_XY[i][1], CORE_Z[i]]}
          size={c.size}
          color={CORE_COLORS[i % CORE_COLORS.length]}
        />
      ))}

      <CameraRig />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.05}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.85}
          mipmapBlur
          radius={0.78}
        />
        <ChromaticAberration
          offset={CA_OFFSET}
          radialModulation
          modulationOffset={0.35}
        />
        <Vignette offset={0.3} darkness={0.62} eskil={false} />
      </EffectComposer>
    </>
  );
}

const CA_OFFSET = new THREE.Vector2(0.0016, 0.0009);

export function Universe() {
  // Start at a modest pixel ratio; drop to 1 if the frame rate sags, climb back if it recovers.
  const [dpr, setDpr] = useState(1.25);
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas
        flat
        dpr={dpr}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 55, near: 0.1, far: 220, position: [0, 0, 95] }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(1.5, window.devicePixelRatio))}
          flipflops={3}
          onFallback={() => setDpr(1)}
        />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
