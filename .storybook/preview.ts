import type { Preview } from '@storybook/react-vite';

import './preview.css';

const preview: Preview = {
  // Chaque composant a sa page de documentation, sans avoir à le demander
  // fichier par fichier : c'est là que s'affiche sa fiche.
  tags: ['autodocs'],
  parameters: {
    // L'ordre du menu suit le chemin de quelqu'un qui découvre : ce que c'est,
    // puis ce sur quoi tout repose, puis les briques, puis ce qu'on en fait.
    //
    // Les fondations sont rangées comme chez Atlassian : les règles de décision
    // d'abord — elles disent COMMENT choisir — puis les styles, qui disent avec
    // quoi. Regarder les couleurs avant les principes, c'est choisir une teinte
    // avant de savoir ce qu'on veut dire.
    options: {
      storySort: {
        order: [
          'Prise en main',
          ['Introduction', 'Installer', 'Par où commencer'],
          'Fondations',
          [
            'Principes de design',
            "Règles d'écran",
            'Couleurs',
            'Typographie',
            'Espacements et arrondis',
            'Icônes',
            'Élévation',
            'Mouvement',
            'Empilement',
          ],
          'Composants',
          ['Générique', 'Métier'],
          'Modèles',
        ],
      },
    },
    controls: { expanded: true },
    layout: 'padded',
  },
};

export default preview;
