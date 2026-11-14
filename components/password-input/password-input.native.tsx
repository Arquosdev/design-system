import * as React from 'react';
import {
  Pressable, StyleSheet, TextInput, View,
  type StyleProp, type TextInputProps, type ViewStyle,
} from 'react-native';

import { colors } from '../../src/colors';
import { touchHeight } from '../../src/control';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { fontFamilyNative, typography } from '../../src/typography';
import { Icon } from '../icon/icon.native';
import { passwordToggleLabel } from './password-input.logic';

export interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry' | 'style'> {
  /** La valeur est refusée : bordure `danger`. Le pendant d'`aria-invalid`. */
  invalid?: boolean;
  /** Le style de l'ENVELOPPE, celle qui porte la bordure — pas du champ, comme sur le web. */
  style?: StyleProp<ViewStyle>;
}

/*
  Le champ de mot de passe du web, aux cotes du mobile (recette V2 du
  13/11/2026 : « ajouter l'œil pour révéler le mot de passe sur myArquos 2 »).

  **La même construction que sur le web** : la bordure est sur l'enveloppe, le
  champ n'en a aucune, et l'œil partage cette bordure au lieu de flotter
  par-dessus. Les cotes sont celles d'`Input` natif — 44 de haut, pilule,
  corps `body` — pour que le mot de passe s'aligne sur l'email juste au-dessus.

  **L'œil fait 44 × 44, la cible tactile**, là où le web se contente de 34 :
  la fiche le demandait (« une implémentation mobile devra l'agrandir »). Il
  n'a pas de filet vertical : sur une pilule, un trait droit à 44 points du
  bord coupait la courbe.

  **L'état « en clair » repart FAUX à chaque montage**, et rien ne le mémorise :
  s'en souvenir afficherait le mot de passe de quelqu'un sur un téléphone
  partagé, la fois suivante, sans qu'il l'ait demandé.
*/
export const PasswordInput = React.forwardRef<TextInput, PasswordInputProps>(function PasswordInput(
  { invalid = false, editable = true, style, onFocus, onBlur, ...props },
  ref,
) {
  const [revealed, setRevealed] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  return (
    <View
      style={[
        styles.enveloppe,
        focus && styles.focus,
        invalid && styles.invalide,
        !editable && styles.inactif,
        style,
      ]}
    >
      <TextInput
        ref={ref}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        editable={editable}
        accessibilityState={{ disabled: !editable }}
        {...(invalid ? { accessibilityInvalid: true } : {})}
        // Le clavier ne propose ni correction ni majuscule sur un mot de passe,
        // en clair comme masqué.
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={(e) => {
          setFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
        {...props}
        secureTextEntry={!revealed}
        style={[styles.champ, focus && styles.champFocus]}
      />
      {/*
        `disabled` suit le champ : un œil actionnable sur un champ grisé promet
        de révéler une saisie qu'on ne peut pas faire. `accessibilityState.selected`
        est le pendant d'`aria-pressed` : sans lui, un lecteur d'écran annonce
        l'action sans dire si elle est déjà faite.
      */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={passwordToggleLabel(revealed)}
        accessibilityState={{ disabled: !editable, selected: revealed }}
        disabled={!editable}
        onPress={() => setRevealed((v) => !v)}
        style={({ pressed }) => [styles.oeil, pressed && styles.oeilPresse]}
      >
        <Icon role={revealed ? 'hidePassword' : 'revealPassword'} size="md" color={colors.textMuted} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  enveloppe: {
    height: touchHeight.md,
    width: '100%',
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  focus: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  invalide: {
    borderColor: colors.danger,
  },
  inactif: {
    opacity: 0.5,
  },
  champ: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    paddingLeft: spacing.base,
    paddingRight: spacing.xs,
    paddingVertical: 0,
    fontSize: typography.body.fontSize,
    fontFamily: fontFamilyNative[400],
    color: colors.text,
  },
  // La bordure s'épaissit d'un point au focus : le retrait recule d'autant,
  // pour que le texte ne saute pas (comme `Input`).
  champFocus: {
    paddingLeft: spacing.base - 1,
  },
  oeil: {
    width: touchHeight.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oeilPresse: {
    backgroundColor: colors.bgMuted,
  },
});
