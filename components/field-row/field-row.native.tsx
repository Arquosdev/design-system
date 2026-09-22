import * as React from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { controlHeight } from '../../src/control';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { fontFamilyNative, typography } from '../../src/typography';
import { Text } from '../text/text.native';
import {
  estVide as estVideLogique,
  texteDeValeur,
  TEXTE_SAUVEGARDE,
  TEXTE_STATUT,
  type FieldKind,
  type FieldOption,
  type FieldSauvegarde,
  type FieldStatut,
} from './field-row.logic';

export interface FieldRowProps {
  label: string;
  value: string | string[] | null;
  kind?: FieldKind;
  options?: readonly FieldOption[];
  /** Absent = lecture seule. */
  onSave?: (v: string | string[]) => void;
  statut?: FieldStatut;
  sauvegarde?: FieldSauvegarde;
  readOnly?: boolean;
  /** Dernière ligne d'un groupe : pas de filet en bas. */
  derniere?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TEINTE_STATUT: Record<FieldStatut, { fond: string; encre: string }> = {
  renseigne: { fond: colors.successBg, encre: colors.onSuccessBg },
  manquant: { fond: colors.dangerBg, encre: colors.onDangerBg },
  a_verifier: { fond: colors.warningBg, encre: colors.onWarningBg },
};

const TEINTE_SAUVEGARDE: Record<FieldSauvegarde, string> = {
  encours: colors.textMuted,
  ok: colors.success,
  echec: colors.danger,
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
  statut,
  sauvegarde,
  readOnly = false,
  derniere = false,
  style,
}: FieldRowProps) {
  const editable = !!onSave && !readOnly && kind !== 'multi';
  const [enSaisie, setEnSaisie] = React.useState(false);
  const [brouillon, setBrouillon] = React.useState('');
  const vide = estVideLogique(value);

  const ouvrir = () => {
    if (!editable) return;
    setBrouillon(vide ? '' : texteDeValeur(value));
    setEnSaisie(true);
  };

  const valider = (v: string) => {
    onSave?.(v);
    setEnSaisie(false);
  };

  return (
    <View style={[styles.ligne, !derniere && styles.filet, style]}>
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
              onPress={ouvrir}
              disabled={!editable}
              accessibilityRole={editable ? 'button' : undefined}
              accessibilityLabel={editable ? `${label} : ${texteDeValeur(value)}, modifier` : undefined}
              style={styles.zoneValeur}
            >
              <Text
                variant="small"
                tone={vide ? 'muted' : 'text'}
                style={[
                  styles.valeur,
                  editable && styles.editable,
                  editable && { borderBottomColor: vide ? colors.border : colors.textSubtle },
                ]}
              >
                {texteDeValeur(value)}
              </Text>
            </Pressable>

            {statut ? (
              <View style={[styles.pastille, { backgroundColor: TEINTE_STATUT[statut].fond }]}>
                <Text variant="caption" style={{ color: TEINTE_STATUT[statut].encre, fontWeight: '600' }}>
                  {TEXTE_STATUT[statut]}
                </Text>
              </View>
            ) : null}

            {sauvegarde ? (
              <Text variant="caption" style={{ color: TEINTE_SAUVEGARDE[sauvegarde], fontWeight: '700' }}>
                {TEXTE_SAUVEGARDE[sauvegarde]}
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
    paddingTop: spacing.xxs,
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
  valeur: {
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
