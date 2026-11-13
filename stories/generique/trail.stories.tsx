import type { Meta, StoryObj } from '@storybook/react-vite';

import { Trail } from '../../components/trail/trail.web';
import specification from '../../components/trail/trail.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Trail',
  component: Trail,
  parameters: docsDe(specification),
  args: {
    steps: [{ label: 'Équipements', href: '#' }],
    current: 'Paramètres des équipements',
  },
} satisfies Meta<typeof Trail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * Le chemin d'une fiche : la liste d'où l'on part, les fiches traversées, et
 * ce qu'on regarde. Cinq crans au plus — au-delà, ce n'est plus un fil.
 */
export const UnChemin: Story = {
  args: {
    label: 'Chemin parcouru',
    steps: [
      { label: 'Clients', href: '#' },
      { label: 'SOGEMAP GESTION', href: '#' },
      { label: 'RÉSIDENCE DU PARC', href: '#' },
    ],
    current: '53 A 00145 02',
  },
};

/**
 * Un nom long se tronque ; les crans, eux, passent à la ligne. La hauteur est
 * un plancher, donc rien n'est rogné.
 */
export const UnNomLong: Story = {
  args: {
    steps: [{ label: 'Immeubles', href: '#' }],
    current: 'RÉSIDENCE LES TILLEULS — BÂTIMENT C, 12 BIS AVENUE DU GÉNÉRAL LECLERC',
  },
};
