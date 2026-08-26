// Arquos design system — l'ordre d'empilement.
//
// Quatre niveaux nommés par **intention**, pas par nombre. Un `z-50` écrit à la
// main ne dit pas au-dessus de quoi il doit passer ; un nom, si.
//
// Ce que ça répare : le 25/08/2026, le panneau latéral, la palette de recherche,
// le menu déroulant et l'infobulle étaient tous à `z-50`. Un menu ouvert dans un
// panneau passait donc devant ou derrière selon l'ordre du DOM — et la fiche a
// exactement ce cas, avec ses champs à choix dans le panneau « Compléter ».
//
// LA RÈGLE QUI TIENT L'ÉCHELLE : un élément flottant doit passer au-dessus de la
// surface qui l'a ouvert. Toute surface capable de contenir un menu, une
// infobulle ou un sélecteur se place donc SOUS `flottant`.

export const layers = {
  /** Le contenu de la page. Rien à déclarer. */
  base: 0,
  /**
   * Une surface qui recouvre une partie de l'écran et reste manipulable :
   * panneau latéral, tiroir. Elle peut contenir des éléments flottants, donc
   * elle passe dessous.
   */
  panneau: 50,
  /**
   * Ce qui s'ouvre depuis un élément et doit passer par-dessus tout le reste,
   * y compris un panneau : menu déroulant, sélecteur, infobulle, popover.
   */
  flottant: 60,
  /**
   * Ce qui prend l'écran entier et suspend le reste : visionneuse de photo,
   * palette de recherche. Ne contient pas d'élément flottant — si un jour
   * c'était le cas, c'est cette échelle qu'il faudrait revoir, pas une
   * exception à écrire au call site.
   */
  pleinEcran: 70,
  /**
   * Ce qui doit rester visible quoi qu'il arrive : les notifications. Toujours
   * au-dessus, y compris d'une visionneuse.
   */
  notification: 80,
} as const;

export type LayerToken = keyof typeof layers;
