"use client";

import { motion } from "framer-motion";
import { profile, references } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  {
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  { label: "LinkedIn", value: "quang-truong", href: profile.linkedin },
  { label: "GitHub", value: "ValoQuang", href: profile.github },
];

export function Signal() {
  return (
    <section
      id="signal"
      className="relative min-h-[100dvh] flex items-center px-6 py-32 md:py-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease }}
        className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-x-8 gap-y-14"
      >
        <div className="md:col-span-3 md:col-start-2">
          <span className="eyebrow font-mono">04 · Signal</span>
        </div>

        <div className="md:col-span-7">
          <h2 className="font-display text-bone text-[clamp(2.4rem,7vw,6rem)] leading-[0.92] tracking-tight">
            Send a signal.
            <span className="block text-bone-dim italic font-light">
              I answer most.
            </span>
          </h2>

          <div className="mt-10">
            <a
              href={`mailto:${profile.email}`}
              className="island group"
              aria-label={`Email ${profile.email}`}
            >
              <span className="font-mono text-[13px] tracked">Open a channel</span>
              <span className="island-icon">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-3 max-w-xl">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="bezel group block"
              >
                <div className="bezel-core px-5 py-4 flex items-center justify-between gap-3">
                  <div className="bezel-bloom" />
                  <div className="min-w-0">
                    <p className="text-[10px] tracked text-bone-dim font-mono mb-1">
                      {c.label}
                    </p>
                    <p className="text-bone group-hover:text-amber transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-sm truncate">
                      {c.value}
                    </p>
                  </div>
                  <span className="shrink-0 text-bone-dim/60 group-hover:text-amber transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                        stroke="currentColor"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-20">
            <p className="text-[11px] tracked text-bone-dim font-mono mb-6">
              Vouched for by
            </p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
              {references.map((r) => (
                <a
                  key={r.email}
                  href={r.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="bezel group block"
                >
                  <div className="bezel-core p-5">
                    <div className="bezel-bloom" />
                    <p className="text-bone text-sm group-hover:text-amber transition-colors duration-500">
                      {r.name}
                    </p>
                    <p className="text-bone-dim text-xs mt-1.5 leading-relaxed">
                      {r.role}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-12 mt-24 flex items-end justify-between text-[11px] tracked text-bone-dim font-mono">
          <span>© 2026 — Built between Espoo and the void.</span>
          <span className="text-amber">END OF TRANSMISSION</span>
        </div>
      </motion.div>
    </section>
  );
}
