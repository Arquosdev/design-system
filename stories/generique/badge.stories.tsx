import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../../components/badge/badge.web';
import specification from '../../components/badge/badge.spec.md?raw';
import { choix, docsDe } from '../fiche';

const meta = {
  title: 'Générique/Badge',
  component: Badge,
  parameters: docsDe(specification),
  args: { children: 'Résolu' },
  argTypes: {
    variant: choix(
      ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'muted'],
      "La variante dit un ÉTAT, pas une couleur qu'on aurait trouvée jolie.",
    ),
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * `success`, `warning` et `muted` n'existent pas chez shadcn : le métier les
 * réclame — un composant est bon, moyen ou mauvais, et « sans objet » n'est pas
 * la même chose que « non renseigné ».
 */
export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Badge>Par défaut</Badge>
      <Badge variant="secondary">Secondaire</Badge>
      <Badge variant="success">Bon</Badge>
      <Badge variant="warning">Moyen</Badge>
      <Badge variant="destructive">Mauvais</Badge>
      <Badge variant="muted">Sans objet</Badge>
      <Badge variant="outline">Contour</Badge>
    </div>
  ),
};

/** Ce que la fiche équipement en fait : l'état constaté de chaque composant. */
export const DansLaFiche: Story = {
  render: () => (
    <div className="flex max-w-[320px] flex-col gap-sm">
      {[
        ['Machine', 'success', 'Bon'],
        ['Armoire de manœuvre', 'warning', 'Moyen'],
        ['Cabine', 'destructive', 'Mauvais'],
        ['Contrepoids', 'muted', 'Non renseigné'],
      ].map(([nom, variant, texte]) => (
        <div key={nom} className="flex items-center justify-between gap-md">
          <span className="text-small text-text">{nom}</span>
          <Badge variant={variant as 'success'}>{texte}</Badge>
        </div>
      ))}
    </div>
  ),
};
