/** La boîte d'un élément, en pixels, dans le repère de son parent positionné. */
export interface Boite {
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
export function boiteDessinee(
  element: Boite,
  naturelle: { w: number; h: number },
): Boite {
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
