import {
  people as staticPeople,
  type Person as StaticPerson,
  type Film,
} from "@/lib/catalog";
import {
  getAllPublicUsers,
  getPublicUserBySlug,
  type PublicUser,
  type Role,
  type Video,
} from "@/lib/users";

export type PersonView = {
  slug: string;
  name: string;
  /** 1-2 roles. */
  roles: Role[];
  tagline: string;
  bio: string;
  photoUrl?: string;
  basedIn?: string;
  born?: number;
  funFact?: string;
  source: "db" | "static";
  /** DB videos (3 horizontal + 3 vertical max) */
  videos: Video[];
  /** Static catalog film appearances (only for source = "static") */
  filmAppearances: Film[];
};

export function staticPersonToView(p: StaticPerson, films: Film[]): PersonView {
  return {
    slug: p.slug,
    name: p.name,
    roles: [p.job],
    tagline: p.tagline,
    bio: p.bio,
    photoUrl: p.portrait,
    basedIn: p.basedIn,
    born: p.born,
    funFact: p.funFact,
    source: "static",
    videos: [],
    filmAppearances: films,
  };
}

export function publicUserToView(u: PublicUser): PersonView {
  return {
    slug: u.slug,
    name: u.displayName,
    roles: u.roles,
    tagline: u.tagline,
    bio: u.bio,
    photoUrl: u.photoUrl,
    basedIn: u.basedIn,
    born: u.born,
    funFact: u.funFact,
    source: "db",
    videos: u.videos,
    filmAppearances: [],
  };
}

export function isDirector(roles: Role[]): boolean {
  return roles.some((r) => r === "réalisateur" || r === "réalisatrice");
}

export function isActor(roles: Role[]): boolean {
  return roles.some((r) => r === "acteur" || r === "actrice");
}

/** Returns the DB user view if a user has this slug AND is approved, else the static one, else null. */
export async function getPersonViewBySlug(slug: string): Promise<PersonView | null> {
  // DB first (only approved)
  try {
    const dbUser = await getPublicUserBySlug(slug);
    if (dbUser) return publicUserToView(dbUser);
  } catch (err) {
    // DB unreachable, fall through to static
    console.error("DB error in getPersonViewBySlug:", err);
  }

  // Static fallback
  const staticP = staticPeople.find((p) => p.slug === slug);
  if (staticP) {
    // Lazy import to avoid circular deps
    const { getFilmsByPerson } = await import("@/lib/catalog");
    return staticPersonToView(staticP, getFilmsByPerson(staticP.name));
  }

  return null;
}

/** All people, with DB users first then static seeds. */
export async function getAllPersonViews(): Promise<{
  dbUsers: PersonView[];
  staticPeople: PersonView[];
}> {
  let dbUsers: PersonView[] = [];
  try {
    const docs = await getAllPublicUsers();
    dbUsers = docs.map(publicUserToView);
  } catch (err) {
    console.error("DB error in getAllPersonViews:", err);
  }

  // De-dupe: if a DB user has the same slug as a static one, hide the static one.
  const dbSlugs = new Set(dbUsers.map((u) => u.slug));
  const { getFilmsByPerson } = await import("@/lib/catalog");
  const staticViews = staticPeople
    .filter((p) => !dbSlugs.has(p.slug))
    .map((p) => staticPersonToView(p, getFilmsByPerson(p.name)));

  return { dbUsers, staticPeople: staticViews };
}
