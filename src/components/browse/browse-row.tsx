"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Film } from "@/lib/catalog";
import {
  BrowseCard,
  VerticalBrowseCard,
} from "./browse-card";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  subtitle?: string;
  films: Film[];
  onSelect: (film: Film) => void;
  variant?: "horizontal" | "vertical";
  /** First row of the page can use bigger cards */
  featuredFirst?: boolean;
};

export function BrowseRow({
  title,
  subtitle,
  films,
  onSelect,
  variant = "horizontal",
  featuredFirst = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [films.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (films.length === 0) return null;

  return (
    <section className="relative py-5 md:py-7">
      <div className="mx-auto max-w-[1800px] px-5 md:px-10">
        <header className="mb-3 flex items-end justify-between md:mb-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
                {subtitle}
              </p>
            )}
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canLeft}
              aria-label="Précédent"
              className={cn(
                "flex h-8 w-8 items-center justify-center border border-ink/15 text-ink transition",
                canLeft
                  ? "hover:border-ink hover:bg-ink hover:text-paper"
                  : "opacity-30",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canRight}
              aria-label="Suivant"
              className={cn(
                "flex h-8 w-8 items-center justify-center border border-ink/15 text-ink transition",
                canRight
                  ? "hover:border-ink hover:bg-ink hover:text-paper"
                  : "opacity-30",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </header>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-5 md:gap-4 md:px-10"
        >
          {films.map((f) =>
            variant === "vertical" ? (
              <VerticalBrowseCard
                key={f.id}
                film={f}
                onClick={() => onSelect(f)}
              />
            ) : (
              <BrowseCard
                key={f.id}
                film={f}
                onClick={() => onSelect(f)}
                size={featuredFirst ? "wide" : "default"}
              />
            ),
          )}
          <div className="w-2 shrink-0 md:w-6" aria-hidden />
        </div>
      </div>
    </section>
  );
}

/** Top-N row: numbered cards à la Netflix Top 10. */
export function BrowseTopRow({
  title,
  films,
  onSelect,
}: {
  title: string;
  films: Film[];
  onSelect: (film: Film) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [films.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (films.length === 0) return null;

  return (
    <section className="relative py-5 md:py-7">
      <div className="mx-auto max-w-[1800px] px-5 md:px-10">
        <header className="mb-3 flex items-end justify-between md:mb-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
              {title}
            </h2>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
              Cette semaine
            </p>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canLeft}
              aria-label="Précédent"
              className={cn(
                "flex h-8 w-8 items-center justify-center border border-ink/15 text-ink transition",
                canLeft
                  ? "hover:border-ink hover:bg-ink hover:text-paper"
                  : "opacity-30",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canRight}
              aria-label="Suivant"
              className={cn(
                "flex h-8 w-8 items-center justify-center border border-ink/15 text-ink transition",
                canRight
                  ? "hover:border-ink hover:bg-ink hover:text-paper"
                  : "opacity-30",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </header>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-5 md:gap-4 md:px-10"
        >
          {films.slice(0, 10).map((f, i) => (
            <NumberedCard
              key={f.id}
              film={f}
              rank={i + 1}
              onClick={() => onSelect(f)}
            />
          ))}
          <div className="w-2 shrink-0 md:w-6" aria-hidden />
        </div>
      </div>
    </section>
  );
}

function NumberedCard({
  film,
  rank,
  onClick,
}: {
  film: Film;
  rank: number;
  onClick: () => void;
}) {
  return (
    <div className="relative flex shrink-0 items-end gap-1">
      {/* Huge number outline behind */}
      <span
        aria-hidden
        className="-mr-2 select-none font-display font-black italic leading-[0.78] tracking-[-0.08em] text-[clamp(140px,18vw,260px)] md:-mr-4"
        style={{
          WebkitTextStroke: "2px rgba(12,12,12,0.85)",
          color: "transparent",
        }}
      >
        {rank}
      </span>
      <BrowseCard film={film} onClick={onClick} />
    </div>
  );
}
