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
  iconSize,
  iconWeight,
  icones,
} as const;
