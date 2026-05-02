"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const POINTS = [
  {
    n: "01",
    title: "Pas de tapis rouge.",
    body: "On ne demande pas votre filmographie, la plupart des nôtres tiendraient sur un post-it. On regarde ce que vous avez tourné. On décide. C'est tout.",
  },
  {
    n: "02",
    title: "Pas d'algorithme.",
    body: "Pas de recommandations qui exploitent vos faiblesses. Une sélection humaine, parfois subjective, souvent à côté.",
  },
  {
    n: "03",
    title: "Pas d'attente.",
    body: "Hébergé sur YouTube. Joué partout. Visible immédiatement par n'importe qui, sans inscription, sans abonnement, sans prétexte. Cheap, dans tous les sens du terme.",
  },
  {
    n: "04",
    title: "Pas connus. Pas chers. Pas mal.",
    body: "On ne fait pas semblant. Les acteurs ne sont pas connus. Les films n'ont rien coûté. Mais regardez, et jugez vous-même.",
  },
];

export function ManifesteClient() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <article className="relative">
      {/* Hero */}
      <section
        ref={ref}
        className="relative flex min-h-[100svh] items-end px-5 pb-16 pt-32 md:px-10 md:pb-24"
      >
        <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-[1800px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
            ●  Manifeste · version 0.1 (provisoire, comme tout ici)
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-display font-black leading-[0.85] tracking-[-0.04em] text-[clamp(56px,13vw,240px)] md:mt-8"
          >
            quelques <br />
            <span className="italic font-medium">règles</span>
            <span className="text-flame">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-6 max-w-md font-display text-lg italic md:text-xl"
          >
            Plus ou moins suivies, selon le niveau de fatigue.
          </motion.p>
        </motion.div>
      </section>

      {/* Points */}
      <section className="relative pb-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <ul className="border-t border-ink/15">
            {POINTS.map((p, i) => (
              <motion.li
                key={p.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className="grid grid-cols-12 gap-4 border-b border-ink/15 py-10 md:py-16 lg:py-20"
              >
                <span className="col-span-2 font-mono text-xs tracking-tight text-smoke md:col-span-1">
                  {p.n}
                </span>
                <h2 className="col-span-10 font-display font-black leading-[0.95] tracking-tight text-[clamp(32px,6vw,72px)] md:col-span-6">
                  {p.title}
                </h2>
                <p className="col-span-12 mt-3 font-display leading-[1.3] text-[clamp(16px,2vw,24px)] md:col-span-5 md:mt-0">
                  {p.body}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative pb-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-12 gap-4"
          >
            <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
              ¶  Soumettre
            </p>
            <div className="col-span-12 md:col-span-9">
              <h3 className="font-display font-black leading-[0.9] tracking-tight text-[clamp(40px,8vw,128px)]">
                Vous filmez ? <br />
                <span className="italic font-medium">Faites voir.</span>
              </h3>
              <p className="mt-6 max-w-xl font-display text-lg leading-snug md:mt-8 md:text-xl">
                On regarde tout, on répond à tout (sauf quand on dort).
                Pas besoin d'un dossier. Un lien YouTube, trois lignes,
                et on vous dit oui, ou non, mais en mieux écrit.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <a
                  href="mailto:hello@cheap-actors.com?subject=Soumission"
                  className="link-underline font-mono text-sm"
                >
                  hello@cheap-actors.com →
                </a>
                <Link
                  href="/"
                  className="link-underline font-mono text-sm"
                >
                  Voir le programme →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </article>
  );
}
