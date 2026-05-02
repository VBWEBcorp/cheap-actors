import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Connexion",
  description: "Accédez à votre fiche.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-[100svh] pt-28 pb-20 md:pt-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-4 px-5 md:px-10">
        <div className="col-span-12 md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
            ●  Connexion
          </p>
          <h1 className="mt-6 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(48px,10vw,160px)]">
            Bon retour<span className="text-flame">.</span>
          </h1>
          <p className="mt-6 max-w-md font-display text-lg leading-snug md:text-xl">
            Accédez à votre fiche. Modifiez ce que vous voulez.
            Ajoutez ou retirez des vidéos. <span className="italic">C'est chez vous.</span>
          </p>

          <p className="mt-10 font-mono text-xs text-smoke">
            Pas encore de compte ?{" "}
            <Link href="/creer-un-compte" className="link-underline text-ink">
              Créer un compte →
            </Link>
          </p>
        </div>

        <div className="col-span-12 md:col-span-5 lg:col-start-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
