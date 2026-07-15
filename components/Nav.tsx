"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "#origin", label: "Origin", index: "01" },
  { href: "#orbit", label: "Orbit", index: "02" },
  { href: "#instruments", label: "Instruments", index: "03" },
  { href: "#signal", label: "Signal", index: "04" },
];

const ease = [0.32, 0.72, 0, 1] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4">
        <div
          className={`mt-6 w-max max-w-[calc(100vw-2rem)] rounded-full border border-bone/10 transition-[background,box-shadow,padding] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            scrolled
              ? "bg-ink-1/60 backdrop-blur-xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(236,230,217,0.08)] py-2 pl-5 pr-2"
              : "bg-ink-1/25 backdrop-blur-md py-2.5 pl-5 pr-2.5"
          }`}
        >
          <div className="flex items-center gap-6">
            <a
              href="#top"
              className="font-display text-bone text-lg leading-none tracking-tight shrink-0"
            >
              Q<span className="text-amber">.</span>T
            </a>

            <nav className="hidden md:flex items-center gap-8 text-[11px] tracked text-bone-dim font-mono">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative py-1 hover:text-bone transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <a
              href="mailto:qtruongngoc95@gmail.com"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-bone/5 border border-bone/10 pl-3.5 pr-1.5 py-1.5 text-[11px] tracked font-mono text-bone-dim hover:text-bone transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group"
            >
              Open Channel
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber/15 text-amber transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>

            {/* Mobile trigger — morphing hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden relative flex items-center justify-center w-9 h-9 rounded-full bg-bone/5 border border-bone/10"
            >
              <span
                className={`absolute h-px w-4 bg-bone transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-bone transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen glass overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-0 z-30 md:hidden backdrop-blur-2xl bg-ink-0/80"
          >
            <nav className="flex flex-col justify-center h-full px-8 gap-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.6, delay: 0.08 + i * 0.06, ease }}
                  className="group flex items-baseline gap-4 py-3 border-b border-thread/60"
                >
                  <span className="text-[11px] tracked text-amber font-mono">{l.index}</span>
                  <span className="font-display text-bone text-4xl tracking-tight group-hover:text-amber transition-colors duration-300">
                    {l.label}
                  </span>
                </motion.a>
              ))}
              <motion.a
                href="mailto:qtruongngoc95@gmail.com"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.6, delay: 0.08 + links.length * 0.06, ease }}
                className="island mt-10 self-start"
              >
                <span className="font-mono text-[13px] tracked">Open Channel</span>
                <span className="island-icon">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
