import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from '../../components/skeleton/skeleton.web';
import specification from '../../components/skeleton/skeleton.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Générique/Skeleton',
  component: Skeleton,
  parameters: docsDe(specification),
  args: { className: 'h-4 w-40' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * Le composant ne connaît aucune forme d'écran : il se compose. Voici le rail
 * de rubriques de la fiche en attente — huit lignes et leurs compteurs.
 *
 * L'assemblage reste dans l'app : il épouse une mise en page qui n'appartient
 * pas au design system.
 */
export const UnRailEnAttente: Story = {
  render: () => (
    <div className="flex w-[240px] flex-col gap-sm rounded-md border border-border-soft p-base">
      {[40, 28, 36, 30, 24, 34, 30, 26].map((l, i) => (
        <div key={i} className="flex items-center justify-between gap-sm">
          <Skeleton className="h-4" style={{ width: `${l * 4}px` }} />
          <Skeleton className="h-3 w-5" />
        </div>
      ))}
    </div>
  ),
};

/** `rond` pour une pastille ou un avatar. La taille se donne en classes. */
export const Formes: Story = {
  render: () => (
    <div className="flex items-center gap-base">
      <Skeleton rond className="size-11" />
      <div className="flex flex-col gap-xs">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  ),
};
