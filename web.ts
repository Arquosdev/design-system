// Point d'entrée des composants web.
//
//   import { Button, Accordion, FieldRow } from '@arquos/design-system/web';
//
// Toujours importer d'ici, jamais un fichier de composant directement : le
// chemin interne peut changer, ce point d'entrée non.
//
// Les tokens s'importent séparément — ils ne dépendent pas de React :
//   import { colors, spacing } from '@arquos/design-system';

export { Button, type ButtonProps } from './components/button/button.web';
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion/accordion.web';
export { Badge, type BadgeProps } from './components/badge/badge.web';
export { Card, type CardProps } from './components/card/card.web';
export { IconButton, type IconButtonProps } from './components/icon-button/icon-button.web';
export {
  FieldRow,
  type FieldRowProps,
  type FieldKind,
  type FieldStatut,
  type FieldOption,
} from './components/field-row/field-row.web';

export { cn } from './components/_lib/cn';
