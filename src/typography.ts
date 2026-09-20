// Arquos design system — typographie.
// Échelle extraite de l'usage réel dans le repo mobile (juin 2026) :
//   16 (×67), 14 (×52), 12 (×28), 13 (×25), 18 (×21), 20 (×15), 15 (×14),
//   22 (×11), 11 (×8), 10 (×4), 17 (×3), 32 (×2), 28 (×1)
//
// Le `body` (16) est la taille par défaut du texte courant.
// Pour éviter le drift, NE PAS introduire de nouvelles tailles : utiliser un alias.

// DM Sans est la seule police de la marque.
//
// Web : une pile CSS classique, la graisse est choisie par `fontWeight`.
// Mobile : React Native ne synthétise pas correctement le gras sur Android — il
// faut nommer explicitement la variante chargée, d'où `fontFamilyNative`.
export const fontFamily =
  "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/**
 * DM Mono, la compagne de DM Sans dessinée dans la même famille — pour les
 * **valeurs de données** : numéros d'équipement, cotes, dates, légendes de
 * figure, plaques du site vitrine.
 *
 * Elle ne remplace pas DM Sans, elle la complète là où des chiffres s'alignent
 * ou qu'une valeur doit se lire comme une valeur. L'application ne l'emploie
 * pas encore ; le site vitrine l'emploie partout où une donnée s'affiche
 * (décision du 20/09/2026, DM Sans partout, DM Mono pour la donnée).
 */
export const fontFamilyMono =
  "'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export const fontFamilyNative = {
  400: 'DMSans_400Regular',
  500: 'DMSans_500Medium',
  600: 'DMSans_600SemiBold',
  700: 'DMSans_700Bold',
  800: 'DMSans_800ExtraBold',
  900: 'DMSans_900Black',
} as const;

export const fontSize = {
  caption: 12,
  small: 14,
  body: 16,        // ← défaut
  subhead: 18,
  title: 20,
  titleLarge: 22,
  headline: 28,
  display: 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Line-height multipliers (à multiplier par fontSize). 1.4 est un bon compromis
// pour du texte courant ; 1.2 convient mieux aux titres.
export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

// Letter spacing en points (négatif = lettres plus serrées, utile pour les
// grosses tailles iOS-style).
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
} as const;

// Combinaisons sémantiques prêtes à l'emploi. Préfère ces tokens dans le code
// applicatif (ex : `typography.body` plutôt que de recombiner les briques).
export const typography = {
  caption: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.caption * lineHeight.normal,
  },
  // Le titre d'une section À L'INTÉRIEUR d'un formulaire : « OUVERTURE »,
  // « FINITION ». Il range sans peser — dans un formulaire, ce qui doit
  // ressortir est le libellé du champ, pas le nom de la section qui le range.
  // S'ÉCRIT EN CAPITALES : c'est la capitale qui le fait lire comme une
  // étiquette plutôt que comme un titre, et c'est pour ça qu'il tient à
  // 12 px. Ajouter `uppercase` (web) ou `textTransform: 'uppercase'` (natif).
  // Ne pas l'employer comme titre de bloc dans une page en lecture : là, c'est
  // `bodyBold` — voir l'accordéon de la fiche équipement.
  overline: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.caption * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  small: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.small * lineHeight.normal,
  },
  body: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.body * lineHeight.normal,
  },
  bodyMedium: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.body * lineHeight.normal,
  },
  bodyBold: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.body * lineHeight.normal,
  },
  subhead: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.subhead * lineHeight.tight,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.title * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  titleLarge: {
    fontSize: fontSize.titleLarge,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.titleLarge * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  headline: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.headline * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  display: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.display * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
} as const;

export type TypographyToken = keyof typeof typography;
