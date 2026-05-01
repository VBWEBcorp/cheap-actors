"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, ShieldCheck, User, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DemoLoginModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/80 px-4 py-8 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-paper text-ink shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center text-smoke transition hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pb-2 pt-8 md:px-10 md:pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
                ●  Accès démo
              </p>
              <h2 className="mt-3 font-display font-black leading-[0.95] tracking-tight text-[clamp(28px,4vw,44px)]">
                Entrez en un clic.
              </h2>
              <p className="mt-2 font-display text-base italic text-smoke md:text-lg">
                Pas d'inscription, pas de mot de passe. Juste pour explorer.
              </p>
            </div>

            <div className="grid gap-3 px-6 pb-8 pt-6 md:grid-cols-2 md:gap-4 md:px-10 md:pb-10">
              <ChoiceCard
                href="/mon-compte"
                onPick={onClose}
                icon={<User className="h-5 w-5" />}
                badge="Acteur · démo"
                title="Espace acteur"
                description="Voyez à quoi ressemble votre fiche, ajoutez des vidéos, modifiez votre bio."
              />
              <ChoiceCard
                href="/admin"
                onPick={onClose}
                icon={<ShieldCheck className="h-5 w-5" />}
                badge="Super admin · démo"
                title="Console créateur"
                description="Modérez les comptes, validez/refusez les vidéos, suspendez ou supprimez."
                accent
              />
            </div>

            <p className="border-t border-ink/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke md:px-10">
              <span className="text-flame">●</span> Mode démo · aucun changement n'est sauvegardé en base
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChoiceCard({
  href,
  onPick,
  icon,
  badge,
  title,
  description,
  accent = false,
}: {
  href: string;
  onPick: () => void;
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onPick}
      className={
        accent
          ? "group flex flex-col gap-3 border border-flame bg-flame p-5 text-paper transition hover:bg-ink hover:border-ink"
          : "group flex flex-col gap-3 border border-ink/15 bg-paper p-5 transition hover:border-ink hover:bg-ink hover:text-paper"
      }
    >
      <div className="flex items-center gap-2">
        <span
          className={
            accent
              ? "flex h-8 w-8 items-center justify-center bg-paper/15"
              : "flex h-8 w-8 items-center justify-center bg-ink/5 transition group-hover:bg-paper/15"
          }
        >
          {icon}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-90">
          {badge}
        </span>
      </div>
      <h3 className="font-display text-2xl font-black leading-tight tracking-tight md:text-3xl">
        {title}
      </h3>
      <p className="text-sm leading-snug opacity-90">{description}</p>
      <span className="mt-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
        Entrer
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
