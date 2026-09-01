import type { Meta, StoryObj } from '@storybook/react-vite';

import { DataTable } from '../../components/data-table/data-table.web';
import specification from '../../components/data-table/data-table.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Métier/DataTable',
  component: DataTable,
  parameters: docsDe(specification),
  args: {
    title: 'Cotes des portes palières',
    columns: ['Niveau', 'Passage libre', 'Hauteur', 'Type'],
    rows: [
      ['RDC', '800 mm', '2 000 mm', 'Coulissante 2 vantaux'],
      ['1er', '800 mm', '2 000 mm', 'Coulissante 2 vantaux'],
      ['2e', '750 mm', '2 000 mm', 'Coulissante 1 vantail'],
      ['3e', '800 mm', '2 000 mm', 'Coulissante 2 vantaux'],
    ],
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Un tableau parce que la comparaison colonne par colonne EST le sujet : on
 * cherche le niveau dont le passage libre sort du lot, et on le voit d'un coup
 * d'œil vertical.
 */
export const Defaut: Story = {};

/** La note dit d'où viennent les valeurs, quand ce n'est pas évident. */
export const AvecNote: Story = {
  args: { note: 'Mesures relevées au niveau du seuil, portes fermées.' },
};
