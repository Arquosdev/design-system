import * as React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { colors } from '../../src/colors';
import { fontFamilyNative, typography, type TypographyToken } from '../../src/typography';

export type TextTone = 'text' | 'muted' | 'onDark' | 'primary' | 'danger' | 'success' | 'warning';

/*
  Pas de `subtle` : `textSubtle` n'est pas une couleur de texte (3,14 sur
  blanc). `warning` prend `onWarningBg` et non `warning` — l'orange de marque
  fait 1,9 pour 1 sur blanc, l'orange 700 en fait 4,6.
*/
const TONS: Record<TextTone, string> = {
  text: colors.text,
  muted: colors.textMuted,
  onDark: colors.textOnDark,
  primary: colors.primary,
  danger: colors.danger,
  success: colors.success,
  warning: colors.onWarningBg,
};

export interface TextProps extends RNTextProps {
  /** Le préréglage typographique. `body` par défaut. */
  variant?: TypographyToken;
  /** La couleur, par son rôle. `text` par défaut. */
  tone?: TextTone;
}

/*
  La graisse choisit le FICHIER de police, et c'est tout l'objet de ce
  composant : DM Sans vient en six fichiers, et React Native ne sait pas passer
  de l'un à l'autre par `fontWeight`. Un `fontWeight: '600'` sur
  `DMSans_400Regular` fait synthétiser un faux gras par l'OS — plus épais, plus
  flou, différent d'une plateforme à l'autre.
*/
function famille(poids: TextStyle['fontWeight']): string {
  const n = poids === 'bold' ? 700 : poids === 'normal' || poids === undefined ? 400 : Number(poids);
  return fontFamilyNative[n as keyof typeof fontFamilyNative] ?? fontFamilyNative[400];
}

export const Text = React.forwardRef<RNText, TextProps>(function Text(
  { variant = 'body', tone = 'text', style, ...props },
  ref,
) {
  const preset = typography[variant];
  const plat = StyleSheet.flatten(style) as TextStyle | undefined;
  const poids = plat?.fontWeight ?? preset.fontWeight;
  return (
    <RNText
      ref={ref}
      {...props}
      style={[
        { fontSize: preset.fontSize, lineHeight: preset.lineHeight, color: TONS[tone] },
        style,
        // Après `style`, exprès : c'est la famille qui porte la graisse, et un
        // `fontWeight` laissé en place ferait synthétiser un second gras.
        { fontFamily: famille(poids), fontWeight: 'normal' },
      ]}
    />
  );
});
