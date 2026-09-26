// Ce que `Combobox` sait des menus longs, indépendamment de la plateforme.

export interface ComboboxOption {
  value: string;
  label: string;
  /**
   * D'autres mots par lesquels l'option se trouve, en plus de son libellé.
   * Né dans le panneau de filtres de l'application web (26/09/2026) : un
   * filtre se cherche aussi par les valeurs qu'il offre — « hors parc » trouve
   * « Contrat de maintenance ». Ils servent à chercher, jamais à afficher.
   */
  keywords?: readonly string[];
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
export function realChoices(
  options: readonly ComboboxOption[],
): readonly ComboboxOption[] {
  return options.filter((o) => o.value !== '');
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
export function displayedText(
  options: readonly ComboboxOption[],
  value: string,
  ouvert: boolean,
  frappe: string,
): string {
  if (ouvert) return frappe;
  const retenue = realChoices(options).find((o) => o.value === value);
  return retenue?.label ?? value;
}

/**
 * Ce que le champ propose en filigrane.
 *
 * Ouvrir le champ vide sa case pour laisser taper : la valeur qu'on avait sous
 * les yeux disparaît au moment précis où l'on cherche à la remplacer, et l'on ne
 * sait plus ce qu'on est en train de changer. Elle revient donc en filigrane,
 * qu'on efface d'une frappe. Rien de retenu : l'invite ordinaire.
 */
export function displayedPlaceholder(
  options: readonly ComboboxOption[],
  value: string,
  ouvert: boolean,
  placeholder: string,
): string {
  if (!ouvert || value === '') return placeholder;
  const retenue = realChoices(options).find((o) => o.value === value);
  return retenue?.label ?? value;
}
