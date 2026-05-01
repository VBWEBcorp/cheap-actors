import type { PublicUser, UserModerationData } from "./user-types";

/** Demo mode flag — when set, auth guards are bypassed and pages
 * fall back to mock data so the whole platform can be explored from the front. */
export const DEMO_MODE = process.env.DEMO_MODE === "1";
export const DEMO_MODE_PUBLIC = process.env.NEXT_PUBLIC_DEMO_MODE === "1";

const now = new Date();

/** A fully-populated mock user used in demo mode for /mon-compte. */
export const DEMO_USER: PublicUser = {
  id: "demo-user",
  slug: "vous",
  displayName: "Vous (démo)",
  roles: ["acteur", "réalisateur"],
  tagline: "Joue. Filme. Doute. Recommence.",
  bio:
    "Voici à quoi ressemble votre fiche, dans la peau d'un compte démo. " +
    "Modifiez ce que vous voulez — rien n'est sauvegardé en base. Quand vous " +
    "désactiverez le mode démo, la vraie authentification reprendra la main.",
  photoUrl: undefined,
  basedIn: "Paris",
  born: 1995,
  funFact: "Connaît tous les acteurs de Cheap Actors. Aucun ne le connaît.",
  status: "approved",
  videos: [
    {
      id: "demo-h1",
      format: "horizontal",
      title: "Une journée comme une autre",
      youtubeId: "dQw4w9WgXcQ",
      coverUrl:
        "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=1200&auto=format&fit=crop",
      year: 2025,
      description: "Le jour où il a oublié son texte. Tournage à 3.",
      tags: ["Comédie dramatique", "Décalé", "Tourné en équipe réduite"],
      status: "approved",
      submittedAt: now,
      reviewedAt: now,
    },
    {
      id: "demo-h2",
      format: "horizontal",
      title: "L'après-midi du 14",
      youtubeId: "dQw4w9WgXcQ",
      coverUrl:
        "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?q=80&w=1200&auto=format&fit=crop",
      year: 2024,
      description: "Court-métrage de 12 minutes sur l'attente.",
      tags: ["Drame", "Émouvant", "Premier film"],
      status: "pending",
      submittedAt: now,
    },
    {
      id: "demo-v1",
      format: "vertical",
      title: "Métro 6h47",
      youtubeId: "dQw4w9WgXcQ",
      coverUrl:
        "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=900&auto=format&fit=crop",
      year: 2025,
      description: "60 secondes verticales. Pas de dialogue.",
      tags: ["Expérimental", "Décalé"],
      status: "approved",
      submittedAt: now,
      reviewedAt: now,
    },
    {
      id: "demo-v2",
      format: "vertical",
      title: "Trois mots de trop",
      youtubeId: "dQw4w9WgXcQ",
      coverUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=900&auto=format&fit=crop",
      year: 2025,
      tags: ["Romance", "Émouvant"],
      status: "rejected",
      rejectionReason: "Trop bien éclairé.",
      submittedAt: now,
      reviewedAt: now,
    },
  ],
  createdAt: now,
  updatedAt: now,
};

/** Mock pending users for /admin to showcase the moderation UI. */
export const DEMO_PENDING_USERS: UserModerationData[] = [
  {
    id: "demo-pending-1",
    email: "noe.castagnet@example.com",
    displayName: "Noé Castagnet",
    slug: "noe-castagnet",
    roles: ["réalisateur"],
    bio: "Réalisateur autodidacte, basé à Paris. Tourne entre amis et avec des moyens limités.",
    tagline: "Filme ce qu'il voit, monte ce qu'il a.",
    basedIn: "Paris",
    born: 1992,
    photoUrl: undefined,
    videos: [],
    status: "pending",
    createdAt: now.toISOString(),
  },
  {
    id: "demo-pending-2",
    email: "sara.mendes@example.com",
    displayName: "Sara Mendès",
    slug: "sara-mendes",
    roles: ["actrice", "réalisatrice"],
    bio: "Comédienne et réalisatrice. Préfère écrire ses rôles que les attendre.",
    tagline: "Préfère écrire ses rôles.",
    basedIn: "Lyon",
    born: 1996,
    photoUrl: undefined,
    videos: [],
    status: "pending",
    createdAt: now.toISOString(),
  },
];

/** Mock pending videos for /admin to showcase. */
export const DEMO_PENDING_VIDEOS = [
  {
    userId: "demo-pending-1",
    userName: "Noé Castagnet",
    userSlug: "noe-castagnet",
    video: {
      id: "demo-pv-1",
      format: "horizontal" as const,
      title: "Sortie d'usine",
      youtubeId: "dQw4w9WgXcQ",
      coverUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      year: 2025,
      description: "Court-métrage de 18 minutes. Tourné en deux nuits.",
      status: "pending" as const,
      submittedAt: now,
    },
  },
  {
    userId: "demo-pending-2",
    userName: "Sara Mendès",
    userSlug: "sara-mendes",
    video: {
      id: "demo-pv-2",
      format: "vertical" as const,
      title: "Coup de fil",
      youtubeId: "dQw4w9WgXcQ",
      coverUrl:
        "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?q=80&w=900&auto=format&fit=crop",
      year: 2025,
      description: "60 secondes. Une voix off. Une rue.",
      status: "pending" as const,
      submittedAt: now,
    },
  },
];
