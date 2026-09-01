import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatTile } from '../../components/stat-tile/stat-tile.web';
import specification from '../../components/stat-tile/stat-tile.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Métier/StatTile',
  component: StatTile,
  parameters: docsDe(specification),
  args: { label: 'Charge utile', value: '630', unit: 'kg' },
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * Les six tuiles d'identité de la vue d'ensemble, sur deux rangées de trois.
 * Une seule taille de chiffre, quelle que soit la valeur : « 630 » et « Haute »
 * doivent s'aligner, sinon la rangée ondule.
 */
export const RangeeDIdentite: Story = {
  render: () => (
    <div className="grid max-w-[720px] grid-cols-3 gap-md">
      <StatTile label="Charge utile" value="630" unit="kg" />
      <StatTile label="Niveaux desservis" value="7" detail="RDC à 6e" />
      <StatTile label="Vitesse" value="1,00" unit="m/s" />
      <StatTile label="Faces de service" value="2" detail="Traversant" />
      <StatTile label="Machinerie" value="Haute" />
      <StatTile label="Télé-alarme" value="Oui" detail="GSM 4G" />
    </div>
  ),
};
