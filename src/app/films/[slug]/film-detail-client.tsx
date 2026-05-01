"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { YouTubePlayer } from "@/components/youtube-player";
import { backdropFor, getPersonByName, type Film } from "@/lib/catalog";

type NavTarget = { slug: string; title: string } | null;

type Props = {
  film: Film;
  related: Film[];
  index: string;
  total: string;
  prev: NavTarget;
  next: NavTarget;
};

export function FilmDetailClient({ film, related, index, total, prev, next }: Props) {
  const [playing, setPlaying] = useState(false);

  // Esc to close player
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playing]);

  return (
    <article className="relative pb-24 pt-28 md:pt-32">
      <div className="mx-auto max-w-[1800px] px-5 md:px-10">
        {/* Back link */}
        <Link
          href="/films"
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
          Tous les films
        </Link>

        {/* Header meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 grid grid-cols-12 gap-4 border-b border-ink/15 pb-6"
        >
          <p className="col-span-6 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ●  Film {index} / {total}
          </p>
          <p className="col-span-6 text-right font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-9">
            {film.format === "film" ? "Court-métrage" : "Short"} · {film.year} · {film.durationMin} min · {film.genres.join(" / ")}
          </p>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(56px,12vw,200px)]"
        >
          {film.title}
        </motion.h1>

        {film.tagline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-2xl font-display text-2xl italic md:text-3xl"
          >
            « {film.tagline} »
          </motion.p>
        )}

        {/* Big play area + sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-12 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-16"
        >
          <div className="col-span-12 lg:col-span-9">
            <button
              onClick={() => setPlaying(true)}
              aria-label={`Lancer ${film.title}`}
              className="group relative block aspect-video w-full overflow-hidden bg-chalk"
            >
              <Image
                src={backdropFor(film)}
                alt={film.title}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-ink/25 transition-opacity duration-500 group-hover:bg-ink/35" />

              <div className="absolute left-5 top-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-paper md:left-6 md:top-6">
                <span className="h-1.5 w-1.5 rounded-full bg-flame motion-safe:animate-pulse" />
                Cliquer pour lancer
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-paper text-ink shadow-2xl transition-transform duration-500 group-hover:scale-110 md:h-28 md:w-28">
                  <Play className="h-6 w-6 fill-current md:h-8 md:w-8" />
                </span>
              </div>

              <div className="absolute bottom-5 right-5 font-mono text-[10px] uppercase tracking-[0.28em] text-paper md:bottom-6 md:right-6">
                {film.durationMin} min · {film.year}
              </div>
            </button>

            {/* Direct CTA below image */}
            <button
              onClick={() => setPlaying(true)}
              className="mt-4 inline-flex items-center gap-3 bg-ink px-5 py-3 text-sm font-medium tracking-tight text-paper transition hover:bg-flame md:hidden"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Lancer le film
            </button>
          </div>

          <aside className="col-span-12 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:col-span-3 lg:flex lg:flex-col lg:gap-8">
            <Field label="Réalisation">
              <PersonLink name={film.director} />
            </Field>
            <Field label="Année">{film.year}</Field>
            <div className="col-span-2 sm:col-span-2">
              <Field label="Genre">{film.genres.join(" · ")}</Field>
            </div>
            <div className="col-span-2 sm:col-span-4 lg:col-span-1">
              <Field label="Distribution">
                <ul className="space-y-1">
                  {film.cast.map((p, i) => (
                    <li key={i}>
                      <PersonLink name={p.name} />
                      {p.role && <span className="text-smoke"> — {p.role}</span>}
                    </li>
                  ))}
                </ul>
              </Field>
            </div>
          </aside>
        </motion.div>

        {/* Synopsis */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-24 grid grid-cols-12 gap-4 md:mt-32"
        >
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ¶  Synopsis
          </p>
          <div className="col-span-12 md:col-span-9">
            <p className="font-display text-3xl leading-[1.15] tracking-tight md:text-5xl lg:text-[64px]">
              {film.synopsis}
            </p>

            {/* Editorial note — handwritten */}
            {film.editorialNote && (
              <motion.aside
                initial={{ opacity: 0, y: 16, rotate: -1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: -1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-12 max-w-xl border-l-2 border-flame bg-ink/[0.02] py-3 pl-4 pr-3"
              >
                <p className="font-display italic leading-snug text-[clamp(15px,1.6vw,20px)]">
                  {film.editorialNote.text}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                  — {film.editorialNote.signature} · note de la rédaction
                </p>
              </motion.aside>
            )}
          </div>
        </motion.section>

        {/* Prev / next nav */}
        <nav className="mt-24 grid grid-cols-2 gap-4 border-t border-ink/15 pt-8 md:mt-32">
          <div>
            {prev ? (
              <Link href={`/films/${prev.slug}`} className="group block">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke transition group-hover:text-ink">
                  <ArrowLeft className="mr-2 inline h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
                  Précédent
                </p>
                <p className="mt-2 font-display text-xl font-bold leading-tight md:text-3xl">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke/50">
                ●  Début du programme
              </span>
            )}
          </div>
          <div className="text-right">
            {next ? (
              <Link href={`/films/${next.slug}`} className="group block">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke transition group-hover:text-ink">
                  Suivant
                  <ArrowRight className="ml-2 inline h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </p>
                <p className="mt-2 font-display text-xl font-bold leading-tight md:text-3xl">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke/50">
                Fin du programme  ●
              </span>
            )}
          </div>
        </nav>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-ink/15 pt-16 md:mt-32">
            <div className="mb-10 flex items-end justify-between">
              <h3 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
                À suivre.
              </h3>
              <Link
                href="/films"
                className="link-underline font-mono text-xs uppercase tracking-[0.22em]"
              >
                Tout le programme →
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
              {related.slice(0, 3).map((f, i) => (
                <li key={f.id}>
                  <Link href={`/films/${f.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-chalk">
                      <Image
                        src={backdropFor(f)}
                        alt={f.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-2">
                      <h4 className="font-display text-2xl font-bold tracking-tight">
                        {f.title}
                      </h4>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke">
                      {f.year} · {f.durationMin}min · {f.genres[0]}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Player modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink p-4"
            onClick={() => setPlaying(false)}
            role="dialog"
            aria-label={`Lecteur ${film.title}`}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPlaying(false)}
                aria-label="Fermer le lecteur"
                className="absolute -top-12 right-0 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-paper transition hover:text-flame"
              >
                Fermer
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/30">
                  <X className="h-3.5 w-3.5" />
                </span>
              </button>
              <YouTubePlayer
                youtubeId={film.youtubeId}
                aspect={film.format === "short" ? "vertical" : "video"}
                title={film.title}
              />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/60">
                Échap pour fermer
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
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
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
        {label}
      </p>
      <div className="mt-2 text-base">{children}</div>
    </div>
  );
}

function PersonLink({ name }: { name: string }) {
  const person = getPersonByName(name);
  if (!person) return <>{name}</>;
  return (
    <Link
      href={`/acteurs/${person.slug}`}
      className="link-underline transition-colors hover:text-flame"
    >
      {name}
    </Link>
  );
}
