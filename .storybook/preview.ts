import type { Preview } from '@storybook/react-vite';

import './preview.css';

const preview: Preview = {
  // Chaque composant a sa page de documentation, sans avoir à le demander
  // fichier par fichier : c'est là que s'affiche sa fiche.
  tags: ['autodocs'],
  parameters: {
    // L'ordre du menu suit celui du catalogue : d'abord ce qu'on lit avant de
    // choisir (les tokens, les couches), ensuite les composants.
    options: {
      storySort: {
        order: [
          'Design system',
          ['Introduction', 'Principes de design', 'Tokens'],
          'Générique',
          'Métier',
        ],
      },
    },
    controls: { expanded: true },
    layout: 'padded',
  },
};

export default preview;
