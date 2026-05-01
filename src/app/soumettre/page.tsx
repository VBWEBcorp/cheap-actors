import { Suspense } from "react";
import { SoumettreClient } from "./soumettre-client";

export const metadata = {
  title: "Soumettre un film",
  description:
    "Comment proposer votre court-métrage ou short à Cheap Actors. Pas de formulaire, pas de plateforme — juste un mail.",
};

export default function SoumettrePage() {
  return (
    <Suspense fallback={null}>
      <SoumettreClient />
    </Suspense>
  );
}
