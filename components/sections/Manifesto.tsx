"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "@/lib/data";

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section id="origin" ref={ref} className="relative min-h-dvh flex items-center px-6">
      <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8">
        <div className="md:col-span-3 md:col-start-2">
          <span className="tag">01 · Origin</span>
          <div className="hairline mt-6 w-16" />
        </div>
        <div className="md:col-span-7 panel">
          <div className="panel-core p-6 md:p-9">
            <p className="text-chrome font-medium text-[clamp(1.3rem,2.1vw,1.75rem)] leading-[1.5]">
              {profile.manifesto}
            </p>
            <p className="mt-7 pt-6 border-t border-line text-chrome-dim text-[17px] leading-relaxed">
              Currently exploring distributed systems and machine learning while
              shipping production code for iGaming wallets, payments, and the
              real-time loops that hold them together. Aviation enthusiast on the
              side.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
