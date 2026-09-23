// Ce que `PhotoTile` sait de l'ascenseur, indépendamment de la plateforme.

/**
 * Ce qu'affiche un emplacement sans photo.
 *
 * « Non prise » est une information, pas un vide : sur un relevé, l'absence
 * d'une photo attendue se constate et se réclame. Un cadre gris muet laisserait
 * croire à un chargement qui traîne.
 */
export const NOT_TAKEN = 'Non prise';

/**
 * Une photo dans le sens du cadre se recadre ; une photo en travers se contient.
 *
 * Sur du 0,77 dans du 0,75 on rogne trois pour cent, personne ne le voit.
 * Recadrer une photo en travers reviendrait à n'en montrer qu'un tiers, et une
 * capture d'écran ainsi réduite ne se reconnaît plus.
 *
 * Le rapport du cadre est un paramètre : le web et le mobile n'ont pas la même
 * densité, et c'est justement ce qui a le droit de diverger.
 */
export function estEnTravers(width: number, height: number, rapportDuCadre: number): boolean {
  if (!width || !height) return false;
  const rapport = width / height;
  return Math.abs(rapport - rapportDuCadre) > rapportDuCadre * 0.35;
}
