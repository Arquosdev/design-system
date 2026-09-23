import type { Meta, StoryObj } from '@storybook/react-vite';

import { EmptyState, EmptyStateError } from '../../components/empty-state/empty-state.web';
import specification from '../../components/empty-state/empty-state.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/EmptyState',
  component: EmptyState,
  parameters: docsDe(specification),
  args: {
    icon: 'document' as const,
    title: 'Aucun document',
    hint: 'Les pièces jointes au relevé apparaîtront ici.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * Le conseil compte autant que le titre. « Aucun résultat » seul laisse devant
 * un mur ; ce qui aide, c'est ce qu'on peut faire ensuite.
 */
export const AvecUneAction: Story = {
  args: {
    icon: 'filter',
    title: 'Aucun écart ne correspond',
    hint: 'Le filtre « Non résolus » masque les quatre écarts de cet appareil.',
    actionLabel: 'Retirer le filtre',
    onAction: () => {},
  },
};

/**
 * **Hors ligne, réessayer tout de suite ne sert à rien.** Le composant lit
 * l'erreur et change ses mots : dans une gaine sans réseau, un message générique
 * enverrait le technicien appuyer en boucle.
 *
 * La décision vit dans `empty-state.logic.ts` — le mobile la portait déjà,
 * enfouie dans son composant.
 */
export const LErreurChoisitSesMots: Story = {
  render: () => (
    <div className="flex flex-col divide-y divide-border-soft">
      <EmptyStateError error={new Error('Failed to fetch')} onReessayer={() => {}} />
      <EmptyStateError error={new Error('500 Internal Server Error')} onReessayer={() => {}} />
    </div>
  ),
};
