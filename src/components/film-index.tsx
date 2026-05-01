"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Film } from "@/lib/catalog";
import { posterFor } from "@/lib/catalog";

type Props = { films: Film[] };

export function FilmIndex({ films }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 380, damping: 40, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 380, damping: 40, mass: 0.6 });

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
      className="relative"
    >
      {/* Floating preview (large screens only) */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x,
              y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            className="pointer-events-none absolute z-20 hidden h-[280px] w-[440px] overflow-hidden lg:block"
          >
            {films.map((f) => (
              <motion.div
                key={f.id}
                initial={false}
                animate={{ opacity: hovered === f.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={posterFor(f)}
                  alt=""
                  fill
                  sizes="440px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="relative z-10">
        {films.map((film, i) => (
          <FilmRow
            key={film.id}
            film={film}
            index={i}
            isHovered={hovered === film.id}
            anyHovered={hovered !== null}
            onHover={() => setHovered(film.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function FilmRow({
  film,
  index,
  isHovered,
  anyHovered,
  onHover,
}: {
  film: Film;
  index: number;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: () => void;
}) {
  return (
    <motion.li
      onMouseEnter={onHover}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      animate={{
        opacity: anyHovered && !isHovered ? 0.4 : 1,
      }}
      className="border-t border-ink/15 last:border-b"
    >
      <Link
        href={`/films/${film.slug}`}
        className="group flex items-stretch gap-4 py-5 transition-[padding,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink/[0.03] sm:items-baseline md:py-7 lg:grid lg:grid-cols-12 lg:gap-4 lg:py-9 lg:hover:px-6"
      >
        {/* Mobile + tablet: thumbnail on the left */}
        <div className="w-[34%] shrink-0 sm:w-[28%] md:w-[22%] lg:hidden">
          <div className="relative aspect-video overflow-hidden bg-chalk">
            <Image
              src={posterFor(film)}
              alt=""
              fill
              sizes="(max-width: 768px) 35vw, 240px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Number — desktop only on its own column */}
        <span className="hidden font-mono text-xs tracking-tight text-smoke lg:col-span-1 lg:block">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex flex-1 flex-col justify-between gap-2 lg:col-span-7 lg:gap-0">
          <div>
            {/* Number — mobile + tablet inline */}
            <span className="font-mono text-[10px] tracking-tight text-smoke lg:hidden">
              {String(index + 1).padStart(2, "0")}  ·  {film.year}
            </span>
            <h3 className="mt-0.5 font-display font-black leading-[0.95] tracking-tight text-[clamp(24px,7vw,88px)]">
              {film.title}
            </h3>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke lg:hidden">
            <span>{film.durationMin} min</span>
            <span>·</span>
            <span>{film.genres.join(" · ")}</span>
          </div>
        </div>

        {/* Meta — desktop only */}
        <div className="hidden flex-col gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke lg:col-span-2 lg:flex">
          <span>{film.year}</span>
          <span>{film.durationMin} min</span>
          <span>{film.genres.join(" · ")}</span>
        </div>

        {/* Arrow CTA — tablet & desktop */}
        <span className="flex shrink-0 items-center justify-end gap-2 self-center font-mono text-[10px] uppercase tracking-[0.18em] text-smoke transition-colors group-hover:text-ink sm:text-[11px] lg:col-span-2 lg:self-baseline">
          <span className="hidden md:inline">regarder</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5" />
        </span>
      </Link>
    </motion.li>
  );
}
