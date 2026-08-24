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
export { StatTile, type StatTileProps } from './components/stat-tile/stat-tile.web';
export { PhotoTile, type PhotoTileProps } from './components/photo-tile/photo-tile.web';
export {
  PhotoViewer,
  type PhotoViewerProps,
  type PhotoVue,
} from './components/photo-viewer/photo-viewer.web';
export {
  ToastProvider,
  useToast,
  type ToastProviderProps,
  type ToastContexte,
  type ToastTon,
} from './components/toast/toast.web';
export { SegmentedTabs, type SegmentedTabsProps, type Segment } from './components/segmented-tabs/segmented-tabs.web';
export { NavList, type NavListProps, type NavItem } from './components/nav-list/nav-list.web';
export {
  FilterChips,
  type FilterChipsProps,
  type FilterChip,
} from './components/filter-chips/filter-chips.web';
export { IconButton, type IconButtonProps } from './components/icon-button/icon-button.web';
export {
  FieldRow,
  menuDeChoix,
  type FieldRowProps,
  type FieldKind,
  type FieldStatut,
  type FieldSauvegarde,
  type FieldOption,
} from './components/field-row/field-row.web';

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

export { cn } from './components/_lib/cn';
