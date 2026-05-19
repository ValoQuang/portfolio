"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Chapter as ChapterType } from "@/lib/data";

type Props = {
  chapter: ChapterType;
  total: number;
};

export function Chapter({ chapter, total }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    chapter.index % 2 === 0 ? [-30, 30] : [30, -30],
  );

  const alignRight = chapter.index % 2 === 1;
  const idx = String(chapter.index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  return (
    <section
      ref={ref}
      className="relative min-h-[120dvh] flex items-center px-6 py-24"
    >
      <motion.div
        style={{ opacity, x }}
        className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-6"
      >
        <div
          className={`md:col-span-6 ${alignRight ? "md:col-start-7 md:text-right" : "md:col-start-2"}`}
        >
          <div
            className={`flex items-center gap-3 mb-6 ${alignRight ? "md:justify-end" : ""}`}
          >
            <span className="text-[11px] tracked text-amber font-mono">
              {idx} <span className="text-bone-dim">/ {totalStr}</span>
            </span>
            <span className="hairline flex-1 max-w-[120px]" />
            <span className="text-[11px] tracked text-bone-dim font-mono">
              {chapter.period}
            </span>
          </div>

          <h3 className="font-display text-bone text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight">
            {chapter.company}
          </h3>
          <p className="mt-3 text-bone-dim text-base">
            {chapter.role} — {chapter.city}
          </p>

          <p className="mt-8 text-bone text-lg leading-relaxed max-w-xl ml-auto">
            <span className={alignRight ? "" : "block"}>{chapter.summary}</span>
          </p>

          <ul
            className={`mt-10 space-y-4 max-w-xl text-bone-dim text-sm leading-relaxed ${
              alignRight ? "ml-auto" : ""
            }`}
          >
            {chapter.beats.map((beat) => (
              <li key={beat} className="flex gap-3 items-start">
                {!alignRight && (
                  <span className="mt-2 inline-block w-3 h-px bg-amber shrink-0" />
                )}
                <span className="flex-1">{beat}</span>
                {alignRight && (
                  <span className="mt-2 inline-block w-3 h-px bg-amber shrink-0" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
