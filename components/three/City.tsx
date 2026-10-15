"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  CYAN,
  FLOOR_Y,
  FOG_FAR,
  FOG_NEAR,
  HAZE,
  MAGENTA,
  NEON,
  mulberry32,
} from "@/lib/palette";

type Building = { x: number; y: number; z: number; w: number; h: number; d: number };
type Sign = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  rotY: number;
  color: THREE.Color;
  seed: number;
  kind: number; // 0 strip, 1 banner, 2 blade
};

const Z_START = 112;
const Z_END = -215;

function buildLayout() {
  const rand = mulberry32(2077);
  const buildings: Building[] = [];
  const signs: Sign[] = [];
  const palette = [NEON, CYAN, MAGENTA, MAGENTA, CYAN].map((c) => new THREE.Color(c));
  const pick = () => palette[Math.floor(rand() * palette.length)].clone();

  for (const side of [-1, 1]) {
    // Front row — the street wall the camera flies past
    let z = Z_START;
    while (z > Z_END) {
      const d = 3 + rand() * 5;
      const w = 4 + rand() * 6;
      const h = 8 + rand() * rand() * 34;
      const inner = 6.4 + rand() * 1.4;
      const cz = z - d / 2;
      buildings.push({ x: side * (inner + w / 2), y: FLOOR_Y + h / 2, z: cz, w, h, d });

      const face = side * (inner - 0.04);
      const faceRot = -side * (Math.PI / 2);
      const top = Math.min(h, 22);

      if (rand() < 0.7) {
        const sh = 2 + rand() * 4;
        signs.push({
          x: face,
          y: FLOOR_Y + 1.5 + sh / 2 + rand() * Math.max(0, top - sh - 2),
          z: cz + (rand() - 0.5) * d * 0.6,
          w: 0.14 + rand() * 0.14,
          h: sh,
          rotY: faceRot,
          color: pick(),
          seed: rand(),
          kind: 0,
        });
      }
      if (rand() < 0.4) {
        const sw = Math.min(d * 0.85, 1.5 + rand() * 2.5);
        signs.push({
          x: face,
          y: FLOOR_Y + 2.5 + rand() * Math.max(1, top - 4),
          z: cz,
          w: sw,
          h: 0.35 + rand() * 0.45,
          rotY: faceRot,
          color: pick(),
          seed: rand(),
          kind: 1,
        });
      }
      if (rand() < 0.42) {
        // Blade sign — sticks out of the wall and faces down the street
        const bh = 1.8 + rand() * 3.2;
        signs.push({
          x: side * (inner - 0.55),
          y: FLOOR_Y + 2.2 + bh / 2 + rand() * Math.max(0, top - bh - 3),
          z: cz + (rand() - 0.5) * d * 0.5,
          w: 0.7 + rand() * 0.3,
          h: bh,
          rotY: 0,
          color: pick(),
          seed: rand(),
          kind: 2,
        });
      }

      z -= d + 0.3 + rand() * 1.1;
    }

    // Back row — taller skyline silhouette
    z = Z_START;
    while (z > Z_END) {
      const d = 6 + rand() * 8;
      const w = 6 + rand() * 8;
      const h = 22 + rand() * 52;
      const inner = 16 + rand() * 7;
      buildings.push({ x: side * (inner + w / 2), y: FLOOR_Y + h / 2, z: z - d / 2, w, h, d });
      z -= d + rand() * 3;
    }
  }

  // Far wall closing both ends of the street
  for (const endZ of [Z_END - 8, Z_START + 10]) {
    for (let i = -3; i <= 3; i++) {
      const h = 30 + rand() * 50;
      buildings.push({ x: i * 9 + (rand() - 0.5) * 3, y: FLOOR_Y + h / 2, z: endZ, w: 8, h, d: 6 });
    }
  }

  return { buildings, signs };
}

