// Arquos design system — point d'entrée unique.
// À importer côté mobile et côté web :
//   import { colors, spacing, radius, typography } from '@arquos/design-system';
//
// Pour avoir tous les tokens d'un coup :
//   import { tokens } from '@arquos/design-system';

export { palette, core, colors, type ColorToken } from './colors';
export { fontSize, fontWeight, lineHeight, letterSpacing, typography, type TypographyToken } from './typography';
export { spacing, type SpacingToken } from './spacing';
export { radius, type RadiusToken } from './radius';

import { palette, core, colors } from './colors';
import { fontSize, fontWeight, lineHeight, letterSpacing, typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';

export const tokens = {
  palette,
  core,
  colors,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typography,
  spacing,
  radius,
} as const;
