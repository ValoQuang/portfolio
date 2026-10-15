"use client";

import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";

/**
 * Fixed street-level HUD — corner brackets, a live grid-coordinate readout
 * and the scroll-sync bar. Decorative: pointer-events-none, aria-hidden,
 * DOM updated by ref so scrolling never triggers a React re-render.
 */
function CornerBrackets() {
  return (
    <>
      {(
        [
          "top-6 left-6",
          "top-6 right-6 rotate-90",
          "bottom-6 left-6 -rotate-90",
        ] as const
      ).map((cls) => (
        <svg
          key={cls}
          className={`absolute ${cls} text-cyan/35`}
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
        >
          <path d="M1 12V1H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      ))}
    </>
  );
}

export function ObservatoryHUD() {
  const sectorRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const syncRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return subscribeScroll((p) => {
      // Street block 0x00 → 0xFF across the descent
      const block = Math.round(p * 255);
      const alt = (18.4 - p * 11.2).toFixed(1);
      const pct = Math.round(p * 100);

      if (sectorRef.current)
        sectorRef.current.textContent = `0x${block.toString(16).toUpperCase().padStart(2, "0")}`;
      if (altRef.current) altRef.current.textContent = `${alt} m`;
      if (syncRef.current) syncRef.current.textContent = `${String(pct).padStart(3, "0")}%`;
      if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
    });
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-30 pointer-events-none select-none">
      <CornerBrackets />

      <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-3 text-[10px] font-mono tracked text-cyan/50">
        <div className="flex items-center gap-2">
          <span className="w-3 h-px bg-cyan/40" />
          <span>Grid · ESP</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-cyan/35">Block</span>
          <span ref={sectorRef} className="text-chrome/75 tabnums text-xs">0x00</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-cyan/35">Alt</span>
          <span ref={altRef} className="text-chrome/75 tabnums text-xs">18.4 m</span>
        </div>
      </div>

      <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-3 text-[10px] font-mono tracked">
        <div className="flex flex-col items-end gap-1">
          <span className="text-cyan/35">Sync</span>
          <span ref={syncRef} className="text-neon/90 tabnums text-xs">000%</span>
        </div>
        <span className="relative h-40 w-px bg-line overflow-hidden">
          <span
            ref={barRef}
            className="absolute inset-0 origin-top bg-neon"
            style={{ transform: "scaleY(0)" }}
          />
        </span>
      </div>
    </div>
  );
}
