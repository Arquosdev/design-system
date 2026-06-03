// Arquos design system — échelle d'espacement.
// Base 4 (standard moderne) : toutes les valeurs sont des multiples de 4.
//
// Usage : `padding: spacing.md`, `gap: spacing.sm`, `marginBottom: spacing.lg`.
// Préfère les tokens sémantiques aux valeurs en dur — si tu as besoin d'un
// nouvel intervalle, propose-le d'abord en équipe avant d'ajouter une valeur.

export const spacing = {
  none: 0,
  xxs: 2,    // micro (séparateurs internes, dot, etc.)
  xs: 4,     // très petit (paddings serrés)
  sm: 8,     // petit (gap entre éléments proches)
  md: 12,    // moyen
  base: 16,  // ← défaut (padding standard des cartes, formulaires)
  lg: 20,
  xl: 24,
  '2xl': 32, // séparation de sections
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export type SpacingToken = keyof typeof spacing;
