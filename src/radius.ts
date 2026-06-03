// Arquos design system — arrondis (border radius).
// Échelle calibrée sur l'usage réel du repo mobile (juin 2026) :
//   8 (×52), 5 (×27), 10 (×15), 12 (×12), 6 (×9), 4 (×6), 20 (×6),
//   11 (×6), 18 (×5), 16 (×3)
//
// Le 8 est dominant — c'est le radius de référence. Les valeurs 5, 10, 11
// sont du bruit et doivent à terme être ramenées sur 4/8/12 lors des
// itérations design.

export const radius = {
  none: 0,
  sm: 4,
  md: 8,     // ← défaut (cartes, inputs, boutons standards)
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999, // pill / cercle parfait (à utiliser sur un carré)
} as const;

export type RadiusToken = keyof typeof radius;
