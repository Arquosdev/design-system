import { addons } from 'storybook/manager-api';

// Importé plutôt qu'écrit en dur : Vite en fait une URL qui respecte le chemin
// de publication. La vitrine vit sous /design-system/ sur GitHub Pages, où un
// chemin absolu pointerait à côté.
import logo from './arquos.svg';
import { create } from 'storybook/theming';

import { colors, palette } from '../src/colors';
import { fontFamily } from '../src/typography';
import { radius } from '../src/radius';

/**
 * L'habillage de la vitrine elle-même — le menu, les onglets, la barre du haut.
 *
 * Storybook sort en gris neutre : correct, et anonyme. Une vitrine qui ne
 * ressemble pas au produit qu'elle documente demande un effort de traduction à
 * chaque coup d'œil, et c'est le genre d'effort qu'on cesse de faire.
 *
 * Tout vient d'ici de `src/*.ts` : la vitrine emploie les tokens qu'elle montre.
 * Elle ne peut donc pas dériver de ce qu'elle documente.
 */
const theme = create({
  base: 'light',

  brandTitle: 'Arquos — design system',
  brandImage: logo,
  brandUrl: 'https://github.com/Arquosdev/design-system',
  brandTarget: '_self',

  // La marine plutôt que le bleu d'action : la barre du haut est une surface,
  // pas un bouton. Le bleu reste réservé à ce qui se clique.
  appBg: palette.marine[50],
  appContentBg: colors.bg,
  appPreviewBg: colors.bg,
  appBorderColor: colors.borderSoft,
  appBorderRadius: radius.md,

  colorPrimary: colors.brand,
  colorSecondary: colors.primary,

  barBg: colors.bg,
  barTextColor: colors.textMuted,
  barSelectedColor: colors.primary,
  barHoverColor: colors.primary,

  textColor: colors.text,
  textInverseColor: colors.textOnDark,
  textMutedColor: colors.textMuted,

  fontBase: fontFamily,
  // La chasse fixe des valeurs : les tokens s'y lisent en colonne.
  fontCode: "'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace",

  inputBg: colors.bg,
  inputBorder: colors.border,
  inputTextColor: colors.text,
  inputBorderRadius: radius.control,
});

addons.setConfig({
  theme,
  sidebar: {
    // Les composants portent leur couche en préfixe (`Composants/Générique/…`) :
    // afficher les racines en gras rend les quatre sections lisibles d'un coup.
    showRoots: true,
  },
});
