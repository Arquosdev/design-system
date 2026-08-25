import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../components/button/button.web';
import specification from '../../components/button/button.spec.md?raw';
import { choix, docsDe } from '../fiche';

const meta = {
  title: 'Générique/Button',
  component: Button,
  parameters: docsDe(specification),
  args: { children: 'Enregistrer' },
  argTypes: {
    variant: choix(
      ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
      "Le poids visuel dit l'importance de l'action, pas sa nature.",
    ),
    size: choix(['default', 'sm', 'lg', 'icon'], 'Les tailles de shadcn.'),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * L'action principale de l'écran. Une seule par écran : deux boutons pleins
 * côte à côte se disputent l'attention et n'en captent aucune.
 */
export const Defaut: Story = {};

/**
 * Les six variantes, dans l'ordre de poids. Le poids visuel dit l'importance de
 * l'action, pas sa nature — `destructive` est la seule exception, parce qu'une
 * suppression doit se voir avant d'être cliquée.
 */
export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Button>Enregistrer</Button>
      <Button variant="secondary">Compléter</Button>
      <Button variant="outline">Annuler</Button>
      <Button variant="ghost">Afficher les champs vides</Button>
      <Button variant="destructive">Supprimer</Button>
      <Button variant="link">En savoir plus</Button>
    </div>
  ),
};

export const Tailles: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Button size="sm">Petit</Button>
      <Button>Par défaut</Button>
      <Button size="lg">Grand</Button>
    </div>
  ),
};

export const Desactive: Story = { args: { disabled: true } };
