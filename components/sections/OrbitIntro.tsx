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
  const x = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section id="runtime" ref={ref} className="relative min-h-[80dvh] flex items-center px-6 overflow-hidden">
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8">
        <div className="md:col-span-10 md:col-start-2">
          <span className="tag">02 · Runtime</span>
          <motion.h2
            style={{ x }}
            className="mt-10 font-display font-bold uppercase text-transparent text-[clamp(3rem,12vw,11rem)] leading-[0.85] tracking-[-0.03em] [-webkit-text-stroke:1px_var(--chrome)]"
          >
            Run log<span className="text-neon [-webkit-text-stroke:0]">.</span>
          </motion.h2>
          <p className="mt-8 max-w-[44ch] md:ml-[30%] text-chrome-dim text-[17px] leading-relaxed">
            Three processes, newest first. Each one ran on a different stack and
            left something behind in the next.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
