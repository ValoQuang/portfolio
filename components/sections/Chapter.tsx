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
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0, 1, 1, 0]);
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
        {/* One panel per chapter: header, summary and log together */}
        <div className={`md:col-span-7 panel ${alignRight ? "md:col-start-5" : "md:col-start-2"}`}>
          <div className="panel-core">
            <header className="p-6 md:p-8 border-b border-line">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs tracked text-neon font-mono tabnums">
                  {idx} <span className="text-chrome-dim">/ {totalStr}</span>
                </span>
                <span className="hairline flex-1" />
                <span className="text-xs tracked text-chrome-dim font-mono">{chapter.period}</span>
              </div>

              <h3 className="font-display font-bold uppercase text-chrome text-[clamp(2rem,4.4vw,3.6rem)] leading-[0.95] tracking-[-0.01em]">
                {chapter.company}
              </h3>
              <p className="mt-3 text-chrome-dim text-lg">
                {chapter.role} — {chapter.city}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono tracked text-cyan/70 tabnums">
                <span>PID 0x{pid}</span>
                <span className="text-cyan/30">/</span>
                <span>Uptime {up}</span>
                <span className="text-cyan/30">/</span>
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

              <p className="mt-6 text-chrome text-lg md:text-xl leading-relaxed">{chapter.summary}</p>
            </header>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 mb-5 text-[11px] tracked font-mono">
                <span className="text-chrome-dim">
                  <span className="text-neon">$</span> tail -n {chapter.beats.length} process.log
                </span>
                <span className="text-cyan/50">{chapter.beats.length} lines</span>
              </div>
              <ul className="space-y-5 text-chrome/85 text-base md:text-[17px] leading-[1.65]">
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
      </motion.article>
    </section>
  );
}
