/** La boîte d'un élément, en pixels, dans le repère de son parent positionné. */
export interface Box {
  l: number;
  t: number;
  w: number;
  h: number;
}

/**
 * Où une photo est réellement dessinée à l'intérieur de son élément.
 *
 * `object-contain` n'agrandit ni ne rogne : il inscrit l'image dans la boîte en
 * gardant ses proportions, et centre ce qui reste. La boîte, elle, ne suit pas
 * l'image — une photo debout dans une boîte large laisse deux bandes vides de
 * chaque côté. Tout ce qu'on pose « dans le coin de la photo » doit donc viser
 * cette boîte-ci, jamais celle de l'élément.
 *
 * Constaté le 21/09/2026 : le bouton « Agrandir » sortait du cliché sur toutes
 * les photos de relevé, c'est-à-dire sur les trois quarts d'entre elles.
 *
 * Les dimensions naturelles valent zéro tant que l'image n'a pas chargé — et
 * pour toujours si elle ne charge jamais. On rend alors la boîte de l'élément :
 * faute de mieux, elle ne place rien en dehors de l'écran.
 */
export function drawnBox(
  element: Box,
  naturelle: { w: number; h: number },
): Box {
  if (naturelle.w <= 0 || naturelle.h <= 0) return element;

  const echelle = Math.min(element.w / naturelle.w, element.h / naturelle.h);
  const w = naturelle.w * echelle;
  const h = naturelle.h * echelle;

  return {
    l: element.l + (element.w - w) / 2,
    t: element.t + (element.h - h) / 2,
    w,
    h,
  };
}

/**
 * Le grossissement d'un clic dans la visionneuse.
 *
 * Né le 28/10/2026 (Louis) : une photo ouverte pour lire une valeur — la plaque
 * d'un moteur, l'étiquette d'une armoire — se lisait mal en plein écran, et il
 * fallait l'ouvrir dans un onglet pour zoomer. Deux fois et demie suffit à lire
 * une plaque prise à bout de bras, sans perdre où l'on est sur la photo.
 */
export const ZOOM = 2.5;

/**
 * Le décalage permis à une photo agrandie, pour qu'elle couvre toujours son cadre.
 *
 * L'agrandissement part du point cliqué (`origine`, en fractions de la boîte) ;
 * le glisser y ajoute un décalage. Sans borne, on pouvait tirer la photo hors de
 * son cadre et ne plus regarder qu'un fond vide. Les bornes se calculent : la
 * photo agrandie va de `o·w·(1−z) + d` à `o·w·(1−z) + d + z·w`, et elle doit
 * contenir `[0, w]`.
 */
export function clampPan(
  decalage: { x: number; y: number },
  boite: { w: number; h: number },
  origine: { x: number; y: number },
  zoom: number = ZOOM,
): { x: number; y: number } {
  const borne = (d: number, taille: number, o: number) =>
    Math.min(o * taille * (zoom - 1), Math.max(-(1 - o) * taille * (zoom - 1), d));
  return { x: borne(decalage.x, boite.w, origine.x), y: borne(decalage.y, boite.h, origine.y) };
}
