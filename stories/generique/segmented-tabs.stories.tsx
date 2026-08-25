import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentedTabs } from '../../components/segmented-tabs/segmented-tabs.web';
import specification from '../../components/segmented-tabs/segmented-tabs.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Générique/SegmentedTabs',
  component: SegmentedTabs,
  parameters: docsDe(specification),
} satisfies Meta<typeof SegmentedTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Celui du rail de la fiche : deux vues du même écran, également importantes. */
export const Defaut: Story = {
  args: {
    ariaLabel: 'Contenu du rail',
    valeur: 'fiche',
    onChanger: () => {},
    segments: [
      { cle: 'fiche', label: 'Fiche', compteur: 9 },
      { cle: 'composants', label: 'Composants', compteur: 15 },
    ],
  },
  render: function Rendu(args) {
    const [valeur, setValeur] = React.useState(args.valeur);
    return (
      <div className="max-w-[268px]">
        <SegmentedTabs {...args} valeur={valeur} onChanger={setValeur} />
      </div>
    );
  },
};

/** Trois, c'est le maximum. Au-delà, les libellés se serrent — prendre `NavList`. */
export const Trois: Story = {
  ...Defaut,
  args: {
    ariaLabel: 'Période',
    valeur: 'mois',
    onChanger: () => {},
    segments: [
      { cle: 'semaine', label: 'Semaine' },
      { cle: 'mois', label: 'Mois' },
      { cle: 'annee', label: 'Année' },
    ],
  },
};
