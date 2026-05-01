"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ROLES, type Role } from "@/lib/user-types";
import type { PersonView } from "@/lib/person-view";
import { PersonAvatar } from "@/components/person-avatar";
import { cn } from "@/lib/cn";

type Format = "horizontal" | "vertical";

type Props = { people: PersonView[] };

export function ActorsBrowser({ people }: Props) {
  const [activeRoles, setActiveRoles] = useState<Set<Role>>(new Set());
  const [activeFormat, setActiveFormat] = useState<Format | null>(null);
  const [activeCity, setActiveCity] = useState<string>("");

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const p of people) {
      if (p.basedIn) set.add(p.basedIn);
    }
    return Array.from(set).sort();
  }, [people]);

  const filtered = useMemo(() => {
    return people.filter((p) => {
      // Roles filter (OR within selection)
      if (activeRoles.size > 0) {
        const hasMatch = p.roles.some((r) => activeRoles.has(r));
        if (!hasMatch) return false;
      }
      // Format filter
      if (activeFormat) {
        const has = p.videos.some((v) => v.format === activeFormat);
        if (!has) return false;
      }
      // City filter
      if (activeCity && p.basedIn !== activeCity) return false;
      return true;
    });
  }, [people, activeRoles, activeFormat, activeCity]);

  const hasFilters =
    activeRoles.size > 0 || activeFormat !== null || activeCity !== "";

  const toggleRole = (r: Role) => {
    setActiveRoles((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const reset = () => {
    setActiveRoles(new Set());
    setActiveFormat(null);
    setActiveCity("");
  };

  return (
    <>
      {/* Filter bar */}
      <section className="border-y border-ink/15 py-5 md:py-6">
        <div className="grid gap-5 md:grid-cols-12 md:gap-6">
          {/* Roles */}
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              Rôle
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROLES.map((r) => {
                const isActive = activeRoles.has(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleRole(r)}
                    aria-pressed={isActive}
                    className={cn(
                      "border px-3 py-2 text-xs font-medium capitalize transition",
                      isActive
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/20 text-ink hover:border-ink/50",
                    )}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format + City */}
          <div className="grid gap-5 md:col-span-5 md:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                Format
              </p>
              <div className="mt-3 flex gap-2">
                {(["horizontal", "vertical"] as Format[]).map((f) => {
                  const isActive = activeFormat === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFormat(isActive ? null : f)}
                      aria-pressed={isActive}
                      className={cn(
                        "border px-3 py-2 text-xs font-medium capitalize transition",
                        isActive
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/20 text-ink hover:border-ink/50",
                      )}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                Ville
              </p>
              <select
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="mt-3 w-full appearance-none border border-ink/20 bg-paper px-3 py-2 font-display text-base outline-none transition hover:border-ink/50 focus:border-flame"
              >
                <option value="">Toutes</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result count + reset */}
        <div className="mt-5 flex items-center justify-between gap-4 md:mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
            <span className="text-ink">{String(filtered.length).padStart(2, "0")}</span>{" "}
            résultat{filtered.length > 1 ? "s" : ""}
            {hasFilters && (
              <>
                {" "}sur {String(people.length).padStart(2, "0")}
              </>
            )}
          </p>
          {hasFilters && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-flame transition hover:text-ink"
            >
              <X className="h-3 w-3" />
              Réinitialiser
            </button>
          )}
        </div>
      </section>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <p className="mt-20 border border-ink/10 bg-ink/[0.02] p-8 text-center font-display text-lg italic text-smoke md:p-16">
          Personne ne correspond à ces filtres.
        </p>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-y-12 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <motion.li
              key={`${p.source}-${p.slug}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4) }}
            >
              <Link href={`/acteurs/${p.slug}`} className="group block">
                <PersonCardAvatar person={p} />
                <h3 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight md:text-2xl">
                  {p.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke">
                  {p.tagline || <span className="italic">Tagline à venir</span>}
                </p>
                {p.basedIn && (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke/70">
                    {p.basedIn}
                  </p>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </>
  );
}

function PersonCardAvatar({ person }: { person: PersonView }) {
  const roleLabel = person.roles.join(" · ");

  if (person.photoUrl) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden bg-chalk transition-transform duration-700 group-hover:scale-[1.02]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={person.photoUrl}
          alt={person.name}
          className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
        />
        <span className="absolute right-2 top-2 flex items-center gap-1.5 bg-paper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur">
          <span className="h-1 w-1 rounded-full bg-flame" />
          {roleLabel}
        </span>
      </div>
    );
  }
  return (
    <PersonAvatar
      person={{
        slug: person.slug,
        name: person.name,
        job: person.roles[0],
        tagline: person.tagline,
        bio: person.bio,
      }}
      size="lg"
      className="transition-transform duration-700 group-hover:scale-[1.02]"
    />
  );
}
