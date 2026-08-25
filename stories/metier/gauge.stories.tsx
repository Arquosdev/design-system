import type { Meta, StoryObj } from '@storybook/react-vite';

import { Gauge } from '../../components/gauge/gauge.web';
import specification from '../../components/gauge/gauge.spec.md?raw';
import { choix, docsDe } from '../fiche';

const meta = {
  title: 'Métier/Gauge',
  component: Gauge,
  parameters: docsDe(specification),
  args: { valeur: 82, label: 'Taux de connaissance' },
  argTypes: { tone: choix(['success', 'warning', 'danger'], 'Force la teinte.') },
} satisfies Meta<typeof Gauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/** La teinte suit la valeur quand on ne la force pas. */
export const Paliers: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-xl">
      <Gauge valeur={18} label="Points statués" />
      <Gauge valeur={54} label="Points statués" />
      <Gauge valeur={91} label="Points statués" />
    </div>
  ),
};

export const Taille: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-xl">
      <Gauge valeur={82} label="Petite" taille={56} />
      <Gauge valeur={82} label="Par défaut" />
      <Gauge valeur={82} label="Grande" taille={120} />
    </div>
  ),
};
