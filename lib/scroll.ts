"use client";

import { useEffect, useRef, useState } from "react";

type Listener = (progress: number) => void;

const listeners = new Set<Listener>();
let lastProgress = 0;
let frame = 0;
let attached = false;

function compute(): number {
  if (typeof window === "undefined") return 0;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function tick() {
  frame = 0;
  const p = compute();
  if (Math.abs(p - lastProgress) < 0.00005) return;
  lastProgress = p;
  listeners.forEach((l) => l(p));
}

function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(tick);
}

function attach() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

export function subscribeScroll(l: Listener): () => void {
  attach();
  listeners.add(l);
  l(lastProgress);
  return () => {
    listeners.delete(l);
  };
}

export function useScrollProgress(): number {
  const [p, setP] = useState(0);
  useEffect(() => subscribeScroll(setP), []);
  return p;
}

export function useScrollProgressRef() {
  const ref = useRef(0);
  useEffect(() => subscribeScroll((p) => (ref.current = p)), []);
  return ref;
}
