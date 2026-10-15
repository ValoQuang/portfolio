"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CYAN, FLOOR_Y, mulberry32 } from "@/lib/palette";

type Props = { count?: number };

const SPAN_X = 26;
const SPAN_Z = 70;
const TOP = 22;

/** Rain streaks in a box that follows the camera down the street. */
export function Rain({ count = 2200 }: Props) {
  const group = useRef<THREE.Group>(null);

  const { positions, ends, seeds } = useMemo(() => {
    const rand = mulberry32(42);
    const positions = new Float32Array(count * 2 * 3);
    const ends = new Float32Array(count * 2);
    const seeds = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * SPAN_X;
      const y = rand() * (TOP - FLOOR_Y);
      const z = (rand() - 0.5) * SPAN_Z;
      const s = rand();
      for (let k = 0; k < 2; k++) {
        const j = i * 2 + k;
        positions.set([x, y, z], j * 3);
        ends[j] = k;
        seeds[j] = s;
      }
    }
    return { positions, ends, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(CYAN) },
      uHeight: { value: TOP - FLOOR_Y },
      uFloor: { value: FLOOR_Y },
    }),
    [],
  );

  useFrame(({ camera }, dt) => {
    uniforms.uTime.value += dt;
    if (group.current) group.current.position.z = camera.position.z - SPAN_Z * 0.35;
  });

  return (
    <group ref={group}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aEnd" args={[ends, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={RAIN_VERT}
          fragmentShader={RAIN_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

const RAIN_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uHeight;
  uniform float uFloor;
  attribute float aEnd;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    float speed = 14.0 + aSeed * 10.0;
    float len = 0.35 + aSeed * 0.45;
    vec3 p = position;
    p.y = uFloor + mod(position.y - uTime * speed, uHeight) + aEnd * len;
    p.x += aEnd * len * 0.12; // wind slant
    vAlpha = mix(0.0, 1.0, aEnd) * (0.18 + aSeed * 0.22);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vAlpha *= 1.0 - smoothstep(10.0, 45.0, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const RAIN_FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor * vAlpha, vAlpha);
  }
`;
