import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentedTabs } from '../../components/segmented-tabs/segmented-tabs.web';
import specification from '../../components/segmented-tabs/segmented-tabs.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/SegmentedTabs',
  component: SegmentedTabs,
  parameters: docsDe(specification),
} satisfies Meta<typeof SegmentedTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Celui du rail de la fiche : deux vues du même écran, également importantes. */
export const Defaut: Story = {
  args: {
    ariaLabel: 'Contenu du rail',
    value: 'specFile',
    onChange: () => {},
    segments: [
      { id: 'specFile', label: 'Fiche', count: 9 },
      { id: 'composants', label: 'Composants', count: 15 },
    ],
  },
  render: function Rendu(args) {
    const [value, setValue] = React.useState(args.value);
    return (
      <div className="max-w-[268px]">
        <SegmentedTabs {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

/** Trois, c'est le maximum. Au-delà, les libellés se serrent — prendre `NavList`. */
export const Trois: Story = {
  ...Defaut,
  args: {
    ariaLabel: 'Période',
    value: 'mois',
    onChange: () => {},
    segments: [
      { id: 'semaine', label: 'Semaine' },
      { id: 'mois', label: 'Mois' },
      { id: 'annee', label: 'Année' },
    ],
  },
};
