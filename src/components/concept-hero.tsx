"use client";

import { motion } from "framer-motion";

export function ConceptHero() {
  return (
    <section className="relative px-5 pb-10 pt-24 md:px-10 md:pb-14 md:pt-28">
      <div className="mx-auto w-full max-w-[1800px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          ●  Vol. 01 · sélection 2026
        </p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 font-display font-black leading-[0.88] tracking-[-0.04em] text-[clamp(36px,7vw,108px)]"
        >
          Des comédien·ne·s que personne{" "}
          <span className="italic font-medium">n'a rappelés</span>
          <span className="text-flame">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-5 grid grid-cols-12 gap-4 md:mt-6"
        >
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ¶  Le principe
          </p>
          <p className="col-span-12 max-w-2xl font-display leading-snug text-[clamp(15px,1.6vw,20px)] md:col-span-9">
            Une vitrine de courts-métrages et de formats verticaux, hébergés
            sur <span className="italic">YouTube</span>, choisis à la main par
            des gens qui ne sont pas connus non plus. Pas d'algo. Pas
            d'inscription. Pas de prétexte.{" "}
            <span className="text-flame">Pas connus. Pas chers. Pas mal.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
