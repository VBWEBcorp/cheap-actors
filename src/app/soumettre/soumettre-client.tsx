"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Mail, ArrowRight } from "lucide-react";
import { SITE_STATS, formatVolume } from "@/lib/site-stats";
import { SubmissionStats } from "@/components/submission-stats";

const WANTED = [
  "courts. très courts.",
  "des comédiens qu'on n'a jamais vus",
  "des plans qui durent un peu trop",
  "des fins qui n'expliquent rien",
  "des erreurs assumées",
  "des films faits avec deux personnes",
];

const NOT_WANTED = [
  "votre démo de 28 min en N&B sous la pluie",
  "un teaser pour un long-métrage",
  "des clips musicaux sponsorisés",
  "votre court d'école si c'est encore un brief",
  "des plans drone gratuits",
  "le mot \"viscéral\" dans le synopsis",
];

const REJECTION_REASONS = [
  "Trop bien éclairé.",
  "On dirait que vous avez essayé.",
  "Le générique fait 4 minutes.",
  "Trois personnages s'appellent Léa.",
  "L'acteur principal a son agent en cc du mail.",
  "Tourné au Pérou. C'est très bien, mais non.",
  "Le synopsis fait deux pages.",
  "On a regardé deux fois. Toujours rien.",
];

const MAILTO_TEMPLATE = `mailto:hello@cheap-actors.com?subject=${encodeURIComponent("Soumission, [Titre du film]")}&body=${encodeURIComponent(
  `Bonjour,\n\nVoici mon film pour Cheap Actors.\n\nTitre : \nDurée : \nFormat (court-métrage / short) : \nAnnée : \nLien YouTube (non listé OK) : \n\nSynopsis (3 lignes max) :\n\n\nQui joue / qui réalise :\n\n\nUne phrase pour me présenter (facultatif) :\n\n\nMerci,\n[Votre nom]`,
)}`;

export function SoumettreClient() {
  return (
    <article className="relative pb-24 pt-28 md:pt-32">
      <div className="mx-auto max-w-[1800px] px-5 md:px-10">
        {/* Header meta */}
        <div className="grid grid-cols-12 gap-4 border-b border-ink/15 pb-6">
          <p className="col-span-6 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ●  Soumissions
          </p>
          <p className="col-span-6 text-right font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-9">
            {formatVolume(SITE_STATS.currentVolume)} fermé · {formatVolume(SITE_STATS.currentVolume + 1)} ouvre dans <Countdown />
          </p>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 font-display font-black leading-[0.88] tracking-[-0.04em] text-[clamp(48px,11vw,200px)] md:mt-10 md:leading-[0.86]"
        >
          Soumettez<span className="text-flame">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 max-w-2xl font-display text-2xl italic md:text-3xl"
        >
          « Pas de formulaire. Pas de plateforme. Juste un mail.
          On lit tout, on répond à tout. <span className="text-flame">Promis.</span> »
        </motion.p>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="mt-14 border-y border-ink/15 py-8 md:mt-20 md:py-10"
        >
          <SubmissionStats variant="expanded" />
          <p className="mt-4 font-mono text-[9px] tracking-tight text-smoke">
            * chiffres approximatifs. La sélection est plus humaine que ces chiffres ne le laissent croire.
          </p>
        </motion.section>

        {/* Wanted / not wanted */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 grid grid-cols-1 gap-12 md:mt-32 md:grid-cols-2 md:gap-8"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
              ✓  Ce qu'on cherche
            </p>
            <h2 className="mt-3 font-display font-black leading-[0.95] tracking-tight text-[clamp(32px,5vw,64px)]">
              Surprenez-nous.
            </h2>
            <ul className="mt-6 space-y-3 border-t border-ink/15 pt-4">
              {WANTED.map((item, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 border-b border-ink/10 pb-3 font-display text-lg leading-snug md:text-xl"
                >
                  <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-flame" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              ×  Ce qu'on évite
            </p>
            <h2 className="mt-3 font-display font-black leading-[0.95] tracking-tight text-[clamp(32px,5vw,64px)]">
              <span className="italic font-medium">Pas la peine.</span>
            </h2>
            <ul className="mt-6 space-y-3 border-t border-ink/15 pt-4">
              {NOT_WANTED.map((item, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 border-b border-ink/10 pb-3 font-display text-lg italic leading-snug text-smoke md:text-xl"
                >
                  <X className="mt-1 h-3.5 w-3.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-24 grid grid-cols-12 gap-4 border-t border-ink/15 pt-12 md:mt-32 md:pt-16"
        >
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ¶  Comment faire
          </p>
          <div className="col-span-12 md:col-span-9">
            <h3 className="font-display font-black leading-[0.95] tracking-tight text-[clamp(36px,6vw,80px)]">
              Trois lignes, un lien.
            </h3>
            <p className="mt-6 max-w-xl font-display text-lg leading-snug md:text-xl">
              Cliquez ci-dessous, on vous ouvre un mail pré-rempli.
              Remplissez les champs, attachez votre lien YouTube (non listé, ça marche aussi),
              et envoyez. <span className="italic">Vraiment, c'est tout.</span>
            </p>
            <a
              href={MAILTO_TEMPLATE}
              className="group mt-8 inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm font-medium tracking-tight text-paper transition hover:bg-flame"
            >
              <Mail className="h-4 w-4" />
              Ouvrir le mail pré-rempli
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
              Adresse : hello@cheap-actors.com
            </p>
          </div>
        </motion.section>

        {/* Rejection wall */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-24 grid grid-cols-12 gap-4 md:mt-32"
        >
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ¶  Mur des refus
          </p>
          <div className="col-span-12 md:col-span-9">
            <h3 className="font-display font-black leading-[0.95] tracking-tight text-[clamp(36px,6vw,80px)]">
              Pourquoi on refuse.
            </h3>
            <p className="mt-4 max-w-xl font-display text-base italic leading-snug text-smoke md:text-lg">
              Quelques raisons réelles, recopiées des derniers refus envoyés.
              Aucun nom, aucun film. Juste pour situer.
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {REJECTION_REASONS.map((r, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 border-b border-ink/10 pb-3 font-display leading-snug"
                >
                  <span className="font-mono text-[10px] tracking-tight text-smoke">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span className="italic">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Final note */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-24 max-w-3xl border-t border-ink/15 pt-12 md:mt-32"
        >
          <p className="font-display text-2xl leading-snug md:text-3xl">
            Si on dit oui, on vous explique la suite. Si on dit non, on vous le dit
            <span className="italic"> bien</span>.
            On vous écrit nous-mêmes, pas un copier-coller.{" "}
            <span className="text-flame">C'est le moins qu'on puisse faire.</span>
          </p>
          <Link
            href="/manifeste"
            className="link-underline mt-8 inline-block font-mono text-xs uppercase tracking-[0.22em]"
          >
            Lire le manifeste →
          </Link>
        </motion.section>
      </div>
    </article>
  );
}

function Countdown() {
  const [text, setText] = useState("…");
  useEffect(() => {
    const update = () => {
      const target = new Date(SITE_STATS.nextVolumeOpensAt).getTime();
      const now = Date.now();
      const ms = target - now;
      if (ms <= 0) {
        setText("maintenant");
        return;
      }
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
      setText(`${days}j ${String(hours).padStart(2, "0")}h`);
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);
  return <span className="text-flame">{text}</span>;
}
