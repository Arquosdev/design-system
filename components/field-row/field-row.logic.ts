// Ce que `FieldRow` sait de l'ascenseur, indépendamment de la plateforme.
//
// Le vocabulaire et les règles vivent ici ; le rendu — classes Tailwind côté
// web, styles React Native côté mobile — reste dans le fichier de plateforme.
// C'est ce partage qui garantit qu'une valeur absente se dit « Non renseigné »
// des deux côtés, et non « Non renseigné » ici et « — » là.
//
// Rien dans ce fichier n'importe React : il se lit et se teste sans navigateur
// ni simulateur.

export type FieldKind = 'text' | 'number' | 'choice' | 'multi';
export type FieldStatus = 'filled' | 'missing' | 'to_check';
export type FieldSave = 'saving' | 'ok' | 'error';
export interface FieldOption {
  value: string;
  label: string;
}

/**
 * Une valeur absente s'annonce en toutes lettres.
 *
 * Un tiret laisse croire à une donnée sans objet ; « Non renseigné » dit qu'il
 * manque quelque chose, et reste cliquable pour le combler. La distinction est
 * métier, pas cosmétique : un relevé où l'on ne sait pas n'est pas un relevé
 * où il n'y a rien à savoir.
 */
export const EMPTY = 'Non renseigné';

/** Ce que chaque statut de champ s'appelle. Les mots, pas la couleur. */
export const STATUS_TEXT: Record<FieldStatus, string> = {
  filled: 'Renseigné',
  missing: 'Manquant',
  to_check: 'À vérifier',
};

/**
 * Ce que dit une sauvegarde en cours, réussie ou échouée.
 *
 * Formulations reprises telles quelles du module Bubble (index.html:4671) : le
 * vocabulaire de la fiche ne change pas parce qu'on la réécrit.
 */
export const SAVE_TEXT: Record<FieldSave, string> = {
  saving: 'Enregistrement…',
  ok: '✓ Enregistré',
  error: '⚠ Non enregistré',
};

/**
 * Le menu d'un champ à choix, et la valeur qui doit y être cochée.
 *
 * La ligne affiche un **libellé** (« Moyen ») ; le menu manipule des **valeurs
 * en base** (`moyen`). Poser le libellé comme valeur du menu ne correspond à
 * aucune option : le sélecteur coche alors la première, et s'ouvre en annonçant
 * « Bon » sur un composant qui est « Moyen ».
 *
 * Une valeur hors catalogue — une marque saisie à la main, un jeton qu'un relevé
 * a laissé — reste en tête du menu : la retirer reviendrait à la remplacer en
 * silence dès l'ouverture.
 */
export function choiceMenu(
  value: string | string[] | null,
  options: readonly FieldOption[],
): { choices: FieldOption[]; chosen: string } {
  const brut = typeof value === 'string' ? value : '';
  const retenu = options.find((o) => o.value === brut || o.label === brut);
  const choices: FieldOption[] = [];

  if (!brut) choices.push({ value: '', label: '— choisir —' });
  if (brut && !retenu) choices.push({ value: brut, label: brut });
  choices.push(...options);

  return { choices, chosen: retenu ? retenu.value : brut };
}

/**
 * Le texte à afficher pour une valeur, quelle qu'elle soit.
 *
 * Une seule porte de sortie pour les valeurs vides, au lieu d'un test répété à
 * chaque endroit qui affiche un champ — c'est ainsi qu'un écran finit par
 * afficher un tiret quand les autres disent « Non renseigné ».
 */
export function valueText(value: string | string[] | null | undefined): string {
  if (Array.isArray(value)) return value.length ? value.join(', ') : EMPTY;
  const t = (value ?? '').trim();
  return t === '' ? EMPTY : t;
}

/** Vrai quand la valeur est à combler — ce qui rend la ligne cliquable. */
export function isEmpty(value: string | string[] | null | undefined): boolean {
  return valueText(value) === EMPTY;
}
