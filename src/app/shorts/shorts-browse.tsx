"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { type Film, getRelatedFilms } from "@/lib/catalog";
import { BrowseRow, BrowseTopRow } from "@/components/browse/browse-row";
import { FilmModal } from "@/components/browse/film-modal";
import { BrowseFilters } from "@/components/browse/browse-filters";

type RowConfig = {
  title: string;
  subtitle?: string;
  films: Film[];
  top?: boolean;
};

type Props = {
  rows: RowConfig[];
};

export function ShortsBrowse({ rows }: Props) {
  return (
    <Suspense fallback={null}>
      <ShortsBrowseInner rows={rows} />
    </Suspense>
  );
}

function ShortsBrowseInner({ rows }: Props) {
  const [selected, setSelected] = useState<Film | null>(null);
  const [selectedRank, setSelectedRank] = useState<number | undefined>();
  const [tagFilters, setTagFilters] = useState<Set<string>>(new Set());
  const params = useSearchParams();

  const open = (film: Film, rank?: number) => {
    setSelected(film);
    setSelectedRank(rank);
  };
  const close = () => {
    setSelected(null);
    setSelectedRank(undefined);
  };

  // Deep-link via ?id=…, opens the modal for the matching short on mount
  useEffect(() => {
    const id = params.get("id");
    if (!id) return;
    const found = rows.flatMap((r) => r.films).find((f) => f.id === id);
    if (found) setSelected(found);
  }, [params, rows]);

  const availableTags = useMemo(() => {
    const all = new Set<string>();
    for (const row of rows) {
      for (const f of row.films) {
        for (const g of f.genres) all.add(g);
      }
    }
    return Array.from(all).sort((a, b) => a.localeCompare(b, "fr"));
  }, [rows]);

  const matchesFilter = (f: Film) => {
    if (tagFilters.size === 0) return true;
    return f.genres.some((g) => tagFilters.has(g));
  };

  const filteredRows = useMemo(() => {
    if (tagFilters.size === 0) return rows;
    return rows
      .map((row) => ({ ...row, films: row.films.filter(matchesFilter) }))
      .filter((row) => row.films.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, tagFilters]);

  const similar = selected ? getRelatedFilms(selected.slug) : [];
  const hasFilter = tagFilters.size > 0;

  return (
    <>
      {/* Editorial header, replaces the BrowseHero (shorts have no horizontal backdrop) */}
      <header className="relative pb-6 pt-28 md:pt-32">
        <div className="mx-auto max-w-[1800px] px-5 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
            ●  Format vertical · une minute, promis
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(48px,10vw,160px)]"
          >
            Shorts<span className="text-flame">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 max-w-2xl font-display text-xl italic text-smoke md:text-2xl"
          >
            « Une minute. Pas plus. Souvent moins. »
          </motion.p>
        </div>
      </header>

      <BrowseFilters
        available={availableTags}
        selected={tagFilters}
        onChange={setTagFilters}
      />

      <div className={hasFilter ? "relative pt-6" : "relative pt-2"}>
        {filteredRows.length === 0 ? (
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
            <p className="font-display text-2xl italic text-smoke md:text-3xl">
              Personne ne correspond à ces tags. Essayez moins de filtres.
            </p>
          </div>
        ) : (
          filteredRows.map((row) =>
            row.top ? (
              <BrowseTopRow
                key={row.title}
                title={row.title}
                films={row.films}
                variant="vertical"
                onSelect={(f) => {
                  const rank = row.films.findIndex((x) => x.id === f.id) + 1;
                  open(f, rank);
                }}
              />
            ) : (
              <BrowseRow
                key={row.title}
                title={row.title}
                subtitle={row.subtitle}
                films={row.films}
                variant="vertical"
                onSelect={(f) => open(f)}
              />
            ),
          )
        )}
      </div>

      <FilmModal
        film={selected}
        rank={selectedRank}
        similar={similar}
        onClose={close}
        onSelectSimilar={(f) => open(f)}
        autoPlay
      />
    </>
  );
}
