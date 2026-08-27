// Ce que `RecordTable` sait du métier, indépendamment de la plateforme.
//
// Le vocabulaire et les règles vivent ici ; le rendu reste dans le fichier de
// plateforme. C'est ce partage qui empêche « sélectionnés » de devenir
// « retenus » d'un écran à l'autre — « retenu » dit un choix arbitré, alors
// qu'il ne s'agit que de cases cochées.

export type SensTri = 'croissant' | 'decroissant';

export interface EtatTri {
  cle: string;
  sens: SensTri;
}

/**
 * Le cycle d'un en-tête cliqué : croissant, puis décroissant, puis plus de tri.
 *
 * Le troisième état compte : sans lui, on ne peut plus revenir à l'ordre
 * d'origine, qui porte souvent un sens (l'ordre d'import, l'ordre de saisie).
 */
export function triSuivant(actuel: EtatTri | null, cle: string): EtatTri | null {
  if (actuel?.cle !== cle) return { cle, sens: 'croissant' };
  if (actuel.sens === 'croissant') return { cle, sens: 'decroissant' };
  return null;
}

/**
 * Compare deux valeurs d'une même colonne.
 *
 * Une valeur absente part toujours en fin de liste, dans les deux sens : ce
 * qu'on cherche en triant, c'est la valeur extrême, pas le trou. Trier par
 * année croissante pour trouver les appareils les plus anciens ne doit pas
 * ramener d'abord ceux dont l'année n'est pas renseignée.
 */
export function comparer(a: unknown, b: unknown, sens: SensTri): number {
  const aVide = a === null || a === undefined || a === '';
  const bVide = b === null || b === undefined || b === '';
  if (aVide && bVide) return 0;
  if (aVide) return 1;
  if (bVide) return -1;

  const ordre =
    typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a).localeCompare(String(b), 'fr', { numeric: true });

  return sens === 'croissant' ? ordre : -ordre;
}

/**
 * Le décompte d'une sélection, accordé.
 *
 * `nom` est le singulier de ce qui est listé (« équipement », « affaire »).
 * Le pluriel est régulier ; les rares exceptions se passent en second argument.
 */
export function libelleSelection(nombre: number, nom: string, pluriel?: string): string {
  if (nombre <= 1) return `${nombre} ${nom} sélectionné`;
  return `${nombre} ${pluriel ?? `${nom}s`} sélectionnés`;
}

/** Ce qu'on annonce sous une liste paginée. */
export function libellePagination(premier: number, dernier: number, total: number): string {
  if (total === 0) return 'Aucun élément';
  return `${premier} à ${dernier} sur ${total}`;
}
