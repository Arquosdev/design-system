import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '../../src/colors';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Text, type TextProps } from '../text/text.native';

/*
  Les mêmes sept parties que `card.web.tsx`, avec les mêmes tokens : contour
  `borderSoft` et arrondi `md`, en-tête teinté `bgMuted` sous un filet, contenu
  à `base`, liste sans retrait, pied sous un filet.

  Pas d'ombre par défaut, et c'est un changement pour myArquos : sa `Card`
  posait `shadowOpacity 0.04` sur chaque carte, donc sur chaque ligne de liste,
  et cent ombres douces font un écran gris. Le web n'en pose pas non plus.
  Une carte posée sur du blanc qui doit se détacher prend `shadowNative.card`
  par `style`, à l'appelant de le dire.

  Pas de `onPress` non plus : la fiche le dit, une carte cliquable dans une
  liste est un composant dédié (`EquipmentCard`, `SurveyCard`), pas une prop.
*/
export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />;
}

export function CardTitle({ style, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="small" style={[{ fontWeight: '700' }, style]} {...props} />;
}

export function CardDescription(props: Omit<TextProps, 'variant' | 'tone'>) {
  return <Text variant="caption" tone="muted" {...props} />;
}

export function CardContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />;
}

export function CardList(props: ViewProps) {
  return <View {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.footer, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    // Mobile seulement : sans bordure, grand arrondi, blanche sur le fond gris
    // des écrans (Louis, 07/10/2026). Pas d'ombre : `overflow: hidden`, qui
    // garde l'en-tête dans les coins, la couperait sur iOS.
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.bgMuted,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  content: {
    padding: spacing.base,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
});
