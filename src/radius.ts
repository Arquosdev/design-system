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
  // Blocs de contenu : cartes, panneaux, tableaux. 4 px, le même rayon que les
  // contrôles (Louis, 27/09/2026) : arrondi voulu, net, sur la grille de 4 px.
  block: 4,
  // Boutons, champs, menus, pastilles : 6 px depuis le 04/11/2026 (Thomas,
  // refonte des boutons « à la Intercom », relevée sur Refero : angles
  // nettement arrondis sans être une pilule). Un seul rayon pour tous les
  // contrôles, hors cercles ; les blocs gardent leurs 4 px (Louis, 27/09/2026).
  control: 6,
  sm: 4,
  md: 8,     // ← défaut (cartes, inputs, boutons standards)
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999, // pill / cercle parfait (à utiliser sur un carré)
} as const;

export type RadiusToken = keyof typeof radius;
