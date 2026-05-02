import Link from "next/link";
import { getFilms, getShorts, type Film } from "@/lib/catalog";
import { HomeBrowse } from "./home-browse";
import { TickerLine } from "@/components/ticker-line";
import { ConceptHero } from "@/components/concept-hero";

/**
 * Demo-only filler: cycle through the catalog and emit `target` items
 * with unique ids so the rows look populated even though the dataset
 * is one film + one short. To remove later when the DB starts feeding
 * real content into the rows.
 */
function pad(items: Film[], target: number): Film[] {
  if (items.length === 0) return [];
  return Array.from({ length: target }, (_, i) => {
    const src = items[i % items.length];
    return { ...src, id: `${src.id}-${i}` };
  });
}

const ROW_SIZE = 10;

export default function HomePage() {
  const films = getFilms();
  const shorts = getShorts();

  const featured = films[0];

  // Rows derived from the catalog, then padded for visual density (demo).
  const filmsRow = pad(films, ROW_SIZE);
  const dramas = pad(films.filter((f) => f.genres.includes("Drame")), ROW_SIZE);
  const romance = pad(
    films.filter((f) => f.genres.includes("Romance")),
    ROW_SIZE,
  );
  const emouvant = pad(
    films.filter((f) => f.genres.includes("Émouvant")),
    ROW_SIZE,
  );
  const premier = pad(
    films.filter((f) => f.genres.includes("Premier film")),
    ROW_SIZE,
  );
  const shortsRow = pad(shorts, ROW_SIZE);

  return (
    <>
      <ConceptHero />

      <HomeBrowse
        featured={featured}
        rows={[
          {
            title: "À l'affiche",
            subtitle: "Notre sélection du moment",
            films: filmsRow,
            featuredFirst: true,
          },
          { title: "Top des plus vus", films: filmsRow, top: true },
          {
            title: "Coups de cœur de la rédaction",
            subtitle: "★ choisis à la main",
            films: filmsRow,
          },
          {
            title: "Récents",
            subtitle: `Sortis en ${films[0]?.year ?? "2025"}`,
            films: filmsRow,
          },
          { title: "Drames", films: dramas },
          {
            title: "Romance",
            subtitle: "Sans agenda, sans pathos",
            films: romance,
          },
          {
            title: "Émouvant",
            subtitle: "Sans manipuler, juste ce qu'il faut",
            films: emouvant,
          },
          {
            title: "Premier film",
            subtitle: "On commence quelque part",
            films: premier,
          },
        ].filter((r) => r.films.length > 0)}
        shorts={shortsRow}
      />

      <TickerLine />

      {/* Manifesto teaser */}
      <section className="relative border-t border-ink/15 py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="grid gap-6 md:grid-cols-12 md:gap-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
              ¶  Manifeste
            </p>
            <div className="md:col-span-9">
              <p className="font-display leading-[1.15] tracking-tight text-[clamp(24px,4.2vw,64px)]">
                L'industrie regarde toujours{" "}
                <span className="italic">les mêmes</span>. Nous,{" "}
                <span className="italic font-medium">les autres</span>.
                Comédiens jamais signés, réalisateurs jamais lus, films qui ne
                ressemblent pas aux trois autres.{" "}
                <span className="text-flame">
                  Ce qui reste quand personne n'a cherché.
                </span>
              </p>
              <Link
                href="/manifeste"
                className="link-underline mt-8 inline-block font-mono text-xs uppercase tracking-[0.22em] md:mt-10"
              >
                Lire l'intégralité →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