function Buildings({ items }: { items: Building[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    items.forEach((b, i) => {
      m.compose(
        new THREE.Vector3(b.x, b.y, b.z),
        new THREE.Quaternion(),
        new THREE.Vector3(b.w, b.h, b.d),
      );
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFog: { value: new THREE.Color(HAZE) },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
      uCyan: { value: new THREE.Color(CYAN) },
      uMagenta: { value: new THREE.Color(MAGENTA) },
      uFloor: { value: FLOOR_Y },
    }),
    [],
  );

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={BUILDING_VERT}
        fragmentShader={BUILDING_FRAG}
      />
    </instancedMesh>
  );
}

function Signs({ items }: { items: Sign[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const { colors, seeds, kinds } = useMemo(() => {
    const colors = new Float32Array(items.length * 3);
    const seeds = new Float32Array(items.length);
    const kinds = new Float32Array(items.length);
    items.forEach((s, i) => {
      s.color.toArray(colors, i * 3);
      seeds[i] = s.seed;
      kinds[i] = s.kind;
    });
    return { colors, seeds, kinds };
  }, [items]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    items.forEach((s, i) => {
      q.setFromAxisAngle(up, s.rotY);
      m.compose(new THREE.Vector3(s.x, s.y, s.z), q, new THREE.Vector3(s.w, s.h, 1));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFog: { value: new THREE.Color(HAZE) },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
    }),
    [],
  );

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} frustumCulled={false}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <instancedBufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <instancedBufferAttribute attach="attributes-aKind" args={[kinds, 1]} />
      </planeGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={SIGN_VERT}
        fragmentShader={SIGN_FRAG}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function Street() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFog: { value: new THREE.Color(HAZE) },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
      uNeon: { value: new THREE.Color(NEON) },
      uCyan: { value: new THREE.Color(CYAN) },
      uMagenta: { value: new THREE.Color(MAGENTA) },
    }),
    [],
  );

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, (Z_START + Z_END) / 2]}>
      <planeGeometry args={[80, Z_START - Z_END + 40]} />
      <shaderMaterial uniforms={uniforms} vertexShader={STREET_VERT} fragmentShader={STREET_FRAG} />
    </mesh>
  );
}

export function City() {
  const { buildings, signs } = useMemo(buildLayout, []);
  return (
    <>
      <Street />
      <Buildings items={buildings} />
      <Signs items={signs} />
    </>
  );
}

const FOG_GLSL = /* glsl */ `
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  vec3 applyFog(vec3 c, float depth) {
    return mix(c, uFog, smoothstep(uFogNear, uFogFar, depth));
  }
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
`;

const BUILDING_VERT = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vSeed;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalW = normal; // boxes are axis-aligned — object normal is world normal
    vec3 t = instanceMatrix[3].xyz;
    vSeed = fract(sin(dot(t.xz, vec2(12.9898, 78.233))) * 43758.5453);
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const BUILDING_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCyan;
  uniform vec3 uMagenta;
  uniform float uFloor;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vSeed;
  varying float vDepth;
  ${FOG_GLSL}
  void main() {
    vec3 n = abs(vNormalW);
    vec3 base = vec3(0.016, 0.014, 0.026);
    vec3 col = base;

    if (n.y < 0.5) {
      vec2 uv = n.x > 0.5 ? vWorld.zy : vWorld.xy;
      vec2 cell = floor(uv / vec2(0.55, 0.8));
      vec2 f = fract(uv / vec2(0.55, 0.8));
      float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.28, f.y) * step(f.y, 0.72);

      float h = hash21(cell + vSeed * 91.0);
      float lit = step(0.8, h);
      // a handful of windows buzz like failing tubes
      float buzz = step(0.988, h) * step(0.55, fract(sin(floor(uTime * 9.0) + h * 40.0) * 43758.5));
      lit = max(lit - buzz, 0.0);

      float pick = hash21(cell * 1.7 + vSeed * 13.0);
      vec3 warm = vec3(1.0, 0.72, 0.42);
      vec3 wc = pick < 0.62 ? warm : (pick < 0.84 ? uCyan : uMagenta);
      col += win * lit * wc * (0.22 + 0.3 * hash21(cell + 3.1));
      col += win * (1.0 - lit) * vec3(0.01, 0.012, 0.024);

      // neon spill climbing up from the street
      float spill = exp(-(vWorld.y - uFloor) * 0.4);
      col += spill * mix(uMagenta, uCyan, vSeed) * 0.035;
    } else {
      col *= 0.5;
    }

    gl_FragColor = vec4(applyFog(col, vDepth), 1.0);
  }
