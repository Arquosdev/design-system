import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../../components/checkbox/checkbox.web';
import { Input } from '../../components/input/input.web';
import { Label } from '../../components/label/label.web';
import specification from '../../components/label/label.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Label',
  component: Label,
  parameters: docsDe(specification),
  args: { children: 'N° de série' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * Deux façons d'associer, et il ne faut pas les cumuler : `htmlFor` pointant
 * l'`id`, ou l'enveloppement. La seconde agrandit la cible de clic à toute la
 * ligne, ce qui change tout sur une case de 18 px.
 */
export const LesDeuxFacons: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-base">
      <div className="flex flex-col gap-xs">
        <Label htmlFor="l-1">Par htmlFor</Label>
        <Input id="l-1" placeholder="N° de série" />
      </div>
      <Label className="gap-sm font-normal">
        <Checkbox /> Par enveloppement — toute la ligne est cliquable
      </Label>
    </div>
  ),
};
