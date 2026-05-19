"use client";

import { useScrollProgress } from "@/lib/scroll";

export function ScrollIndicator() {
  const p = useScrollProgress();
  const pct = Math.round(p * 100);
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-end gap-3 pointer-events-none">
      <span className="text-[10px] tracked text-bone-dim font-mono">
        {String(pct).padStart(3, "0")} / 100
      </span>
      <div className="h-40 w-px bg-thread relative overflow-hidden">
        <span
          className="absolute top-0 left-0 w-px bg-amber transition-[height] duration-200 ease-out"
          style={{ height: `${pct}%` }}
        />
      </div>
    </div>
  );
}
