"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { SubmissionStats } from "@/components/submission-stats";

type Props = {
  filmCount: number;
  shortCount: number;
  openingFilmSlug?: string;
  openingFilmTitle?: string;
};

export function HomeHero({
  filmCount,
  shortCount,
  openingFilmSlug,
  openingFilmTitle,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-12 pt-28 md:px-10 md:pb-20 md:pt-32"
    >
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-[1800px]">
        <div className="mb-10 flex flex-col gap-2 md:mb-16 md:flex-row md:items-center md:justify-between md:gap-6">
          <SubmissionStats variant="compact" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:text-right">
            {filmCount.toString().padStart(2, "0")} films · {shortCount.toString().padStart(2, "0")} shorts · printemps 2026
          </p>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black leading-[0.85] tracking-[-0.04em] text-[clamp(52px,12vw,224px)]"
        >
          des acteurs <br />
          <span className="italic font-medium">pas chers.</span> <br />
          des films <br />
          <span className="italic font-medium">pas mal</span>
          <span className="text-flame">.</span>
        </motion.h1>

        <div className="mt-10 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-14">
          <div className="col-span-12 md:col-span-5 md:col-start-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="font-display text-xl leading-[1.35] md:text-2xl"
            >
              Une plateforme gratuite, dédiée aux comédiens et réalisateurs
              que personne n'a encore eu l'idée d'appeler. Ils ont tourné
              quand même. <span className="italic">Et c'est pas mal.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Link
                href="#programme"
                className="group inline-flex items-center justify-center gap-3 bg-ink px-6 py-4 text-sm font-medium tracking-tight text-paper transition hover:bg-flame sm:justify-start"
              >
                Voir le programme
                <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-1" />
              </Link>
              {openingFilmSlug && openingFilmTitle && (
                <Link
                  href={`/films/${openingFilmSlug}`}
                  className="group inline-flex items-center justify-center gap-3 border border-ink/25 px-6 py-4 text-sm font-medium tracking-tight transition hover:border-ink hover:bg-ink/5 sm:justify-start"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Le film d'ouverture
                  <span className="hidden text-smoke lg:inline">·</span>
                  <span className="hidden italic text-smoke lg:inline">{openingFilmTitle}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#programme"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-5 left-5 flex items-center gap-3 md:left-10"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          Défilez
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="block h-6 w-px bg-ink/40"
        />
      </motion.a>
    </section>
  );
}
