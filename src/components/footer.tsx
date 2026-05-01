import Link from "next/link";
import { SubmissionStats } from "@/components/submission-stats";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-ink/15 bg-paper">
      {/* Stats banner */}
      <div className="border-b border-ink/15">
        <div className="mx-auto max-w-[1800px] px-5 py-10 md:px-10 md:py-12">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                ●  Sélection en cours
              </p>
              <h4 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                C'est <span className="italic">tendu.</span>
              </h4>
            </div>
            <div className="md:col-span-8">
              <SubmissionStats variant="expanded" />
              <p className="mt-4 font-mono text-[9px] tracking-tight text-smoke">
                * chiffres approximatifs, comme tout sur ce site.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              ●  Cheap Actors — fr · 2026 →
            </p>
            <h3 className="mt-6 max-w-3xl font-display font-black leading-[0.95] tracking-tight text-[clamp(40px,8vw,96px)]">
              Vous filmez ? <br />
              <span className="italic font-medium">On regarde.</span>
            </h3>
            <p className="mt-4 max-w-md text-sm text-smoke">
              On répond à tout. Même aux mauvais films — c'est notre cœur de métier.
            </p>
            <Link
              href="/soumettre"
              className="mt-6 inline-flex items-center gap-3 bg-ink px-5 py-3 text-sm font-medium tracking-tight text-paper transition hover:bg-flame md:mt-8"
            >
              Soumettre un film →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:col-start-9 md:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                Index
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/" className="link-underline">Programme</Link></li>
                <li><Link href="/shorts" className="link-underline">Shorts</Link></li>
                <li><Link href="/acteurs" className="link-underline">Acteurs</Link></li>
                <li><Link href="/manifeste" className="link-underline">Manifeste</Link></li>
                <li><Link href="/soumettre" className="link-underline">Soumettre</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                Suivre
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="link-underline">Instagram</a></li>
                <li><a href="#" className="link-underline">Letterboxd</a></li>
                <li><a href="#" className="link-underline">YouTube</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-ink/15 pt-6 text-[10px] uppercase tracking-[0.22em] text-smoke md:flex-row md:items-center md:justify-between">
          <p>© Cheap Actors. Pas connus. Pas chers. Pas mal.</p>
          <p className="font-mono normal-case tracking-tight">v0.3 / fait avec rien</p>
        </div>
      </div>
    </footer>
  );
}
