"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Film } from "@/lib/catalog";
import { posterFor } from "@/lib/catalog";
import { YouTubePlayer } from "@/components/youtube-player";
import { cn } from "@/lib/cn";

type Props = { shorts: Film[] };

export function ShortsViewer({ shorts }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const [hintVisible, setHintVisible] = useState(true);
  const params = useSearchParams();

  // Jump to ?id=… on mount
  useEffect(() => {
    const id = params.get("id");
    if (!id) return;
    const idx = shorts.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const el = containerRef.current?.querySelectorAll<HTMLElement>("[data-short]")[idx];
    el?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  }, [params, shorts]);

  // Track active index
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-short]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(idx);
          }
        });
      },
      { threshold: [0, 0.5, 0.7, 1] },
    );
    items.forEach((i) => observer.observe(i));
    return () => observer.disconnect();
  }, [shorts.length]);

  // Hide onboarding hint after first scroll or 5s
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 5000);
    const onScroll = () => setHintVisible(false);
    const el = containerRef.current;
    el?.addEventListener("scroll", onScroll, { once: true, passive: true });
    return () => {
      clearTimeout(t);
      el?.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = (dir: "up" | "down") => {
    const next =
      dir === "up"
        ? Math.max(0, activeIndex - 1)
        : Math.min(shorts.length - 1, activeIndex + 1);
    const el = containerRef.current?.querySelectorAll<HTMLElement>("[data-short]")[next];
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "j") {
        e.preventDefault();
        goTo("down");
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k") {
        e.preventDefault();
        goTo("up");
      } else if (e.key === " ") {
        e.preventDefault();
        const id = shorts[activeIndex]?.id;
        if (id) togglePlay(id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, shorts]);

  const togglePlay = (id: string) =>
    setPlaying((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-paper pt-16">
      {/* Top bar */}
      <div className="absolute left-5 top-20 z-30 md:left-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
          Retour
        </Link>
      </div>

      <div
        ref={containerRef}
        className="shorts-snap no-scrollbar h-[calc(100svh-4rem)] overflow-y-scroll"
      >
        {shorts.map((short, idx) => (
          <ShortFrame
            key={short.id}
            short={short}
            index={idx}
            total={shorts.length}
            isActive={idx === activeIndex}
            isPlaying={!!playing[short.id]}
            onTogglePlay={() => togglePlay(short.id)}
          />
        ))}
      </div>

      {/* Up/Down nav */}
      <div className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 sm:right-5 sm:flex md:right-8 lg:right-10">
        <button
          onClick={() => goTo("up")}
          aria-label="Short précédent"
          disabled={activeIndex === 0}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 bg-paper/80 text-ink backdrop-blur-md transition",
            activeIndex === 0
              ? "opacity-30"
              : "hover:bg-ink hover:text-paper",
          )}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          onClick={() => goTo("down")}
          aria-label="Short suivant"
          disabled={activeIndex === shorts.length - 1}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 bg-paper/80 text-ink backdrop-blur-md transition",
            activeIndex === shorts.length - 1
              ? "opacity-30"
              : "hover:bg-ink hover:text-paper",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Index counter */}
      <div className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 sm:left-5 sm:block md:left-8 lg:left-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink">
          {String(activeIndex + 1).padStart(2, "0")}{" "}
          <span className="text-smoke">/ {String(shorts.length).padStart(2, "0")}</span>
        </p>
      </div>

      {/* Onboarding hint */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center"
          >
            <div className="flex items-center gap-3 bg-ink/90 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper backdrop-blur-md">
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
              Faites défiler · ou ↑↓ au clavier
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FrameProps = {
  short: Film;
  index: number;
  total: number;
  isActive: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
};

function ShortFrame({
  short,
  index,
  total,
  isActive,
  isPlaying,
  onTogglePlay,
}: FrameProps) {
  return (
    <section
      data-short
      data-index={index}
      className="relative grid h-[calc(100svh-4rem)] w-full grid-cols-12 items-center gap-4 bg-paper px-5 md:px-10"
    >
      {/* Left meta — only on lg+ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-3 hidden lg:block"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          ●  Short {String(index + 1).padStart(2, "0")}
        </p>
        <h2 className="mt-4 font-display font-black leading-[0.9] tracking-tight text-[clamp(40px,4vw,72px)]">
          {short.title}
        </h2>
        <p className="mt-6 max-w-xs font-display text-lg leading-snug">{short.synopsis}</p>
        <div className="mt-6 space-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
          <p>Réal. {short.director}</p>
          <p>Avec {short.cast.map((p) => p.name).join(", ")}</p>
          <p>{short.year} · {short.durationMin} min · {short.genres.join(" · ")}</p>
        </div>
      </motion.div>

      {/* Center vertical player */}
      <div className="col-span-12 mx-auto h-[78svh] w-full max-w-[440px] sm:max-w-[400px] md:max-w-[440px] lg:col-span-6">
        <div className="relative h-full w-full overflow-hidden bg-ink">
          <Image
            src={short.verticalPoster ?? posterFor(short)}
            alt={short.title}
            fill
            priority={index < 2}
            sizes="440px"
            className={cn(
              "object-cover transition-opacity duration-700",
              isPlaying && isActive ? "opacity-0" : "opacity-100",
            )}
          />

          <AnimatePresence>
            {isPlaying && isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <YouTubePlayer
                  youtubeId={short.youtubeId}
                  aspect="vertical"
                  className="h-full w-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" />

          {!isPlaying && (
            <button
              onClick={onTogglePlay}
              aria-label={`Lire ${short.title}`}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            >
              <motion.span
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-paper text-ink shadow-2xl"
              >
                <Play className="h-7 w-7 fill-current" />
              </motion.span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper drop-shadow">
                Lancer
              </span>
            </button>
          )}

          {/* Title overlay — visible up to lg, hidden on lg+ where left sidebar takes over */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-5 lg:hidden">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/80">
              Short {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2 className="mt-1 font-display text-3xl font-black leading-tight text-paper sm:text-4xl">
              {short.title}
            </h2>
            <p className="mt-2 max-w-xs text-sm text-paper/85">{short.synopsis}</p>
            <div className="mt-3 flex flex-wrap gap-x-3 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/60">
              <span>Réal. {short.director}</span>
              <span>·</span>
              <span>{short.durationMin} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right index — only on lg+ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-3 hidden text-right lg:block"
      >
        <p className="font-display font-black leading-none tracking-[-0.06em] text-[clamp(120px,15vw,200px)]">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          sur {String(total).padStart(2, "0")}
        </p>
      </motion.div>
    </section>
  );
}
