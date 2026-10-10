import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { radius } from '../../src/radius';
import { Icon } from '../icon/icon.native';
import { ThinkingDots } from '../thinking-dots/thinking-dots.native';

/*
  La marque de l'assistant, sur le téléphone (voir ai-mark.web.tsx). Le web la
  peint d'un dégradé du marine au bleu de la marque ; le mobile n'embarque pas
  de dégradé (aucune dépendance native de plus pour une tuile de 28 points), et
  la peint donc de l'aplat `primary`, le bleu où le dégradé finit.
*/

const TAILLES = {
  sm: { boite: 20, icone: 'xs' },
  md: { boite: 28, icone: 'sm' },
  lg: { boite: 40, icone: 'lg' },
} as const;

export interface AiMarkProps {
  size?: keyof typeof TAILLES;
  thinking?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AiMark({ size = 'md', thinking = false, style }: AiMarkProps) {
  const t = TAILLES[size];
  return (
    <View
      accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={[{ width: t.boite, height: t.boite, borderRadius: radius.control, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      {thinking
        ? <ThinkingDots size={t.icone} color={colors.textOnDark} />
        : <Icon role="aiAssist" size={t.icone} weight="active" color={colors.textOnDark} />}
    </View>
  );
}
