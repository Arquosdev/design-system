// Ce que `FieldRow` sait de l'ascenseur, indépendamment de la plateforme.
//
// Le vocabulaire et les règles vivent ici ; le rendu — classes Tailwind côté
// web, styles React Native côté mobile — reste dans le fichier de plateforme.
// C'est ce partage qui garantit qu'une valeur absente se dit « Non renseigné »
// des deux côtés, et non « Non renseigné » ici et « — » là.
//
// Rien dans ce fichier n'importe React : il se lit et se teste sans navigateur
// ni simulateur.

/*
  Le premier import d'un module de logique par un autre, et l'extension `.ts` y
  est OBLIGATOIRE : ces fichiers tournent sous Node nu — `npm run test` les
  exécute par `--experimental-strip-types`, sans bundler pour deviner un
  chemin. Les `.web.tsx` voisins peuvent l'omettre, eux passent par Vite.
*/
import { isISO, toDisplay } from '../date-field/date-field.logic.ts';

export type FieldKind = 'text' | 'number' | 'choice' | 'multi' | 'date';
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

/**
 * Le texte d'une valeur de genre `date` — l'ISO qu'on stocke, rendu lisible.
 *
 * La ligne affiche `12/09/2026`, le service reçoit `2026-09-12`. Sans ce
 * passage, une fiche montrerait son ISO nu à l'utilisateur : c'est l'autre
 * moitié de la confusion qui a corrompu les données côté `web` — le format de
 * stockage n'est pas un format de lecture.
 *
 * Une valeur qui n'est pas de l'ISO passe telle quelle : un champ peut porter
 * une date approximative saisie à la main (« vers 1978 ») que rien n'oblige à
 * cacher.
 */
export function dateText(value: string | string[] | null | undefined): string {
  if (typeof value === 'string' && isISO(value)) return toDisplay(value);
  return valueText(value);
}

/**
 * Un choix multiple, séparé en deux : ce qui vient du catalogue, et le reste.
 *
 * Un jeu d'options OUVERT porte une valeur « Autre » : le relevé coche l'option
 * et écrit le texte à côté. Sur un champ à choix multiple, le texte arrive donc
 * mêlé aux valeurs connues, et rien ne le distingue — les pastilles ne montrent
 * que le catalogue, si bien qu'une valeur saisie à la main devenait invisible
 * et disparaissait au premier enregistrement.
 *
 * On rend donc les deux : les valeurs que le catalogue reconnaît, et LA valeur
 * libre. Une seule, parce que la colonne jumelle n'en porte qu'une — c'est ce
 * que le service accepte, et refuser ici ce qu'il refusera de toute façon vaut
 * mieux que de le découvrir après l'envoi.
 */
export function splitMultipleChoice(
  values: readonly string[],
  options: readonly FieldOption[],
  /* Le mot que le relevé écrit dans la colonne pour dire « il y a un texte à
     côté ». Il n'est pas dans le catalogue — l'extraction l'en retire — et ce
     n'est pas pour autant la valeur saisie : le prendre pour elle remplissait la
     saisie avec le mot « Autre » au lieu du texte réel. */
  otherLabel = 'Autre',
): { known: string[]; free: string; marked: boolean } {
  /*
    LES CONNUES SORTENT EN VALEUR DE MENU, PAS COMME ELLES SONT ENTRÉES.

    Une valeur arrive tantôt en valeur de base (`came_fixe`), tantôt en libellé
    (« Came fixe ») : la fiche équipement affiche le libellé, le menu porte la
    valeur, et les deux se ressemblent assez souvent pour que la différence ait
    passé longtemps inaperçue. Les reconnaître ne suffisait donc pas — l'appelant
    comparait ensuite `known` à `o.value`, et sur un jeu où les deux diffèrent
    aucune pastille ne s'allumait. Les neuf champs à choix multiples de la fiche
    étaient dans ce cas, « type de came » compris. Constaté le 22/09/2026.

    On traduit ici, une fois : reconnaître une valeur et la rendre sous le nom
    du menu sont la même opération, et les séparer, c'est laisser à chaque
    appelant le soin de la refaire.
  */
  const retenu = (v: string) => options.find((o) => o.value === v || o.label === v);
  const marque = (v: string) =>
    v.trim().toLowerCase() === otherLabel.trim().toLowerCase();
  const known = values.map(retenu).filter((o): o is FieldOption => Boolean(o)).map((o) => o.value);
  const free = values.find((v) => !retenu(v) && !marque(v) && v.trim() !== '') ?? '';
  return { known, free, marked: values.some(marque) };
}
