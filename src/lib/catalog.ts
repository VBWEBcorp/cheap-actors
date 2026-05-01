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
  /** Optional portrait URL — falls back to a typographic placeholder */
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
  /** YouTube video ID — extract from a URL like youtu.be/XXXXX */
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
 * PEOPLE — registry of all actors / directors with their fiches.
 * Each cast.name and director string in the films array should
 * match a `name` here. Names without a matching person remain
 * plain text (no link).
 * =============================================================
 */
export const people: Person[] = [
  // Réalisateurs
  {
    slug: "lea-marchand",
    name: "Léa Marchand",
    job: "réalisatrice",
    tagline: "Filme la nuit. Doute la journée.",
    bio:
      "Léa a appris le cinéma en regardant des films qu'elle aurait préféré faire elle-même. Elle écrit la nuit, tourne quand elle peut, et monte au troisième café. Ses plateaux sont calmes — ses scénarios beaucoup moins. On l'a découverte avec un court tourné dans son escalier.",
    born: 1995,
    basedIn: "Lyon",
    funFact: "N'a jamais vu Le Parrain. Refuse d'en parler.",
  },
  {
    slug: "sami-bonnet",
    name: "Sami Bonnet",
    job: "réalisateur",
    tagline: "Préfère les zones industrielles aux décors.",
    bio:
      "Sami repère ses lieux avant d'écrire. Il dit qu'un mur sale raconte mieux qu'un dialogue. Ses films durent rarement plus de 20 minutes et ne finissent jamais où on les attend. Travaille seul, monte seul, doute seul — bref, fait du cinéma.",
    born: 1988,
    basedIn: "Marseille",
    funFact: "Possède 11 walkie-talkies. Aucun ne fonctionne.",
  },
  {
    slug: "iris-vannier",
    name: "Iris Vannier",
    job: "réalisatrice",
    tagline: "Aime trop les néons pour les éteindre.",
    bio:
      "Iris filme la ville comme si elle ne dormait jamais — parce que la sienne ne dort pas. Elle a un faible pour les détectives fatigués, les bars qui ferment trop tard, et les femmes qui mentent bien. Son cinéma sent la pluie et le café froid.",
    born: 1991,
    basedIn: "Bruxelles",
    funFact: "A réécrit ce paragraphe 4 fois. Reste insatisfaite.",
  },
  {
    slug: "margot-lenoir",
    name: "Margot Lenoir",
    job: "réalisatrice",
    tagline: "Comédie de l'embarras. Sa spécialité.",
    bio:
      "Margot écrit comme on raconte une anecdote — mais en mieux structuré. Elle filme des gens ordinaires dans des situations à peine au-dessus du normal, et c'est là que ça grince. Spécialiste du dialogue qui dérape, des silences gênants et des personnages qui s'écoutent parler.",
    born: 1993,
    basedIn: "Paris",
    funFact: "Note tout ce qu'elle entend dans le métro. Dans un Bloc-notes Apple.",
  },

  // Acteurs / actrices
  {
    slug: "tom-vialard",
    name: "Tom Vialard",
    job: "acteur",
    tagline: "Joue mieux fatigué.",
    bio:
      "Tom passe ses auditions sans agent, sans coach et avec un peu trop d'énergie. Il a ce visage qu'on a déjà vu quelque part sans pouvoir dire où — et ça lui va bien. Sait pleurer sans glycérine. Refuse de le faire sur commande.",
    born: 1996,
    basedIn: "Paris",
    funFact: "A travaillé 3 ans dans un cinéma indépendant. Sans regarder les films.",
  },
  {
    slug: "camille-roux",
    name: "Camille Roux",
    job: "actrice",
    tagline: "Une présence. Et beaucoup de patience.",
    bio:
      "Camille a commencé au théâtre, où elle apprenait des textes que personne ne venait écouter. Elle a fini par passer à la caméra, où c'est l'inverse — on la regarde plus qu'elle ne parle. Joue avec une économie qui désarme, surtout les réalisateurs bavards.",
    born: 1990,
    basedIn: "Lyon",
    funFact: "Connaît Tchekhov par cœur. Refuse de le réciter en soirée.",
  },
  {
    slug: "ines-vergne",
    name: "Inès Vergne",
    job: "actrice",
    tagline: "Le regard de quelqu'un qui sait quelque chose.",
    bio:
      "Inès joue surtout des rôles écrits par des hommes, mais les retourne à sa façon. Elle aime les rôles ambigus, les femmes qu'on ne classe pas. Travaille beaucoup en court-métrage parce qu'elle dit que c'est là qu'on prend des risques.",
    born: 1992,
    basedIn: "Marseille",
    funFact: "A passé une audition pour une pub Renault. N'a pas été rappelée. Soulagée.",
  },
  {
    slug: "paul-tessier",
    name: "Paul Tessier",
    job: "acteur",
    tagline: "Tout le monde lui dit qu'il a déjà joué quelque part.",
    bio:
      "Paul a un visage de seconds rôles, ce qu'il assume parfaitement. Il est cet acteur qu'on engage pour donner du grain à une scène. Il sait écouter — sur scène et en dehors — et c'est devenu son super-pouvoir.",
    born: 1985,
    basedIn: "Lille",
    funFact: "Joue de la basse. Mal. Mais en rythme.",
  },
  {
    slug: "karim-ferraoui",
    name: "Karim Ferraoui",
    job: "acteur",
    tagline: "Voix grave. Phrases courtes. Effet maximal.",
    bio:
      "Karim parle peu et regarde beaucoup. À l'écran, c'est exactement ce qu'on lui demande. Il a fait de la radio avant de se laisser convaincre par une réalisatrice qui aimait sa voix. Aujourd'hui c'est l'inverse — on le veut pour ce qu'il ne dit pas.",
    born: 1987,
    basedIn: "Bruxelles",
    funFact: "Ne boit que de l'eau gazeuse. Question de principe.",
  },
  {
    slug: "lou-daubigne",
    name: "Lou Daubigné",
    job: "actrice",
    tagline: "Joue ce qu'elle ne dit pas.",
    bio:
      "Lou a une formation classique qu'elle utilise rarement — elle préfère travailler à l'instinct. Sa caméra de prédilection : la première qu'on lui pointe. Elle dit qu'elle n'a pas de méthode, mais six réalisateurs disent l'inverse.",
    born: 1998,
    basedIn: "Paris",
    funFact: "A trois chats. Refuse de les nommer.",
  },
  {
    slug: "adrien-belot",
    name: "Adrien Belot",
    job: "acteur",
    tagline: "Comique de l'absurde. Fait rire sans le vouloir.",
    bio:
      "Adrien a un timing étrange et une diction qui ne ressemble à personne. Du coup, on l'engage souvent pour des rôles écrits trop droit — et il les fait dévier. Joue beaucoup en court-métrage parce qu'il dit que les longs « durent trop longtemps ».",
    born: 1994,
    basedIn: "Paris",
    funFact: "A fait deux ans de stand-up. A arrêté de lui-même.",
  },
  {
    slug: "yasmine-drouet",
    name: "Yasmine Drouet",
    job: "actrice",
    tagline: "Pas dans le décor. Dans la scène.",
    bio:
      "Yasmine prend de la place sans hausser le ton. Ses partenaires disent qu'elle écoute mieux qu'elle ne joue — c'est un compliment. Aime les dialogues à plusieurs niveaux et les personnages qui ont l'air de comprendre quelque chose qu'on ne nous dit pas.",
    born: 1996,
    basedIn: "Bordeaux",
    funFact: "Lit trois livres en même temps. Ne finit jamais le troisième.",
  },
];

