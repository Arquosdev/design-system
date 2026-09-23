import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../../components/label/label.web';
import { RadioGroup, RadioGroupItem } from '../../components/radio-group/radio-group.web';
import specification from '../../components/radio-group/radio-group.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/RadioGroup',
  component: RadioGroup,
  parameters: docsDe(specification),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  render: () => (
    <RadioGroup defaultValue="traction">
      <Label className="gap-sm font-normal"><RadioGroupItem value="traction" /> Traction à câbles</Label>
      <Label className="gap-sm font-normal"><RadioGroupItem value="hydraulique" /> Hydraulique</Label>
      <Label className="gap-sm font-normal"><RadioGroupItem value="unknown" /> Non déterminé</Label>
    </RadioGroup>
  ),
};

/**
 * Un groupe radio **ne se dévalide pas au clic** : une fois une option prise,
 * on ne revient pas à « aucune ». Si « aucune » est une réponse valable, elle
 * doit être une option — ici « Sans objet ».
 */
export const PrevoirLAucune: Story = {
  render: () => (
    <RadioGroup>
      <Label className="gap-sm font-normal"><RadioGroupItem value="oui" /> Conforme</Label>
      <Label className="gap-sm font-normal"><RadioGroupItem value="non" /> Non conforme</Label>
      <Label className="gap-sm font-normal"><RadioGroupItem value="so" /> Sans objet</Label>
    </RadioGroup>
  ),
};
