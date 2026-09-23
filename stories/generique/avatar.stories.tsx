import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from '../../components/avatar/avatar.web';
import specification from '../../components/avatar/avatar.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Avatar',
  component: Avatar,
  parameters: docsDe(specification),
  args: { initials: 'TL', label: 'Thomas Lauzanne' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * Les initiales sont **toujours rendues dessous**. Ici la photo pointe vers un
 * lien mort — exactement le cas d'un lien de stockage expiré, qui est courant
 * et non exceptionnel. Les initiales restent, au lieu d'une bulle vide.
 */
export const PhotoCassee: Story = {
  args: { photo: 'https://exemple.invalide/photo.jpg', initials: 'OM', label: 'Ombeline M.' },
};

/** La taille se règle en classes, pas en prop. */
export const Tailles: Story = {
  render: () => (
    <div className="flex items-center gap-base">
      <Avatar initials="TL" label="Thomas Lauzanne" className="size-6 text-caption" />
      <Avatar initials="TL" label="Thomas Lauzanne" className="size-8 text-small" />
      <Avatar initials="TL" label="Thomas Lauzanne" />
    </div>
  ),
};
