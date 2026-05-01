"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Play, Info } from "lucide-react";
import { backdropFor, type Film } from "@/lib/catalog";

type Props = {
  film: Film;
  onPlay: () => void;
  onInfo: () => void;
};

export function BrowseHero({ film, onPlay, onInfo }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[88svh] min-h-[600px] w-full overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={backdropFor(film)}
          alt={film.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Gradients to make text readable, blending into cream paper at bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-paper via-paper/60 to-transparent" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex h-full max-w-[1800px] flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-20"
      >
        <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
          <span className="h-1 w-1 rounded-full bg-flame animate-pulse" />
          À l'affiche · {film.year}
        </p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl font-display font-black leading-[0.86] tracking-[-0.04em] text-paper text-[clamp(48px,9vw,140px)]"
          style={{ textShadow: "0 2px 32px rgba(0,0,0,0.4)" }}
        >
          {film.title}
        </motion.h1>

        {film.tagline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 max-w-xl font-display text-xl italic text-paper/95 md:text-2xl"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
          >
            « {film.tagline} »
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-3 max-w-xl text-sm leading-relaxed text-paper/85 md:text-base"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
        >
          {film.synopsis}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-6 flex flex-wrap items-center gap-2 md:mt-8 md:gap-3"
        >
          <button
            onClick={onPlay}
            className="inline-flex items-center gap-2 bg-paper px-6 py-3 text-sm font-medium tracking-tight text-ink transition hover:bg-flame hover:text-paper"
          >
            <Play className="h-4 w-4 fill-current" />
            Lecture
          </button>
          <button
            onClick={onInfo}
            className="inline-flex items-center gap-2 border border-paper/40 bg-ink/30 px-6 py-3 text-sm font-medium tracking-tight text-paper backdrop-blur transition hover:border-paper hover:bg-ink/60"
          >
            <Info className="h-4 w-4" />
            Plus d'infos
          </button>
        </motion.div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
          <span>{film.durationMin} min</span>
          <span>·</span>
          <span>{film.genres.join(" · ")}</span>
          <span>·</span>
          <span>Réal. {film.director}</span>
        </div>
      </motion.div>
    </section>
  );
}
