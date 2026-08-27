import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../../components/badge/badge.web';
import specification from '../../components/badge/badge.spec.md?raw';
import { choices, docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Badge',
  component: Badge,
  parameters: docsDe(specification),
  args: { children: 'Résolu' },
  argTypes: {
    variant: choices(
      [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
        'muted',
      ],
      "La variante dit un ÉTAT, pas une couleur qu'on aurait trouvée jolie.",
    ),
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * `success`, `warning`, `info` et `muted` n'existent pas chez shadcn : le métier
 * les réclame — un composant est bon, moyen ou mauvais, « sans objet » n'est pas
 * la même chose que « non renseigné », et une décision prise n'est ni un succès
 * ni une alerte.
 */
export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Badge>Par défaut</Badge>
      <Badge variant="secondary">Secondaire</Badge>
      <Badge variant="success">Bon</Badge>
      <Badge variant="warning">Moyen</Badge>
      <Badge variant="destructive">Mauvais</Badge>
      <Badge variant="info">Réglages technicien</Badge>
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
      ].map(([name, variant, texte]) => (
        <div key={name} className="flex items-center justify-between gap-md">
          <span className="text-small text-text">{name}</span>
          <Badge variant={variant as 'success'}>{texte}</Badge>
        </div>
      ))}
    </div>
  ),
};

/**
 * **Fond clair ou fond plein ?** Les variantes à fond clair lisent comme un
 * état — quelque chose qui *est*. `default` et `secondary` sont pleins et lisent
 * comme un bouton — quelque chose sur quoi on *appuie*.
 *
 * Au bout d'une ligne de liste, la différence n'est pas décorative : un badge
 * plein promet une action qui n'existe pas. C'est arrivé le 25/08/2026 sur
 * l'action d'un écart, posée en `default` puis reprise en `info`.
 */
export const EtatOuBouton: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap items-center gap-sm">
        <span className="w-[150px] text-small text-text-muted">Lit comme un état</span>
        <Badge variant="success">Bon</Badge>
        <Badge variant="warning">Moyen</Badge>
        <Badge variant="destructive">Mauvais</Badge>
        <Badge variant="info">Travaux</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-sm">
        <span className="w-[150px] text-small text-text-muted">Lit comme un bouton</span>
        <Badge>Par défaut</Badge>
        <Badge variant="secondary">Secondaire</Badge>
      </div>
    </div>
  ),
};
