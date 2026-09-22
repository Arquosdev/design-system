import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import type { IconRole } from '../../src/icons';
import { spacing } from '../../src/spacing';
import { Icon } from '../icon/icon.native';
import { Text } from '../text/text.native';

export type BannerTon = 'info' | 'attention' | 'danger';

export interface BannerProps {
  ton?: BannerTon;
  icone?: IconRole;
  /** Ce qu'on peut faire — un bouton `ghost`, un lien. */
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Les paires d'état, jamais dissociées : le fond et son encre vont ensemble.
const TONS: Record<BannerTon, { fond: string; encre: string }> = {
  info: { fond: colors.infoBg, encre: colors.onInfoBg },
  attention: { fond: colors.warningBg, encre: colors.onWarningBg },
  danger: { fond: colors.dangerBg, encre: colors.onDangerBg },
};

export function Banner({ ton = 'info', icone, action, children, style }: BannerProps) {
  const { fond, encre } = TONS[ton];
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.bandeau, { backgroundColor: fond }, style]}
    >
      {icone ? <Icon role={icone} size="sm" color={encre} /> : null}
      <Text variant="small" style={[styles.message, { color: encre, fontWeight: '500' }]}>
        {children}
      </Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  bandeau: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  message: {
    flex: 1,
    minWidth: 0,
  },
});
