"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { UserModerationData } from "@/lib/user-types";

export type { UserModerationData };
import { moderateUserAction } from "./actions";

export function UserModerationCard({ user }: { user: UserModerationData }) {
  const [showReject, setShowReject] = useState(false);

  return (
    <article className="border border-ink/15 bg-paper p-5 md:p-7">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
            ●  Inscrit le{" "}
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {user.displayName}
          </h3>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke">
            <span>{user.email}</span>
            <span>·</span>
            <span>{user.roles.join(" + ")}</span>
            <span>·</span>
            <span>slug : /{user.slug}</span>
          </div>

          {user.bio && (
            <p className="mt-4 max-w-2xl font-display text-base italic text-ink md:text-lg">
              « {user.bio} »
            </p>
          )}
          {user.tagline && (
            <p className="mt-2 max-w-2xl text-sm text-smoke">Tagline : {user.tagline}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke sm:grid-cols-4">
            {user.basedIn && <span>📍 {user.basedIn}</span>}
            {user.born && <span>né·e {user.born}</span>}
            <span>{user.videos.length} vidéos</span>
            {user.photoUrl && <span>📷 photo</span>}
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-3 md:col-span-4 md:items-end">
          <form action={moderateUserAction} className="contents">
            <input type="hidden" name="userId" value={user.id} />
            <button
              type="submit"
              name="status"
              value="approved"
              className="group inline-flex items-center justify-center gap-2 bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition hover:bg-emerald-700"
            >
              <Check className="h-3.5 w-3.5" />
              Valider le compte
            </button>
          </form>

          {!showReject ? (
            <button
              onClick={() => setShowReject(true)}
              className="inline-flex items-center justify-center gap-2 border border-ink/20 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition hover:border-flame hover:text-flame"
            >
              <X className="h-3.5 w-3.5" />
              Refuser
            </button>
          ) : (
            <form action={moderateUserAction} className="grid w-full gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="status" value="rejected" />
              <input
                name="reason"
                type="text"
                placeholder="Raison (optionnelle, lue par le user)"
                maxLength={200}
                className="border border-ink/20 bg-paper px-3 py-2 font-mono text-xs"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-flame px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper hover:bg-ink"
                >
                  Confirmer le refus
                </button>
                <button
                  type="button"
                  onClick={() => setShowReject(false)}
                  className="border border-ink/20 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em]"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
