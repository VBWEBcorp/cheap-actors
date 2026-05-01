"use client";

import { motion } from "framer-motion";

const PHRASES = [
  "pas connus",
  "pas chers",
  "pas mal",
  "fait maison",
  "tourné chez sa mère",
  "monté la nuit",
  "personne n'a dit oui",
  "encore moins non",
  "vu par 12 personnes",
  "méritait beaucoup mieux",
  "remboursé en pizzas",
];

export function TickerLine() {
  const items = [...PHRASES, ...PHRASES, ...PHRASES];

  return (
    <section className="relative overflow-hidden border-y border-ink/15 bg-paper py-6">
      <motion.div
        className="flex w-max items-center gap-6 whitespace-nowrap sm:gap-10"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          duration: 60,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items.map((p, i) => (
          <span
            key={i}
            className="flex items-center gap-6 font-display font-medium italic text-[clamp(22px,4vw,48px)] sm:gap-10"
          >
            {p}
            <span className="text-flame">●</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
