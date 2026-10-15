/** Scene colours — mirror the CSS tokens in app/globals.css. */
export const NEON = "#F0E14A";
export const CYAN = "#3DE0E0";
export const MAGENTA = "#FF3D8B";
export const SKY = "#06050A";
export const HAZE = "#10060E";

export const FLOOR_Y = -2.5;
export const FOG_NEAR = 18;
export const FOG_FAR = 130;

/** Deterministic PRNG so the city layout is identical on every load. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
