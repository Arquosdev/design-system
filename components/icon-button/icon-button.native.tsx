import * as React from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { controlHeight } from '../../src/control';
import type { IconRole } from '../../src/icons';
import { radius } from '../../src/radius';
import { Icon } from '../icon/icon.native';

export type IconButtonVariant = 'outline' | 'soft' | 'ghost';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  /** **Obligatoire.** Le nom accessible : un bouton sans texte est muet sans lui. */
  label: string;
  /**
   * Le rôle de l'icône, et non un nœud comme sur le web : là-bas l'icône
   * hérite sa couleur du bouton (`currentColor`), ici c'est le bouton qui la
   * peint — encre mutée sur `outline` et `ghost`, `onInfoBg` sur `soft`.
   */
  icon: IconRole;
  variant?: IconButtonVariant;
  /** `sm` 36, `md` 44 — les crans du mobile, ceux du `Button` natif. */
  size?: IconButtonSize;
  style?: StyleProp<ViewStyle>;
}

const ENCRE: Record<IconButtonVariant, string> = {
  outline: colors.textMuted,
  soft: colors.onInfoBg,
  ghost: colors.textMuted,
};

export function IconButton({
  label,
  icon,
  variant = 'outline',
  size = 'md',
  disabled,
  style,
  ...props
}: IconButtonProps) {
  const cote = size === 'sm' ? controlHeight.md : controlHeight.lg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={size === 'sm' ? 4 : 0}
      {...props}
      style={({ pressed }) => [
        styles.bouton,
        { width: cote, height: cote },
        styles[variant],
        pressed && !disabled && styles[`${variant}Presse` as const],
        disabled && styles.inactif,
        style,
      ]}
    >
      <Icon role={icon} size={size === 'sm' ? 'sm' : 'md'} color={ENCRE[variant]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control,
    flexShrink: 0,
  },
  outline: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg },
  outlinePresse: { backgroundColor: colors.bgMuted },
  soft: { backgroundColor: colors.infoBg },
  softPresse: { opacity: 0.8 },
  ghost: { backgroundColor: 'transparent' },
  ghostPresse: { backgroundColor: colors.bgMuted },
  inactif: { opacity: 0.5 },
});
