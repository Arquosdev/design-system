import * as React from 'react';
import { AccessibilityInfo, Animated, Easing, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { iconSize } from '../../src/icons';
import { CONSTELLATION } from '../icon/constellation';

/*
  L'assistant RÉFLÉCHIT, sur le mobile : la même constellation et la même vague
  que le web (thinking-dots.web.tsx), du centre vers le bord.

  Des vues et non `react-native-svg` : l'opacité et l'échelle d'une vue
  s'animent sur le fil NATIF (`useNativeDriver`), et continuent donc pendant
  que le fil JavaScript prépare la réponse — le moment exact où l'animation se
  montre. Quand le système demande moins de mouvement, les points restent
  immobiles.
*/

const DUREE = 1600;
const D_CENTRE = Math.SQRT1_2;
const distance = (x: number, y: number) => Math.hypot((x - 12) / 4.1, (y - 12) / 4.1);

function Point({ x, y, r, echelle, retard, couleur, immobile }: {
  x: number; y: number; r: number; echelle: number; retard: number; couleur: string; immobile: boolean;
}) {
  const valeur = React.useRef(new Animated.Value(immobile ? 1 : 0)).current;
  React.useEffect(() => {
    if (immobile) return;
    const boucle = Animated.loop(
      Animated.sequence([
        Animated.delay(retard),
        Animated.timing(valeur, { toValue: 1, duration: DUREE * 0.3, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(valeur, { toValue: 0, duration: DUREE * 0.7, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(Math.max(0, DUREE * 0.35 - retard)),
      ]),
    );
    boucle.start();
    return () => boucle.stop();
  }, [immobile, retard, valeur]);
  const d = r * 2 * echelle;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x * echelle - d / 2,
        top: y * echelle - d / 2,
        width: d,
        height: d,
        borderRadius: d / 2,
        backgroundColor: couleur,
        opacity: valeur.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
        transform: [{ scale: valeur.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.15] }) }],
      }}
    />
  );
}

export interface ThinkingDotsProps {
  /** Échelon de `iconSize`. Défaut `md` (18). */
  size?: keyof typeof iconSize;
  /** La couleur des points ; `colors.primary` par défaut. */
  color?: string;
  /** Ce qui est annoncé au lecteur d'écran. Vide, le dessin est décoratif. */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function ThinkingDots({ size = 'md', color = colors.primary, label, style }: ThinkingDotsProps) {
  const [immobile, setImmobile] = React.useState(false);
  React.useEffect(() => {
    let vivant = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => vivant && setImmobile(v));
    const abonnement = AccessibilityInfo.addEventListener('reduceMotionChanged', setImmobile);
    return () => { vivant = false; abonnement.remove(); };
  }, []);
  const cote = iconSize[size];
  const echelle = cote / 24;
  return (
    <View
      style={[{ width: cote, height: cote }, style]}
      {...(label
        ? { accessible: true, accessibilityRole: 'progressbar' as const, accessibilityLabel: label }
        : { accessible: false, importantForAccessibility: 'no-hide-descendants' as const })}
    >
      {CONSTELLATION.map((p) => (
        <Point
          key={`${p.x}-${p.y}-${immobile}`}
          {...p}
          echelle={echelle}
          retard={((distance(p.x, p.y) - D_CENTRE) * DUREE) / 4.5}
          couleur={color}
          immobile={immobile}
        />
      ))}
    </View>
  );
}
