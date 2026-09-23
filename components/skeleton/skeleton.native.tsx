import * as React from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { radius } from '../../src/radius';

export interface SkeletonProps {
  /** Bloc circulaire — pastille, avatar. */
  round?: boolean;
  /** La **taille se donne ici** : `{ width: 120, height: 16 }`. */
  style?: StyleProp<ViewStyle>;
}

/*
  Une pulsation d'opacité et non un dégradé qui glisse : le second demande un
  `LinearGradient` par squelette et une largeur mesurée, ce qui sur un Android
  d'entrée de gamme saccade assez pour trahir le but. C'est le `animate-pulse`
  du web, avec la même teinte.
*/
export function Skeleton({ round = false, style }: SkeletonProps) {
  const opacite = React.useRef(new Animated.Value(0.45)).current;
  React.useEffect(() => {
    const boucle = Animated.loop(
      Animated.sequence([
        Animated.timing(opacite, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacite, {
          toValue: 0.45,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    boucle.start();
    return () => boucle.stop();
  }, [opacite]);

  return (
    <Animated.View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        { backgroundColor: colors.bgMuted, borderRadius: round ? radius.full : radius.sm, opacity: opacite },
        style,
      ]}
    />
  );
}
