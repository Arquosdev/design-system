// Arquos design system — largeurs nommées.
//
// Trois largeurs reviennent partout, et étaient jusqu'ici écrites à la main
// dans chaque écran : la largeur d'une saisie selon ce qu'elle reçoit, et
// celle d'un panneau latéral.
//
// POURQUOI DES TOKENS. Un champ de 800 px pour y écrire « 2170 » dit au lecteur
// qu'on attend un paragraphe : la largeur porte du sens, elle se décide une
// fois. Et le panneau d'édition de la fiche équipement avait dû être élargi par
// un `w-[860px]` posé dans l'app — la règle du système interdit une valeur de
// design en dur, il fallait donc que le système la porte.
//
// Usage :
//   web      `max-w-saisie-courte`, `w-panneau-large` (namespace `--container-*`)
//   CSS nu   `var(--arq-largeur-saisie-courte)`

export const largeur = {
  /** Un nombre, une date, un code — ce qui se lit d'un coup d'œil. */
  saisieCourte: 200,
  /** Un texte libre, un menu : assez large pour un libellé entier. */
  saisieLongue: 420,
  /** Une planche de mesure intercalée dans un formulaire. Assez large pour que
   *  ses repères se lisent, assez étroite pour rester une illustration : une
   *  image qui prend toute la largeur du panneau devient le sujet. */
  planche: 620,
  /** Le panneau latéral courant — une tâche annexe, quelques champs. */
  panneau: 460,
  /** Le panneau qui porte un formulaire ET ce qui l'explique — une planche
   *  cotée, un tableau. En dessous, les repères A/B d'un dessin ne se lisent
   *  plus : c'est la mesure qui a fixé cette largeur. */
  panneauLarge: 860,
} as const;

export type LargeurToken = keyof typeof largeur;
