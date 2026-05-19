"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function OrbitIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const letter = useTransform(scrollYProgress, [0, 1], [0.05, 0.5]);

  return (
    <section
      id="orbit"
      ref={ref}
      className="relative min-h-[80dvh] flex items-center px-6"
    >
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto w-full text-center">
        <p className="text-[11px] tracked text-amber font-mono">
          <span className="glyph-divider">02 / Orbit</span>
        </p>
        <motion.h2
          style={{ letterSpacing: useTransform(letter, (v) => `${v}em`) }}
          className="mt-10 font-display text-bone text-[clamp(2rem,7vw,6rem)] leading-[1] font-light"
        >
          Chapters
        </motion.h2>
        <p className="mt-8 max-w-md mx-auto text-bone-dim text-sm leading-relaxed">
          Three orbits, three gravities. Scroll past each to see what pulled me in
          and what I left behind.
        </p>
      </motion.div>
    </section>
  );
}
