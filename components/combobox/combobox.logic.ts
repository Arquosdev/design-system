// Ce que `Combobox` sait des menus longs, indépendamment de la plateforme.

export interface ComboboxOption {
  valeur: string;
  libelle: string;
}

/**
 * Les vraies options, celles qu'on peut choisir.
 *
 * Une option SANS VALEUR n'est pas un choix, c'est l'absence de choix — et le
 * placeholder le dit déjà. `menuDeChoix` en ajoute pourtant une, « — choisir — »,
 * parce que Radix l'exige de son `Select` : là-bas, une entrée doit porter une
 * valeur pour signifier « rien ».
 *
 * Passée telle quelle au champ cherchable, cette entrée faisait deux dégâts, vus
 * en clientèle le 04/09/2026 : le champ affichait « — choisir — » comme si on
 * l'avait saisi, et la première frappe s'y collait — « — choisir —SEMA » — pour
 * finir sur « Aucun choix ne correspond ».
 */
export function choixReels(
  options: readonly ComboboxOption[],
): readonly ComboboxOption[] {
  return options.filter((o) => o.valeur !== '');
}

/**
 * Ce que le champ montre.
 *
 * Fermé, la valeur retenue — son libellé si le catalogue la connaît, sinon la
 * valeur telle quelle, car une valeur hors catalogue reste légitime. Ouvert, ce
 * qu'on tape : sans ça, ouvrir le champ effacerait sous les yeux la valeur qu'on
 * venait consulter.
 *
 * Rien retenu, rien tapé : la chaîne vide, pour que le placeholder paraisse.
 */
export function contenuAffiche(
  options: readonly ComboboxOption[],
  valeur: string,
  ouvert: boolean,
  frappe: string,
  libelleValeur?: string,
): string {
  if (ouvert) return frappe;
  return libelleDe(options, valeur, libelleValeur);
}

/**
 * Ce que le champ propose en filigrane.
 *
 * Ouvrir le champ vide sa case pour laisser taper : la valeur qu'on avait sous
 * les yeux disparaît au moment précis où l'on cherche à la remplacer, et l'on ne
 * sait plus ce qu'on est en train de changer. Elle revient donc en filigrane,
 * qu'on efface d'une frappe. Rien de retenu : l'invite ordinaire.
 */
export function invitAffichee(
  options: readonly ComboboxOption[],
  valeur: string,
  ouvert: boolean,
  placeholder: string,
  libelleValeur?: string,
): string {
  if (!ouvert || valeur === '') return placeholder;
  return libelleDe(options, valeur, libelleValeur);
}

/**
 * Le libellé de la valeur retenue.
 *
 * Trouvé dans les options d'abord. À défaut, celui que l'écran a fourni — et
 * c'est le cas ordinaire en **recherche déléguée** : les options ne sont que les
 * résultats de la dernière frappe, et la valeur retenue n'y figure presque
 * jamais. Sans ce libellé, un champ dont la valeur est un identifiant afficherait
 * l'identifiant (« 1759219354084x16… ») au lieu du nom.
 *
 * Et en dernier recours la valeur telle quelle : une valeur hors catalogue reste
 * légitime, la taire effacerait à l'écran ce que la base contient.
 */
function libelleDe(
  options: readonly ComboboxOption[],
  valeur: string,
  libelleValeur?: string,
): string {
  const retenue = choixReels(options).find((o) => o.valeur === valeur);
  return retenue?.libelle ?? (libelleValeur || valeur);
}

/**
 * Ce que la liste dit quand elle n'a rien à montrer.
 *
 * Filtrée sur place, la liste vide veut toujours dire la même chose : rien ne
 * correspond. En recherche déléguée, elle peut aussi vouloir dire « on cherche
 * encore » ou « rien n'a été demandé » — et afficher « Aucun choix ne
 * correspond » pendant que la réponse arrive ferait croire à une liste vide.
 */
export function messageVide(delegue: boolean, chargement: boolean): string {
  return delegue && chargement ? 'Recherche…' : 'Aucun choix ne correspond.';
}
