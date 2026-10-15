"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const first = profile.name.split(" ").slice(0, 2).join(" ");
  const last = `${profile.name.split(" ").slice(2).join(" ")}.`;

  return (
    <section id="top" className="relative min-h-dvh flex items-end pb-24 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8 md:col-start-2">
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
            className="tag mb-8"
          >
            Uplink · {profile.location}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="font-display font-semibold uppercase text-chrome leading-[0.88] tracking-[-0.02em] text-[clamp(2.8rem,8.5vw,8rem)]"
          >
            <span className="glitch" data-text={first}>
              {first}
            </span>
            <span className="block font-light italic text-chrome-dim">
              {last}
              <span className="text-neon not-italic blink">_</span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="mt-10 max-w-[38ch] text-chrome-dim text-lg md:text-2xl leading-relaxed"
          >
            <span className="text-chrome">{profile.role}.</span>{" "}
            {profile.yearsExperience}+ years shipping payment infrastructure,
            provider integrations, and the AI tooling a backend team works with
            every day.
          </motion.p>
        </div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="md:col-span-2 md:col-start-11 text-[12px] tracked text-chrome-dim font-mono space-y-2 tabnums"
        >
          <div className="flex gap-2"><dt className="text-cyan">N</dt><dd>60.21°</dd></div>
          <div className="flex gap-2"><dt className="text-cyan">E</dt><dd>24.66°</dd></div>
          <div className="pt-3 text-neon">↓ Scroll to descend</div>
        </motion.dl>
      </div>
    </section>
  );
}
