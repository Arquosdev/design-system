// Arquos design system — la hauteur d'un contrôle.
//
// **Ce que ça répare.** `36px` était écrit en dur à sept endroits — `Button`,
// `IconButton`, le bouton de recherche de `RecordRail`, son squelette, la ligne
// de titre de `PageHeader` — sans qu'aucune règle ne les tienne ensemble.
// Quiconque en changeait un ne pouvait pas savoir que les six autres devaient
// suivre.
//
// Et le manque se payait à l'écran : le 30/08/2026, la pagination a dû écrire
// `size-[32px]` à la main sur ses deux `IconButton` pour qu'ils s'alignent sur
// le `Select` voisin. Un écran qui écrit une hauteur est le signe qu'elle
// manque ici.
//
// TROIS VALEURS, ET PAS QUATRE. Ce sont les trois tailles de `Button`, qui
// étaient déjà l'échelle de fait. Le `32px` de `Select`, `Combobox` et
// `FilterChips` n'en est pas une quatrième : c'est l'anomalie qui empêche
// justement trois contrôles de s'aligner. Voir `MIGRATION.md`.
//
// Ce n'est pas une échelle d'espacement : on ne s'en sert que pour la hauteur
// d'un contrôle interactif, et pour la ligne qui doit valoir exactement cette
// hauteur.

export const controlHeight = {
  /**
   * 30 px — l'action discrète : fin de ligne, barre de sélection, éditeur en
   * place, bouton de fermeture d'un panneau.
   *
   * **Sous la cible tactile de 44 pt.** À réserver au pointeur, ou à un endroit
   * où le doigt a de la marge autour.
   */
  sm: 30,
  /**
   * 36 px — **la référence.** Un bouton, un bouton d'icône, un sélecteur, une
   * ligne de titre qui doit valoir exactement la hauteur d'un bouton.
   *
   * C'est la valeur à prendre quand on hésite : c'est elle qui permet à trois
   * contrôles posés sur une même barre de s'aligner sans que personne n'écrive
   * de hauteur.
   */
  md: 36,
  /**
   * 44 px — la cible tactile confortable, celle que les recommandations
   * mobiles demandent. L'action principale d'un écran tactile.
   */
  lg: 44,
} as const;

export type ControlHeightToken = keyof typeof controlHeight;
