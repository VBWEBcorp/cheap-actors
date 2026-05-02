import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Créer un compte",
  description: "Réservez votre fiche sur Cheap Actors. Trois lignes, on s'occupe du reste.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="min-h-[100svh] pt-28 pb-20 md:pt-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-4 px-5 md:px-10">
        <div className="col-span-12 md:col-span-7 lg:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
            ●  Inscription
          </p>
          <h1 className="mt-6 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(48px,10vw,160px)]">
            Créez <br />
            <span className="italic font-medium">votre fiche</span>
            <span className="text-flame">.</span>
          </h1>
          <p className="mt-6 max-w-md font-display text-lg leading-snug md:text-xl">
            Trois minutes. Un email, un mot de passe, votre nom de scène, et
            le rôle que vous voulez bien revendiquer.
          </p>
          <p className="mt-4 max-w-md text-sm text-smoke">
            On vous donne ensuite un espace perso pour ajouter votre photo,
            votre paragraphe, et jusqu'à 6 vidéos YouTube (3 horizontales + 3 verticales).
            <span className="italic"> Pas plus.</span>
          </p>

          <p className="mt-10 font-mono text-xs text-smoke">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="link-underline text-ink">
              Connexion →
            </Link>
          </p>
        </div>

        <div className="col-span-12 md:col-span-5 lg:col-span-5 lg:col-start-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
