"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { type Film, getRelatedFilms } from "@/lib/catalog";
import { BrowseHero } from "@/components/browse/browse-hero";
import { BrowseRow, BrowseTopRow } from "@/components/browse/browse-row";
import { FilmModal } from "@/components/browse/film-modal";
import { BrowseFilters } from "@/components/browse/browse-filters";

type RowConfig = {
  title: string;
  subtitle?: string;
  films: Film[];
  featuredFirst?: boolean;
  top?: boolean;
};

type Props = {
  featured: Film | undefined;
  rows: RowConfig[];
  shorts: Film[];
};

export function HomeBrowse({ featured, rows, shorts }: Props) {
  return (
    <Suspense fallback={null}>
      <HomeBrowseInner featured={featured} rows={rows} shorts={shorts} />
    </Suspense>
  );
}

function HomeBrowseInner({ featured, rows, shorts }: Props) {
  const [selected, setSelected] = useState<Film | null>(null);
  const [selectedRank, setSelectedRank] = useState<number | undefined>();
  const [tagFilters, setTagFilters] = useState<Set<string>>(new Set());
  const params = useSearchParams();

  const open = (film: Film, rank?: number) => {
    setSelected(film);
    setSelectedRank(rank);
  };

  // Deep-link via ?film=slug — open the modal for that film on mount
  useEffect(() => {
    const slug = params.get("film");
    if (!slug) return;
    const all = [...rows.flatMap((r) => r.films), ...shorts];
    const found = all.find((f) => f.slug === slug);
    if (found) setSelected(found);
  }, [params, rows, shorts]);
  const close = () => {
    setSelected(null);
    setSelectedRank(undefined);
  };

  // All distinct tags currently in the catalog (rows + shorts)
  const availableTags = useMemo(() => {
    const all = new Set<string>();
    for (const row of rows) {
      for (const f of row.films) {
        for (const g of f.genres) all.add(g);
      }
    }
    for (const s of shorts) {
      for (const g of s.genres) all.add(g);
    }
    return Array.from(all).sort((a, b) => a.localeCompare(b, "fr"));
  }, [rows, shorts]);

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

  const filteredShorts = useMemo(
    () => (tagFilters.size === 0 ? shorts : shorts.filter(matchesFilter)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shorts, tagFilters],
  );

  const similar = selected ? getRelatedFilms(selected.slug) : [];
  const hasFilter = tagFilters.size > 0;

  return (
    <>
      {featured && !hasFilter && (
        <BrowseHero
          film={featured}
          onPlay={() => open(featured)}
          onInfo={() => open(featured)}
        />
      )}

      <BrowseFilters
        available={availableTags}
        selected={tagFilters}
        onChange={setTagFilters}
      />

      <div
        className={
          hasFilter
            ? "relative pt-8"
            : "relative -mt-12 md:-mt-16"
        }
      >
        {filteredRows.length === 0 && filteredShorts.length === 0 ? (
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
            <p className="font-display text-2xl italic text-smoke md:text-3xl">
              Personne ne correspond à ces tags. Essayez moins de filtres.
            </p>
          </div>
        ) : (
          <>
            {filteredRows.map((row) =>
              row.top ? (
                <BrowseTopRow
                  key={row.title}
                  title={row.title}
                  films={row.films}
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
                  featuredFirst={row.featuredFirst}
                  onSelect={(f) => open(f)}
                />
              ),
            )}

            {filteredShorts.length > 0 && (
              <BrowseRow
                title="Shorts"
                subtitle="Format vertical · une minute, promis"
                films={filteredShorts}
                variant="vertical"
                onSelect={(f) => open(f)}
              />
            )}
          </>
        )}
      </div>

      <FilmModal
        film={selected}
        rank={selectedRank}
        similar={similar}
        onClose={close}
        onSelectSimilar={(f) => open(f)}
      />
    </>
  );
}
