import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Archive,
  ArrowRight,
  ArrowSquareOut,
  ArrowsDownUp,
  BookmarkSimple,
  Briefcase,
  Buildings,
  Calculator,
  Calendar,
  Camera,
  CameraRotate,
  CameraSlash,
  CaretCircleDown,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  ChartBar,
  ChatCircleDots,
  Check,
  CheckCircle,
  ClipboardText,
  Columns,
  Copy,
  Crosshair,
  DotsSixVertical,
  DotsThreeVertical,
  DownloadSimple,
  Elevator,
  Eye,
  EyeSlash,
  FileCsv,
  FilePdf,
  FileText,
  Folder,
  GearSix,
  Handshake,
  Hash,
  ImageSquare,
  Images,
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
  PaperPlaneTilt,
  PencilSimple,
  Plus,
  Receipt,
  Rows,
  Ruler,
  ShieldCheck,
  SignOut,
  Sliders,
  Sparkle,
  Stop,
  Tag,
  TextAa,
  ToggleLeft,
  Trash,
  Truck,
  UploadSimple,
  User,
  UserCircle,
  Phone,
  EnvelopeSimple,
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
  openExternal: ArrowSquareOut,
  filter: Sliders,
  moreActions: DotsThreeVertical,
  dictate: Microphone,
  stop: Stop,
  revealPassword: Eye,
  hidePassword: EyeSlash,
  settings: GearSix,
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
  calculate: Calculator,
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
  user: UserCircle,
  phone: Phone,
  email: EnvelopeSimple,
  conversation: ChatCircleDots,
  copy: Copy,
  folder: Folder,
  archive: Archive,
  signOut: SignOut,
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
