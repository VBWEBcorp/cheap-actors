"use client";

import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Video } from "@/lib/user-types";
import { youtubeThumbUrl } from "@/lib/youtube";
import { moderateVideoAction } from "./actions";

type Props = {
  userId: string;
  userName: string;
  userSlug: string;
  video: Video;
};

export function VideoModerationCard({ userId, userName, userSlug, video }: Props) {
  const [showReject, setShowReject] = useState(false);

  return (
    <article className="border border-ink/15 bg-paper p-5 md:p-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-5">
          <div
            className={`relative overflow-hidden bg-chalk ${video.format === "vertical" ? "aspect-[9/16]" : "aspect-video"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.coverUrl || youtubeThumbUrl(video.youtubeId)}
              alt={video.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute right-2 top-2 flex items-center gap-1.5 bg-paper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur">
              <span className="h-1 w-1 rounded-full bg-flame" />
              {video.format}
            </span>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
            ●  Soumise le{" "}
            {new Date(video.submittedAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
            })}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
            {video.title}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
            {video.year ?? "—"} · {video.format} · YouTube ID{" "}
            <span className="text-ink">{video.youtubeId}</span>
          </p>

          {video.description && (
            <p className="mt-3 max-w-md text-sm italic text-smoke">{video.description}</p>
          )}

          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
            Par{" "}
            <Link href={`/acteurs/${userSlug}`} className="link-underline text-ink">
              {userName}
            </Link>
          </p>

          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition hover:text-flame"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Regarder sur YouTube
          </a>

          <div className="mt-5 flex flex-wrap gap-2">
            <form action={moderateVideoAction}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="videoId" value={video.id} />
              <button
                type="submit"
                name="status"
                value="approved"
                className="inline-flex items-center gap-2 bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition hover:bg-emerald-700"
              >
                <Check className="h-3.5 w-3.5" />
                Valider
              </button>
            </form>

            {!showReject ? (
              <button
                onClick={() => setShowReject(true)}
                className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition hover:border-flame hover:text-flame"
              >
                <X className="h-3.5 w-3.5" />
                Refuser
              </button>
            ) : (
              <form action={moderateVideoAction} className="grid w-full gap-2">
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="videoId" value={video.id} />
                <input type="hidden" name="status" value="rejected" />
                <input
                  name="reason"
                  type="text"
                  placeholder="Raison (lu par le user)"
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
      </div>
    </article>
  );
}
