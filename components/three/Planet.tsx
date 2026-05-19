"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  size: number;
  hue: [number, number, number];
  ring?: boolean;
  spin?: number;
};

export function Planet({ position, size, hue, ring = false, spin = 0.18 }: Props) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);

  const colorA = new THREE.Color().setHSL(hue[0], hue[1], hue[2]);
  const colorB = new THREE.Color().setHSL((hue[0] + 0.06) % 1, hue[1] * 0.6, Math.min(1, hue[2] + 0.2));

  useFrame((_, delta) => {
    if (body.current) body.current.rotation.y += delta * spin;
    if (group.current) group.current.rotation.z += delta * 0.02;
  });

  return (
    <group ref={group} position={position}>
      <mesh ref={body}>
        <icosahedronGeometry args={[size, 4]} />
        <meshStandardMaterial
          color={colorA}
          emissive={colorB}
          emissiveIntensity={0.18}
          roughness={0.85}
          metalness={0.05}
          flatShading
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 1.08, 24, 24]} />
        <meshBasicMaterial color={colorB} transparent opacity={0.06} />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[size * 1.55, size * 2.05, 64]} />
          <meshBasicMaterial
            color="#E8A87C"
            transparent
            opacity={0.42}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
