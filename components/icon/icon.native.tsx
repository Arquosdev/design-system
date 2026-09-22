import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  ArrowRight,
  Calculator,
  Camera,
  CameraRotate,
  CameraSlash,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  CheckCircle,
  DotsThreeVertical,
  DownloadSimple,
  FileText,
  ImageSquare,
  Images,
  Info,
  Lightning,
  LightningSlash,
  MagnifyingGlass,
  MagnifyingGlassPlus,
  Microphone,
  MinusCircle,
  PencilSimple,
  Plus,
  Ruler,
  ShieldCheck,
  Sliders,
  Sparkle,
  Stop,
  Tag,
  Trash,
  Warning,
  WarningCircle,
  WarningOctagon,
  WifiSlash,
  Wrench,
  X,
  type Icon as PhosphorIcon,
} from 'phosphor-react-native';

import { colors } from '../../src/colors';
import { iconSize, iconWeight, type IconRole } from '../../src/icons';

// Le MÊME tableau que `icon.web.tsx`, dessin pour dessin : les deux lisent
// `IconRole`, et TypeScript refuse qu'un rôle manque d'un côté. Les 37 dessins
// sont importés ici et nulle part ailleurs dans l'app mobile.
const DESSINS: Record<IconRole, PhosphorIcon> = {
  suivant: CaretRight,
  precedent: CaretLeft,
  deplier: CaretDown,
  replier: CaretUp,
  aller: ArrowRight,
  fermer: X,

  rechercher: MagnifyingGlass,
  agrandir: MagnifyingGlassPlus,
  ajouter: Plus,
  modifier: PencilSimple,
  supprimer: Trash,
  telecharger: DownloadSimple,
  filtrer: Sliders,
  plusDActions: DotsThreeVertical,
  dicter: Microphone,
  arreter: Stop,

  conforme: CheckCircle,
  coche: Check,
  ecart: Warning,
  bloquant: WarningOctagon,
  attention: WarningCircle,
  information: Info,
  sansObjet: MinusCircle,
  horsLigne: WifiSlash,
  synchronisation: Lightning,
  synchronisationSuspendue: LightningSlash,

  photo: ImageSquare,
  photos: Images,
  prendreUnePhoto: Camera,
  photoIndisponible: CameraSlash,
  changerDeCamera: CameraRotate,

  document: FileText,
  etiquette: Tag,
  securite: ShieldCheck,
  intervention: Wrench,
  mesure: Ruler,
  calculer: Calculator,
  assistanceIA: Sparkle,
};

export interface IconProps {
  /** Le rôle, pas le dessin — voir `icones` dans `src/icons.ts`. */
  role: IconRole;
  /** Échelon de `iconSize`. Défaut `md` (18). */
  size?: keyof typeof iconSize;
  /** Échelon de `iconWeight`. Défaut `default` (bold). */
  weight?: keyof typeof iconWeight;
  /**
   * Ce que l'icône dit, quand elle le dit seule. Vide, elle est décorative et
   * se masque aux lecteurs d'écran — même règle que sur le web.
   */
  label?: string;
  /**
   * **La seule prop qui n'existe pas sur le web.** Là-bas la couleur est
   * héritée (`currentColor`) ; React Native n'a pas d'héritage entre une vue
   * et son icône, donc l'appelant la donne. `colors.text` par défaut — ce
   * qu'un texte courant aurait.
   */
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Icon({
  role,
  size = 'md',
  weight = 'default',
  label,
  color = colors.text,
  style,
}: IconProps) {
  const Dessin = DESSINS[role];
  return (
    <Dessin
      size={iconSize[size]}
      weight={iconWeight[weight]}
      color={color}
      style={style}
      {...(label
        ? { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: label }
        : { accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no' as const })}
    />
  );
}
