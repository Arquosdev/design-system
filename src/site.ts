/**
 * Ce que le site vitrine arquos.eu ajoute au design system.
 *
 * Rien ici n'est destiné à l'application (Arquos, myArquos) : le site et le
 * produit partagent la palette, les couleurs sémantiques et la typographie,
 * mais le site a ses propres surfaces (la nuit du hero) et ses propres objets
 * (les appareils dessinés en CSS). Ces jetons vivent à part pour que personne
 * ne les prenne pour du vocabulaire applicatif, et sortent en CSS sous
 * `--arq-site-*`.
 *
 * Contrastes des encres sur `night` : 15,9 — 11,6 — 6,2 pour 1.
 */
export const site = {
  color: {
    /** Surface de nuit : hero, appel à la démo, pied de page. */
    night: '#04122A',
    /** Texte courant posé sur la nuit. */
    textOnNight: '#EEF3F9',
    /** Texte secondaire posé sur la nuit : chapeaux, légendes. */
    textOnNightMuted: '#C6D4E6',
    /** Repères et libellés mono posés sur la nuit. */
    textOnNightSubtle: '#93A9C6',
    /** Cadre du téléphone et de l'ordinateur dessinés en CSS, plus profond que la nuit. */
    deviceFrame: '#0B1220',
  },
} as const;

export type SiteColorToken = keyof typeof site.color;
