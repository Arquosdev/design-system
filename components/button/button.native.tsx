import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../../src/colors';
import { controlHeight } from '../../src/control';
import type { IconRole } from '../../src/icons';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Icon } from '../icon/icon.native';
import { Text } from '../text/text.native';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'default' | 'sm' | 'icon';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  /** Le libellé. Une chaîne : un bouton dit ce qu'il fait, en mots. */
  children: string;
  variant?: ButtonVariant;
  /**
   * `default` 44, `sm` 36, `icon` 44 de côté.
   *
   * **Ce sont les crans du MOBILE, pas ceux du web** (36 / 30 / 44), et la
   * divergence est écrite dans la fiche : 44 points est la cible tactile sous
   * laquelle on ne descend pas au doigt, et ces boutons se pressent dehors,
   * en gants, d'une main. Le corps du libellé suit : `body` (16) et non
   * `small` (14).
   */
  size?: ButtonSize;
  /** Une icône du vocabulaire, avant le libellé. */
  icon?: IconRole;
  /** L'action est en cours : le libellé cède la place à l'indicateur, la largeur ne bouge pas. */
  loading?: boolean;
  /** Le geste est impossible ici, et on peut dire pourquoi. Voir la fiche. */
  inactive?: boolean;
  /** La raison, lue par le lecteur d'écran. À l'écran, elle s'écrit à côté. */
  inactiveReason?: string;
  style?: StyleProp<ViewStyle>;
}

/*
  Les six variantes du web, aux mêmes teintes, lues dans `tokens.tailwind.css` :
  `secondary` est `infoBg` / `onInfoBg`, `outline` un gris pâle à bordure douce
  (07/10/2026), `destructive` le rouge `danger` sous du blanc.

  **L'état inactif est la même plaque grise pour toutes les variantes**, comme
  sur le web : un bouton indisponible doit cesser de ressembler à la variante
  qu'il était, sinon il continue de promettre son geste. `disabled` garde
  l'opacité à 0,5 — c'est le contrôle qui n'est pas là pour cet utilisateur,
  et dont il n'y a rien à dire.
*/
const VARIANTES: Record<ButtonVariant, { fond: ViewStyle; encre: string; presse: ViewStyle }> = {
  default: { fond: { backgroundColor: colors.primary }, encre: colors.textOnDark, presse: { backgroundColor: colors.primaryDark } },
  secondary: { fond: { backgroundColor: colors.infoBg }, encre: colors.onInfoBg, presse: { opacity: 0.8 } },
  // Gris pâle à bordure douce, comme sur le web (Louis, 07/10/2026).
  outline: {
    fond: { backgroundColor: colors.bgMuted, borderWidth: 1, borderColor: colors.borderSoft },
    encre: colors.text,
    presse: { backgroundColor: colors.borderSoft },
  },
  ghost: { fond: { backgroundColor: 'transparent' }, encre: colors.textMuted, presse: { backgroundColor: colors.bgMuted } },
  destructive: { fond: { backgroundColor: colors.danger }, encre: colors.textOnDark, presse: { opacity: 0.9 } },
  link: { fond: { backgroundColor: 'transparent', paddingHorizontal: 0 }, encre: colors.primary, presse: { opacity: 0.7 } },
};

export function Button({
  children,
  variant = 'default',
  size = 'default',
  icon,
  loading = false,
  inactive = false,
  inactiveReason,
  disabled,
  style,
  onPress,
  ...props
}: ButtonProps) {
  const v = VARIANTES[variant];
  const bloque = !!disabled || loading;
  const encre = inactive ? colors.onInactiveBg : v.encre;
  const petit = size === 'sm';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: bloque || inactive, busy: loading }}
      accessibilityHint={inactive ? inactiveReason : undefined}
      disabled={bloque}
      // Un bouton inactif RESTE pressable : il avale le geste, pour que le
      // lecteur d'écran puisse le trouver et lire sa raison.
      onPress={inactive ? undefined : onPress}
      {...props}
      style={({ pressed }) => [
        styles.bouton,
        petit ? styles.petit : styles.normal,
        size === 'icon' && styles.carre,
        inactive ? styles.inactif : v.fond,
        pressed && !bloque && !inactive && v.presse,
        bloque && styles.desactive,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={encre} />
      ) : (
        <>
          {icon ? <Icon role={icon} size={petit ? 'sm' : 'md'} color={encre} /> : null}
          <Text
            variant={petit ? 'small' : 'body'}
            numberOfLines={1}
            style={[
              { color: encre, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
              variant === 'link' && styles.souligne,
            ]}
          >
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.control,
  },
  normal: { minHeight: controlHeight.lg, paddingHorizontal: spacing.base },
  petit: { minHeight: controlHeight.md, paddingHorizontal: spacing.md },
  carre: { width: controlHeight.lg, paddingHorizontal: 0 },
  inactif: {
    backgroundColor: colors.inactiveBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  desactive: { opacity: 0.5 },
  souligne: { textDecorationLine: 'underline' },
});
