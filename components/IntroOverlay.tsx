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
              <div className="flex flex-col items-center gap-3 text-chrome-dim">
                <span className="inline-block w-2 h-2 bg-neon blink" />
                <span className="text-xs tracked font-mono">Uplink ready · 1 node</span>
              </div>

              <button
                type="button"
                onClick={handleEnter}
                className="group panel pulse-rim [--notch:12px] active:translate-y-px"
              >
                <span className="panel-core flex items-center gap-4 px-8 py-4 text-chrome transition-colors duration-300 group-hover:bg-neon group-hover:text-ink-0">
                <span
                  className="glitch font-display font-semibold uppercase text-xl md:text-2xl tracking-[0.12em]"
                  data-text="Jack in"
                >
                  Jack in
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="square"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
                </span>
              </button>

              <p className="text-xs tracked font-mono text-chrome-dim/70 max-w-xs">
                Sound on · press to enter
              </p>
            </motion.div>
          )}

          {(phase === "loading" || phase === "zoom") && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "loading" ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center gap-3 text-chrome-dim pointer-events-none"
            >
              <span className="inline-block w-2 h-2 bg-neon blink" />
              <span className="text-xs tracked font-mono">Handshake…</span>
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
