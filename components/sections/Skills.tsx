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
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="stack" ref={ref} className="relative min-h-dvh flex items-center px-6 pt-28 pb-36 md:pt-40 md:pb-48">
      <motion.div style={{ opacity, y }} className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-x-10 gap-y-14">
        <div className="md:col-span-3 md:col-start-2">
          <span className="tag">03 · Stack</span>
          <p className="mt-7 font-display font-semibold uppercase text-chrome text-[clamp(1.7rem,3vw,2.6rem)] leading-none tracking-[-0.01em]">
            Loaded modules.
          </p>
          <p className="mt-5 text-chrome-dim text-base leading-relaxed max-w-xs">
            Payments first. The AI tooling and the frontend roots sit on top of it.
          </p>
        </div>

        {/* One panel: primary module on top, the other two split below */}
        <div className="md:col-span-7 panel">
          <div className="panel-core grid sm:grid-cols-2">
            {skillGroups.map((group, gi) => {
              const primary = gi === 0;
              return (
                <div
                  key={group.title}
                  className={`p-6 md:p-7 ${
                    primary ? "sm:col-span-2 border-b border-line" : gi === 1 ? "sm:border-r border-line" : ""
                  } ${gi === 1 ? "max-sm:border-b" : ""}`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`text-xs tracked font-mono ${primary ? "text-neon" : "text-chrome-dim"}`}>
                      {group.title}
                    </h3>
                    <span className="text-[11px] font-mono text-cyan/60 tabnums">
                      mod_0{gi + 1} · {group.items.length}
                    </span>
                  </div>
                  <ul className={`grid gap-x-6 gap-y-3 text-chrome text-base ${primary ? "sm:grid-cols-2" : ""}`}>
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 leading-snug">
                        <span className="inline-block w-1.5 h-px bg-neon/70 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-10 md:col-start-2 mt-4">
          <div className="flex items-center gap-4">
            <p className="text-xs tracked text-chrome-dim font-mono">Education</p>
            <span className="hairline flex-1" />
          </div>
          <div className="panel mt-8">
            <div className="panel-core grid sm:grid-cols-2">
              {education.map((e, i) => (
                <div
                  key={e.school}
                  className={`p-6 ${i === 0 ? "border-b sm:border-b-0 sm:border-r border-line" : ""}`}
                >
                  <p className="text-xs tracked text-cyan/60 font-mono mb-3 tabnums">{e.period}</p>
                  <p className="font-display font-semibold text-chrome text-xl tracking-tight">{e.school}</p>
                  <p className="text-chrome-dim text-base mt-2 leading-relaxed">
                    {e.track} — {e.place}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
