import * as React from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { colors } from '../../src/colors';
import { controlHeight } from '../../src/control';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { fontFamilyNative, typography } from '../../src/typography';

export interface InputProps extends TextInputProps {
  /** La valeur est refusée : bordure `danger`. Le pendant d'`aria-invalid`. */
  invalid?: boolean;
}

/*
  Le champ du web, aux cotes du mobile.

  **Deux divergences, toutes deux écrites dans la fiche.** La hauteur est
  `controlHeight.lg` (44) et non 36 : c'est la cible tactile sous laquelle on
  ne descend pas au doigt, et c'est la hauteur du `Button` natif, pour que les
  deux s'alignent côte à côte comme sur le web. Le corps est `body` (16) et non
  `small` (14) : on tape dehors, en marchant, et le texte qu'on tape est celui
  qu'on relit le moins bien.

  Le reste est identique : bordure `border`, `primary` au focus, `danger`
  quand la valeur est refusée, arrondi `control`, retrait `sm`.
*/
export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  { invalid = false, editable = true, style, onFocus, onBlur, ...props },
  ref,
) {
  const [focus, setFocus] = React.useState(false);
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={colors.textMuted}
      selectionColor={colors.primary}
      editable={editable}
      accessibilityState={{ disabled: !editable }}
      {...(invalid ? { accessibilityInvalid: true } : {})}
      onFocus={(e) => {
        setFocus(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocus(false);
        onBlur?.(e);
      }}
      {...props}
      style={[
        styles.champ,
        focus && styles.focus,
        invalid && styles.invalide,
        !editable && styles.inactif,
        style,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  champ: {
    height: controlHeight.lg,
    width: '100%',
    minWidth: 0,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 0,
    fontSize: typography.body.fontSize,
    fontFamily: fontFamilyNative[400],
    color: colors.text,
  },
  focus: {
    borderColor: colors.primary,
    borderWidth: 2,
    // La bordure s'épaissit d'un point : le retrait recule d'autant, pour que
    // le texte ne saute pas au focus.
    paddingHorizontal: spacing.sm - 1,
  },
  invalide: {
    borderColor: colors.danger,
  },
  inactif: {
    opacity: 0.5,
  },
});
