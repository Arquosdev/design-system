import * as React from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { controlHeight } from '../../src/control';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { fontFamilyNative, typography } from '../../src/typography';
import { Text } from '../text/text.native';
import {
  isEmpty as estVideLogique,
  valueText,
  SAVE_TEXT,
  STATUS_TEXT,
  type FieldKind,
  type FieldOption,
  type FieldSave,
  type FieldStatus,
} from './field-row.logic';

export interface FieldRowProps {
  label: string;
  value: string | string[] | null;
  kind?: FieldKind;
  options?: readonly FieldOption[];
  /** Absent = lecture seule. */
  onSave?: (v: string | string[]) => void;
  /**
   * La valeur MÈNE quelque part : une adresse ouvre Plans, un téléphone
   * compose, un email écrit.
   *
   * **Mobile seulement, et c'est la nature du support.** Sur le web, ce serait
   * un lien — la valeur porterait un `href` et le navigateur ferait le reste.
   * React Native n'a pas de lien : c'est l'appelant qui ouvre l'URL, donc le
   * composant a besoin de savoir que la valeur agit pour la peindre comme
   * telle. `onSave` et `onPress` s'excluent : une valeur qui mène ailleurs ne
   * s'édite pas sur place.
   */
  onPress?: () => void;
  status?: FieldStatus;
  save?: FieldSave;
  readOnly?: boolean;
  /** Dernière ligne d'un groupe : pas de filet en bas. */
  last?: boolean;
  style?: StyleProp<ViewStyle>;
}

const STATUS_TINT: Record<FieldStatus, { fond: string; encre: string }> = {
  filled: { fond: colors.successBg, encre: colors.onSuccessBg },
  missing: { fond: colors.dangerBg, encre: colors.onDangerBg },
  to_check: { fond: colors.warningBg, encre: colors.onWarningBg },
};

const SAVE_TINT: Record<FieldSave, string> = {
  saving: colors.textMuted,
  ok: colors.success,
  error: colors.danger,
};

/**
 * Une ligne « libellé → valeur », éditable sur place.
 *
 * **Deux divergences avec le web, et la première est structurelle.** Là-bas, la
 * colonne du libellé fait 190 px fixes ; ici elle prend 40 % d'une largeur de
 * téléphone, bornée à 150 — 190 sur un écran de 393 points ne laisserait pas de
 * quoi lire une adresse. La valeur passe à la ligne dans sa colonne plutôt que
 * de pousser le libellé.
 *
 * Et l'édition s'ouvre au TOUCHER, sans survol pour l'annoncer : le
 * soulignement pointillé porte donc seul le signal « ceci se corrige », ce qui
 * lui donne plus de poids qu'en web. Une valeur non éditable ne le porte pas.
 *
 * `multi` n'a pas d'éditeur natif : la valeur se lit, la correction se fait
 * ailleurs. À écrire le jour où un écran mobile en a besoin.
 */
export function FieldRow({
  label,
  value,
  kind = 'text',
  options = [],
  onSave,
  onPress,
  status,
  save,
  readOnly = false,
  last = false,
  style,
}: FieldRowProps) {
  const editable = !!onSave && !onPress && !readOnly && kind !== 'multi';
  const [enSaisie, setEnSaisie] = React.useState(false);
  const [brouillon, setBrouillon] = React.useState('');
  const vide = estVideLogique(value);

  const ouvrir = () => {
    if (!editable) return;
    setBrouillon(vide ? '' : valueText(value));
    setEnSaisie(true);
  };

  const valider = (v: string) => {
    onSave?.(v);
    setEnSaisie(false);
  };

  return (
    <View style={[styles.ligne, !last && styles.filet, style]}>
      <Text variant="small" tone="muted" style={styles.libelle}>
        {label}
      </Text>

      <View style={styles.colonneValeur}>
        {enSaisie && kind !== 'choice' ? (
          <TextInput
            autoFocus
            value={brouillon}
            onChangeText={setBrouillon}
            onBlur={() => valider(brouillon)}
            onSubmitEditing={() => valider(brouillon)}
            keyboardType={kind === 'number' ? 'numeric' : 'default'}
            accessibilityLabel={label}
            selectionColor={colors.primary}
            style={styles.saisie}
          />
        ) : enSaisie ? (
          <View style={styles.choix}>
            {options.map((o) => (
              <Pressable
                key={o.value}
                onPress={() => valider(o.value)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.option, pressed && styles.optionPressee]}
              >
                <Text variant="small">{o.label}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.lecture}>
            <Pressable
              onPress={onPress ?? ouvrir}
              disabled={!editable && !onPress}
              accessibilityRole={editable || onPress ? 'button' : undefined}
              accessibilityLabel={
                onPress
                  ? `${label} : ${valueText(value)}, ouvrir`
                  : editable
                    ? `${label} : ${valueText(value)}, modifier`
                    : undefined
              }
              style={styles.zoneValeur}
            >
              <Text
                variant="small"
                tone={onPress ? 'primary' : vide ? 'muted' : 'text'}
                style={[
                  styles.value,
                  editable && styles.editable,
                  editable && { borderBottomColor: vide ? colors.border : colors.textSubtle },
                ]}
              >
                {valueText(value)}
              </Text>
            </Pressable>

            {status ? (
              <View style={[styles.pastille, { backgroundColor: STATUS_TINT[status].fond }]}>
                <Text variant="caption" style={{ color: STATUS_TINT[status].encre, fontWeight: '600' }}>
                  {STATUS_TEXT[status]}
                </Text>
              </View>
            ) : null}

            {save ? (
              <Text variant="caption" style={{ color: SAVE_TINT[save], fontWeight: '700' }}>
                {SAVE_TEXT[save]}
              </Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  filet: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  libelle: {
    width: '40%',
    maxWidth: 150,
  },
  colonneValeur: {
    flex: 1,
    minWidth: 0,
  },
  lecture: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  zoneValeur: {
    flexShrink: 1,
  },
  value: {
    fontWeight: '500',
  },
  // Le soulignement pointillé : LE signal « cette valeur se corrige ». Sans
  // survol pour l'annoncer, il porte seul cette information sur mobile.
  editable: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    paddingBottom: 1,
  },
  pastille: {
    borderRadius: radius.control,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  saisie: {
    height: controlHeight.md,
    borderRadius: radius.control,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 0,
    fontSize: typography.small.fontSize,
    fontFamily: fontFamilyNative[400],
    color: colors.text,
  },
  choix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  option: {
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  optionPressee: {
    backgroundColor: colors.bgMuted,
  },
});
