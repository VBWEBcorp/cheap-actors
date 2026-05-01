import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPersonViews } from "@/lib/person-view";
import { ActorsBrowser } from "./actors-browser";

export const metadata = {
  title: "Acteurs",
  description:
    "Catalogue d'acteurs et de réalisateurs. Filtrez, regardez, contactez.",
};

export const revalidate = 0;

export default async function ActeursPage() {
  const { dbUsers, staticPeople } = await getAllPersonViews();
  const all = [...dbUsers, ...staticPeople];

  return (
    <div className="pt-32 pb-20 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-10 grid grid-cols-12 gap-4 md:mb-16">
          <div className="col-span-12 md:col-span-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              ●  Annuaire — {String(all.length).padStart(2, "0")} fiches
            </p>
            <h1 className="mt-4 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(56px,12vw,200px)] md:mt-6">
              Acteurs<span className="text-flame">.</span>
            </h1>
          </div>
          <p className="col-span-12 mt-2 max-w-md font-display text-lg leading-snug md:col-span-3 md:mt-24 md:text-xl lg:mt-32">
            Acteurs, actrices, réalisateurs, réalisatrices.
            <br />
            <span className="italic text-smoke">Filtrez. Regardez. Contactez.</span>
          </p>
        </div>

        {/* Empty state CTA */}
        {dbUsers.length === 0 && (
          <div className="mb-12 grid grid-cols-12 gap-4 border border-flame/30 bg-flame/[0.04] p-6 md:mb-16 md:p-10">
            <div className="col-span-12 md:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
                ●  Annuaire ouvert
              </p>
              <h2 className="mt-3 font-display font-black leading-[0.95] tracking-tight text-[clamp(28px,4vw,48px)]">
                Soyez la première fiche.
              </h2>
              <p className="mt-3 max-w-md text-sm md:text-base">
                Personne n'a encore créé son compte. Vous pourriez être en page
                d'accueil par défaut. <span className="italic">C'est rare.</span>
              </p>
            </div>
            <div className="col-span-12 flex items-end md:col-span-4 md:justify-end">
              <Link
                href="/creer-un-compte"
                className="group inline-flex items-center gap-3 bg-ink px-5 py-3 text-sm font-medium tracking-tight text-paper transition hover:bg-flame"
              >
                Créer ma fiche
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        )}

        <ActorsBrowser people={all} />
      </div>
    </div>
  );
}
