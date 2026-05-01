/**
 * Types and constants safe to import from any environment (client or server).
 * The server-only DB code lives in src/lib/users.ts.
 */

export type Role = "acteur" | "actrice" | "réalisateur" | "réalisatrice";
export type VideoFormat = "horizontal" | "vertical";
export type ModerationStatus =
  | "pending"
  | "approved"
  | "rejected"
  /** Suspended: temporarily hidden from public, can be reactivated. */
  | "suspended";

export const ROLES: Role[] = ["acteur", "actrice", "réalisateur", "réalisatrice"];

export const MAX_VIDEOS_PER_FORMAT = 3;
export const MAX_ROLES = 2;
export const MAX_TAGS_PER_VIDEO = 4;

/**
 * Categories an actor can pick when uploading a video. Multi-select, max 4.
 * Mix of genres, moods and "context" tags adapted to amateur shorts.
 */
export const TAGS = [
  // — Genres
  "Drame",
  "Comédie",
  "Comédie dramatique",
  "Thriller",
  "Romance",
  "Horreur",
  "Documentaire",
  "Polar",
  "Néo-noir",
  "Mystère",
  "Science-fiction",
  "Fantastique",
  "Animation",
  "Musical",
  // — Style / mood
  "Expérimental",
  "Méta",
  "Décalé",
  "Émouvant",
  "Absurde",
  "Huis-clos",
  // — Contexte (perso au cinéma indé)
  "Premier film",
  "Sans budget",
  "Auto-produit",
  "Tourné en équipe réduite",
] as const;

export type Tag = (typeof TAGS)[number];

export type Video = {
  id: string;
  format: VideoFormat;
  title: string;
  youtubeId: string;
  /**
   * Cover image URL chosen by the author — what's shown as the
   * preview before the video is actually played. Required for new
   * submissions; older records may still rely on the YouTube
   * auto-thumbnail as a fallback.
   */
  coverUrl?: string;
  year?: number;
  description?: string;
  /** Categories chosen by the author (multi-select, max 4). */
  tags?: Tag[];
  status: ModerationStatus;
  rejectionReason?: string;
  submittedAt: Date;
  reviewedAt?: Date;
};

export type PublicUser = {
  id: string;
  slug: string;
  displayName: string;
  /** 1 to 2 roles. Someone can be both "acteur" and "réalisateur". */
  roles: Role[];
  tagline: string;
  bio: string;
  photoUrl?: string;
  basedIn?: string;
  born?: number;
  funFact?: string;
  videos: Video[];
  status: ModerationStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
};

export type AdminUser = PublicUser & { email: string };

/** Shape used in the admin UI (created from a UserDoc on the server,
 * passed to client components without ObjectId or Date). */
export type UserModerationData = {
  id: string;
  email: string;
  displayName: string;
  slug: string;
  roles: Role[];
  bio: string;
  tagline: string;
  basedIn?: string;
  born?: number;
  photoUrl?: string;
  videos: Video[];
  status: ModerationStatus;
  rejectionReason?: string;
  createdAt: Date | string;
};

/** Format roles array as a human label, e.g. "acteur · réalisateur" */
export function rolesLabel(roles: Role[]): string {
  return roles.join(" · ");
}

/** Determine the section bucket for someone with multiple roles.
 * Returns "directors" if any director role, else "actors". */
export function rolePrimary(roles: Role[]): "directors" | "actors" {
  return roles.some((r) => r === "réalisateur" || r === "réalisatrice")
    ? "directors"
    : "actors";
}
