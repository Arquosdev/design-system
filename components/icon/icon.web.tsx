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
const DESSINS: Record<IconRole, PhosphorIcon> = {
  suivant: CaretRight,
  precedent: CaretLeft,
  deplier: CaretDown,
  replier: CaretUp,
  aller: ArrowRight,
  fermer: X,

  rechercher: MagnifyingGlass,
  ajouter: Plus,
  modifier: PencilSimple,
  supprimer: Trash,
  telecharger: DownloadSimple,
  filtrer: Sliders,
  plusDActions: DotsThreeVertical,
  dicter: Microphone,
  arreter: Stop,

  conforme: CheckCircle,
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
  assistanceIA: Sparkle,
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
  const Dessin = DESSINS[role];
  return (
    <Dessin
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
