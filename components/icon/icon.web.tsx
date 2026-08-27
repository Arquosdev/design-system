import * as React from 'react';
import {
  ArrowRight,
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
} from '@phosphor-icons/react';

import { iconSize, iconWeight, type IconRole } from '../../src/icons';
import { cn } from '../_lib/cn';

// Le vocabulaire de `src/icons.ts` résolu en composants. Les 35 dessins sont
// importés ici et nulle part ailleurs : c'est ce qui garantit qu'un rôle donne
// le même dessin dans tout le produit.
//
// Les clés doivent couvrir `IconRole` — TypeScript le vérifie via `Record`.
const GLYPHS: Record<IconRole, PhosphorIcon> = {
  next: CaretRight,
  previous: CaretLeft,
  expand: CaretDown,
  collapse: CaretUp,
  go: ArrowRight,
  close: X,

  search: MagnifyingGlass,
  add: Plus,
  edit: PencilSimple,
  delete: Trash,
  download: DownloadSimple,
  filter: Sliders,
  moreActions: DotsThreeVertical,
  dictate: Microphone,
  stop: Stop,

  compliant: CheckCircle,
  check: Check,
  discrepancy: Warning,
  blocking: WarningOctagon,
  warning: WarningCircle,
  info: Info,
  notApplicable: MinusCircle,
  offline: WifiSlash,
  sync: Lightning,
  syncPaused: LightningSlash,

  photo: ImageSquare,
  photos: Images,
  takePhoto: Camera,
  photoUnavailable: CameraSlash,
  switchCamera: CameraRotate,

  document: FileText,
  tag: Tag,
  safety: ShieldCheck,
  maintenance: Wrench,
  measure: Ruler,
  aiAssist: Sparkle,
};

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'role' | 'ref'> {
  /** Le rôle, pas le dessin — voir `icones` dans `src/icons.ts`. */
  role: IconRole;
  /** Échelon de `iconSize`. Défaut `md` (18). */
  size?: keyof typeof iconSize;
  /** Échelon de `iconWeight`. Défaut `default` (bold). */
  weight?: keyof typeof iconWeight;
  /**
   * Ce que l'icône dit, quand elle le dit seule.
   *
   * À laisser vide si un texte voisin porte déjà l'information : l'icône est
   * alors décorative, et la répéter fait bégayer le lecteur d'écran.
   */
  label?: string;
}

/**
 * Une icône du vocabulaire Arquos.
 *
 * La couleur est héritée (`currentColor`) : elle se règle sur le parent, jamais
 * ici — c'est ce qui permet à la même icône de suivre un texte muté ou un
 * bouton primaire sans variante supplémentaire.
 */
export function Icon({
  role,
  size = 'md',
  weight = 'default',
  label,
  className,
  ...props
}: IconProps) {
  const Glyph = GLYPHS[role];
  return (
    <Glyph
      size={iconSize[size]}
      weight={iconWeight[weight]}
      className={cn('shrink-0', className)}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
      {...props}
    />
  );
}
