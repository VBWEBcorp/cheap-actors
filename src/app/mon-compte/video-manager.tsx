"use client";

import { useActionState, useState } from "react";
import { Check, ImageIcon, Plus, Trash2, X } from "lucide-react";
import { addVideoAction, deleteVideoAction, type VideoState } from "./actions";
import type { Video, ModerationStatus } from "@/lib/user-types";
import { youtubeThumbUrl } from "@/lib/youtube";
import { cn } from "@/lib/cn";
import { TagsPicker } from "@/components/tags-picker";

const initial: VideoState = {};

type Props = {
  horizontal: Video[];
  vertical: Video[];
  maxPerFormat: number;
};

export function VideoManager({ horizontal, vertical, maxPerFormat }: Props) {
  return (
    <div className="space-y-10">
      <FormatSection
        format="horizontal"
        title="Format horizontal"
        videos={horizontal}
        max={maxPerFormat}
      />
      <FormatSection
        format="vertical"
        title="Format vertical"
        videos={vertical}
        max={maxPerFormat}
      />
    </div>
  );
}

function FormatSection({
  format,
  title,
  videos,
  max,
}: {
  format: "horizontal" | "vertical";
  title: string;
  videos: Video[];
  max: number;
}) {
  const [adding, setAdding] = useState(false);
  const slotsLeft = max - videos.length;

  // Build the array of slots: [video, video, video] padded with empty slots
  const slots: (Video | null)[] = [...videos];
  while (slots.length < max) slots.push(null);

  const isVertical = format === "vertical";
  const aspectClass = isVertical ? "aspect-[9/16]" : "aspect-video";

  return (
    <section>
      <header className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight">
            {title}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
            {videos.length} / {max}
          </p>
        </div>
      </header>

      <div
        className={cn(
          "grid gap-3 sm:gap-4",
          isVertical ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3",
        )}
      >
        {slots.map((video, i) =>
          video ? (
            <VideoSlot key={video.id} video={video} aspectClass={aspectClass} />
          ) : (
            <EmptySlot
              key={`empty-${i}`}
              aspectClass={aspectClass}
              clickable={i === videos.length && slotsLeft > 0}
              onClick={() => setAdding(true)}
            />
          ),
        )}
      </div>

      {/* Inline add form */}
      {adding && (
        <AddVideoForm
          format={format}
          onClose={() => setAdding(false)}
        />
      )}
    </section>
  );
}

