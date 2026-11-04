import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { tagPalette, tagTone, type TagTone } from '../../src/colors';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Text } from '../text/text.native';

export interface TagProps {
  /** Le mot. */
  children: string;
  /** La teinte ; sans elle, elle se déduit du mot. */
  tone?: TagTone;
  style?: StyleProp<ViewStyle>;
}

/** Une catégorie : le mot dans l'encre de sa teinte, sur le fond de la même teinte, comme sur le web. */
export function Tag({ children, tone, style }: TagProps) {
  const teinte = tagPalette[tone ?? tagTone(children)];
  return (
    <View style={[styles.tag, { backgroundColor: teinte.bg }, style]}>
      <Text variant="caption" numberOfLines={1} style={[styles.mot, { color: teinte.ink }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: radius.control,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  mot: { fontWeight: '600' },
});
