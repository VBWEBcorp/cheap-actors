import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  films,
  getFilmBySlug,
  getRelatedFilms,
  backdropFor,
} from "@/lib/catalog";
import { FilmDetailClient } from "./film-detail-client";

export async function generateStaticParams() {
  return films.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const film = getFilmBySlug(slug);
  if (!film) return {};
  return {
    title: film.title,
    description: film.synopsis,
    openGraph: {
      title: film.title,
      description: film.synopsis,
      images: [backdropFor(film)],
    },
  };
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const film = getFilmBySlug(slug);
  if (!film) notFound();

  const related = getRelatedFilms(slug);
  const allFilms = films.filter((f) => f.format === "film");
  const filmIndex = allFilms.findIndex((f) => f.slug === slug);
  const indexLabel = String(filmIndex + 1).padStart(2, "0");
  const total = allFilms.length;
  const prev = filmIndex > 0 ? allFilms[filmIndex - 1] : null;
  const next = filmIndex < total - 1 ? allFilms[filmIndex + 1] : null;

  return (
    <FilmDetailClient
      film={film}
      related={related}
      index={indexLabel}
      total={String(total).padStart(2, "0")}
      prev={prev ? { slug: prev.slug, title: prev.title } : null}
      next={next ? { slug: next.slug, title: next.title } : null}
    />
  );
}
