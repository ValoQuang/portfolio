"use client";

import { motion } from "framer-motion";
import { profile, references } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

function Arrow() {
  return (
    <span className="text-chrome-dim/60 group-hover:text-neon transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
      </svg>
    </span>
  );
}

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
      className="relative min-h-dvh flex items-center px-6 pt-32 pb-28 md:pt-40 md:pb-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease }}
        className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-x-8 gap-y-14"
      >
        <div className="md:col-span-3 md:col-start-2">
          <span className="tag">04 · Signal</span>
        </div>

        <div className="md:col-span-7">
          <h2 className="font-display font-bold uppercase text-chrome text-[clamp(2.6rem,7.5vw,6.5rem)] leading-[0.88] tracking-[-0.02em]">
            <span className="glitch" data-text="Send a signal.">Send a signal.</span>
            <span className="block text-chrome-dim italic font-light normal-case">
              I answer most.
            </span>
          </h2>

          <div className="mt-10">
            <a
              href={`mailto:${profile.email}`}
              className="cta"
              aria-label={`Email ${profile.email}`}
            >
              <span className="cta-body notched">
              Open a channel
              <span className="cta-icon">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
              </span>
            </a>
          </div>

          {/* One panel: contact rows, then references */}
          <div className="panel mt-12 max-w-2xl">
            <div className="panel-core">
              <ul>
                {channels.map((c) => (
                  <li key={c.label} className="border-b border-line">
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                      className="group grid grid-cols-[6.5rem_1fr_auto] items-center gap-4 px-6 py-4 transition-colors duration-300 hover:bg-neon/[0.06]"
                    >
                      <span className="text-xs tracked text-cyan/70 font-mono">{c.label}</span>
                      <span className="text-chrome text-base truncate group-hover:text-neon transition-colors duration-300">
                        {c.value}
                      </span>
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="px-6 pt-6 pb-2 text-xs tracked text-chrome-dim font-mono">Vouched for by</p>
              <ul className="pb-3">
                {references.map((r) => (
                  <li key={r.email}>
                    <a
                      href={r.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="group grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-3 transition-colors duration-300 hover:bg-neon/[0.06]"
                    >
                      <span>
                        <span className="text-chrome text-base group-hover:text-neon transition-colors duration-300">
                          {r.name}
                        </span>
                        <span className="block text-chrome-dim text-sm mt-0.5">{r.role}</span>
                      </span>
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="md:col-span-10 md:col-start-2 mt-24 pt-6 border-t border-line flex flex-wrap gap-4 items-end justify-between text-xs tracked text-chrome-dim font-mono">
          <span>© 2026 · Built in Espoo, wired to the grid.</span>
          <span className="text-neon">// End of line<span className="blink">_</span></span>
        </div>
      </motion.div>
    </section>
  );
}
