import type { Meta, StoryObj } from '@storybook/react-vite';

import { Gauge } from '../../components/gauge/gauge.web';
import specification from '../../components/gauge/gauge.spec.md?raw';
import { choix, docsDe } from '../fiche';

const meta = {
  title: 'Composants/Métier/Gauge',
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

/**
 * Le creux de l'anneau est le seul endroit libre de la jauge. `centre` y pose
 * un bouton : le taux dit combien on sait, le creux ouvre le détail de ce qui
 * manque. Pas un chiffre — il se confondrait avec le pourcentage, à deux
 * centimètres de lui.
 */
export const AvecCentre: Story = {
  args: {
    valeur: 87,
    label: 'Taux de connaissance',
    centre: (
      <button
        type="button"
        aria-label="Photos essentielles"
        className="flex size-[26px] items-center justify-center rounded-full text-text-muted outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 7.6v0.2" />
        </svg>
      </button>
    ),
  },
};
