"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startIntro, useIntro } from "@/lib/intro";

export function IntroOverlay() {
  const { phase } = useIntro();

  useEffect(() => {
    if (phase !== "done") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  const handleEnter = () => {
    window.dispatchEvent(new Event("intro-start"));
    startIntro();
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-60 flex items-center justify-center"
        >
          {phase === "idle" || phase === "loading" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-ink-0"
            />
          ) : null}

          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center gap-8 text-center px-6"
            >
              <div className="flex flex-col items-center gap-3 text-bone-dim">
                <span className="inline-block w-1.5 h-1.5 bg-amber rounded-full drift" />
                <span className="text-[10px] tracked font-mono">Transmission armed</span>
              </div>

              <button
                type="button"
                onClick={handleEnter}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-thread bg-ink-0/60 px-7 py-3 text-bone backdrop-blur-sm transition void-glow void-scan hover:border-amber hover:text-amber focus:outline-none focus-visible:border-amber focus-visible:text-amber"
              >
                <span className="font-display italic text-lg md:text-xl tracking-wide void-flicker">
                  Press to enter the void
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-amber/0 transition group-hover:ring-amber/40"
                />
              </button>

              <p className="text-[10px] tracked font-mono text-bone-dim/70 max-w-xs">
                Click to begin transmission.
              </p>
            </motion.div>
          )}

          {(phase === "loading" || phase === "zoom") && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "loading" ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center gap-3 text-bone-dim pointer-events-none"
            >
              <span className="inline-block w-1.5 h-1.5 bg-amber rounded-full drift" />
              <span className="text-[10px] tracked font-mono">Initialising transmission</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function IntroGate({ children }: { children: React.ReactNode }) {
  const { phase } = useIntro();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "done" ? 1 : 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: phase === "done" ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
}
