import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FilterChips } from '../../components/filter-chips/filter-chips.web';
import specification from '../../components/filter-chips/filter-chips.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/FilterChips',
  component: FilterChips,
  parameters: docsDe(specification),
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Le filtre de la rubrique Photos : 57 photos ramenées à une section. */
export const Defaut: Story = {
  args: {
    label: 'Filtrer par section',
    value: 'toutes',
    onValueChange: () => {},
    chips: [
      { value: 'toutes', label: 'Toutes', count: 57 },
      { value: 'environnement', label: 'Environnement', count: 4 },
      { value: 'cabine', label: 'Cabine', count: 18 },
      { value: 'palier', label: 'Palier niveau principal', count: 2 },
      { value: 'machinerie', label: 'Machinerie', count: 22 },
      { value: 'gaine', label: 'Gaine', count: 9 },
      { value: 'poulie', label: 'Local Poulie', count: 1 },
    ],
  },
  render: function Rendu(args) {
    const [value, setValue] = React.useState(args.value);
    return <FilterChips {...args} value={value} onValueChange={setValue} />;
  },
};

/** Sans compteur, quand la partie ne se compte pas. */
export const SansCompteur: Story = {
  ...Defaut,
  args: {
    label: 'Filtrer par état',
    value: 'tous',
    onValueChange: () => {},
    chips: [
      { value: 'tous', label: 'Tous' },
      { value: 'ouverts', label: 'Non résolus' },
      { value: 'resolus', label: 'Résolus' },
    ],
  },
};
