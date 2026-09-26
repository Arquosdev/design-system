import * as React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { colors } from '../../src/colors';
import { fontFamilyMonoNative, fontFamilyNative, typography, type TypographyToken } from '../../src/typography';

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
  /**
   * Composé en DM Mono : un numéro d'équipement, une référence, comme une
   * plaque (design-eu). Deux graisses : 400, et 500 pour tout ce qui est plus
   * gras — DM Mono n'en a pas d'autre, et un faux gras serait flou.
   */
  mono?: boolean;
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
  { variant = 'body', tone = 'text', mono = false, style, ...props },
  ref,
) {
  const preset = typography[variant];
  const plat = StyleSheet.flatten(style) as TextStyle | undefined;
  const poids = plat?.fontWeight ?? preset.fontWeight;

  /*
    **Une taille imposée sans interligne emporte l'interligne avec elle.**

    Sans ça, un appelant qui écrit `fontSize: 32` dans son `style` garde
    l'interligne du préréglage — 22,4 pour `body` — et son texte se fait
    ROGNER par le haut. Mesuré le 22/09/2026 sur les titres « Carte » et
    « Dépannage » de myArquos, dont la moitié supérieure des lettres avait
    disparu.

    Le rapport du préréglage est conservé : c'est lui qui fait l'air entre les
    lignes, et il ne dépend pas de la taille. Un appelant qui donne les deux
    garde évidemment les siens.
  */
  const rapport = preset.lineHeight / preset.fontSize;
  const interligne =
    plat?.lineHeight ??
    (plat?.fontSize ? Math.round(plat.fontSize * rapport) : preset.lineHeight);

  return (
    <RNText
      ref={ref}
      {...props}
      style={[
        { fontSize: preset.fontSize, color: TONS[tone] },
        style,
        // Après `style`, exprès : c'est la famille qui porte la graisse, et un
        // `fontWeight` laissé en place ferait synthétiser un second gras.
        // L'interligne aussi, puisqu'il se déduit de la taille finale.
        {
          lineHeight: interligne,
          fontFamily: mono
            ? fontFamilyMonoNative[Number(poids === 'bold' ? 700 : poids ?? 400) > 400 ? 500 : 400]
            : famille(poids),
          fontWeight: 'normal',
        },
      ]}
    />
  );
});
