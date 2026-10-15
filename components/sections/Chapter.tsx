"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Chapter as ChapterType } from "@/lib/data";

type Props = {
  chapter: ChapterType;
  total: number;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Jun 2024 — Present" → { uptime: "2y 4m", live: true } */
function uptime(period: string) {
  const [from, to] = period.split("—").map((s) => s.trim());
  const parse = (s: string) => {
    if (/present/i.test(s)) {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    const [m, y] = s.split(" ");
    return Number(y) * 12 + MONTHS.indexOf(m);
  };
  const months = Math.max(0, parse(to) - parse(from));
  const y = Math.floor(months / 12);
  const m = months % 12;
  return { uptime: y ? `${y}y ${m}m` : `${m}m`, live: /present/i.test(to) };
}

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
  const pid = (0x3a70 + chapter.index * 0x1c3).toString(16).toUpperCase();
  const { uptime: up, live } = uptime(chapter.period);

  return (
    <section ref={ref} className="relative min-h-[120dvh] flex items-center px-6 md:px-20 py-24">
      <motion.article
        style={{ opacity, x }}
        className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-6"
      >
        <div className={`md:col-span-6 ${alignRight ? "md:col-start-7 md:text-right" : "md:col-start-2"}`}>
          <div className={`flex items-center gap-3 mb-6 ${alignRight ? "md:justify-end" : ""}`}>
            <span className="text-xs tracked text-neon font-mono tabnums">
              {idx} <span className="text-chrome-dim">/ {totalStr}</span>
            </span>
            <span className="hairline flex-1 max-w-30" />
            <span className="text-xs tracked text-chrome-dim font-mono">{chapter.period}</span>
          </div>

          <h3 className="font-display font-bold uppercase text-chrome text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[0.92] tracking-[-0.02em]">
            {chapter.company}
          </h3>
          <p className="mt-3 text-chrome-dim text-lg">
            {chapter.role} — {chapter.city}
          </p>

          <div
            className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono tracked text-cyan/55 tabnums ${
              alignRight ? "md:justify-end" : ""
            }`}
          >
            <span>PID 0x{pid}</span>
            <span className="text-cyan/25">/</span>
            <span>Uptime {up}</span>
            <span className="text-cyan/25">/</span>
            <span className={live ? "text-neon" : "text-chrome-dim"}>
              {live ? (
                <>
                  <span className="inline-block w-1.5 h-1.5 bg-neon blink mr-1.5 align-middle" />
                  Running
                </>
              ) : (
                "Exited 0"
              )}
            </span>
          </div>

          <p className={`mt-8 text-chrome text-xl leading-relaxed max-w-[52ch] ${alignRight ? "ml-auto" : ""}`}>
            {chapter.summary}
          </p>

          <div className={`mt-10 max-w-2xl ${alignRight ? "ml-auto" : ""}`}>
            <div className="panel">
              <div className="panel-core p-6 md:p-7">
                <div className="panel-glow" />
                <div className="flex items-center justify-between gap-3 mb-5 text-[11px] tracked font-mono">
                  <span className="text-chrome-dim">
                    <span className="text-neon">$</span> tail -n {chapter.beats.length} process.log
                  </span>
                  <span className="text-cyan/50">{chapter.beats.length} lines</span>
                </div>
                <ul className="space-y-5 text-chrome/85 text-base md:text-[17px] leading-[1.65] text-left">
                  {chapter.beats.map((beat, i) => (
                    <li key={beat} className="grid grid-cols-[auto_1fr] gap-3">
                      <span className="font-mono text-xs text-neon/80 tabnums pt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{beat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
