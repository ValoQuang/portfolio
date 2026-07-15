"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// The band sits far enough away to read as sky, but the camera travels a long
// way down the tunnel — so we anchor it to the camera each frame (skybox
// behaviour) to keep the Milky Way omnipresent through the whole journey.

type Props = {
  count?: number;
  distance?: number;
  /** gaussian half-thickness of the band, in radians of galactic latitude */
  spread?: number;
  rotation?: [number, number, number];
  size?: number;
  opacity?: number;
};

/**
 * The Milky Way as a great-circle band of faint, dust-lit stars.
 * Latitude is gaussian-biased toward the galactic equator and brightness
 * swells toward the galactic centre, giving a real bulge-and-arms haze.
 * Rendered additively far behind everything so the bloom pass turns the
 * dense core into a soft glow rather than a field of dots.
 */
export function GalacticBand({
  count = 9000,
  distance = 118,
  spread = 0.17,
  rotation = [0.62, 0.4, 0.95],
  size = 1.4,
  opacity = 0.9,
}: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const follow = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // warm bulge core → cooler arms
    const core = new THREE.Color("#ffe7c4");
    const mid = new THREE.Color("#e9ecff");
    const arm = new THREE.Color("#9fb0e0");

    for (let i = 0; i < count; i++) {
      // longitude uniform, latitude gaussian toward the plane (Box–Muller)
      const l = Math.random() * Math.PI * 2;
      const u1 = Math.max(1e-4, Math.random());
      const u2 = Math.random();
      const g = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const b = g * spread;

      const cb = Math.cos(b);
      const dir = new THREE.Vector3(cb * Math.cos(l), Math.sin(b), cb * Math.sin(l));
      const r = distance * (0.86 + Math.random() * 0.28);
      positions[i * 3 + 0] = dir.x * r;
      positions[i * 3 + 1] = dir.y * r;
      positions[i * 3 + 2] = dir.z * r;

      // proximity to the galactic centre (l ≈ 0) drives the bulge brightness
      const centreBias = Math.pow((Math.cos(l) + 1) * 0.5, 2.2);
      const latFade = Math.exp(-(b * b) / (2 * spread * spread));

      // dust lanes — random extinction darkening
      const dust = Math.random() < 0.16 ? 0.25 + Math.random() * 0.35 : 1;

      const c = mid.clone();
      c.lerp(core, centreBias * 0.8);
      c.lerp(arm, (1 - latFade) * 0.5 * (1 - centreBias));
      const bright = (0.3 + 0.7 * latFade) * (0.45 + 0.55 * centreBias) * dust;
      c.multiplyScalar(bright);

      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.5 + Math.pow(Math.random(), 3) * 2.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const u = {
      uSize: { value: size },
      uOpacity: { value: opacity },
      uPixelRatio: { value: 1 },
    };

    return { geometry: geo, uniforms: u };
  }, [count, distance, spread, size, opacity]);

  useFrame(() => {
    if (follow.current) follow.current.position.copy(camera.position);
    if (matRef.current) {
      matRef.current.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);
    }
  });

  return (
    <group ref={follow}>
      <points geometry={geometry} rotation={rotation}>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={VERT}
          fragmentShader={FRAG}
        />
      </points>
    </group>
  );
}

const VERT = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aSize * uPixelRatio * (320.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 2.0) * uOpacity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;
