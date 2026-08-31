import * as React from 'react';
import {
  ArrowRight,
  Briefcase,
  Buildings,
  ClipboardText,
  Crosshair,
  Elevator,
  Handshake,
  PaperPlaneTilt,
  Receipt,
  Truck,
  UploadSimple,
  ArrowsDownUp,
  Calendar,
  CaretCircleDown,
  ChartBar,
  BookmarkSimple,
  Camera,
  CameraRotate,
  CameraSlash,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  CheckCircle,
  Columns,
  DotsSixVertical,
  DotsThreeVertical,
  DownloadSimple,
  Eye,
  EyeSlash,
  FileCsv,
  FilePdf,
  FileText,
  ImageSquare,
  Images,
  Hash,
  Info,
  Lightning,
  LightningSlash,
  LinkSimple,
  LockSimple,
  MagnifyingGlass,
  MapPin,
  MapTrifold,
  Microphone,
  MinusCircle,
  PencilSimple,
  Plus,
  Rows,
  Ruler,
  ShieldCheck,
  Sliders,
  Sparkle,
  Stop,
  Tag,
  TextAa,
  ToggleLeft,
  Trash,
  User,
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

// Le vocabulaire de `src/icons.ts` résolu en composants. Les dessins sont
// importés ici et nulle part ailleurs : c'est ce qui garantit qu'un rôle donne
// le même dessin dans tout le produit.
//
// **Le compte a été retiré de ce commentaire le 31/08/2026** : il disait « les
// 35 dessins » alors qu’il y en avait 65, et il n'avait aucune raison de rester
// juste — un rôle s'ajoute sans que personne pense à recompter. `Record` le
// vérifie, lui, à chaque compilation.
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
  revealPassword: Eye,
  hidePassword: EyeSlash,

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

  columns: Columns,
  reorder: DotsSixVertical,
  sortNeutral: ArrowsDownUp,
  lock: LockSimple,
  bookmark: BookmarkSimple,
  list: Rows,
  map: MapTrifold,
  pdf: FilePdf,
  csv: FileCsv,

  document: FileText,
  tag: Tag,
  safety: ShieldCheck,
  maintenance: Wrench,
  measure: Ruler,
  aiAssist: Sparkle,

  survey: ClipboardText,
  equipment: Elevator,
  building: Buildings,
  client: Briefcase,
  contact: User,
  supplier: Truck,
  sector: MapTrifold,
  technician: Wrench,
  deal: Handshake,
  contract: FileText,
  quote: Receipt,
  campaign: Crosshair,
  import: UploadSimple,
  request: PaperPlaneTilt,

  fieldText: TextAa,
  fieldNumber: Hash,
  fieldDate: Calendar,
  fieldChoice: CaretCircleDown,
  fieldLink: LinkSimple,
  fieldPerson: User,
  fieldGauge: ChartBar,
  fieldPlace: MapPin,
  fieldYesNo: ToggleLeft,
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
      /*
        Le rôle est écrit dans le DOM, et ce n'est pas décoratif.

        Le dessin seul ne se distingue pas : Phosphor rend un `svg` nu, sans
        classe ni marqueur, si bien qu'un harnais ne peut pas dire si un bouton
        porte trois points ou un chevron. Un test qui cherchait les trois points
        passait donc au vert alors qu'ils étaient là — il ne mesurait rien.

        Un attribut de données ne change rien au rendu et rend l'intention
        lisible, ce qui est exactement ce qu'un rôle d'icône veut dire.
      */
      data-role={role}
      className={cn('shrink-0', className)}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
      {...props}
    />
  );
}
