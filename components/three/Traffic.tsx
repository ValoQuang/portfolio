"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MAGENTA, mulberry32 } from "@/lib/palette";

type Car = { x: number; y: number; z: number; dir: number; speed: number };

const Z_MIN = -210;
const Z_MAX = 110;
const LANES_X = [-4.6, -3.2, 3.2, 4.6];
const LANES_Y = [7, 9.5, 12.5, 16];

/** Flying traffic — head/tail light pairs drifting along stacked sky lanes. */
export function Traffic({ count = 44 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const cars = useMemo<Car[]>(() => {
    const rand = mulberry32(88);
    return Array.from({ length: count }, (_, i) => {
      const lane = i % LANES_X.length;
      return {
        x: LANES_X[lane],
        y: LANES_Y[Math.floor(rand() * LANES_Y.length)] + (rand() - 0.5),
        z: Z_MIN + rand() * (Z_MAX - Z_MIN),
        dir: lane < 2 ? 1 : -1,
        speed: 6 + rand() * 9,
      };
    });
  }, [count]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const head = new THREE.Color("#F4F1FF").multiplyScalar(1.6);
    const tail = new THREE.Color(MAGENTA).multiplyScalar(1.4);
    // Moving toward camera (+z) shows headlights; away shows tail lights.
    cars.forEach((c, i) => mesh.setColorAt(i, c.dir > 0 ? head : tail));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [cars]);

  useFrame((_, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    const step = Math.min(dt, 0.05);
    cars.forEach((c, i) => {
      c.z += c.dir * c.speed * step;
      if (c.z > Z_MAX) c.z = Z_MIN;
      if (c.z < Z_MIN) c.z = Z_MAX;
      dummy.position.set(c.x, c.y, c.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.55, 0.12, 0.9]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
