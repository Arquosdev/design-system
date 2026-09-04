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
): string {
  if (ouvert) return frappe;
  const retenue = choixReels(options).find((o) => o.valeur === valeur);
  return retenue?.libelle ?? valeur;
}
