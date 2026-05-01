"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** All available tags (computed from current films catalog) */
  available: string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
};

export function BrowseFilters({ available, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const hasFilters = selected.size > 0;

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = (tag: string) => {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    onChange(next);
  };

  const reset = () => onChange(new Set());

  return (
    <section className="sticky top-16 z-30 border-y border-ink/15 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-5 py-3 md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className={cn(
              "inline-flex items-center gap-2 border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition",
              hasFilters
                ? "border-flame bg-flame text-paper"
                : "border-ink/20 text-ink hover:border-ink/40",
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            Filtrer
            {hasFilters && (
              <span className="ml-1 rounded-full bg-paper px-1.5 py-0.5 text-[9px] text-flame">
                {selected.size}
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>

          {/* Inline selected chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-1.5">
              {Array.from(selected).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  className="inline-flex items-center gap-1 border border-ink/30 bg-ink/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition hover:border-flame hover:text-flame"
                >
                  {tag}
                  <X className="h-2.5 w-2.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {hasFilters && (
          <button
            onClick={reset}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-flame transition hover:text-ink"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-paper"
          >
            <div className="mx-auto max-w-[1800px] px-5 py-5 md:px-10 md:py-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                Tags · sélection multiple
              </p>
              <div className="flex flex-wrap gap-1.5">
                {available.map((tag) => {
                  const isSelected = selected.has(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggle(tag)}
                      aria-pressed={isSelected}
                      className={cn(
                        "border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition",
                        isSelected
                          ? "border-flame bg-flame text-paper"
                          : "border-ink/15 text-ink hover:border-ink/40",
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
