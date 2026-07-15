"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  count?: number;
  radius?: number;
  size?: number;
  /** subtle overall tint multiplied onto the physical star colors */
  color?: string;
  speed?: number;
  opacity?: number;
  fog?: boolean;
};

/**
 * Physically-flavoured starfield.
 * Star colours are sampled from an approximate stellar main-sequence
 * distribution (mostly white with a minority of blue-white and warm
 * K/M stars) and sizes follow a magnitude-like power law — a handful of
 * bright anchors among many faint pinpricks. Rendered additively so the
 * bloom pass in the composer treats bright stars as real light sources.
 */

// Approximate blackbody colours across spectral classes O → M.
const SPECTRUM: Array<[THREE.ColorRepresentation, number]> = [
  ["#aac4ff", 0.06], // O/B — hot blue-white (rare)
  ["#cfdcff", 0.16], // A — blue-white
  ["#f4f2ff", 0.30], // F — white
  ["#fff4e6", 0.24], // G — sun-like warm white
  ["#ffd9a6", 0.16], // K — amber
  ["#ffb680", 0.08], // M — cool orange-red
];

function pickSpectral(): THREE.Color {
  const r = Math.random();
  let acc = 0;
  for (const [hex, w] of SPECTRUM) {
    acc += w;
    if (r <= acc) return new THREE.Color(hex);
  }
  return new THREE.Color("#f4f2ff");
}

export function Starfield({
  count = 1800,
  radius = 60,
  size = 0.05,
  color = "#ffffff",
  speed = 0.012,
  opacity = 0.9,
  fog = true,
}: Props) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const gl = useThree((s) => s.gl);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const tint = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = pickSpectral().multiply(tint);
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // magnitude-like power law: most faint, a few bright anchors
      const m = Math.pow(Math.random(), 6);
      sizes[i] = 0.6 + m * 4.2;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const u = THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uTime: { value: 0 },
        uSize: { value: size },
        uOpacity: { value: opacity },
        uPixelRatio: { value: 1 },
      },
    ]);

    return { geometry: g, uniforms: u };
  }, [count, radius, size, color, opacity]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
      ref.current.rotation.x += delta * speed * 0.3;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        fog={fog}
        blending={THREE.AdditiveBlending}
        vertexShader={VERT}
        fragmentShader={FRAG}
      />
    </points>
  );
}

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vTwinkle;
  #include <fog_pars_vertex>
  void main() {
    vColor = aColor;
    vTwinkle = 0.72 + 0.28 * sin(uTime * 1.6 + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aSize * uPixelRatio * (320.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vTwinkle;
  #include <fog_pars_fragment>
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 1.7) * uOpacity * vTwinkle;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
    #include <fog_fragment>
  }
`;
