import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, tagPalette, tagTone, type TagTone } from '../../src/colors';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Text } from '../text/text.native';

export interface TagProps {
  /** Le mot. */
  children: string;
  /** La teinte du point ; sans elle, elle se déduit du mot. */
  tone?: TagTone;
  style?: StyleProp<ViewStyle>;
}

/** Une catégorie : un point de couleur et le mot, sur un fond neutre, comme sur le web. */
export function Tag({ children, tone, style }: TagProps) {
  const encre = tagPalette[tone ?? tagTone(children)].ink;
  return (
    <View style={[styles.tag, style]}>
      <View style={[styles.point, { backgroundColor: encre }]} />
      <Text variant="caption" numberOfLines={1} style={styles.mot}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  point: { width: 6, height: 6, borderRadius: radius.full },
  mot: { color: colors.text, fontWeight: '500' },
});
