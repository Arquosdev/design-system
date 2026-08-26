import tailwind from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';

/**
 * La vitrine du design system.
 *
 * Elle ne duplique rien : chaque page de composant affiche **sa fiche**
 * (`components/<nom>/<nom>.spec.md`), lue telle quelle. Une documentation
 * recopiée à la main diverge de la fiche au premier changement, et c'est alors
 * la vitrine qu'on croit — pas le dépôt.
 */
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)', '../stories/**/*.mdx'],
  // Le favicon d'Arquos remplace celui de Storybook : la vitrine est un onglet
  // qu'on garde ouvert, et l'icône est ce qui permet de le retrouver.
  staticDirs: ['./public'],
  addons: [
    '@storybook/addon-docs',
    // Le panneau « Accessibility » de chaque story. Il regarde ce que le
    // calcul de `npm run contraste` ne voit pas : rôles, libellés, ordre des
    // titres, cibles tactiles. Les deux sont complémentaires — l'un tourne en
    // CI sans navigateur, l'autre demande un œil mais couvre bien plus large.
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
  viteFinal: async (vite) => ({
    ...vite,
    // Sans le greffon, Vite se contente d'inliner la feuille de Tailwind : on
    // récupère son thème par défaut et AUCUNE de nos classes. La vitrine sort
    // alors sans mise en forme, ce qui se voit — mais la cause, non.
    plugins: [...(vite.plugins ?? []), tailwind()],
    // Publiée sur GitHub Pages, sous /<dépôt>/ : les chemins d'assets doivent
    // être relatifs, sinon la page cherche ses scripts à la racine du domaine.
    base: './',
  }),
};

export default config;
