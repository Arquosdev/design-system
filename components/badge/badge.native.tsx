import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Text } from '../text/text.native';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info'
  | 'muted';

export interface BadgeProps {
  variant?: BadgeVariant;
  /** Le mot. Un badge de plus de trois mots est une phrase : la mettre dans le texte. */
  children: string;
  style?: StyleProp<ViewStyle>;
}

/*
  Les huit registres du web, aux mêmes teintes. Les rôles shadcn se lisent dans
  `dist/tokens.tailwind.css` : `secondary` est la paire `infoBg` / `onInfoBg`,
  `destructive` le rouge `danger` sous une encre blanche, `muted` la paire
  `bgMuted` / `textMuted`. Les quatre teintes d'état vont par paire, jamais
  dissociées.

  C'est ce qui remplace `StatusPill`, `Tag` et `OpportunityTypePill` de
  myArquos, qui composaient chacune leurs couleurs depuis la palette brute —
  orange 50 sur orange 500 pour « Assigné », par exemple, soit 1,9 pour 1.
*/
const REGISTRES: Record<BadgeVariant, { fond: string; encre: string; bordure: string }> = {
  default: { fond: colors.primary, encre: colors.textOnDark, bordure: 'transparent' },
  secondary: { fond: colors.infoBg, encre: colors.onInfoBg, bordure: 'transparent' },
  destructive: { fond: colors.dangerBg, encre: colors.onDangerBg, bordure: 'transparent' },
  outline: { fond: 'transparent', encre: colors.textMuted, bordure: colors.border },
  success: { fond: colors.successBg, encre: colors.onSuccessBg, bordure: 'transparent' },
  warning: { fond: colors.warningBg, encre: colors.onWarningBg, bordure: 'transparent' },
  info: { fond: colors.infoBg, encre: colors.onInfoBg, bordure: 'transparent' },
  muted: { fond: colors.bgMuted, encre: colors.textMuted, bordure: 'transparent' },
};

export function Badge({ variant = 'muted', children, style }: BadgeProps) {
  const { fond, encre, bordure } = REGISTRES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: fond, borderColor: bordure }, style]}>
      <Text variant="caption" numberOfLines={1} style={{ color: encre, fontWeight: '600' }}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: radius.full, // En pilule sur le mobile seulement (07/10/2026).
    borderWidth: 1,
    // Une pilule demande un peu d'air sur les côtés.
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
});