function VideoSlot({
  video,
  aspectClass,
}: {
  video: Video;
  aspectClass: string;
}) {
  const cover = video.coverUrl || youtubeThumbUrl(video.youtubeId);
  return (
    <article className="group relative">
      <div
        className={cn(
          "relative overflow-hidden border border-ink/10 bg-chalk",
          aspectClass,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={video.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-2 top-2">
          <StatusBadge status={video.status} />
        </div>
        <form action={deleteVideoAction} className="absolute right-2 top-2">
          <input type="hidden" name="videoId" value={video.id} />
          <button
            type="submit"
            aria-label={`Supprimer ${video.title}`}
            className="flex h-7 w-7 items-center justify-center bg-paper/90 text-ink backdrop-blur transition hover:bg-flame hover:text-paper"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
      <h4 className="mt-2 line-clamp-2 font-display text-sm font-bold leading-tight">
        {video.title}
      </h4>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
        {video.year ?? "·"} · {video.youtubeId}
      </p>
      {video.tags && video.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {video.tags.map((t) => (
            <span
              key={t}
              className="border border-ink/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/75"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {video.status === "rejected" && video.rejectionReason && (
        <p className="mt-1 border-l-2 border-flame pl-2 text-[11px] italic text-flame">
          {video.rejectionReason}
        </p>
      )}
    </article>
  );
}

function EmptySlot({
  aspectClass,
  clickable,
  onClick,
}: {
  aspectClass: string;
  clickable: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      className={cn(
        "flex flex-col items-center justify-center border border-dashed border-ink/20 transition",
        aspectClass,
        clickable
          ? "cursor-pointer hover:border-flame hover:bg-flame/5"
          : "opacity-30",
      )}
    >
      {clickable ? (
        <>
          <Plus className="h-6 w-6 text-smoke transition group-hover:text-flame" />
          <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
            Ajouter
          </span>
        </>
      ) : (
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke/50">
          libre
        </span>
      )}
    </button>
  );
}

function AddVideoForm({
  format,
  onClose,
}: {
  format: "horizontal" | "vertical";
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(addVideoAction, initial);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverError, setCoverError] = useState<string>("");

  // Auto-close on success
  if (state.ok) {
    setTimeout(onClose, 800);
  }

  const isVertical = format === "vertical";

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverError("");
    const file = e.target.files?.[0];
    if (!file) {
      setCoverPreview("");
      return;
    }
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
      setCoverError("Format non supporté (JPG, PNG, WebP, AVIF)");
      e.target.value = "";
      setCoverPreview("");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCoverError("Image trop lourde (5 Mo max)");
      e.target.value = "";
      setCoverPreview("");
      return;
    }
    setCoverPreview(URL.createObjectURL(file));
  };

  return (
    <form
      action={action}
      className="mt-5 grid gap-3 border border-ink bg-paper p-5"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
          ●  Ajouter une vidéo {format}e
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="flex h-7 w-7 items-center justify-center text-smoke transition hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <input type="hidden" name="format" value={format} />

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          Lien YouTube
        </span>
        <input
          name="youtubeUrl"
          type="text"
          required
          autoFocus
          placeholder="https://youtube.com/watch?v=… ou youtu.be/…"
          className="add-input mt-1"
        />
      </label>

      {/* Cover image (required) — uploaded to R2 by the server action */}
      <div>
        <span className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          Image de couverture
          <span className="text-[9px] normal-case tracking-tight text-smoke/70">
            {isVertical ? "Format 9:16 idéal" : "Format 16:9 idéal"} · 5 Mo max ·
            JPG / PNG / WebP / AVIF
          </span>
        </span>
        <div className="mt-1 grid gap-3 sm:grid-cols-[1fr_140px]">
          <label
            className={cn(
              "flex cursor-pointer flex-col items-start justify-center border border-ink/15 px-3 py-2 transition hover:border-ink/40",
              coverError && "border-flame",
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
              Choisir une image
            </span>
            <input
              name="coverFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              required
              onChange={onCoverChange}
              className="mt-1 w-full text-xs file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.18em] file:text-paper file:transition hover:file:bg-flame"
            />
          </label>
          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden border border-ink/15 bg-chalk",
              isVertical ? "aspect-[9/16] w-[80px] sm:w-full" : "aspect-video",
            )}
          >
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverPreview}
                alt="Aperçu couverture"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-smoke/40" />
            )}
          </div>
        </div>
        {coverError && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-flame">
            {coverError}
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_140px]">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
            Titre
          </span>
          <input
            name="title"
            type="text"
            required
            minLength={1}
            maxLength={80}
            placeholder="Le titre de la vidéo"
            className="add-input mt-1"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
            Année
          </span>
          <input
            name="year"
            type="number"
            min={1900}
            max={new Date().getFullYear() + 1}
            placeholder="2025"
            className="add-input mt-1"
          />
        </label>
      </div>

      <div>
        <span className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          Tags / catégories
          <span className="text-[9px] normal-case tracking-tight text-smoke/70">
            Max 4, aide les visiteurs à vous trouver
          </span>
        </span>
        <div className="mt-2">
          <TagsPicker />
        </div>
      </div>

      {state.error && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-flame">
          ✗ {state.error}
        </p>
      )}
      {state.ok && (
        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-700">
          <Check className="h-3.5 w-3.5" />
          Vidéo ajoutée
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium tracking-tight text-paper transition hover:bg-flame disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          {pending ? "Ajout…" : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke hover:text-ink"
        >
          Annuler
        </button>
      </div>

      <style>{`
        .add-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(12, 12, 12, 0.15);
          padding: 10px 12px;
          font-family: var(--font-display);
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }
        .add-input:focus { border-color: #ff3a1f; }
      `}</style>
    </form>
  );
}

function StatusBadge({ status }: { status: ModerationStatus }) {
  const map = {
    pending: {
      label: "En attente",
      class: "border-flame/40 bg-flame/90 text-paper",
    },
    approved: {
      label: "Validée",
      class: "border-emerald-700/40 bg-emerald-700/90 text-paper",
    },
    suspended: {
      label: "Suspendue",
      class: "border-amber-700/40 bg-amber-700/90 text-paper",
    },
    rejected: {
      label: "Refusée",
      class: "border-smoke/40 bg-smoke/90 text-paper",
    },
  } as const;
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${m.class}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {m.label}
    </span>
  );
}
