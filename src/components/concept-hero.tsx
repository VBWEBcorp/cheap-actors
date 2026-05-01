"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";

export function ConceptHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88svh] items-end overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pb-20"
    >
      <motion.div
        style={{ y, opacity }}
        className="mx-auto w-full max-w-[1800px]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          ●  Vol. 01 · sélection 2026
        </p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display font-black leading-[0.85] tracking-[-0.04em] text-[clamp(48px,11vw,200px)] md:mt-8"
        >
          Des comédien·ne·s <br />
          que personne <br />
          <span className="italic font-medium">n'a rappelés</span>
          <span className="text-flame">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.45 }}
          className="mt-6 max-w-xl font-display text-lg italic text-smoke md:text-2xl"
        >
          (Et, surprise, c'est plus intéressant que prévu.)
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-12 grid grid-cols-12 gap-4 border-t border-ink/15 pt-8 md:mt-16 md:pt-10"
        >
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ¶  Le principe
          </p>
          <p className="col-span-12 max-w-2xl font-display leading-snug text-[clamp(16px,2vw,24px)] md:col-span-9">
            Une vitrine de courts-métrages et de formats verticaux, hébergés
            sur <span className="italic">YouTube</span>, choisis à la main par des gens
            qui ne sont pas connus non plus. Pas d'algorithme. Pas
            d'inscription. Pas de prétexte.{" "}
            <span className="text-flame">Pas connus. Pas chers. Pas mal.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:mt-16"
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </motion.span>
          Programme ci-dessous
        </motion.div>
      </motion.div>
    </section>
  );
}
