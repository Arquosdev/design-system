import type { Meta, StoryObj } from '@storybook/react-vite';

import { PhotoTile } from '../../components/photo-tile/photo-tile.web';
import specification from '../../components/photo-tile/photo-tile.spec.md?raw';
import { docsDe } from '../fiche';

/**
 * Une fausse photo aux dimensions demandées. Le rapport compte plus que le
 * dessin : c'est lui qui décide si la vignette recadre ou contient.
 */
const photo = (largeur: number, hauteur: number, fond: string, texte: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${hauteur}">` +
      `<rect width="${largeur}" height="${hauteur}" fill="${fond}"/>` +
      `<text x="${largeur / 2}" y="${hauteur / 2}" font-family="sans-serif" font-size="${Math.round(Math.min(largeur, hauteur) / 8)}" fill="#ffffff" text-anchor="middle">${texte}</text>` +
      `</svg>`,
  );

/** Le format d'une photo de relevé : téléphone tenu droit, rapport 0,77. */
const portrait = (fond: string, texte: string) => photo(1080, 1400, fond, texte);

const meta = {
  title: 'Métier/PhotoTile',
  component: PhotoTile,
  parameters: docsDe(specification),
  args: { nom: 'Façade de l’immeuble', url: portrait('#0D5AB7', 'Façade') },
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

/**
 * Une photo en travers du cadre se **contient** au lieu de se recadrer. Les
 * vingt-trois pour cent de photos en paysage sont souvent des captures d'écran ;
 * rognées aux deux tiers, elles ne se reconnaîtraient plus.
 */
export const EnTravers: Story = {
  args: { nom: 'Rapport de contrôle', url: photo(1600, 740, '#00295B', 'Paysage') },
};

/** Une grille de zone, telle que la rubrique Photos la rend. */
export const Grille: Story = {
  render: () => (
    <div className="grid max-w-[760px] grid-cols-6 gap-md">
      <PhotoTile nom="Façade de l’immeuble" url={portrait('#0D5AB7', 'Façade')} onOuvrir={() => {}} />
      <PhotoTile nom="Accès à l’ascenseur" url={portrait('#00295B', 'Accès')} onOuvrir={() => {}} />
      <PhotoTile nom="Porte palière niveau principal" url={portrait('#3B6DA7', 'Porte')} onOuvrir={() => {}} />
      <PhotoTile
        nom="Rapport de contrôle"
        url={photo(1600, 740, '#6B7280', 'Paysage')}
        onOuvrir={() => {}}
      />
      <PhotoTile nom="Plaque de charge" essentielle />
      <PhotoTile nom="Toit de cabine" />
    </div>
  ),
};
