// Arquos design system — point d'entrée unique.
// À importer côté mobile et côté web :
//   import { colors, spacing, radius, typography } from '@arquos/design-system';
//
// Pour avoir tous les tokens d'un coup :
//   import { tokens } from '@arquos/design-system';

export {
  palette, core, colors, tagPalette, tagTone, TAG_TONES,
  type ColorToken, type TagTone,
} from './colors';
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
export { controlHeight, type ControlHeightToken } from './control';

// --- Logique métier partagée -------------------------------------------
// Ce que les composants métier savent de l'ascenseur, sans une ligne de React :
// le vocabulaire et les règles, lisibles et testables des deux plateformes.
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
} from '../components/field-row/field-row.logic';
export { NOT_TAKEN, estEnTravers } from '../components/photo-tile/photo-tile.logic';
export {
  FAILURES,
  RETRY,
  failureKind,
  type FailureKind,
  type FailureWording,
} from '../components/empty-state/empty-state.logic';
export {
  iconSize,
  iconWeight,
  icons,
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
import { controlHeight } from './control';
import { iconSize, iconWeight, icons } from './icons';

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
  controlHeight,
  iconSize,
  iconWeight,
  icons,
} as const;
