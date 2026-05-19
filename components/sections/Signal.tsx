"use client";

import { motion } from "framer-motion";
import { profile, references } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Signal() {
  return (
    <section
      id="signal"
      className="relative min-h-[100dvh] flex items-center px-6 py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease }}
        className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8"
      >
        <div className="md:col-span-3 md:col-start-2">
          <p className="text-[11px] tracked text-amber font-mono">03 / Signal</p>
          <div className="hairline mt-4 w-16" />
        </div>

        <div className="md:col-span-7">
          <h2 className="font-display text-bone text-[clamp(2.4rem,7vw,6rem)] leading-[0.92] tracking-tight">
            Send a signal.
            <span className="block text-bone-dim italic font-light">
              I answer most.
            </span>
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 gap-x-8 gap-y-6 max-w-xl">
            <a href={`mailto:${profile.email}`} className="group block">
              <p className="text-[11px] tracked text-bone-dim font-mono mb-1">Email</p>
              <p className="text-bone group-hover:text-amber transition-colors text-base">
                {profile.email}
              </p>
            </a>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="group block">
              <p className="text-[11px] tracked text-bone-dim font-mono mb-1">Phone</p>
              <p className="text-bone group-hover:text-amber transition-colors text-base">
                {profile.phone}
              </p>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <p className="text-[11px] tracked text-bone-dim font-mono mb-1">LinkedIn</p>
              <p className="text-bone group-hover:text-amber transition-colors text-base">
                quang-truong
              </p>
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <p className="text-[11px] tracked text-bone-dim font-mono mb-1">GitHub</p>
              <p className="text-bone group-hover:text-amber transition-colors text-base">
                ValoQuang
              </p>
            </a>
          </div>

          <div className="mt-20">
            <p className="text-[11px] tracked text-bone-dim font-mono mb-6">
              Vouched for by
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-xl">
              {references.map((r) => (
                <div key={r.email} className="border-l border-thread pl-4">
                  <p className="text-bone text-sm">{r.name}</p>
                  <p className="text-bone-dim text-xs mt-1 leading-relaxed">{r.role}</p>
                </div>
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
