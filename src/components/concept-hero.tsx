"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Splash hero on first load. Each block drops in askew, springs back,
 * settles at a slight rotation — the whole thing reads as "hand-stuck
 * notice" rather than a polished UI. First scroll input smooth-scrolls
 * past it; refresh to see the splash again.
 */
export function ConceptHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let fired = false;

    const fire = () => {
      if (fired) return;
      if (window.scrollY > 50) return;
      const heroEl = ref.current;
      if (!heroEl) return;
      fired = true;
      const targetY = heroEl.offsetTop + heroEl.offsetHeight;
      const reduced =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: targetY,
        behavior: reduced ? "auto" : "smooth",
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) fire();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStartY - (e.touches[0]?.clientY ?? touchStartY);
      if (dy > 10) fire();
    };

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "End"].includes(e.key)) fire();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Spring config gives the wobble — low damping = bouncier.
  const spring = (delay: number) =>
    ({
      type: "spring" as const,
      stiffness: 75,
      damping: 9,
      mass: 0.9,
      delay,
    }) as const;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-5 pb-16 pt-20 md:px-10 md:pb-20 md:pt-24"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <motion.p
          initial={{ opacity: 0, y: -120, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: -1.2 }}
          transition={spring(0)}
          className="origin-left font-mono text-[10px] uppercase tracking-[0.28em] text-smoke"
        >
          ●  vol. 01 · 2026 · entrée gratuite, sortie quand vous voulez
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -260, rotate: 14 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={spring(0.1)}
          className="mt-3 origin-bottom-left font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(56px,14vw,200px)]"
        >
          la vitrine<span className="text-flame">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -180, rotate: -11 }}
          animate={{ opacity: 1, y: 0, rotate: 1.5 }}
          transition={spring(0.25)}
          className="mt-3 max-w-3xl origin-left font-display text-[clamp(20px,3vw,38px)] italic leading-tight text-smoke md:mt-4"
        >
          des comédien·ne·s qu'aucune agence n'a rappelés.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: -90, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: -0.5 }}
          transition={spring(0.4)}
          className="mt-10 grid origin-left grid-cols-12 gap-x-4 gap-y-2 md:mt-12"
        >
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ¶  ce que c'est
          </p>
          <p className="col-span-12 max-w-2xl font-display leading-snug text-[clamp(16px,1.7vw,22px)] md:col-span-9">
            Une plateforme gratuite, sans inscription ni algorithme,
            qui héberge sur YouTube des courts-métrages joués par des
            gens dont vous n'avez pas entendu parler. Choisis à la main
            par des gens dont vous n'avez pas entendu parler non plus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -22 }}
          animate={{ opacity: 1, scale: 1, rotate: -3.5 }}
          transition={{
            type: "spring",
            stiffness: 130,
            damping: 8,
            mass: 0.7,
            delay: 0.6,
          }}
          className="mt-10 inline-block origin-center border-2 border-flame px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-flame md:mt-14 md:px-6 md:py-3 md:text-sm"
        >
          ●  pas connus · pas chers · pas mal
        </motion.div>
      </div>
    </section>
  );
}
