// Arquos design system — élévation (ombres).
//
// Trois niveaux seulement, chacun attaché à un usage précis. L'ombre est le
// token le plus facile à réinventer au call site : s'en tenir à ces trois-là.
//
// Le web consomme `--arq-shadow-*`, le mobile consomme `shadowNative.*`
// (React Native ne comprend pas la syntaxe CSS `box-shadow`).

export const shadow = {
  card: '0 2px 8px rgba(0, 0, 0, 0.04)', // cartes, surfaces posées sur le fond
  pop: '0 8px 24px rgba(0, 41, 91, 0.12)', // menus, popovers, feuilles modales
  fab: '0 4px 12px rgba(13, 90, 183, 0.30)', // bouton flottant — teintée de bleu
} as const;

// Équivalents React Native. `elevation` est la propriété Android, les `shadow*`
// sont lues par iOS : les deux sont nécessaires pour un rendu identique.
export const shadowNative = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  pop: {
    shadowColor: '#00295B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  fab: {
    shadowColor: '#0D5AB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export type ShadowToken = keyof typeof shadow;
