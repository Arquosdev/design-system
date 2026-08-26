// Arquos design system — point d'entrée unique.
// À importer côté mobile et côté web :
//   import { colors, spacing, radius, typography } from '@arquos/design-system';
//
// Pour avoir tous les tokens d'un coup :
//   import { tokens } from '@arquos/design-system';

export { palette, core, colors, type ColorToken } from './colors';
export {
  fontFamily,
  fontFamilyNative,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typography,
  type TypographyToken,
} from './typography';
export { spacing, type SpacingToken } from './spacing';
export { radius, type RadiusToken } from './radius';
export { shadow, shadowNative, type ShadowToken } from './elevation';
export { duration, easing, type DurationToken } from './motion';
export { layers, type LayerToken } from './layers';
export { borderWidth, type BorderWidthToken } from './border';

// --- Logique métier partagée -------------------------------------------
// Ce que les composants métier savent de l'ascenseur, sans une ligne de React :
// le vocabulaire et les règles, lisibles et testables des deux plateformes.
export {
  menuDeChoix,
  texteDeValeur,
  estVide,
  VIDE,
  TEXTE_STATUT,
  TEXTE_SAUVEGARDE,
  type FieldKind,
  type FieldStatut,
  type FieldSauvegarde,
  type FieldOption,
} from '../components/field-row/field-row.logic';
export { NON_PRISE, estEnTravers } from '../components/photo-tile/photo-tile.logic';
export {
  ECHECS,
  REESSAYER,
  natureDeLEchec,
  type NatureDeLEchec,
  type FormulationDEchec,
} from '../components/empty-state/empty-state.logic';
export {
  iconSize,
  iconWeight,
  icones,
  type IconSizeToken,
  type IconWeightToken,
  type IconRole,
  type IconName,
} from './icons';

import { palette, core, colors } from './colors';
import {
  fontFamily,
  fontFamilyNative,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typography,
} from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadow, shadowNative } from './elevation';
import { duration, easing } from './motion';
import { layers } from './layers';
import { borderWidth } from './border';
import { iconSize, iconWeight, icones } from './icons';

export const tokens = {
  palette,
  core,
  colors,
  fontFamily,
  fontFamilyNative,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typography,
  spacing,
  radius,
  shadow,
  shadowNative,
  duration,
  easing,
  layers,
  borderWidth,
  iconSize,
  iconWeight,
  icones,
} as const;
