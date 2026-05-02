import { ManifesteClient } from "./manifeste-client";

export const metadata = {
  title: "Manifeste",
  description:
    "Pas de tapis rouge. Pas d'algorithme. Pas d'attente. Pourquoi Cheap Actors existe, en quatre points et un slogan : pas connus, pas chers, pas mal.",
  alternates: { canonical: "/manifeste" },
  openGraph: {
    title: "Manifeste · Cheap Actors",
    description:
      "Pas connus. Pas chers. Pas mal. Quatre règles, plus ou moins suivies selon le niveau de fatigue.",
    url: "/manifeste",
  },
};

export default function ManifestePage() {
  return <ManifesteClient />;
}
