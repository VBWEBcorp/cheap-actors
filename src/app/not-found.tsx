import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center px-5">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          ●  404 — hors champ
        </p>
        <h1 className="mt-8 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(72px,14vw,220px)]">
          Coupez<span className="text-flame">.</span>
        </h1>
        <p className="mt-8 max-w-md font-display text-2xl leading-snug">
          Cette scène n'a jamais été tournée.
          <br />
          Ou elle a été coupée au montage. <span className="italic text-smoke">Probablement pour de bonnes raisons.</span>
        </p>
        <Link
          href="/"
          className="link-underline mt-12 inline-block font-mono text-sm uppercase tracking-[0.22em]"
        >
          Retour au programme →
        </Link>
      </div>
    </div>
  );
}
