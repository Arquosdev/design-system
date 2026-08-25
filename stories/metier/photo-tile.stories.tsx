import type { Meta, StoryObj } from '@storybook/react-vite';

import { PhotoTile } from '../../components/photo-tile/photo-tile.web';
import specification from '../../components/photo-tile/photo-tile.spec.md?raw';
import { docsDe } from '../fiche';

const carre = (fond: string, texte: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${fond}"/><text x="200" y="160" font-family="sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">${texte}</text></svg>`,
  );

const meta = {
  title: 'Métier/PhotoTile',
  component: PhotoTile,
  parameters: docsDe(specification),
  args: { nom: 'Façade de l’immeuble', url: carre('#0D5AB7', 'Façade') },
} satisfies Meta<typeof PhotoTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Prise: Story = {};

/**
 * L'absence de photo est une information : elle dit ce qui reste à prendre. La
 * tuile reste, avec sa légende.
 */
export const NonPrise: Story = { args: { url: undefined } };

/** Essentielle et non prise : c'est un manque, pas un vide. */
export const EssentielleManquante: Story = {
  args: { nom: 'Plaque de charge', url: undefined, essentielle: true },
};

/** Une grille de zone, telle que la rubrique Photos la rend. */
export const Grille: Story = {
  render: () => (
    <div className="grid max-w-[760px] grid-cols-5 gap-md">
      <PhotoTile nom="Façade de l’immeuble" url={carre('#0D5AB7', 'Façade')} onOuvrir={() => {}} />
      <PhotoTile nom="Accès à l’ascenseur" url={carre('#00295B', 'Accès')} onOuvrir={() => {}} />
      <PhotoTile nom="Plan d’évacuation" url={carre('#3B6DA7', 'Plan')} onOuvrir={() => {}} />
      <PhotoTile nom="Plaque de charge" essentielle />
      <PhotoTile nom="Toit de cabine" />
    </div>
  ),
};
