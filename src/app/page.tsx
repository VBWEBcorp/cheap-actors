import Link from "next/link";
import { getFilms, getShorts } from "@/lib/catalog";
import { HomeBrowse } from "./home-browse";
import { TickerLine } from "@/components/ticker-line";

export default function HomePage() {
  const films = getFilms();
  const shorts = getShorts();

  // Build curated rows from the static catalog. Once DB users post videos,
  // these rows can be augmented or replaced server-side.
  const featured = films[0]; // first film as hero
  const dramas = films.filter((f) => f.genres.includes("Drame"));
  const thrillers = films.filter((f) => f.genres.some((g) => /thriller|noir|polar/i.test(g)));
  const comedies = films.filter((f) => f.genres.includes("Comédie"));
  const recent = [...films].sort((a, b) => b.year - a.year);
  const editorsPicks = films.slice(0, Math.min(films.length, 4));

  return (
    <>
      <HomeBrowse
        featured={featured}
        rows={[
          { title: "À l'affiche", subtitle: "Notre sélection du moment", films: films, featuredFirst: true },
          { title: "Top des plus vus", films: films, top: true },
          { title: "Coups de cœur de la rédaction", subtitle: "★ choisis à la main", films: editorsPicks },
          { title: "Récents", subtitle: `Sortis en ${recent[0]?.year ?? "2025"}`, films: recent },
          { title: "Drames", films: dramas },
          { title: "Thrillers & néo-noir", films: thrillers },
          { title: "Comédies", subtitle: "Pour rire un peu, pas trop", films: comedies },
        ].filter((r) => r.films.length > 0)}
        shorts={shorts}
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
                Cheap Actors est une <span className="italic font-medium">vitrine</span>.
                Pour ceux qui n'ont pas eu de chance, qui n'ont pas eu de relations,
                ou qui n'avaient juste pas le bon nom. Pas connus. Pas chers.
                <span className="text-flame"> Pas mal.</span>
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
