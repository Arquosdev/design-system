// Règle de lecture d'une proportion, partagée par `Gauge` et `Meter`.
//
// Elle vit ici plutôt que dans l'un des deux : deux composants qui montrent la
// même chose ne doivent pas la colorer différemment. Un taux de connaissance de
// 40 % est « à compléter » dans un anneau comme dans une barre.

export type ProportionTone = 'success' | 'warning' | 'danger';

/**
 * Les deux frontières, en pourcentage.
 *
 * Sous `alerte`, la donnée est trop lacunaire pour décider ; entre les deux,
 * elle se complète ; au-dessus de `bon`, elle porte.
 */
export const PROPORTION_THRESHOLDS = { alerte: 34, bon: 67 } as const;

/** Sans ton imposé, la couleur suit la valeur — mais le chiffre reste toujours écrit. */
export function proportionTone(value: number): ProportionTone {
  if (value < PROPORTION_THRESHOLDS.alerte) return 'danger';
  if (value < PROPORTION_THRESHOLDS.bon) return 'warning';
  return 'success';
}

/** Borné plutôt que de dessiner une barre ou un arc aberrant. */
export function borner(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
