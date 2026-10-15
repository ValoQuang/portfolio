"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  size: number;
  color: string;
};

/** A chapter marker — a holographic data core hovering over the street. */
export function DataCore({ position, size, color }: Props) {
  const shell = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.LineSegments>(null);

  const glow = useMemo(() => new THREE.Color(color).multiplyScalar(1.6), [color]);
  const coreEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(size * 0.55)),
    [size],
  );

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += dt * 0.25;
      shell.current.rotation.x += dt * 0.08;
    }
    if (core.current) {
      core.current.rotation.y -= dt * 0.7;
      core.current.position.y = Math.sin(t * 1.3) * 0.08;
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.45;
    if (ringB.current) ringB.current.rotation.x += dt * 0.32;
  });

  return (
    <group position={position} scale={0.62}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[size * 1.1, 1]} />
        <meshBasicMaterial color={glow} wireframe transparent opacity={0.55} toneMapped={false} />
      </mesh>

      <lineSegments ref={core} geometry={coreEdges}>
        <lineBasicMaterial color="#F4F1FF" toneMapped={false} />
      </lineSegments>

      <mesh ref={ringA} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[size * 1.75, 0.014, 6, 120]} />
        <meshBasicMaterial color={glow} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[size * 2.05, 0.008, 6, 120]} />
        <meshBasicMaterial color={glow} transparent opacity={0.5} toneMapped={false} />
      </mesh>

      {/* uplink beam into the haze */}
      <mesh position={[0, 15, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 30, 6, 1, true]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Ring gate the camera threads through on arrival and at the end of the street. */
export function HoloGate({
  position,
  radius = 3.2,
  color,
  accent,
}: {
  position: [number, number, number];
  radius?: number;
  color: string;
  accent: string;
}) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const main = useMemo(() => new THREE.Color(color).multiplyScalar(1.5), [color]);
  const sub = useMemo(() => new THREE.Color(accent).multiplyScalar(1.3), [accent]);

  useFrame((_, dt) => {
    if (outer.current) outer.current.rotation.z += dt * 0.12;
    if (inner.current) inner.current.rotation.z -= dt * 0.3;
  });

  return (
    <group position={position}>
      <mesh ref={outer}>
        <torusGeometry args={[radius, 0.035, 6, 6]} />
        <meshBasicMaterial color={main} toneMapped={false} />
      </mesh>
      <mesh ref={inner}>
        <ringGeometry args={[radius * 0.84, radius * 0.87, 64, 1, 0, Math.PI * 1.4]} />
        <meshBasicMaterial color={sub} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}
