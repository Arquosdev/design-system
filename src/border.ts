// Arquos design system — épaisseurs de bordure.
//
// Deux valeurs, parce que le produit n'en emploie que deux. Le trait courant, et
// celui qui dit qu'un champ est en cours de saisie.
//
// L'arrondi vit à part, dans `radius.ts` : une bordure et un angle ne se
// choisissent pas ensemble.

export const borderWidth = {
  /** Le trait courant — cartes, champs, séparateurs, tableaux. */
  fin: 1,
  /**
   * Ce qui est en cours d'édition ou retenu.
   *
   * Un demi-pixel de plus suffit à distinguer un champ ouvert d'un champ au
   * repos, sans décaler la mise en page comme le ferait un 2 px.
   */
  epais: 1.5,
} as const;

export type BorderWidthToken = keyof typeof borderWidth;
