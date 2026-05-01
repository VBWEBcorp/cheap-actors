/**
 * Stats fictives assumées pour la maquette.
 * À mettre à jour à la main quand vous aurez les vrais chiffres.
 * L'astérisque dans l'UI indique au visiteur que ces chiffres
 * sont approximatifs (et c'est très bien comme ça).
 */
export const SITE_STATS = {
  /** Volume actuellement ouvert */
  currentVolume: 1,
  /** Nombre de soumissions reçues pour le volume actuel */
  submissionsReceived: 287,
  /** Nombre de films retenus (= films listés sur la plateforme pour ce volume) */
  filmsSelected: 4,
  /** Nombre de shorts retenus */
  shortsSelected: 3,
  /** ISO date d'ouverture du prochain volume */
  nextVolumeOpensAt: "2026-07-01T00:00:00+02:00",
};

export const getAcceptanceRate = (): string => {
  const ratio =
    ((SITE_STATS.filmsSelected + SITE_STATS.shortsSelected) /
      SITE_STATS.submissionsReceived) *
    100;
  return ratio.toFixed(1);
};

export const formatVolume = (n: number): string =>
  `Volume ${String(n).padStart(2, "0")}`;
