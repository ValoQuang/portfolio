"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PlanetSpec = {
  name: string;
  size: number;
  distance: number;
  speed: number;
  angle: number;
  color: string;
  emissive?: string;
  ring?: { inner: number; outer: number; color: string; opacity: number };
};

const PLANETS: PlanetSpec[] = [
  { name: "mercury", size: 0.06, distance: 1.30, speed: 0.41, angle: 2.1, color: "#8C7B6B" },
  { name: "venus",   size: 0.10, distance: 1.75, speed: 0.16, angle: 4.8, color: "#D9A86A" },
  { name: "earth",   size: 0.11, distance: 2.25, speed: 0.10, angle: 3.45, color: "#5B8FB9", emissive: "#1E3A5F" },
  { name: "mars",    size: 0.08, distance: 2.80, speed: 0.053, angle: 0.9, color: "#B05A3A" },
  { name: "jupiter", size: 0.24, distance: 3.70, speed: 0.0084, angle: 2.7, color: "#C9A37A" },
  { name: "saturn",  size: 0.20, distance: 4.55, speed: 0.0034, angle: 5.8, color: "#D6BE8A",
    ring: { inner: 1.55, outer: 2.20, color: "#E8A87C", opacity: 0.55 } },
  { name: "uranus",  size: 0.14, distance: 5.35, speed: 0.0012, angle: 1.2, color: "#9FD0CE" },
  { name: "neptune", size: 0.13, distance: 6.05, speed: 0.00061, angle: 6.1, color: "#6F8FCB" },
];

type Props = {
  position?: [number, number, number];
  scale?: number;
  tilt?: number;
  speedFactor?: number;
};

function OrbitRing({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.RingGeometry(radius - 0.004, radius + 0.004, 128);
    return g;
  }, [radius]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} geometry={geometry}>
      <meshBasicMaterial
        color="#B7B0A1"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
    if (haloRef.current) {
      const t = performance.now() * 0.0008;
      const s = 1 + Math.sin(t) * 0.04;
      haloRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshBasicMaterial color="#FBE3CD" />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshBasicMaterial color="#E8A87C" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial color="#C97A4A" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <pointLight color="#FBE3CD" intensity={2.4} distance={14} decay={1.6} />
    </group>
  );
}

function Planet({ spec, speedFactor }: { spec: PlanetSpec; speedFactor: number }) {
  const pivot = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const angle = useRef(spec.angle);

  useFrame((_, delta) => {
    angle.current += delta * spec.speed * speedFactor;
    if (pivot.current) {
      pivot.current.position.x = Math.cos(angle.current) * spec.distance;
      pivot.current.position.z = Math.sin(angle.current) * spec.distance;
    }
    if (body.current) body.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={pivot}>
      <mesh ref={body}>
        <sphereGeometry args={[spec.size, 24, 24]} />
        <meshStandardMaterial
          color={spec.color}
          emissive={spec.emissive ?? "#000000"}
          emissiveIntensity={spec.emissive ? 0.25 : 0}
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>
      {spec.ring && (
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry
            args={[spec.size * spec.ring.inner, spec.size * spec.ring.outer, 64]}
          />
          <meshBasicMaterial
            color={spec.ring.color}
            transparent
            opacity={spec.ring.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

export function SolarSystem({
  position = [-13, 6.5, -28],
  scale = 1,
  tilt = -0.25,
  speedFactor = 40,
}: Props) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.012;
  });

  return (
    <group position={position} scale={scale} rotation={[tilt, 0, 0.18]}>
      <group ref={group}>
        <Sun />
        {PLANETS.map((p) => (
          <OrbitRing key={`${p.name}-ring`} radius={p.distance} />
        ))}
        {PLANETS.map((p) => (
          <Planet key={p.name} spec={p} speedFactor={speedFactor} />
        ))}
      </group>
    </group>
  );
}
