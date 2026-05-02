import { getShorts, type Film } from "@/lib/catalog";
import { ShortsBrowse } from "./shorts-browse";

export const metadata = {
  title: "Shorts",
  description:
    "Courts au format vertical, une minute promis. Sélection humaine de shorts pour acteurs et réalisateurs indépendants. Hébergés sur YouTube, regardables d'un pouce.",
  alternates: { canonical: "/shorts" },
  openGraph: {
    title: "Shorts · Cheap Actors",
    description:
      "Une minute. Pas plus. Souvent moins. Format vertical pour comédien·ne·s qu'aucun casting n'a rappelés.",
    url: "/shorts",
  },
};

/** Demo-only filler — duplicate the catalog so each row looks full. */
function pad(items: Film[], target: number): Film[] {
  if (items.length === 0) return [];
  return Array.from({ length: target }, (_, i) => {
    const src = items[i % items.length];
    return { ...src, id: `${src.id}-${i}` };
  });
}

const ROW_SIZE = 10;

export default function ShortsPage() {
  const shorts = getShorts();
  const recent = [...shorts].sort((a, b) => b.year - a.year);
  const dramas = shorts.filter((s) =>
    s.genres.some((g) => /drame|émouvant/i.test(g)),
  );
  const comedies = shorts.filter((s) => s.genres.includes("Comédie"));
  const meta = shorts.filter((s) =>
    s.genres.some((g) => /méta|décalé|absurde/i.test(g)),
  );
  const absurde = shorts.filter((s) => s.genres.includes("Absurde"));
  const autoProduit = shorts.filter((s) => s.genres.includes("Auto-produit"));

  return (
    <ShortsBrowse
      rows={[
        {
          title: "À l'affiche",
          subtitle: "La sélection du moment",
          films: pad(shorts, ROW_SIZE),
        },
        {
          title: "Top des plus vus",
          films: pad(shorts, ROW_SIZE),
          top: true,
        },
        {
          title: "Récents",
          subtitle: `Sortis en ${recent[0]?.year ?? "2025"}`,
          films: pad(recent, ROW_SIZE),
        },
        {
          title: "Drames",
          subtitle: "Pour pleurer en une minute",
          films: pad(dramas, ROW_SIZE),
        },
        { title: "Comédies", films: pad(comedies, ROW_SIZE) },
        {
          title: "Méta & décalé",
          subtitle: "Quand le short se regarde lui-même",
          films: pad(meta, ROW_SIZE),
        },
        {
          title: "Absurde",
          subtitle: "Pas tout à fait sérieux",
          films: pad(absurde, ROW_SIZE),
        },
        {
          title: "Auto-produits",
          subtitle: "Filmés à la maison, ou presque",
          films: pad(autoProduit, ROW_SIZE),
        },
      ].filter((r) => r.films.length > 0)}
    />
  );
}
