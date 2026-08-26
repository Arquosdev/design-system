// Arquos design system — durées de transition, en millisecondes.
//
// Trois durées, chacune attachée à ce qu'elle accompagne. `CLAUDE.md` interdit
// d'écrire une valeur de design en dur ; les composants du dépôt écrivaient
// pourtant `duration-150` et `duration-200` sans qu'aucun token existe.
//
// Au-delà de 300 ms, une transition se remarque au lieu d'accompagner. En deçà
// de 100, elle ne se voit pas et vaut autant que rien.

export const duration = {
  /** Un retour immédiat : survol, focus, opacité. */
  rapide: 150,
  /** Une bascule visible : un chevron qui pivote, un onglet qui glisse. */
  normal: 200,
  /** Une surface qui entre ou sort : panneau, modale, feuille. */
  lent: 300,
} as const;

/**
 * La courbe par défaut. Sortie douce : le mouvement démarre franchement et
 * s'arrête sans à-coup, ce qui se lit comme « posé » plutôt que « stoppé ».
 */
export const easing = 'cubic-bezier(0.2, 0, 0, 1)';

export type DurationToken = keyof typeof duration;
