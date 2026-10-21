import * as React from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { controlHeight } from '../../src/control';
import type { IconRole } from '../../src/icons';
import { radius } from '../../src/radius';
import { debordTactile } from '../button/button.logic';
import { Icon } from '../icon/icon.native';

export type IconButtonVariant = 'outline' | 'soft' | 'ghost' | 'solid' | 'surface';
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
  /**
   * Un rond plutôt qu'un carré arrondi : à côté d'un avatar, dans l'en-tête
   * d'une liste, le « + » carré détonnait (Louis, 12/10/2026 : « pas ouf »).
   */
  rond?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ENCRE: Record<IconButtonVariant, string> = {
  outline: colors.textMuted,
  soft: colors.onInfoBg,
  ghost: colors.textMuted,
  // L'action principale d'un écran, pleine : la même que `solid` sur le web.
  solid: colors.textOnDark,
  // Blanc sans bordure, sur le fond gris d'un écran : comme le champ de
  // recherche voisin (Louis, 12/10/2026, le bouton carte « rond lui aussi »).
  surface: colors.text,
};

export function IconButton({
  label,
  icon,
  variant = 'outline',
  size = 'md',
  rond = false,
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
      hitSlop={debordTactile(cote)}
      {...props}
      style={({ pressed }) => [
        styles.bouton,
        { width: cote, height: cote },
        rond && { borderRadius: cote / 2 },
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
  solid: { backgroundColor: colors.primary },
  solidPresse: { backgroundColor: colors.primaryDark },
  surface: { backgroundColor: colors.bg },
  surfacePresse: { backgroundColor: colors.bgMuted },
  inactif: { opacity: 0.5 },
});
