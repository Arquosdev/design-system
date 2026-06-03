// Arquos design system — colour palette.
// Each ramp goes from 50 (lightest) to 800 (darkest) in 9 steps.
// Core brand tokens are exposed via the `core` map and via semantic aliases
// (primary, danger, success…) so screens reference meaning rather than hex.

export const palette = {
  blue: {
    50: '#E1ECFA',
    100: '#B4D2F5',
    200: '#87B7F0',
    300: '#5A9CEC',
    400: '#2F7BCE',
    500: '#0D5AB7', // core Blue
    600: '#0A4B93',
    700: '#073B6F',
    800: '#052B4B',
  },
  marine: {
    50: '#F5F9FD',
    100: '#DFEAF8',
    200: '#BFD4ED',
    300: '#99B8DE',
    400: '#6E97C8',
    500: '#3B6DA7',
    600: '#13437D',
    700: '#00295B', // core Marine
    800: '#001C40',
  },
  orange: {
    50: '#FFF3DD',
    100: '#FFE0B0',
    200: '#FFCD84',
    300: '#FFBA58',
    400: '#FFA836',
    500: '#FFA522', // core Orange
    600: '#CC841B',
    700: '#996315',
    800: '#66420E',
  },
  green: {
    50: '#F3FCFB',
    100: '#DFF7F3',
    200: '#B6ECE3',
    300: '#85E0D1',
    400: '#59D4C0',
    500: '#2EB89A',
    600: '#17A679',
    700: '#0C7C59',
    800: '#032B1F',
  },
  red: {
    50: '#FDF7F7',
    100: '#F1C0C1',
    200: '#EB9E9F',
    300: '#E26F71',
    400: '#DA494B',
    500: '#BE3A37',
    600: '#943124',
    700: '#5E1F17',
    800: '#2D0F0B',
  },
  grey: {
    50: '#F6F7F9',
    100: '#EAEEF1',
    200: '#C8D3DA',
    300: '#A4B5C1',
    400: '#8094A3',
    500: '#5D6D79',
    600: '#4D5B66',
    700: '#3F4950',
    800: '#232B2F',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

// Brand core — the 4 named colours from the spec.
export const core = {
  marine: palette.marine[700],
  blue: palette.blue[500],
  orange: palette.orange[500],
  white: palette.white,
} as const;

// Semantic aliases — prefer these in screen code so meaning stays decoupled
// from raw values (e.g. `colors.danger` rather than `palette.red[500]`).
export const colors = {
  // Brand
  primary: core.blue, // main interactive accent (CTAs, links, active state)
  primaryDark: palette.blue[700],
  brand: core.marine, // dominant brand surface (headers, hero blocks)
  accent: core.orange, // highlight / attention

  // Status
  success: palette.green[600],
  successBg: palette.green[100],
  danger: palette.red[500],
  dangerBg: palette.red[100],
  warning: palette.orange[500],

  // Neutrals
  bg: palette.white,
  bgMuted: palette.grey[50],
  border: palette.grey[200],
  text: palette.grey[800],
  textMuted: palette.grey[500],
  textSubtle: palette.grey[400],
  textOnDark: palette.white,
  black: palette.black,
} as const;

export type ColorToken = keyof typeof colors;
