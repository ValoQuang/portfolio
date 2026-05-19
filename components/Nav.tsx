"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#origin", label: "Origin" },
  { href: "#orbit", label: "Orbit" },
  { href: "#instruments", label: "Instruments" },
  { href: "#signal", label: "Signal" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-[background,backdrop-filter] duration-500 ${
        scrolled ? "backdrop-blur-md bg-ink-1/60" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#top" className="font-display text-bone text-lg leading-none tracking-tight">
          Q<span className="text-amber">.</span>T
        </a>
        <nav className="hidden md:flex items-center gap-9 text-[11px] tracked text-bone-dim font-mono">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-bone transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="mailto:qtruongngoc95@gmail.com"
          className="text-[11px] tracked text-bone-dim hover:text-amber font-mono transition-colors"
        >
          Open Channel
        </a>
      </div>
    </header>
  );
}
