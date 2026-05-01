"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Trash2,
  PauseCircle,
  PlayCircle,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { youtubeThumbUrl } from "@/lib/youtube";
import type { ModerationStatus, UserModerationData, Video } from "@/lib/user-types";
import {
  deleteUserAction,
  deleteVideoAction,
  moderateUserAction,
  moderateVideoAction,
} from "./actions";

export function AccountControlCard({ user }: { user: UserModerationData }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const pendingVideos = user.videos.filter((v) => v.status === "pending").length;
  const approvedVideos = user.videos.filter((v) => v.status === "approved").length;

  return (
    <article
      className={cn(
        "border bg-paper transition",
        user.status === "pending" && "border-flame/30",
        user.status === "approved" && "border-ink/15",
        user.status === "suspended" && "border-amber-700/40",
        user.status === "rejected" && "border-smoke/40 opacity-80",
      )}
    >
      {/* Top row */}
      <div className="grid grid-cols-12 items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="col-span-12 flex items-center justify-between gap-4 text-left md:col-span-7"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-lg font-bold tracking-tight md:text-xl">
                  {user.displayName}
                </h3>
                <StatusPill status={user.status} />
              </div>
              <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
                {user.email} · {user.roles.join(" · ")}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
                {user.videos.length} vidéos
                {pendingVideos > 0 && (
                  <>
                    {" · "}
                    <span className="text-flame">{pendingVideos} en attente</span>
                  </>
                )}
                {approvedVideos > 0 && (
                  <>
                    {" · "}
                    <span className="text-emerald-700">{approvedVideos} publiques</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-smoke transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>

        {/* Action buttons */}
        <div className="col-span-12 flex flex-wrap items-center gap-2 md:col-span-5 md:justify-end">
          {/* Status actions */}
          {user.status !== "approved" && (
            <ActionForm action={moderateUserAction}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="status" value="approved" />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 border border-emerald-700/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700 transition hover:bg-emerald-700 hover:text-paper"
              >
                <Check className="h-3 w-3" />
                Valider
              </button>
            </ActionForm>
          )}

          {user.status === "approved" && (
            <ActionForm action={moderateUserAction}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="status" value="suspended" />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 border border-amber-700/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-700 transition hover:bg-amber-700 hover:text-paper"
              >
                <PauseCircle className="h-3 w-3" />
                Suspendre
              </button>
            </ActionForm>
          )}

          {user.status === "suspended" && (
            <ActionForm action={moderateUserAction}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="status" value="approved" />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 border border-emerald-700/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700 transition hover:bg-emerald-700 hover:text-paper"
              >
                <PlayCircle className="h-3 w-3" />
                Réactiver
              </button>
            </ActionForm>
          )}

          {user.status !== "rejected" && user.status !== "suspended" && (
            <ActionForm action={moderateUserAction}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="status" value="rejected" />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 border border-smoke/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke transition hover:bg-smoke hover:text-paper"
              >
                <X className="h-3 w-3" />
                Refuser
              </button>
            </ActionForm>
          )}

          {/* Delete with confirm */}
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 border border-flame/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-flame transition hover:bg-flame hover:text-paper"
            >
              <Trash2 className="h-3 w-3" />
              Supprimer
            </button>
          ) : (
            <ActionForm action={deleteUserAction} className="contents">
              <input type="hidden" name="userId" value={user.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-flame px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper hover:bg-ink"
              >
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke hover:text-ink"
              >
                Annuler
              </button>
            </ActionForm>
          )}

          <Link
            href={`/acteurs/${user.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke transition hover:text-ink"
          >
            <ExternalLink className="h-3 w-3" />
            Fiche
          </Link>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-ink/10 bg-ink/[0.015] p-4">
          {/* Profile snapshot */}
          {(user.tagline || user.bio) && (
            <div className="mb-5 grid gap-4 md:grid-cols-2">
              {user.tagline && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
                    Tagline
                  </p>
                  <p className="mt-1 font-display text-base italic">« {user.tagline} »</p>
                </div>
              )}
              {user.bio && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
                    Bio
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm">{user.bio}</p>
                </div>
              )}
            </div>
          )}

          {/* Videos */}
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
            Vidéos ({user.videos.length})
          </p>
          {user.videos.length === 0 ? (
            <p className="font-display text-sm italic text-smoke">
              Aucune vidéo soumise.
            </p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {user.videos.map((v) => (
                <VideoControlRow key={v.id} userId={user.id} video={v} />
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}

function VideoControlRow({ userId, video }: { userId: string; video: Video }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <li className="flex items-start gap-3 border border-ink/10 bg-paper p-3">
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-chalk",
          video.format === "vertical" ? "aspect-[9/16] w-12" : "aspect-video w-24",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={youtubeThumbUrl(video.youtubeId)}
          alt={video.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h4 className="line-clamp-1 font-display text-sm font-bold leading-tight">
            {video.title}
          </h4>
          <VideoStatusPill status={video.status} />
        </div>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
          {video.format} · {video.year ?? "—"} · {video.youtubeId}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.22em] text-smoke transition hover:text-ink"
          >
            <ExternalLink className="h-2.5 w-2.5" /> YouTube
          </a>
          {video.status !== "approved" && (
            <ActionForm action={moderateVideoAction}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="videoId" value={video.id} />
              <input type="hidden" name="status" value="approved" />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-700 transition hover:bg-emerald-700 hover:text-paper"
              >
                <Check className="h-2.5 w-2.5" /> Valider
              </button>
            </ActionForm>
          )}
          {video.status !== "rejected" && (
            <ActionForm action={moderateVideoAction}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="videoId" value={video.id} />
              <input type="hidden" name="status" value="rejected" />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-smoke transition hover:bg-smoke hover:text-paper"
              >
                <X className="h-2.5 w-2.5" /> Refuser
              </button>
            </ActionForm>
          )}
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-flame transition hover:bg-flame hover:text-paper"
            >
              <Trash2 className="h-2.5 w-2.5" /> Suppr.
            </button>
          ) : (
            <ActionForm action={deleteVideoAction} className="contents">
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="videoId" value={video.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1 bg-flame px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-paper"
              >
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="font-mono text-[9px] uppercase tracking-[0.22em] text-smoke"
              >
                ×
              </button>
            </ActionForm>
          )}
        </div>
      </div>
    </li>
  );
}

function Avatar({ user }: { user: UserModerationData }) {
  if (user.photoUrl) {
    return (
      <div className="h-12 w-12 shrink-0 overflow-hidden bg-chalk">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.photoUrl}
          alt=""
          className="h-full w-full object-cover grayscale"
        />
      </div>
    );
  }
  const initials = user.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-chalk font-display text-base font-black italic text-ink/70">
      {initials}
    </div>
  );
}

function StatusPill({ status }: { status: ModerationStatus }) {
  const map = {
    pending: { label: "En attente", c: "border-flame/40 bg-flame/5 text-flame" },
    approved: {
      label: "Validé",
      c: "border-emerald-700/40 bg-emerald-700/5 text-emerald-700",
    },
    suspended: {
      label: "Suspendu",
      c: "border-amber-700/40 bg-amber-700/5 text-amber-700",
    },
    rejected: { label: "Refusé", c: "border-smoke/40 bg-smoke/5 text-smoke" },
  } as const;
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] ${m.c}`}
    >
      <span className="h-0.5 w-0.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

function VideoStatusPill({ status }: { status: ModerationStatus }) {
  const map = {
    pending: { label: "att.", c: "text-flame" },
    approved: { label: "ok", c: "text-emerald-700" },
    suspended: { label: "susp.", c: "text-amber-700" },
    rejected: { label: "ref.", c: "text-smoke" },
  } as const;
  const m = map[status];
  return (
    <span className={`font-mono text-[9px] uppercase tracking-[0.22em] ${m.c}`}>
      ●  {m.label}
    </span>
  );
}

/** Server-action form helper that serializes children as a single form. */
function ActionForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form action={action} className={className ?? "inline"}>
      {children}
    </form>
  );
}
