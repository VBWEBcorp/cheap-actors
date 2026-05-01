import { getShorts } from "@/lib/catalog";
import { ShortsBrowse } from "./shorts-browse";

export const metadata = {
  title: "Shorts",
  description: "Format vertical, format urgent.",
};

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

  return (
    <ShortsBrowse
      rows={[
        {
          title: "À l'affiche",
          subtitle: "La sélection du moment",
          films: shorts,
        },
        { title: "Top des plus vus", films: shorts, top: true },
        {
          title: "Récents",
          subtitle: `Sortis en ${recent[0]?.year ?? "2025"}`,
          films: recent,
        },
        {
          title: "Drames",
          subtitle: "Pour pleurer en une minute",
          films: dramas,
        },
        { title: "Comédies", films: comedies },
        {
          title: "Méta & décalé",
          subtitle: "Quand le short se regarde lui-même",
          films: meta,
        },
      ].filter((r) => r.films.length > 0)}
    />
  );
}
