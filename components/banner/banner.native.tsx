import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import type { IconRole } from '../../src/icons';
import { spacing } from '../../src/spacing';
import { Icon } from '../icon/icon.native';
import { Text } from '../text/text.native';

export type BannerTone = 'info' | 'warning' | 'danger';

export interface BannerProps {
  tone?: BannerTone;
  icon?: IconRole;
  /** Ce qu'on peut faire — un bouton `ghost`, un lien. */
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Les paires d'état, jamais dissociées : le fond et son encre vont ensemble.
const TONES: Record<BannerTone, { background: string; ink: string }> = {
  info: { background: colors.infoBg, ink: colors.onInfoBg },
  warning: { background: colors.warningBg, ink: colors.onWarningBg },
  danger: { background: colors.dangerBg, ink: colors.onDangerBg },
};

export function Banner({ tone = 'info', icon, action, children, style }: BannerProps) {
  const { background, ink } = TONES[tone];
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.bandeau, { backgroundColor: background }, style]}
    >
      {icon ? <Icon role={icon} size="sm" color={ink} /> : null}
      <Text variant="small" style={[styles.message, { color: ink, fontWeight: '500' }]}>
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
