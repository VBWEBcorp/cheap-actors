"use client";

import { useState } from "react";
import { ROLES, MAX_ROLES, type Role } from "@/lib/user-types";
import { cn } from "@/lib/cn";

type Props = {
  initial?: Role[];
  /** Field name used in the form. The form will receive multiple
   * `roles=...` entries, parsed via `formData.getAll("roles")`. */
  name?: string;
  required?: boolean;
};

export function RolesPicker({ initial = [], name = "roles", required }: Props) {
  const [selected, setSelected] = useState<Role[]>(initial);

  const toggle = (role: Role) => {
    setSelected((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      }
      if (prev.length >= MAX_ROLES) {
        // Replace the oldest selection so user can swap.
        return [prev[1], role];
      }
      return [...prev, role];
    });
  };

  return (
    <fieldset className="grid grid-cols-2 gap-2">
      <legend className="sr-only">Vos rôles</legend>

      {/* Hidden inputs that submit the actual values */}
      {selected.map((r) => (
        <input key={r} type="hidden" name={name} value={r} />
      ))}

      {/* Required validation: a single dummy required input that's empty
          when no role is selected. */}
      {required && selected.length === 0 && (
        <input
          type="text"
          required
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
      )}

      {ROLES.map((r) => {
        const isSelected = selected.includes(r);
        return (
          <button
            key={r}
            type="button"
            onClick={() => toggle(r)}
            aria-pressed={isSelected}
            className={cn(
              "group flex items-center gap-3 border px-4 py-3 text-left transition",
              isSelected
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-paper hover:border-ink/50",
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center border transition",
                isSelected
                  ? "border-paper bg-paper text-ink"
                  : "border-ink/30",
              )}
            >
              {isSelected && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-current">
                  <path d="M3 6.5l2 2L9 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="capitalize font-display text-base md:text-lg">{r}</span>
          </button>
        );
      })}

      <p className="col-span-2 mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
        Max {MAX_ROLES} · sélectionnez 1 ou 2 ·{" "}
        <span className="text-ink">{selected.length}</span> sélectionné
        {selected.length > 1 ? "s" : ""}
      </p>
    </fieldset>
  );
}
