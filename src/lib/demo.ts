import type { PublicUser, UserModerationData } from "./user-types";

/** Demo mode flag, when set, auth guards are bypassed and pages
 * fall back to mock data so the whole platform can be explored from the front. */
export const DEMO_MODE = process.env.DEMO_MODE === "1";
export const DEMO_MODE_PUBLIC = process.env.NEXT_PUBLIC_DEMO_MODE === "1";

const now = new Date();

/** A fully-populated mock user used in demo mode for /mon-compte.
 * Aligned with the public catalog: same person (Valentin), same two
 * videos, so the demo experience matches what a visitor sees on /. */
export const DEMO_USER: PublicUser = {
  id: "demo-user",
  slug: "valentin-beasse",
  displayName: "Valentin Béasse",
  roles: ["acteur"],
  tagline: "A quitté le consulting pour la scène. Sans regret apparent.",
  bio:
    "Valentin a fait Cours Florent puis La Volia, après quelques années dans le consulting. Joue sur scène, devant la caméra, et en format vertical de plus en plus souvent.",
  photoUrl: "https://i.ibb.co/zHByKBzx/Studio-2.jpg",
  basedIn: "Paris",
  funFact:
    "A codé son propre site avant son book. L'ordre des priorités, on en reparlera.",
  status: "approved",
  videos: [
    {
      id: "demo-h1",
      format: "horizontal",
      title: "D'amour et d'eau fraîche",
      youtubeId: "KQQ3p5SPdWA",
      coverUrl: "https://i.ytimg.com/vi/KQQ3p5SPdWA/hqdefault.jpg",
      year: 2024,
      description: "Court-métrage de Pierre Lavalette et Martin Baillon.",
      tags: ["Drame", "Romance", "Émouvant", "Premier film"],
      status: "approved",
      submittedAt: now,
      reviewedAt: now,
    },
    {
      id: "demo-v1",
      format: "vertical",
      title: "Et vous, vous auriez osé ?",
      youtubeId: "u1YgHYJ-grw",
      coverUrl: "https://i.ibb.co/zVjn253f/Studio-3.jpg",
      year: 2025,
      description: "Sketch vertical. Un mariage, une réplique, un risque.",
      tags: ["Comédie", "Décalé", "Absurde", "Auto-produit"],
      status: "approved",
      submittedAt: now,
      reviewedAt: now,
    },
  ],
  createdAt: now,
  updatedAt: now,
};

/** Mock pending users for /admin. Vide en démo : la DB sert quand
 * il y a vraiment des comptes en attente. */
export const DEMO_PENDING_USERS: UserModerationData[] = [];

/** Mock pending videos for /admin. Vide pour la même raison. */
export const DEMO_PENDING_VIDEOS: {
  userId: string;
  userName: string;
  userSlug: string;
  video: {
    id: string;
    format: "horizontal" | "vertical";
    title: string;
    youtubeId: string;
    coverUrl?: string;
    year?: number;
    description?: string;
    status: "pending";
    submittedAt: Date;
  };
}[] = [];
