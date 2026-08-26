import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../../components/label/label.web';
import { Switch } from '../../components/switch/switch.web';
import specification from '../../components/switch/switch.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Générique/Switch',
  component: Switch,
  parameters: docsDe(specification),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * L'intitulé porte le réglage, l'interrupteur son état. `justify-between`
 * pousse la piste à droite, où l'œil la cherche dans une liste de réglages.
 */
export const DansUneListeDeReglages: Story = {
  render: () => (
    <div className="flex w-[340px] flex-col gap-md">
      <Label className="justify-between font-normal">Afficher les champs vides<Switch /></Label>
      <Label className="justify-between font-normal">Mode expert<Switch defaultChecked /></Label>
      <Label className="justify-between font-normal text-text-muted">
        Synchronisation automatique<Switch disabled />
      </Label>
    </div>
  ),
};
