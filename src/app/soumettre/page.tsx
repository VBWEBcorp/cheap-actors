import { Suspense } from "react";
import { SoumettreClient } from "./soumettre-client";

export const metadata = {
  title: "Soumettre un film",
  description:
    "Proposez votre court-métrage ou short à Cheap Actors. Sélection humaine, taux d'acceptation 1.4 %. Pas de formulaire, pas de dossier, juste un mail honnête.",
  alternates: { canonical: "/soumettre" },
  openGraph: {
    title: "Soumettre un film · Cheap Actors",
    description:
      "Trois lignes, un lien YouTube, et c'est parti. On répond à tout — même aux refus, mais en mieux écrit.",
    url: "/soumettre",
  },
};

export default function SoumettrePage() {
  return (
    <Suspense fallback={null}>
      <SoumettreClient />
    </Suspense>
  );
}
