"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, Plus, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { posterFor, type Film } from "@/lib/catalog";
import { cn } from "@/lib/cn";

type Props = {
  film: Film;
  onClick: () => void;
  /** Visual size variant, large for the first row */
  size?: "default" | "wide";
};

const HOVER_DELAY = 350;
const LEAVE_DELAY = 80;

export function BrowseCard({ film, onClick, size = "default" }: Props) {
  const isWide = size === "wide";
  const cardRef = useRef<HTMLDivElement>(null);
  const enterT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (enterT.current) clearTimeout(enterT.current);
      if (leaveT.current) clearTimeout(leaveT.current);
    };
  }, []);

  // Close preview on any scroll, its position would otherwise become stale.
  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () =>
      window.removeEventListener("scroll", onScroll, { capture: true });
  }, [open]);

  const handleEnter = () => {
    if (leaveT.current) {
      clearTimeout(leaveT.current);
      leaveT.current = null;
    }
    enterT.current = setTimeout(() => {
      if (cardRef.current) setRect(cardRef.current.getBoundingClientRect());
      setOpen(true);
    }, HOVER_DELAY);
  };

  const handleLeave = () => {
    if (enterT.current) {
      clearTimeout(enterT.current);
      enterT.current = null;
    }
    leaveT.current = setTimeout(() => setOpen(false), LEAVE_DELAY);
  };

  const cancelLeave = () => {
    if (leaveT.current) {
      clearTimeout(leaveT.current);
      leaveT.current = null;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "shrink-0",
        isWide ? "w-[280px] md:w-[360px]" : "w-[220px] md:w-[280px]",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="group relative block w-full text-left"
      >
        <div className="relative aspect-video overflow-hidden bg-chalk shadow-md transition-shadow duration-300 group-hover:shadow-lg">
          <Image
            src={posterFor(film)}
            alt={film.title}
            fill
            sizes={isWide ? "360px" : "280px"}
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
            <h3 className="line-clamp-1 font-display text-base font-bold leading-tight text-paper md:text-lg">
              {film.title}
            </h3>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/80">
              {film.year} · {film.durationMin}min · {film.genres[0]}
            </p>
          </div>
          <span className="absolute right-2 top-2 flex items-center gap-1 bg-paper/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-flame" />
            {film.format === "film" ? "CM" : "Short"}
          </span>
        </div>
      </button>

      {/* Hover preview portal */}
      {mounted &&
        rect &&
        createPortal(
          <AnimatePresence>
            {open && (
              <HoverPreview
                film={film}
                rect={rect}
                onMouseEnter={cancelLeave}
                onMouseLeave={handleLeave}
                onPlay={onClick}
                onMore={onClick}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

type HoverPreviewProps = {
  film: Film;
  rect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPlay: () => void;
  onMore: () => void;
};

function HoverPreview({
  film,
  rect,
  onMouseEnter,
  onMouseLeave,
  onPlay,
  onMore,
}: HoverPreviewProps) {
  // Expand to 1.35x the card width, centered on the original card
  const previewWidth = Math.min(rect.width * 1.35, 480);
  const widthDelta = previewWidth - rect.width;
  let left = rect.left - widthDelta / 2;
  // Clamp to viewport with 16px breathing room
  const minLeft = 16;
  const maxLeft = window.innerWidth - previewWidth - 16;
  left = Math.max(minLeft, Math.min(left, maxLeft));

  // Vertical: align top with card top, slight raise
  const top = rect.top + window.scrollY - 30;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        left,
        top,
        width: previewWidth,
        zIndex: 70,
      }}
      className="bg-ink text-paper shadow-2xl"
    >
      {/* Image */}
      <button
        type="button"
        onClick={onPlay}
        className="group relative block aspect-video w-full overflow-hidden bg-chalk"
        aria-label={`Lecture ${film.title}`}
      >
        <Image
          src={posterFor(film)}
          alt={film.title}
          fill
          sizes="480px"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition group-hover:bg-ink/30">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-ink shadow-2xl transition group-hover:scale-110">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
        <span className="absolute right-3 top-3 flex items-center gap-1 bg-paper/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink backdrop-blur">
          <span className="h-1 w-1 rounded-full bg-flame" />
          {film.format === "film" ? "Court-métrage" : "Short"}
        </span>
      </button>

      {/* Body */}
      <div className="p-4">
        {/* Action row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleAction primary onClick={onPlay} ariaLabel="Lecture">
              <Play className="h-4 w-4 fill-current" />
            </CircleAction>
            <CircleAction
              ariaLabel="Ajouter à ma liste"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-4 w-4" />
            </CircleAction>
            <CircleAction
              ariaLabel="J'aime"
              onClick={(e) => e.stopPropagation()}
            >
              <ThumbsUp className="h-4 w-4" />
            </CircleAction>
          </div>
          <CircleAction onClick={onMore} ariaLabel="Plus d'infos">
            <ChevronDown className="h-4 w-4" />
          </CircleAction>
        </div>

        {/* Title + meta */}
        <h3 className="mt-3 font-display text-lg font-bold leading-tight">
          {film.title}
        </h3>

        {/* Meta line */}
        <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/85">
          <span className="border border-paper/40 px-1.5 py-0.5">
            {film.format === "short" ? "1+" : "10+"}
          </span>
          <span>{film.durationMin} min</span>
          <span className="border border-paper/40 px-1.5 py-0.5">HD</span>
        </div>

        {/* Genre tags */}
        <p className="mt-2 line-clamp-2 text-[12px] text-paper/85">
          {film.genres.map((g, i) => (
            <span key={g}>
              {g}
              {i < film.genres.length - 1 && (
                <span className="mx-1.5 text-flame">·</span>
              )}
            </span>
          ))}
        </p>
      </div>
    </motion.div>
  );
}

function CircleAction({
  children,
  primary = false,
  ariaLabel,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  ariaLabel: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full transition",
        primary
          ? "bg-paper text-ink hover:bg-flame hover:text-paper"
          : "border border-paper/50 text-paper hover:border-paper hover:bg-paper hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function VerticalBrowseCard({
  film,
  onClick,
}: {
  film: Film;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const enterT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (enterT.current) clearTimeout(enterT.current);
      if (leaveT.current) clearTimeout(leaveT.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    return () =>
      window.removeEventListener("scroll", onScroll, { capture: true });
  }, [open]);

  const handleEnter = () => {
    if (leaveT.current) {
      clearTimeout(leaveT.current);
      leaveT.current = null;
    }
    enterT.current = setTimeout(() => {
      if (cardRef.current) setRect(cardRef.current.getBoundingClientRect());
      setOpen(true);
    }, HOVER_DELAY);
  };

  const handleLeave = () => {
    if (enterT.current) {
      clearTimeout(enterT.current);
      enterT.current = null;
    }
    leaveT.current = setTimeout(() => setOpen(false), LEAVE_DELAY);
  };

  const cancelLeave = () => {
    if (leaveT.current) {
      clearTimeout(leaveT.current);
      leaveT.current = null;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="w-[160px] shrink-0 md:w-[200px]"
    >
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group relative block w-full text-left"
      >
        <div className="relative aspect-[9/16] overflow-hidden bg-chalk shadow-md transition group-hover:shadow-2xl">
          <Image
            src={film.verticalPoster ?? posterFor(film)}
            alt={film.title}
            fill
            sizes="200px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="line-clamp-2 font-display text-sm font-bold leading-tight text-paper">
              {film.title}
            </h3>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/80">
              Short · {film.durationMin}min
            </p>
          </div>
        </div>
      </motion.button>

      {mounted &&
        rect &&
        createPortal(
          <AnimatePresence>
            {open && (
              <VerticalHoverPreview
                film={film}
                rect={rect}
                onMouseEnter={cancelLeave}
                onMouseLeave={handleLeave}
                onPlay={onClick}
                onMore={onClick}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

function VerticalHoverPreview({
  film,
  rect,
  onMouseEnter,
  onMouseLeave,
  onPlay,
  onMore,
}: {
  film: Film;
  rect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPlay: () => void;
  onMore: () => void;
}) {
  // Vertical cards are narrower (200px), so widen ~1.45x for the preview.
  const previewWidth = Math.min(rect.width * 1.45, 320);
  const widthDelta = previewWidth - rect.width;
  let left = rect.left - widthDelta / 2;
  const minLeft = 16;
  const maxLeft = window.innerWidth - previewWidth - 16;
  left = Math.max(minLeft, Math.min(left, maxLeft));
  const top = rect.top + window.scrollY - 30;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        left,
        top,
        width: previewWidth,
        zIndex: 70,
      }}
      className="bg-ink text-paper shadow-2xl"
    >
      <button
        type="button"
        onClick={onPlay}
        className="group relative block aspect-[9/16] w-full overflow-hidden bg-chalk"
        aria-label={`Lecture ${film.title}`}
      >
        <Image
          src={film.verticalPoster ?? posterFor(film)}
          alt={film.title}
          fill
          sizes="320px"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition group-hover:bg-ink/30">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-ink shadow-2xl transition group-hover:scale-110">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
        <span className="absolute right-3 top-3 flex items-center gap-1 bg-paper/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink backdrop-blur">
          <span className="h-1 w-1 rounded-full bg-flame" />
          Short
        </span>
      </button>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleAction primary onClick={onPlay} ariaLabel="Lecture">
              <Play className="h-4 w-4 fill-current" />
            </CircleAction>
            <CircleAction
              ariaLabel="Ajouter à ma liste"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-4 w-4" />
            </CircleAction>
            <CircleAction
              ariaLabel="J'aime"
              onClick={(e) => e.stopPropagation()}
            >
              <ThumbsUp className="h-4 w-4" />
            </CircleAction>
          </div>
          <CircleAction onClick={onMore} ariaLabel="Plus d'infos">
            <ChevronDown className="h-4 w-4" />
          </CircleAction>
        </div>

        <h3 className="mt-3 font-display text-base font-bold leading-tight">
          {film.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-[12px] leading-snug text-paper/85">
          {film.synopsis}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/85">
          <span className="border border-paper/40 px-1.5 py-0.5">Short</span>
          <span>{film.durationMin} min</span>
          <span>{film.year}</span>
        </div>

        <p className="mt-2 line-clamp-2 text-[12px] text-paper/85">
          {film.genres.map((g, i) => (
            <span key={g}>
              {g}
              {i < film.genres.length - 1 && (
                <span className="mx-1.5 text-flame">·</span>
              )}
            </span>
          ))}
        </p>
      </div>
    </motion.div>
  );
}
