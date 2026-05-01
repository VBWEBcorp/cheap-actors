"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

export function ShareCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/acteurs/${slug}`
        : `/acteurs/${slug}`;
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section className="mt-20 grid grid-cols-12 gap-4 rounded-none border border-ink/15 bg-paper p-6 md:mt-32 md:p-10">
      <div className="col-span-12 md:col-span-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
          ●  Partager cette fiche
        </p>
        <h3 className="mt-3 font-display font-black leading-[0.95] tracking-tight text-[clamp(28px,4vw,48px)]">
          Votre vanity URL.
          <br />
          <span className="italic font-medium text-smoke">Faites-en quelque chose.</span>
        </h3>
        <p className="mt-4 max-w-md font-display text-base italic md:text-lg">
          Ajoutez ce lien dans votre bio Insta, vos auditions, vos mails de relance.
          Quelqu'un finira par cliquer.
        </p>
      </div>
      <div className="col-span-12 flex flex-col justify-end gap-3 md:col-span-5">
        <div className="break-all bg-ink/5 px-4 py-3 font-mono text-xs">
          cheap-actors.com/acteurs/{slug}
        </div>
        <button
          onClick={onCopy}
          className="group inline-flex items-center justify-center gap-3 bg-ink px-5 py-3 text-sm font-medium tracking-tight text-paper transition hover:bg-flame"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Lien copié
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4" />
              Copier le lien
            </>
          )}
        </button>
      </div>
    </section>
  );
}
