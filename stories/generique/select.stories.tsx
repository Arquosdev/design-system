import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../components/select/select.web';
import specification from '../../components/select/select.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Générique/Select',
  component: Select,
  parameters: docsDe(specification),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Le menu d'action d'un écart — trois choix, plus « aucune ». */
export const Defaut: Story = {
  render: function Rendu() {
    const [valeur, setValeur] = React.useState('r_parations');
    return (
      <Select value={valeur} onValueChange={setValeur}>
        <SelectTrigger aria-label="Action à mener">
          <SelectValue placeholder="Aucune action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aucune">Aucune action</SelectItem>
          <SelectItem value="r_glages_technicien">Réglages technicien</SelectItem>
          <SelectItem value="r_parations">Réparations</SelectItem>
          <SelectItem value="travaux">Travaux</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

/**
 * La gâchette s'ajuste à son contenu. C'est l'écart qu'on assume avec shadcn :
 * un menu de trois choix étiré sur un tiers d'écran promet une saisie longue là
 * où il n'y a qu'un mot à choisir. `w-full` la rend à qui la veut.
 */
export const Largeur: Story = {
  render: () => (
    <div className="flex max-w-[420px] flex-col gap-md">
      <div>
        <div className="mb-xxs text-caption text-text-subtle">Au contenu (défaut)</div>
        <Select defaultValue="travaux">
          <SelectTrigger aria-label="Action">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="r_parations">Réparations</SelectItem>
            <SelectItem value="travaux">Travaux</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className="mb-xxs text-caption text-text-subtle">Pleine largeur</div>
        <Select defaultValue="travaux">
          <SelectTrigger aria-label="Action" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="r_parations">Réparations</SelectItem>
            <SelectItem value="travaux">Travaux</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

/** Avec un intitulé de groupe et un séparateur, quand la liste a des familles. */
export const Groupes: Story = {
  render: () => (
    <Select defaultValue="moyen">
      <SelectTrigger aria-label="État constaté">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectLabel>Constaté</SelectLabel>
        <SelectItem value="bon">Bon</SelectItem>
        <SelectItem value="moyen">Moyen</SelectItem>
        <SelectItem value="mauvais">Mauvais</SelectItem>
        <SelectSeparator />
        <SelectItem value="na">Sans objet</SelectItem>
      </SelectContent>
    </Select>
  ),
};
