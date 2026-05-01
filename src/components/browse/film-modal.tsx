"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Plus, ThumbsUp, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { backdropFor, posterFor, type Film } from "@/lib/catalog";
import { YouTubePlayer } from "@/components/youtube-player";

type Props = {
  film: Film | null;
  similar?: Film[];
  rank?: number;
  onClose: () => void;
};

export function FilmModal({ film, similar = [], rank, onClose }: Props) {
  const [playing, setPlaying] = useState(false);

  // Lock scroll & support ESC
  useEffect(() => {
    if (!film) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (playing) setPlaying(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [film, playing, onClose]);

  return (
    <AnimatePresence>
      {film && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/80 px-4 py-8 md:py-12"
          onClick={onClose}
        >
          <motion.article
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-paper text-ink shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-paper/95 text-ink shadow-lg transition hover:bg-flame hover:text-paper"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Hero with image or player */}
            <div className="relative aspect-video w-full overflow-hidden bg-ink">
              {playing ? (
                <YouTubePlayer
                  youtubeId={film.youtubeId}
                  aspect={film.format === "short" ? "vertical" : "video"}
                  title={film.title}
                  className="h-full w-full"
                />
              ) : (
                <>
                  <Image
                    src={backdropFor(film)}
                    alt={film.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-10 md:pb-10">
                    <h2 className="font-display font-black leading-[0.9] tracking-[-0.02em] text-[clamp(36px,6vw,72px)]">
                      {film.title}
                    </h2>
                    <div className="mt-5 flex flex-wrap items-center gap-2 md:gap-3">
                      <button
                        onClick={() => setPlaying(true)}
                        className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium tracking-tight text-paper transition hover:bg-flame"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        Lecture
                      </button>
                      <button
                        aria-label="Ajouter à la liste"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/30 bg-paper/60 text-ink backdrop-blur transition hover:border-ink"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="J'aime"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/30 bg-paper/60 text-ink backdrop-blur transition hover:border-ink"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Info panel */}
            {!playing && (
              <div className="grid gap-6 px-6 pb-8 pt-6 md:grid-cols-3 md:gap-10 md:px-10 md:pb-12 md:pt-8">
                <div className="md:col-span-2">
                  {/* Meta line */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
                    <span className="text-ink">{film.year}</span>
                    <span>·</span>
                    <span>{film.durationMin} min</span>
                    <span>·</span>
                    <span className="border border-ink/20 px-1.5 py-0.5">
                      {film.format === "film" ? "Court-métrage" : "Short"}
                    </span>
                    {rank && (
                      <>
                        <span>·</span>
                        <span className="bg-flame px-2 py-0.5 text-paper">
                          N° {rank} cette semaine
                        </span>
                      </>
                    )}
                  </div>

                  {film.tagline && (
                    <p className="mt-4 font-display text-xl italic md:text-2xl">
                      « {film.tagline} »
                    </p>
                  )}

                  <p className="mt-4 font-display text-base leading-snug md:text-lg">
                    {film.synopsis}
                  </p>

                  <div className="mt-6">
                    <Link
                      href={`/films/${film.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-flame transition hover:text-ink"
                    >
                      <Info className="h-3.5 w-3.5" />
                      Fiche complète
                    </Link>
                  </div>
                </div>

                <aside className="space-y-4 md:border-l md:border-ink/15 md:pl-8">
                  <Field label="Distribution">
                    {film.cast.map((p) => p.name).join(", ")}
                  </Field>
                  <Field label="Réalisation">{film.director}</Field>
                  <Field label="Genres">{film.genres.join(" · ")}</Field>
                </aside>
              </div>
            )}

            {/* Similar titles */}
            {!playing && similar.length > 0 && (
              <div className="border-t border-ink/15 px-6 pb-10 pt-8 md:px-10 md:pb-14 md:pt-10">
                <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">
                  Titres similaires
                </h3>
                <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
                  {similar.slice(0, 6).map((f) => (
                    <li key={f.id}>
                      <SimilarCard film={f} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
        {label}
      </p>
      <p className="mt-1 text-sm">{children}</p>
    </div>
  );
}

function SimilarCard({ film }: { film: Film }) {
  return (
    <Link href={`/films/${film.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden bg-chalk">
        <Image
          src={posterFor(film)}
          alt={film.title}
          fill
          sizes="(max-width: 768px) 50vw, 240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-1.5 top-1.5 bg-paper/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur">
          {film.durationMin}min
        </span>
      </div>
      <h4 className="mt-2 line-clamp-1 font-display text-sm font-bold leading-tight">
        {film.title}
      </h4>
      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-smoke">
        {film.year} · {film.genres[0]}
      </p>
    </Link>
  );
}
