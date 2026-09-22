// Point d'entrée des composants React Native.
//
//   import { Button, Card, Text } from '@arquos/design-system/native';
//
// Le pendant de `web.ts`, aux mêmes noms : `CONVERGENCE.md` promet une seule
// bibliothèque de noms et deux implémentations. Toujours importer d'ici, jamais
// un fichier de composant directement.
//
// Les tokens s'importent séparément — ils ne dépendent pas de React :
//   import { colors, spacing } from '@arquos/design-system';
//
// **Ces fichiers ne sont pas vérifiés par le `tsc` du design system**, qui n'a
// pas `react-native` dans ses dépendances (tsconfig les exclut). C'est le `tsc`
// de l'app qui les consomme qui les vérifie, en suivant le lien de fichier.
// Le jour où le design system prend `react-native` en dépendance de
// développement, l'exclusion tombe.

export { Text, type TextProps, type TextTone } from './components/text/text.native';
export { Icon, type IconProps } from './components/icon/icon.native';
export { type IconRole, type IconName } from './src/icons';
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './components/button/button.native';
export {
  IconButton,
  type IconButtonProps,
  type IconButtonVariant,
  type IconButtonSize,
} from './components/icon-button/icon-button.native';
export { Badge, type BadgeProps, type BadgeVariant } from './components/badge/badge.native';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardList,
  CardFooter,
} from './components/card/card.native';
export {
  SegmentedTabs,
  type SegmentedTabsProps,
  type Segment,
} from './components/segmented-tabs/segmented-tabs.native';
export { Input, type InputProps } from './components/input/input.native';
export { Label, type LabelProps } from './components/label/label.native';
export {
  EmptyState,
  EmptyStateErreur,
  type EmptyStateProps,
} from './components/empty-state/empty-state.native';
export { Skeleton, type SkeletonProps } from './components/skeleton/skeleton.native';
export { Banner, type BannerProps, type BannerTon } from './components/banner/banner.native';
