import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../../components/checkbox/checkbox.web';
import { Label } from '../../components/label/label.web';
import specification from '../../components/checkbox/checkbox.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Checkbox',
  component: Checkbox,
  parameters: docsDe(specification),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/** L'intitulé enveloppe la case : toute la ligne devient cliquable. */
export const AvecSonIntitule: Story = {
  render: () => (
    <Label className="gap-sm font-normal">
      <Checkbox defaultChecked /> Machinerie accessible sans clé
    </Label>
  ),
};

/** Les trois états. Le partiel dit « certaines, pas toutes ». */
export const LesTroisEtats: Story = {
  render: () => (
    <div className="flex flex-col gap-sm">
      <Label className="gap-sm font-normal"><Checkbox /> Décochée</Label>
      <Label className="gap-sm font-normal"><Checkbox checked /> Cochée</Label>
      <Label className="gap-sm font-normal"><Checkbox checked="indeterminate" /> Partielle</Label>
      <Label className="gap-sm font-normal"><Checkbox disabled checked /> Désactivée</Label>
    </div>
  ),
};
