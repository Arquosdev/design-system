import * as React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { shadowNative } from '../../src/elevation';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Text } from '../text/text.native';

export interface Segment {
  id: string;
  label: string;
  count?: number | string;
}

export interface SegmentedTabsProps {
  segments: readonly Segment[];
  value: string;
  onChange: (id: string) => void;
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
export function SegmentedTabs({ segments, value, onChange, ariaLabel, style }: SegmentedTabsProps) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel={ariaLabel} style={[styles.piste, style]}>
      {segments.map((segment) => {
        const actif = segment.id === value;
        return (
          <Pressable
            key={segment.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: actif }}
            accessibilityLabel={
              segment.count !== undefined && segment.count !== ''
                ? `${segment.label}, ${segment.count}`
                : segment.label
            }
            onPress={() => onChange(segment.id)}
            style={[styles.segment, actif && styles.segmentActif]}
          >
            <Text
              variant="small"
              tone={actif ? 'text' : 'muted'}
              numberOfLines={1}
              /*
                **Plus d'`adjustsFontSizeToFit`.** Il réduisait le libellé
                bien en deçà des 85 % annoncés quand la piste était étroite —
                « Équipements » devenait illisible à côté de « Relevés » sur
                la carte de myArquos, mesuré le 22/09/2026. Un libellé qui ne
                tient pas se coupe : c'est visible, donc corrigeable. Un
                libellé qui rétrécit en silence ne l'est pas.
              */
              style={[styles.libelle, { fontWeight: actif ? '600' : '500' }]}
            >
              {segment.label}
            </Text>
            {segment.count !== undefined && segment.count !== '' ? (
              <Text
                variant="small"
                tone={actif ? 'primary' : 'muted'}
                style={[styles.count, { fontWeight: actif ? '600' : '500' }]}
              >
                {segment.count}
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
    // Un cran plus soutenu que la toile grise des listes (design-eu).
    backgroundColor: colors.inactiveBg,
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
  libelle: {
    flexShrink: 1,
  },
  count: {
    fontVariant: ['tabular-nums'],
  },
});
