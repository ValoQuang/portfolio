"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";

const links = [
  { id: "origin", label: "Origin", index: "01" },
  { id: "runtime", label: "Runtime", index: "02" },
  { id: "stack", label: "Stack", index: "03" },
  { id: "signal", label: "Signal", index: "04" },
];

const ease = [0.32, 0.72, 0, 1] as const;

function ArrowIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the section crossing the middle of the viewport is "active".
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
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
          className={`notched mt-6 w-max max-w-[calc(100vw-2rem)] [--notch:10px] transition-[background,padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            scrolled
              ? "bg-ink-0/92 py-2 pl-5 pr-2"
              : "bg-ink-0/70 py-2.5 pl-5 pr-2.5"
          }`}
        >
          <div className="flex items-center gap-6">
            <a
              href="#top"
              className="font-display font-semibold text-chrome text-lg leading-none tracking-tight shrink-0"
            >
              QT<span className="text-neon blink">_</span>
            </a>

            <nav aria-label="Sections" className="hidden md:flex items-center gap-7 text-xs tracked font-mono">
              {links.map((l) => {
                const isActive = active === l.id;
                return (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative py-1 transition-colors duration-300 ${
                      isActive ? "text-neon" : "text-chrome-dim hover:text-chrome"
                    }`}
                  >
                    <span className="text-chrome-dim/50 mr-1.5">{l.index}</span>
                    {l.label}
                    <span
                      className={`absolute left-0 -bottom-0.5 h-px bg-neon transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            <a
              href={`mailto:${profile.email}`}
              className="hidden md:inline-flex items-center gap-2 bg-neon/10 border-l-2 border-neon pl-3 pr-3 py-1.5 text-xs tracked font-mono text-neon hover:bg-neon hover:text-ink-0 active:translate-y-px transition-colors duration-300 group"
            >
              Ping me
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowIcon />
              </span>
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden relative flex items-center justify-center w-9 h-9 bg-chrome/5 border border-line"
            >
              <span
                className={`absolute h-px w-4 bg-chrome transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-chrome transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-30 md:hidden bg-ink-0/96"
          >
            <nav aria-label="Sections" className="flex flex-col justify-center h-full px-8 gap-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.5, delay: 0.06 + i * 0.06, ease }}
                  className="group flex items-baseline gap-4 py-3 border-b border-line"
                >
                  <span className="text-xs tracked text-neon font-mono">{l.index}</span>
                  <span className="font-display font-semibold uppercase text-chrome text-4xl tracking-tight group-hover:text-neon transition-colors duration-300">
                    {l.label}
                  </span>
                </motion.a>
              ))}
              <motion.a
                href={`mailto:${profile.email}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.5, delay: 0.06 + links.length * 0.06, ease }}
                className="cta mt-10 self-start"
              >
                <span className="cta-body notched">
                  Ping me
                  <span className="cta-icon"><ArrowIcon size={12} /></span>
                </span>
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
