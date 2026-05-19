"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex items-end pb-24 md:pb-32 px-6"
    >
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8 md:col-start-2">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] tracked text-amber font-mono mb-6"
          >
            <span className="inline-block w-1.5 h-1.5 bg-amber rounded-full align-middle mr-2 drift" />
            Transmission · {profile.location}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-bone leading-[0.92] tracking-tight text-[clamp(2.6rem,8vw,7.5rem)]"
          >
            {profile.name.split(" ").slice(0, 2).join(" ")}
            <span className="block text-bone-dim italic font-light">
              {profile.name.split(" ").slice(2).join(" ")}.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl text-bone-dim text-base md:text-lg leading-relaxed"
          >
            {profile.role}, working between Redis pub/sub queues, Sequelize migrations,
            and 3D Canvas worlds. Real-time systems with {profile.yearsExperience}+ years
            on the seam where infrastructure meets interface.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.6 }}
          className="md:col-span-2 md:col-start-11 text-[11px] tracked text-bone-dim font-mono space-y-2"
        >
          <p>
            <span className="text-bone">N</span> 60.21°
          </p>
          <p>
            <span className="text-bone">E</span> 24.66°
          </p>
          <p className="pt-3 text-amber">↓ Scroll to depart</p>
        </motion.div>
      </div>
    </section>
  );
}
