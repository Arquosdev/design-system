import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../../components/label/label.web';
import { PasswordInput } from '../../components/password-input/password-input.web';
import specification from '../../components/password-input/password-input.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/PasswordInput',
  component: PasswordInput,
  parameters: docsDe(specification),
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  render: (a) => <PasswordInput {...a} className="w-[320px]" defaultValue="tres-secret" />,
};

/** Comme il se pose vraiment : un intitulé au-dessus, rien dans le champ. */
export const AvecSonIntitule: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-xs">
      <Label htmlFor="mdp-1">Votre mot de passe</Label>
      <PasswordInput id="mdp-1" autoComplete="current-password" />
    </div>
  ),
};

/**
 * L'erreur se dit par la bordure de l'enveloppe, et `aria-invalid` reste sur le
 * champ : c'est lui qu'annonce un lecteur d'écran, pas son décor.
 */
export const EnErreur: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-xs">
      <Label htmlFor="mdp-2">Votre mot de passe</Label>
      <PasswordInput id="mdp-2" aria-invalid defaultValue="court" />
    </div>
  ),
};

/** Le champ ET le bouton. Un œil actionnable sur un champ grisé ne promet rien. */
export const Desactive: Story = {
  render: () => <PasswordInput className="w-[320px]" disabled defaultValue="tres-secret" />,
};