/**
 * REPLACE the youtubeId values below with your actual YouTube video IDs.
 * Visuals are placeholder Unsplash photos so the layout is presentation-ready.
 * Goal: keep the catalog small and curated. Add films one by one, slowly.
 */
export const films: Film[] = [
  {
    id: "01",
    slug: "la-derniere-prise",
    title: "La Dernière Prise",
    format: "film",
    youtubeId: "dQw4w9WgXcQ",
    backdrop:
      "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2400&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=1200&auto=format&fit=crop",
    durationMin: 22,
    year: 2025,
    genres: ["Drame", "Huis-clos", "Méta", "Émouvant"],
    director: "Léa Marchand",
    cast: [
      { name: "Tom Vialard", role: "Antoine" },
      { name: "Camille Roux", role: "Hélène" },
    ],
    synopsis:
      "Une nuit de tournage qui ne devait jamais se terminer. Antoine, comédien sans nom, comprend que ce plateau est sa dernière chance — et peut-être bien plus que ça.",
    tagline: "Le rôle d'une vie. Ou rien.",
    editorialNote: {
      text: "★ La séquence à 14:02 — la prise du miroir. C'est de l'or. Tournée en une seule fois. Tom a voulu refaire, on a refusé.",
      signature: "L.",
    },
  },
  {
    id: "02",
    slug: "ciels-bas",
    title: "Ciels Bas",
    format: "film",
    youtubeId: "dQw4w9WgXcQ",
    backdrop:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2400&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    durationMin: 18,
    year: 2024,
    genres: ["Thriller", "Polar", "Mystère"],
    director: "Sami Bonnet",
    cast: [{ name: "Inès Vergne" }, { name: "Paul Tessier" }],
    synopsis:
      "Dans une zone industrielle abandonnée, deux inconnus négocient un échange qui ne ressemble à rien de ce qu'ils avaient prévu.",
    tagline: "Personne ne devait mourir ce soir.",
    editorialNote: {
      text: "On est passés à côté à la première lecture. Vraiment. Le revoir est obligatoire — surtout pour la fin, qu'on n'a pas vue venir.",
      signature: "M.",
    },
  },
  {
    id: "03",
    slug: "neon-blues",
    title: "Néon Blues",
    format: "film",
    youtubeId: "dQw4w9WgXcQ",
    backdrop:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2400&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop",
    durationMin: 14,
    year: 2025,
    genres: ["Néo-noir", "Polar", "Mystère", "Sans budget"],
    director: "Iris Vannier",
    cast: [{ name: "Karim Ferraoui" }, { name: "Lou Daubigné" }],
    synopsis:
      "Un détective fatigué, un témoin qui ment trop bien et une ville qui n'éteint jamais ses lumières.",
    tagline: "La nuit ne dort pas. Lui non plus.",
    editorialNote: {
      text: "★ Karim donne moins de 20 répliques dans tout le film. Et il joue mieux que la plupart des gens qui en disent 200.",
      signature: "L.",
    },
  },
  {
    id: "04",
    slug: "rien-de-special",
    title: "Rien de Spécial",
    format: "film",
    youtubeId: "dQw4w9WgXcQ",
    backdrop:
      "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?q=80&w=2400&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?q=80&w=1200&auto=format&fit=crop",
    durationMin: 12,
    year: 2025,
    genres: ["Comédie", "Décalé", "Tourné en équipe réduite"],
    director: "Margot Lenoir",
    cast: [{ name: "Adrien Belot" }, { name: "Yasmine Drouet" }],
    synopsis:
      "Deux serveurs en fin de service inventent leur vie pour le client du fond — celui qui n'a pas commandé.",
    tagline: "Ce soir, ils ont une biographie.",
    editorialNote: {
      text: "On a ri à l'écriture, ri au tournage, ri au montage. Le seul film de cette sélection qu'on a vu six fois sans s'en lasser.",
      signature: "M.",
    },
  },

  // ===== SHORTS (vertical) =====
  {
    id: "s01",
    slug: "appel-manque",
    title: "Appel Manqué",
    format: "short",
    youtubeId: "dQw4w9WgXcQ",
    verticalPoster:
      "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=900&auto=format&fit=crop",
    durationMin: 1,
    year: 2025,
    genres: ["Drame", "Émouvant", "Auto-produit"],
    director: "Anonyme",
    cast: [{ name: "Lou Daubigné" }],
    synopsis: "60 secondes. Une voix. Un silence qui parle plus fort.",
  },
  {
    id: "s02",
    slug: "metro-ligne-9",
    title: "Métro Ligne 9",
    format: "short",
    youtubeId: "dQw4w9WgXcQ",
    verticalPoster:
      "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?q=80&w=900&auto=format&fit=crop",
    durationMin: 2,
    year: 2025,
    genres: ["Comédie", "Décalé", "Absurde"],
    director: "Margot Lenoir",
    cast: [{ name: "Adrien Belot" }],
    synopsis: "Il avait tout préparé. Sauf le bon arrêt.",
  },
  {
    id: "s03",
    slug: "premier-plan",
    title: "Premier Plan",
    format: "short",
    youtubeId: "dQw4w9WgXcQ",
    verticalPoster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=900&auto=format&fit=crop",
    durationMin: 1,
    year: 2024,
    genres: ["Méta", "Comédie", "Premier film"],
    director: "Léa Marchand",
    cast: [{ name: "Tom Vialard" }],
    synopsis: "L'audition n'a pas commencé. Lui, oui.",
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