`;

const SIGN_VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSeed;
  attribute float aKind;
  varying vec3 vColor;
  varying float vSeed;
  varying float vKind;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vColor = aColor;
    vSeed = aSeed;
    vKind = aKind;
    vUv = uv;
    vec4 mv = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const SIGN_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vSeed;
  varying float vKind;
  varying vec2 vUv;
  varying float vDepth;
  ${FOG_GLSL}
  void main() {
    // tube border
    vec2 e = min(vUv, 1.0 - vUv);
    float edge = 1.0 - smoothstep(0.0, 0.08, min(e.x, e.y));
    float fill = 0.18;

    if (vKind > 1.5) {
      // blade sign: stacked glyph blocks
      float row = floor(vUv.y * 7.0);
      float g = step(0.3, hash21(vec2(row, floor(vSeed * 50.0))));
      float inRow = step(0.25, fract(vUv.y * 7.0)) * step(0.22, vUv.x) * step(vUv.x, 0.78);
      fill = 0.15 + g * inRow * 0.75;
    } else if (vKind > 0.5) {
      // banner: scrolling segmented ticker
      float seg = floor(vUv.x * 14.0 - uTime * (1.5 + vSeed * 2.0));
      float on = step(0.45, hash21(vec2(seg, vSeed * 17.0)));
      float band = step(0.3, vUv.y) * step(vUv.y, 0.7);
      fill = 0.12 + on * band * 0.7;
    } else {
      fill = 0.9;
    }

    float flicker = 1.0;
    if (vSeed > 0.86) {
      float t = floor(uTime * 12.0 + vSeed * 100.0);
      flicker = mix(0.15, 1.0, step(0.18, hash21(vec2(t, vSeed))));
    }

    float a = max(edge, fill) * flicker;
    vec3 c = vColor * a * 1.2;
    float fog = smoothstep(uFogNear, uFogFar * 1.2, vDepth);
    gl_FragColor = vec4(c * (1.0 - fog), a * (1.0 - fog));
  }
`;

const STREET_VERT = /* glsl */ `
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const STREET_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uNeon;
  uniform vec3 uCyan;
  uniform vec3 uMagenta;
  varying vec3 vWorld;
  varying float vDepth;
  ${FOG_GLSL}
  void main() {
    float x = vWorld.x;
    float z = vWorld.z;
    vec3 col = vec3(0.018, 0.016, 0.028);

    // wet-asphalt reflections: neon smeared along the street
    float streak = hash21(vec2(floor(x * 1.6), 0.0));
    float wave = 0.5 + 0.5 * sin(z * 0.08 + streak * 6.2831);
    vec3 refl = mix(uMagenta, uCyan, streak);
    col += refl * wave * 0.05 * smoothstep(7.5, 2.0, abs(x));

    // dashed centre line
    float dash = step(0.5, fract(z * 0.18)) * (1.0 - smoothstep(0.04, 0.09, abs(x)));
    col += uNeon * dash * 0.85;

    // kerb lines
    float kerb = 1.0 - smoothstep(0.02, 0.08, abs(abs(x) - 6.0));
    col += uCyan * kerb * 0.6;

    // faint survey grid
    vec2 g = abs(fract(vWorld.xz * 0.5) - 0.5);
    float grid = 1.0 - smoothstep(0.0, 0.03, min(g.x, g.y));
    col += uCyan * grid * 0.035;

    gl_FragColor = vec4(applyFog(col, vDepth), 1.0);
  }
`;
