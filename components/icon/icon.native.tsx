import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Archive,
  ArrowsClockwise,
  ArrowsSplit,
  BoxArrowUp,
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
  PaperPlaneRight,
  PaperPlaneTilt,
  PencilSimple,
  Plus,
  Receipt,
  Rows,
  Ruler,
  ShieldCheck,
  SignOut,
  ArrowsOutSimple,
  ArrowsInSimple,
  NotePencil,
  Sliders,
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
  ClockCounterClockwise,
  EnvelopeSimple,
  Warning,
  WarningCircle,
  WarningOctagon,
  Bell,
  ChartLineUp,
  WifiSlash,
  HardHat,
  Invoice,
  Wrench,
  X,
  type Icon as PhosphorIcon,
  Siren,
  ThumbsUp,
  ThumbsDown,
  ArrowDown,
  Question,
  BookOpenText,
  CalendarCheck,
  CalendarDots,
  Polygon,
  Signature,
  Printer,
  House,
  Star,
  MagnifyingGlassPlus,
  SpeakerHigh,
  Play,
  Pause,
  ArrowCounterClockwise,
  Spinner,
  CircleIcon as CircleOutline, // « Circle » se nomme CircleIcon dans phosphor-react-native 3
  CircleHalf,
  ArrowLineDown,
  ArrowLineUp,
  DoorOpen,
  Gear,
  NavigationArrow,
} from 'phosphor-react-native';

import { Circle, Svg } from 'react-native-svg';

import { colors } from '../../src/colors';
import { iconSize, iconWeight, type IconRole } from '../../src/icons';
import { CONSTELLATION } from './constellation';

/** Le dessin de `aiAssist`, tracé ici comme sur le web (voir ./constellation.ts). */
function Constellation({ size = 18, color = colors.text, weight, ...props }: { size?: number; color?: string; weight?: string; style?: StyleProp<ViewStyle> } & Record<string, unknown>) {
  void weight; // des points pleins n'ont pas de graisse
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
      {CONSTELLATION.map((p) => <Circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r={p.r} />)}
    </Svg>
  );
}

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
  notification: Bell,
  report: ChartLineUp,
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
  aiAssist: Constellation as unknown as PhosphorIcon,
  calculate: Calculator,
  recalculate: ArrowsClockwise,
  split: ArrowsSplit,
  restore: BoxArrowUp,
  survey: ClipboardText,
  equipment: Elevator,
  building: Buildings,
  client: Briefcase,
  contact: User,
  supplier: Truck,
  sector: Polygon,
  // Un casque et non une clé : la clé est déjà `maintenance`, et deux entrées
  // du rail (Visites, Techniciens) portaient le même dessin. Louis, 06/10/2026.
  technician: HardHat,
  deal: Handshake,
  contract: Signature,
  quote: Receipt,
  invoice: Invoice,
  campaign: Crosshair,
  import: UploadSimple,
  request: PaperPlaneTilt,
  user: UserCircle,
  phone: Phone,
  emergencyPhone: Siren,
  recent: ClockCounterClockwise,
  planning: CalendarDots,
  email: EnvelopeSimple,
  conversation: ChatCircleDots,
  copy: Copy,
  folder: Folder,
  archive: Archive,
  signOut: SignOut,
  send: PaperPlaneRight,
  maximize: ArrowsOutSimple,
  minimize: ArrowsInSimple,
  newConversation: NotePencil,
  thumbsUp: ThumbsUp,
  thumbsDown: ThumbsDown,
  scrollDown: ArrowDown,
  help: Question,
  documentation: BookOpenText,
  today: CalendarCheck,
  print: Printer,
  home: House,
  rating: Star,
  locateMe: NavigationArrow,
  view: Eye,
  zoomIn: MagnifyingGlassPlus,
  listen: SpeakerHigh,
  play: Play,
  pause: Pause,
  flash: Lightning,
  flashOff: LightningSlash,
  undo: ArrowCounterClockwise,
  loading: Spinner,
  pending: CircleOutline,
  partial: CircleHalf,
  zoneBottom: ArrowLineDown,
  zoneTop: ArrowLineUp,
  door: DoorOpen,
  secondEntrance: Copy,
  cabin: Elevator,
  mechanism: Gear,
  controls: Sliders,
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
