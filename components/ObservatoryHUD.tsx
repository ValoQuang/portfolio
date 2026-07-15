"use client";

import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";

/**
 * A fixed observatory instrument frame — corner registration marks and a
 * live coordinate/depth readout that tracks the flight down the tunnel.
 * Purely decorative: pointer-events-none, aria-hidden, DOM updated by ref
 * so scrolling never triggers a React re-render.
 */
function CornerTicks() {
  return (
    <>
      {(
        [
          "top-6 left-6",
          "top-6 right-6 rotate-90",
          "bottom-6 right-6 rotate-180",
          "bottom-6 left-6 -rotate-90",
        ] as const
      ).map((cls) => (
        <svg
          key={cls}
          className={`absolute ${cls} text-starlight/25`}
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
        >
          <path
            d="M1 9V1H9"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="square"
          />
        </svg>
      ))}
    </>
  );
}

export function ObservatoryHUD() {
  const raRef = useRef<HTMLSpanElement>(null);
  const decRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return subscribeScroll((p) => {
      // Right ascension 02h24m → 22h00m across the descent
      const raH = 2.4 + p * 19.6;
      const h = Math.floor(raH);
      const m = Math.floor((raH - h) * 60);
      // Declination +78° → −62°
      const decD = 78 - p * 140;
      const sign = decD >= 0 ? "+" : "−";
      const ad = Math.abs(decD);
      const dd = Math.floor(ad);
      const dm = Math.floor((ad - dd) * 60);
      // Line-of-sight depth in parsecs
      const pc = Math.round(4.2 + p * 3255.8);

      if (raRef.current)
        raRef.current.textContent = `${String(h).padStart(2, "0")}ʰ${String(m).padStart(2, "0")}ᵐ`;
      if (decRef.current)
        decRef.current.textContent = `${sign}${String(dd).padStart(2, "0")}° ${String(dm).padStart(2, "0")}′`;
      if (depthRef.current)
        depthRef.current.textContent = `${pc.toLocaleString("en-US")} pc`;
    });
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-30 pointer-events-none select-none"
    >
      <CornerTicks />

      {/* left telemetry — coordinates */}
      <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-3 text-[10px] font-mono tracked text-starlight/45">
        <div className="flex items-center gap-2">
          <span className="w-3 h-px bg-starlight/30" />
          <span>Field · Observatory</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-starlight/30">R.A.</span>
          <span ref={raRef} className="text-bone/70 tabnums text-xs">
            02ʰ24ᵐ
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-starlight/30">DEC.</span>
          <span ref={decRef} className="text-bone/70 tabnums text-xs">
            +78° 00′
          </span>
        </div>
      </div>

      {/* right telemetry — plate designation + depth */}
      <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col items-end gap-3 text-[10px] font-mono tracked text-starlight/45">
        <div className="flex items-center gap-2">
          <span>Plate · QT-2026</span>
          <span className="w-3 h-px bg-starlight/30" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-starlight/30">DEPTH</span>
          <span ref={depthRef} className="text-amber/80 tabnums text-xs">
            4 pc
          </span>
        </div>
      </div>
    </div>
  );
}
