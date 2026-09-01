// Ce que `RecordTable` sait du métier, indépendamment de la plateforme.
//
// Le vocabulaire et les règles vivent ici ; le rendu reste dans le fichier de
// plateforme. C'est ce partage qui empêche « sélectionnés » de devenir
// « retenus » d'un écran à l'autre — « retenu » dit un choix arbitré, alors
// qu'il ne s'agit que de cases cochées.

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  /** L'identifiant de la colonne triée. */
  column: string;
  direction: SortDirection;
}

/**
 * Le cycle d'un en-tête cliqué : croissant, puis décroissant, puis plus de tri.
 *
 * Le troisième état compte : sans lui, on ne peut plus revenir à l'ordre
 * d'origine, qui porte souvent un sens (l'ordre d'import, l'ordre de saisie).
 */
export function nextSort(actuel: SortState | null, column: string): SortState | null {
  if (actuel?.column !== column) return { column, direction: 'asc' };
  if (actuel.direction === 'asc') return { column, direction: 'desc' };
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
export function compare(a: unknown, b: unknown, direction: SortDirection): number {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  const ordre =
    typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a).localeCompare(String(b), 'fr', { numeric: true });

  return direction === 'asc' ? ordre : -ordre;
}

/**
 * Le décompte d'une sélection, accordé en nombre ET EN GENRE.
 *
 * `nom` est le singulier de ce qui est listé (« équipement », « affaire »).
 * Le pluriel est régulier ; les rares exceptions se passent en argument — le
 * devis n'a pas de pluriel à lui, et « deviss » se lisait sous la pagination.
 *
 * **Le genre ne se devine pas d'un mot français**, et il ne se déduit pas non
 * plus du pluriel : le participe s'accorde avec le nom, et la fonction ne
 * connaissait que le mot. Elle rendait « 3 affaires sélectionnés ». Qui appelle
 * connaît le genre de ce qu'il liste ; qui ne le passe pas garde le masculin,
 * qui est le cas le plus fréquent.
 */
export function selectionLabel(
  nombre: number,
  name: string,
  plural?: string,
  feminine = false,
): string {
  const accord = feminine ? 'e' : '';
  if (nombre <= 1) return `${nombre} ${name} sélectionné${accord}`;
  return `${nombre} ${plural ?? `${name}s`} sélectionné${accord}s`;
}

/** Ce qu'on annonce sous une liste paginée. */
export function paginationLabel(premier: number, dernier: number, total: number): string {
  if (total === 0) return 'Aucun élément';
  return `${premier} à ${dernier} sur ${total}`;
}
