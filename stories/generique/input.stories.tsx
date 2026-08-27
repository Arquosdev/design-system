import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../../components/input/input.web';
import { Label } from '../../components/label/label.web';
import specification from '../../components/input/input.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Input',
  component: Input,
  parameters: docsDe(specification),
  args: { placeholder: 'ex. Hauteur libre sous linteau' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { render: (a) => <Input {...a} className="w-[320px]" /> };

/** Toujours un intitulé associé : la marque de réserve disparaît dès qu'on tape. */
export const AvecSonIntitule: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-xs">
      <Label htmlFor="i-1">Height libre sous linteau</Label>
      <Input id="i-1" type="number" placeholder="en mm" />
    </div>
  ),
};

export const EnErreur: Story = {
  render: () => <Input defaultValue="35000" aria-invalid className="w-[320px]" />,
};

export const Desactive: Story = {
  render: () => <Input disabled defaultValue="Verrouillé" className="w-[320px]" />,
};
