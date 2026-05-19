"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  count?: number;
  radius?: number;
  length?: number;
  color?: string;
};

export function Wormhole({
  count = 900,
  radius = 4.2,
  length = 36,
  color = "#E8A87C",
}: Props) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = Math.random() * Math.PI * 2;
      const jitter = 0.7 + Math.random() * 0.5;
      const r = radius * jitter;
      arr[i * 3 + 0] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle) * r;
      arr[i * 3 + 2] = -t * length;
    }
    return arr;
  }, [count, radius, length]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}
