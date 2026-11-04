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
// sont l'échelle de tous les contrôles : un champ, un sélecteur, un bouton
// d'icône posés sur une même barre s'alignent sans que personne n'écrive de
// hauteur.
//
// **Descendues le 04/11/2026 (Thomas, refonte des boutons « à la Intercom »,
// relevée sur Refero) : 28 / 32 / 40 au lieu de 30 / 36 / 44.** Les boutons
// d'Intercom font 32 px, et c'est toute l'échelle qui suit, pour que les champs
// et les sélecteurs restent à la hauteur des boutons.
//
// Ce n'est pas une échelle d'espacement : on ne s'en sert que pour la hauteur
// d'un contrôle interactif, et pour la ligne qui doit valoir exactement cette
// hauteur. Le mobile a la sienne, `touchHeight`, tenue par la cible tactile.

export const controlHeight = {
  /**
   * 28 px — l'action discrète : fin de ligne, barre de sélection, éditeur en
   * place, bouton de fermeture d'un panneau.
   *
   * **Sous la cible tactile de 44 pt.** À réserver au pointeur, ou à un endroit
   * où le doigt a de la marge autour.
   */
  sm: 28,
  /**
   * 32 px — **la référence.** Un bouton, un bouton d'icône, un sélecteur, un
   * champ, une ligne de titre qui doit valoir exactement la hauteur d'un bouton.
   *
   * C'est la valeur à prendre quand on hésite : c'est elle qui permet à trois
   * contrôles posés sur une même barre de s'aligner sans que personne n'écrive
   * de hauteur.
   */
  md: 32,
  /**
   * 40 px — l'action principale d'un écran, quand elle doit peser plus que les
   * autres (un formulaire de connexion, une page d'accueil).
   */
  lg: 40,
} as const;

export type ControlHeightToken = keyof typeof controlHeight;

/**
 * La hauteur d'un contrôle SUR LE TÉLÉPHONE, tenue par la cible tactile et non
 * par l'échelle du web : 44 pt est le seuil sous lequel un pouce ganté rate le
 * bouton, 36 la petite taille qui se touche quand même sur 44 par un `hitSlop`
 * (`debordTactile`). Les deux échelles se sont séparées le 04/11/2026, quand
 * celle du web est descendue à 32 : le mobile n'avait aucune raison de suivre.
 */
export const touchHeight = {
  /** 36 pt — le petit bouton, le bouton d'icône discret ; se touche sur 44. */
  sm: 36,
  /** 44 pt — la cible tactile confortable : bouton, champ, en-tête d'écran. */
  md: 44,
} as const;

export type TouchHeightToken = keyof typeof touchHeight;
