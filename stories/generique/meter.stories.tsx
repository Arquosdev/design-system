import type { Meta, StoryObj } from '@storybook/react-vite';

import { Meter } from '../../components/meter/meter.web';
import specification from '../../components/meter/meter.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Meter',
  component: Meter,
  parameters: docsDe(specification),
  args: { value: 41, label: 'Taux de connaissance' },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  parameters: {
    docs: { description: { story: 'Sans ton imposé, la couleur suit la valeur.' } },
  },
};

const PARC = [
  { numero: '53 A 0147 01', taux: 92 },
  { numero: '53 A 0155 01', taux: 78 },
  { numero: '53 A 0163 01', taux: 41 },
  { numero: '53 A 0171 01', taux: 22 },
  { numero: '53 A 0144 01', taux: 8 },
];

export const EnSerie: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "C'est le cas pour lequel ce composant existe : cinq anneaux côte à côte se comparent moins bien que cinq barres, parce que l'œil compare mal des angles. La largeur reste constante d'une ligne à l'autre — c'est elle qui rend la série lisible.",
      },
    },
  },
  render: () => (
    <table className="text-small">
      <tbody>
        {PARC.map((e) => (
          <tr key={e.numero} className="border-b border-border-soft">
            <td className="py-sm pr-xl whitespace-nowrap">{e.numero}</td>
            <td className="py-sm">
              <Meter value={e.taux} label="Taux de connaissance" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Bornes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'À zéro, la piste seule ne dirait rien : le chiffre reste écrit, sans quoi on croirait la donnée absente alors qu’elle est mesurée.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-sm">
      <Meter value={0} label="Taux de connaissance" />
      <Meter value={100} label="Taux de connaissance" />
      <Meter value={140} label="Valeur hors bornes" />
    </div>
  ),
};
