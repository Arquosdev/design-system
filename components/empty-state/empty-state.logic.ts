// Ce qu'un état vide dit, indépendamment de la plateforme.
//
// Le mobile portait déjà cette décision, enfouie dans son composant : selon que
// l'erreur vient du réseau ou d'ailleurs, ni l'icône, ni le titre, ni le conseil
// ne sont les mêmes. Le web l'a réécrite au cas par cas, avec d'autres mots.
//
// Les mots vivent ici, le rendu chez chaque plateforme.

import type { IconRole } from '../../src/icons';

export type NatureDeLEchec = 'hors-ligne' | 'inconnu';

export interface FormulationDEchec {
  icone: IconRole;
  titre: string;
  conseil: string;
}

/**
 * Ce qu'on montre quand un chargement échoue.
 *
 * Distinguer les deux cas n'est pas un raffinement : hors ligne, réessayer tout
 * de suite ne sert à rien, et la bonne action est de rétablir la connexion. Un
 * message générique enverrait le technicien appuyer en boucle dans une gaine
 * sans réseau.
 */
export const ECHECS: Record<NatureDeLEchec, FormulationDEchec> = {
  'hors-ligne': {
    icone: 'horsLigne',
    titre: 'Pas de connexion',
    conseil: 'Vérifiez votre connexion internet, puis réessayez.',
  },
  inconnu: {
    icone: 'attention',
    titre: 'Une erreur est survenue',
    conseil: 'Veuillez réessayer dans quelques instants.',
  },
};

/** Le libellé du bouton de reprise. Un seul mot, le même partout. */
export const REESSAYER = 'Réessayer';

/**
 * La nature d'un échec, lue sur l'erreur elle-même.
 *
 * Volontairement grossier : on ne cherche pas à classer les erreurs, seulement à
 * répondre à « est-ce que réessayer maintenant a une chance de marcher ? ». Un
 * faux négatif coûte un message générique ; un faux positif enverrait attendre
 * un réseau qui n'est pas en cause.
 */
export function natureDeLEchec(erreur: unknown): NatureDeLEchec {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'hors-ligne';
  const message = erreur instanceof Error ? erreur.message : String(erreur ?? '');
  return /network|fetch failed|offline|ERR_INTERNET|Failed to fetch|NetworkError/i.test(message)
    ? 'hors-ligne'
    : 'inconnu';
}
