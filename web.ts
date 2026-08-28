// Point d'entrée des composants web.
//
//   import { Button, Accordion, FieldRow } from '@arquos/design-system/web';
//
// Toujours importer d'ici, jamais un fichier de composant directement : le
// chemin interne peut changer, ce point d'entrée non.
//
// Les tokens s'importent séparément — ils ne dépendent pas de React :
//   import { colors, spacing } from '@arquos/design-system';

export { Button, buttonVariants, type ButtonProps } from './components/button/button.web';
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion/accordion.web';
export { Badge, badgeVariants, type BadgeProps } from './components/badge/badge.web';
export { Tag, type TagProps } from './components/tag/tag.web';
export { tagPalette, tagTone, TAG_TONES, type TagTone } from './src/colors';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardList,
  CardFooter,
} from './components/card/card.web';
export { DataTable, type DataTableProps } from './components/data-table/data-table.web';
export { Gauge, type GaugeProps } from './components/gauge/gauge.web';
export { Meter, type MeterProps } from './components/meter/meter.web';
export {
  RecordTable,
  type RecordTableProps,
  type RecordColumn,
} from './components/record-table/record-table.web';
export {
  compare,
  paginationLabel,
  selectionLabel,
  nextSort,
  type SortState,
  type SortDirection,
} from './components/record-table/record-table.logic';
export { StatTile, type StatTileProps } from './components/stat-tile/stat-tile.web';
export { PhotoTile, type PhotoTileProps } from './components/photo-tile/photo-tile.web';
export {
  PhotoViewer,
  type PhotoViewerProps,
  type PhotoView,
} from './components/photo-viewer/photo-viewer.web';
export {
  ToastProvider,
  useToast,
  type ToastProviderProps,
  type ToastContext,
  type ToastTone,
} from './components/toast/toast.web';
export { SegmentedTabs, type SegmentedTabsProps, type Segment } from './components/segmented-tabs/segmented-tabs.web';
export { NavList, type NavListProps, type NavItem } from './components/nav-list/nav-list.web';
export {
  FilterChips,
  type FilterChipsProps,
  type FilterChip,
} from './components/filter-chips/filter-chips.web';
export { IconButton, type IconButtonProps } from './components/icon-button/icon-button.web';
export { Icon, type IconProps } from './components/icon/icon.web';
export { FieldRow, type FieldRowProps } from './components/field-row/field-row.web';
// La logique métier de FieldRow est aussi servie par le point d'entrée racine —
// c'est la même source, deux portes : le mobile la prendra par la racine.
export {
  choiceMenu,
  valueText,
  isEmpty,
  EMPTY,
  STATUS_TEXT,
  SAVE_TEXT,
  type FieldKind,
  type FieldStatus,
  type FieldSave,
  type FieldOption,
} from './components/field-row/field-row.logic';

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetCloseButton,
  type SheetContentProps,
} from './components/sheet/sheet.web';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from './components/command/command.web';

export { Combobox, SEARCH_THRESHOLD } from './components/combobox/combobox.web';
export type { ComboboxOption, ComboboxProps } from './components/combobox/combobox.web';

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from './components/popover/popover.web';

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './components/select/select.web';

// --- Attente, vide, condition ------------------------------------------
// Trois composants remontés depuis le mobile, qui les avait et que le design
// system n'avait pas. Voir CONVERGENCE.md — le premier mouvement va du mobile
// vers le dépôt partagé, pas l'inverse.
export { Skeleton, type SkeletonProps } from './components/skeleton/skeleton.web';
export {
  EmptyState,
  EmptyStateError,
  type EmptyStateProps,
} from './components/empty-state/empty-state.web';
export { Banner, type BannerProps, type BannerTone } from './components/banner/banner.web';
export { Avatar, type AvatarProps } from './components/avatar/avatar.web';

// --- Formulaire ---------------------------------------------------------
// Les primitives de saisie. `Select` et `Combobox` sont plus haut : ils
// choisissent dans une liste, ils ne recueillent pas une frappe.
export { Input } from './components/input/input.web';
export { Textarea } from './components/textarea/textarea.web';
export { Label } from './components/label/label.web';
export { Checkbox } from './components/checkbox/checkbox.web';
export { RadioGroup, RadioGroupItem } from './components/radio-group/radio-group.web';
export { Switch } from './components/switch/switch.web';

// --- Composer une liste ---------------------------------------------------
// Écrits d'abord dans l'app, puis remontés ici : ils n'ont rien de propre aux
// équipements, et la liste des affaires en aura besoin à l'identique.
export { Drawer, DrawerSection, type DrawerProps } from './components/drawer/drawer.web';
export {
  Toolbar, ToolButton, ToolbarSpacer, type ToolButtonProps,
} from './components/toolbar/toolbar.web';
export {
  SelectionBar, SelectionAction, type SelectionActionProps,
} from './components/selection-bar/selection-bar.web';
export {
  ActiveFilters, type ActiveFilter, type ActiveFiltersProps,
} from './components/active-filters/active-filters.web';

export { PageHeader, type PageHeaderProps } from './components/page-header/page-header.web';

export { cn } from './components/_lib/cn';
