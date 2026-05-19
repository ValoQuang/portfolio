"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { skillGroups, education } from "@/lib/data";

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      id="instruments"
      ref={ref}
      className="relative min-h-[100dvh] flex items-center px-6 py-24"
    >
      <motion.div
        style={{ opacity, y }}
        className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-10"
      >
        <div className="md:col-span-3 md:col-start-2">
          <p className="text-[11px] tracked text-amber font-mono">02 / Instruments</p>
          <div className="hairline mt-4 w-16" />
          <p className="mt-6 font-display text-bone text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] tracking-tight">
            The tools I reach for first.
          </p>
        </div>

        <div className="md:col-span-7 grid sm:grid-cols-3 gap-x-8 gap-y-12">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] tracked text-bone-dim font-mono mb-4">
                {group.title}
              </p>
              <ul className="space-y-2.5 text-bone text-sm">
                {group.items.map((item) => (
                  <li key={item} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="md:col-span-10 md:col-start-2 mt-16">
          <div className="hairline w-full" />
          <div className="mt-8 grid sm:grid-cols-2 gap-8">
            {education.map((e) => (
              <div key={e.school}>
                <p className="text-[11px] tracked text-bone-dim font-mono mb-2">
                  {e.period}
                </p>
                <p className="font-display text-bone text-xl tracking-tight">
                  {e.school}
                </p>
                <p className="text-bone-dim text-sm mt-1">
                  {e.track} — {e.place}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
