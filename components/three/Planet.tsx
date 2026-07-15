"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  size: number;
  hue: [number, number, number];
  ring?: boolean;
  spin?: number;
};

export function Planet({ position, size, hue, ring = false, spin = 0.14 }: Props) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);

  const colorA = useMemo(
    () => new THREE.Color().setHSL(hue[0], hue[1], hue[2]),
    [hue],
  );
  const colorB = useMemo(
    () =>
      new THREE.Color().setHSL(
        (hue[0] + 0.06) % 1,
        hue[1] * 0.6,
        Math.min(1, hue[2] + 0.2),
      ),
    [hue],
  );

  const atmoUniforms = useMemo(
    () => ({
      uColor: { value: colorB.clone() },
      uPower: { value: 3.2 },
      uIntensity: { value: 1.15 },
    }),
    [colorB],
  );

  useFrame((_, delta) => {
    if (body.current) body.current.rotation.y += delta * spin;
    if (group.current) group.current.rotation.z += delta * 0.015;
  });

  return (
    <group ref={group} position={position}>
      {/* body — smooth planetary sphere with a soft terminator */}
      <mesh ref={body}>
        <icosahedronGeometry args={[size, 6]} />
        <meshStandardMaterial
          color={colorA}
          emissive={colorB}
          emissiveIntensity={0.12}
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>

      {/* atmosphere — fresnel limb glow, additive so bloom catches the edge */}
      <mesh scale={1.14}>
        <icosahedronGeometry args={[size, 5]} />
        <shaderMaterial
          uniforms={atmoUniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
          vertexShader={ATMO_VERT}
          fragmentShader={ATMO_FRAG}
        />
      </mesh>

      {ring && (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[size * 1.55, size * 2.15, 96]} />
          <meshBasicMaterial
            color="#E8A87C"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = 1.0 - max(dot(vNormal, vView), 0.0);
    float glow = pow(rim, uPower) * uIntensity;
    gl_FragColor = vec4(uColor * glow, glow);
  }
`;
