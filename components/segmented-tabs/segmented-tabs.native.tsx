import * as React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { shadowNative } from '../../src/elevation';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Text } from '../text/text.native';

export interface Segment {
  cle: string;
  label: string;
  compteur?: number | string;
}

export interface SegmentedTabsProps {
  segments: readonly Segment[];
  valeur: string;
  onChanger: (cle: string) => void;
  /** Ce que le groupe sépare, pour l'annoncer. Même nom que sur le web. */
  ariaLabel: string;
  style?: StyleProp<ViewStyle>;
}

/*
  La forme du web, et plus celle de Bubble : une piste `bgMuted`, le segment
  actif en blanc détaché par l'ombre `card`, les autres en `textMuted`. Le bleu
  plein qui glissait sous l'onglet actif est parti — il faisait du sélecteur de
  vue la chose la plus voyante de l'écran, au-dessus du bouton d'action, et le
  bleu est réservé à ce qu'on FAIT et à l'entrée de navigation active.

  Chaque segment prend la même largeur (`flex: 1`), quelle que soit la
  longueur de son libellé : sinon la piste tressaute d'un onglet à l'autre.
  Le libellé ne se coupe pas en deux lignes ; il rétrécit d'abord.
*/
export function SegmentedTabs({ segments, valeur, onChanger, ariaLabel, style }: SegmentedTabsProps) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel={ariaLabel} style={[styles.piste, style]}>
      {segments.map((segment) => {
        const actif = segment.cle === valeur;
        return (
          <Pressable
            key={segment.cle}
            accessibilityRole="tab"
            accessibilityState={{ selected: actif }}
            accessibilityLabel={
              segment.compteur !== undefined && segment.compteur !== ''
                ? `${segment.label}, ${segment.compteur}`
                : segment.label
            }
            onPress={() => onChanger(segment.cle)}
            style={[styles.segment, actif && styles.segmentActif]}
          >
            <Text
              variant="small"
              tone={actif ? 'text' : 'muted'}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              style={{ fontWeight: actif ? '600' : '500' }}
            >
              {segment.label}
            </Text>
            {segment.compteur !== undefined && segment.compteur !== '' ? (
              <Text
                variant="small"
                tone={actif ? 'primary' : 'muted'}
                style={[styles.compteur, { fontWeight: actif ? '600' : '500' }]}
              >
                {segment.compteur}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  piste: {
    flexDirection: 'row',
    gap: spacing.xxs,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
    padding: spacing.xxs,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.control,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  segmentActif: {
    backgroundColor: colors.bg,
    ...shadowNative.card,
  },
  compteur: {
    fontVariant: ['tabular-nums'],
  },
});
