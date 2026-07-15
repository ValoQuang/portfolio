"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { skillGroups, education } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      id="instruments"
      ref={ref}
      className="relative min-h-[100dvh] flex items-center px-6 py-28 md:py-40"
    >
      <motion.div
        style={{ opacity, y }}
        className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-x-10 gap-y-14"
      >
        <div className="md:col-span-3 md:col-start-2">
          <span className="eyebrow font-mono">03 · Instruments</span>
          <p className="mt-7 font-display text-bone text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.05] tracking-tight">
            The tools I reach for first.
          </p>
          <p className="mt-5 text-bone-dim text-sm leading-relaxed max-w-xs">
            Three consoles I keep within arm&apos;s reach — the surfaces, the
            engines, and the ground crew that keeps them flying.
          </p>
        </div>

        <div className="md:col-span-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: gi * 0.1, ease }}
              className="bezel group h-full"
            >
              <div className="bezel-core h-full flex flex-col p-5">
                <div className="bezel-bloom" />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] tracked text-bone-dim font-mono">
                    {group.title}
                  </p>
                  <span className="text-[10px] font-mono text-amber/70">
                    0{gi + 1}
                  </span>
                </div>
                <div className="hairline mt-4 mb-5" />
                <ul className="flex flex-col gap-2.5 text-bone text-sm">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 leading-snug"
                    >
                      <span className="inline-block w-1 h-1 rounded-full bg-amber/50 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-150 group-hover:bg-amber" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="md:col-span-10 md:col-start-2 mt-4">
          <div className="flex items-center gap-4">
            <p className="text-[11px] tracked text-bone-dim font-mono">Education</p>
            <span className="hairline flex-1" />
          </div>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {education.map((e) => (
              <div key={e.school} className="bezel group">
                <div className="bezel-core p-6">
                  <div className="bezel-bloom" />
                  <p className="text-[11px] tracked text-bone-dim font-mono mb-3">
                    {e.period}
                  </p>
                  <p className="font-display text-bone text-xl tracking-tight">
                    {e.school}
                  </p>
                  <p className="text-bone-dim text-sm mt-2 leading-relaxed">
                    {e.track} — {e.place}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
