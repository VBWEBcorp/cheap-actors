export type Format = "film" | "short";
export type Job = "acteur" | "actrice" | "réalisateur" | "réalisatrice";

export type CastMember = {
  name: string;
  /** Character role in this specific film */
  role?: string;
};

export type Person = {
  slug: string;
  name: string;
  job: Job;
  /** One-line tagline for the person, shown under their name */
  tagline: string;
  /** 2-3 paragraph mini-bio in the CA voice */
  bio: string;
  /** Optional portrait URL, falls back to a typographic placeholder */
  portrait?: string;
  /** Year of birth, optional */
  born?: number;
  /** Where they live / are based */
  basedIn?: string;
  /** Random absurd "fun fact" in CA voice */
  funFact?: string;
};

export type EditorialNote = {
  text: string;
  /** Single letter signature, e.g. "L." */
  signature: string;
};

export type Film = {
  id: string;
  slug: string;
  title: string;
  format: Format;
  /** YouTube video ID, extract from a URL like youtu.be/XXXXX */
  youtubeId: string;
  poster?: string;
  backdrop?: string;
  verticalPoster?: string;
  durationMin: number;
  year: number;
  genres: string[];
  director: string;
  cast: CastMember[];
  synopsis: string;
  tagline?: string;
  /** Editorial note shown on the film detail page */
  editorialNote?: EditorialNote;
};

/* =============================================================
 * PEOPLE, registry of all actors / directors with their fiches.
 * Each cast.name and director string in the films array should
 * match a `name` here. Names without a matching person remain
 * plain text (no link).
 * =============================================================
 */
export const people: Person[] = [
  {
    slug: "valentin-beasse",
    name: "Valentin Béasse",
    job: "acteur",
    tagline: "A quitté le consulting pour la scène. Sans regret apparent.",
    bio:
      "Valentin a fait Cours Florent puis La Volia, après quelques années dans le consulting, reconversion qu'il décrit lui-même comme « la moins étonnée de sa famille ». Joue sur scène, devant la caméra, et de plus en plus en format vertical : ses sketches finissent par tourner sans qu'il les pousse.",
    portrait: "https://i.ibb.co/zHByKBzx/Studio-2.jpg",
    basedIn: "Paris",
    funFact:
      "A codé son propre site avant son book. L'ordre des priorités, on en reparlera.",
  },
  {
    slug: "margot-ferre",
    name: "Margot Ferré-Gallais",
    job: "actrice",
    tagline: "Énergique, têtue, et difficile à interrompre.",
    bio:
      "Margot a fait Cours Florent puis Studio Muller, où elle bosse avec Jocelyn Muller et Rémi De Vos. Beaucoup de courts-métrages avec le collectif La Vie en Jaune. A mis en scène une adaptation de The Wasp en gardant le rôle principal, pas par caprice, par logique.",
    born: 1992,
    basedIn: "Paris",
    funFact:
      "12 ans d'athlétisme, 10 ans de violon, trois langues qu'elle parle vraiment.",
  },
];

export const films: Film[] = [
  {
    id: "01",
    slug: "damour-et-deau-fraiche",
    title: "D'amour et d'eau fraîche",
    format: "film",
    youtubeId: "KQQ3p5SPdWA",
    backdrop: "https://i.ytimg.com/vi/KQQ3p5SPdWA/maxresdefault.jpg",
    poster: "https://i.ytimg.com/vi/KQQ3p5SPdWA/hqdefault.jpg",
    durationMin: 18,
    year: 2024,
    genres: ["Drame", "Romance", "Émouvant", "Premier film"],
    director: "Pierre Lavalette & Martin Baillon",
    cast: [
      { name: "Valentin Béasse" },
      { name: "Margot Ferré-Gallais" },
    ],
    synopsis:
      "Deux personnages qui n'ont pas encore mis de mots dessus. Et qui ne sont pas pressés.",
    tagline:
      "Court-métrage. Trop court selon certains, parfait selon d'autres.",
    editorialNote: {
      text: "★ Le plan-séquence du milieu vaut à lui seul le détour. Tourné à deux, monté à un, regardé à mille.",
      signature: "L.",
    },
  },
  {
    id: "s01",
    slug: "et-vous-vous-auriez-ose",
    title: "Et vous, vous auriez osé ?",
    format: "short",
    youtubeId: "u1YgHYJ-grw",
    verticalPoster: "https://i.ibb.co/zVjn253f/Studio-3.jpg",
    poster: "https://i.ibb.co/zVjn253f/Studio-3.jpg",
    durationMin: 1,
    year: 2025,
    genres: ["Comédie", "Décalé", "Absurde", "Auto-produit"],
    director: "Valentin Béasse",
    cast: [
      { name: "Valentin Béasse" },
      { name: "Margot Ferré-Gallais" },
    ],
    synopsis:
      "Un mariage. Une réplique. Un risque. Soixante secondes pour savoir si la salle suit.",
    tagline: "Vertical. Frontal. Très frontal.",
  },
];

/* =============================================================
 * Helpers
 * =============================================================
 */
export const getFilms = () => films.filter((f) => f.format === "film");
export const getShorts = () => films.filter((f) => f.format === "short");

export const getFilmBySlug = (slug: string) =>
  films.find((f) => f.slug === slug);

export const getRelatedFilms = (slug: string) => {
  const target = getFilmBySlug(slug);
  if (!target) return [];
  return films.filter((f) => f.slug !== slug && f.format === target.format);
};

export const youtubeThumb = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

export const posterFor = (f: Film) =>
  f.poster ?? (f.youtubeId ? youtubeThumb(f.youtubeId) : "");

export const backdropFor = (f: Film) =>
  f.backdrop ?? f.poster ?? (f.youtubeId ? youtubeThumb(f.youtubeId) : "");

/* =============================================================
 * People helpers
 * =============================================================
 */
export const getPersonByName = (name: string): Person | undefined =>
  people.find((p) => p.name === name);

export const getPersonBySlug = (slug: string): Person | undefined =>
  people.find((p) => p.slug === slug);

export const getFilmsByPerson = (personName: string): Film[] =>
  films.filter(
    (f) =>
      f.director === personName ||
      f.cast.some((c) => c.name === personName),
  );

export const getPersonRoleInFilm = (
  personName: string,
  film: Film,
): "Réalisation" | string | null => {
  if (film.director === personName) return "Réalisation";
  const cast = film.cast.find((c) => c.name === personName);
  if (!cast) return null;
  return cast.role ?? "Casting";
};

export const getDirectors = () =>
  people.filter((p) => p.job === "réalisateur" || p.job === "réalisatrice");

export const getActors = () =>
  people.filter((p) => p.job === "acteur" || p.job === "actrice");

/** Total minutes someone is in films (simplistic: full duration for cast members) */
export const getPersonScreenTime = (personName: string): number =>
  getFilmsByPerson(personName).reduce((acc, f) => acc + f.durationMin, 0);
