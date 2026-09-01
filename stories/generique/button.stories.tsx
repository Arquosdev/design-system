import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../components/button/button.web';
import specification from '../../components/button/button.spec.md?raw';
import { choices, docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Button',
  component: Button,
  parameters: docsDe(specification),
  args: { children: 'Enregistrer' },
  argTypes: {
    variant: choices(
      ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
      "Le poids visuel dit l'importance de l'action, pas sa nature.",
    ),
    size: choices(['default', 'sm', 'lg', 'icon'], 'Les tailles de shadcn.'),
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

/**
 * **Le geste est impossible ici, et le bouton peut dire pourquoi.**
 *
 * Louis, le 01/09/2026 : « on dirait que c'est un bouton qui est cliquable ».
 * La plaque grise est la même pour toutes les variantes — c'est ce qui la fait
 * lire comme un état et non comme une action de moindre poids.
 *
 * Survoler le bouton : la raison paraît. C'est ce que `disabled` ne peut pas
 * faire, puisqu'il ne reçoit ni survol ni focus.
 */
export const Inactif: Story = {
  args: {
    inactive: true,
    inactiveReason: 'Choisissez une agence pour créer un équipement',
    children: 'Nouvel équipement',
  },
};

/**
 * Les six variantes une fois inactives : elles rendent toutes la même plaque.
 * Comparer avec « Variantes » — c'est là que se voit ce qui change.
 */
export const InactifToutesVariantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Button inactive>Enregistrer</Button>
      <Button variant="secondary" inactive>Compléter</Button>
      <Button variant="outline" inactive>Annuler</Button>
      <Button variant="ghost" inactive>Afficher les champs vides</Button>
      <Button variant="destructive" inactive>Supprimer</Button>
      <Button variant="link" inactive>En savoir plus</Button>
    </div>
  ),
};

/**
 * La raison écrite à l'écran plutôt qu'en infobulle : pas d'`inactiveReason`
 * alors, sinon un lecteur d'écran la lit deux fois.
 */
export const InactifRaisonVisible: Story = {
  render: () => (
    <div className="flex items-center justify-end gap-sm">
      <p className="whitespace-nowrap text-caption text-text-muted">
        Choisissez une agence pour créer un client.
      </p>
      <Button inactive>Nouveau client</Button>
    </div>
  ),
};

/**
 * `disabled` reste : le contrôle qui n'est pas là pour cet utilisateur, et dont
 * il n'y a rien à dire. Il sort de l'ordre de tabulation.
 */
export const Desactive: Story = { args: { disabled: true } };
