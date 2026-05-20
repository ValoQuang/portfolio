"use client";

import { useEffect, useRef, useState } from "react";

export type IntroPhase = "loading" | "zoom" | "done";

type State = { phase: IntroPhase; progress: number };

const listeners = new Set<(s: State) => void>();
const state: State = { phase: "loading", progress: 0 };
let started = false;
let raf = 0;

const LOAD_MS = 500;
const ZOOM_MS = 1800;

function notify() {
  listeners.forEach((l) => l(state));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function startIntro() {
  if (started || typeof window === "undefined") return;
  started = true;

  const loadStart = performance.now();

  const loadTick = () => {
    const elapsed = performance.now() - loadStart;
    if (elapsed < LOAD_MS) {
      raf = requestAnimationFrame(loadTick);
      return;
    }
    state.phase = "zoom";
    notify();
    const zoomStart = performance.now();

    const zoomTick = () => {
      const e = performance.now() - zoomStart;
      const t = Math.min(1, e / ZOOM_MS);
      state.progress = easeOutCubic(t);
      notify();
      if (t < 1) {
        raf = requestAnimationFrame(zoomTick);
      } else {
        state.phase = "done";
        notify();
      }
    };
    raf = requestAnimationFrame(zoomTick);
  };
  raf = requestAnimationFrame(loadTick);
}

export function getIntroState(): State {
  return state;
}

export function subscribeIntro(l: (s: State) => void): () => void {
  listeners.add(l);
  l(state);
  return () => {
    listeners.delete(l);
  };
}

export function useIntro(): State {
  const [s, setS] = useState<State>(state);
  useEffect(() => subscribeIntro((next) => setS({ ...next })), []);
  return s;
}

export function useIntroRef() {
  const ref = useRef<State>(state);
  useEffect(
    () =>
      subscribeIntro((next) => {
        ref.current = next;
      }),
    [],
  );
  return ref;
}
