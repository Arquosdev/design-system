import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '../../src/colors';
import { shadowNative } from '../../src/elevation';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Text, type TextProps } from '../text/text.native';

/*
  Les mêmes sept parties que `card.web.tsx`, avec les mêmes tokens : contour
  `borderSoft` et arrondi `md`, en-tête teinté `bgMuted` sous un filet, contenu
  à `base`, liste sans retrait, pied sous un filet.

  L'ombre `block`, la même que sur le web, depuis le 13/10/2026 (Thomas : faire
  ressortir les cartes). Deux couches pour la porter : l'ombre dehors, le
  rognage dedans, sans quoi `overflow: hidden` la couperait sur iOS. Une ligne
  de liste n'est pas une `Card` : elle a son composant (`EquipmentCard`…).

  Pas de `onPress` non plus : la fiche le dit, une carte cliquable dans une
  liste est un composant dédié (`EquipmentCard`, `SurveyCard`), pas une prop.
*/
export function Card({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.ombre, style]} {...props}>
      <View style={styles.card}>{children}</View>
    </View>
  );
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
  ombre: {
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    ...shadowNative.block,
  },
  card: {
    flexGrow: 1,
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
