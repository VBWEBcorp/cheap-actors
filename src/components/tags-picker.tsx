"use client";

import { useState } from "react";
import { TAGS, MAX_TAGS_PER_VIDEO, type Tag } from "@/lib/user-types";
import { cn } from "@/lib/cn";

type Props = {
  initial?: Tag[];
  /** Field name used in the form. The form will receive multiple
   *  `tags=...` entries, parsed via `formData.getAll("tags")`. */
  name?: string;
};

export function TagsPicker({ initial = [], name = "tags" }: Props) {
  const [selected, setSelected] = useState<Tag[]>(initial);

  const toggle = (t: Tag) => {
    setSelected((prev) => {
      if (prev.includes(t)) {
        return prev.filter((x) => x !== t);
      }
      if (prev.length >= MAX_TAGS_PER_VIDEO) {
        // Replace the oldest selected so the user can keep tagging
        return [...prev.slice(1), t];
      }
      return [...prev, t];
    });
  };

  return (
    <fieldset>
      <legend className="sr-only">Tags du film</legend>

      {/* Hidden inputs that submit the actual values */}
      {selected.map((t) => (
        <input key={t} type="hidden" name={name} value={t} />
      ))}

      <div className="flex flex-wrap gap-1.5">
        {TAGS.map((t) => {
          const isSelected = selected.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              aria-pressed={isSelected}
              className={cn(
                "border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition",
                isSelected
                  ? "border-flame bg-flame text-paper"
                  : "border-ink/15 text-ink/80 hover:border-ink/40",
              )}
            >
              {t}
            </button>
          );
        })}
      </div>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
        Max {MAX_TAGS_PER_VIDEO} ·{" "}
        <span className={cn(selected.length > 0 && "text-flame")}>
          {selected.length}
        </span>{" "}
        sélectionné{selected.length > 1 ? "s" : ""}
      </p>
    </fieldset>
  );
}
