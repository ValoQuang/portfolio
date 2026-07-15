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

  // Star-chart flavour — each chapter catalogued as an observed object.
  const catalog = [
    { ra: "14ʰ02ᵐ", dec: "−12° 41′", spec: "G2 V" },
    { ra: "07ʰ38ᵐ", dec: "+31° 09′", spec: "K3 III" },
    { ra: "21ʰ55ᵐ", dec: "−48° 22′", spec: "M1 V" },
  ][chapter.index] ?? { ra: "00ʰ00ᵐ", dec: "+00° 00′", spec: "—" };
  const magnitude = (6.5 - chapter.size * 3).toFixed(1);

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

          <div
            className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-mono tracked text-starlight/45 ${
              alignRight ? "md:justify-end" : ""
            }`}
          >
            <span className="tabnums">R.A. {catalog.ra}</span>
            <span className="text-starlight/25">·</span>
            <span className="tabnums">DEC {catalog.dec}</span>
            <span className="text-starlight/25">·</span>
            <span className="tabnums">mag {magnitude}</span>
            <span className="text-starlight/25">·</span>
            <span className="text-amber/70">{catalog.spec}</span>
          </div>

          <p
            className={`mt-8 text-bone text-lg leading-relaxed max-w-xl ${alignRight ? "ml-auto" : ""}`}
          >
            {chapter.summary}
          </p>

          {/* Dossier — nested machined panel holding the mission log */}
          <div className={`mt-10 max-w-xl ${alignRight ? "ml-auto" : ""}`}>
            <div className="bezel group">
              <div className="bezel-core p-6 md:p-7">
                <div className="bezel-bloom" />
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber drift" />
                  <span className="text-[10px] tracked text-bone-dim font-mono">
                    Mission log
                  </span>
                </div>
                <ul className="space-y-4 text-bone-dim text-sm leading-relaxed text-left">
                  {chapter.beats.map((beat) => (
                    <li key={beat} className="flex gap-3 items-start">
                      <span className="mt-2 inline-block w-3 h-px bg-amber shrink-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:w-4" />
                      <span className="flex-1">{beat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
