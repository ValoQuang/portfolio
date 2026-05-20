"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startIntro, useIntro } from "@/lib/intro";

export function IntroOverlay() {
  const { phase } = useIntro();

  useEffect(() => {
    startIntro();
    document.documentElement.style.scrollBehavior = "auto";
    if (phase !== "done") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
        >
          {phase === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-ink-0"
            />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "loading" ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center gap-3 text-bone-dim"
          >
            <span className="inline-block w-1.5 h-1.5 bg-amber rounded-full drift" />
            <span className="text-[10px] tracked font-mono">Initialising transmission</span>
          </motion.div>
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
