import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Combobox } from '../../components/combobox/combobox.web';
import specification from '../../components/combobox/combobox.spec.md?raw';
import { docsDe } from '../fiche';

/* Un extrait des marques du catalogue Arquos — il en compte quatre-vingts. */
const MARQUES = [
  'AKRON', 'ALBERTO SASSI', 'AMK', 'BASSANI LODO', 'BRUNCKEN', 'CECI',
  'ELEMOL', 'ETI', 'FERMATOR', 'GMV', 'KONE', 'MICROLIFT', 'MONITOR',
  'OCTE', 'ORONA', 'OTIS', 'SASSI', 'SCHINDLER', 'SEMATIC', 'THYSSEN',
  'WITTUR',
].map((m) => ({ value: m.toLowerCase().replace(/ /g, '_'), label: m }));

const meta = {
  title: 'Composants/Générique/Combobox',
  component: Combobox,
  parameters: docsDe(specification),
  // Chaque histoire rend son propre exemple, mais `StoryObj<typeof meta>` exige
  // quand même les props obligatoires : sans ces valeurs par défaut, `tsc`
  // refuse les histoires qui n'ont qu'un `render`.
  args: { options: MARQUES, value: 'otis', onValue: () => {} },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Un champ, et la liste qui se resserre dessous à mesure qu'on tape. */
export const Defaut: Story = {
  render: function Rendu() {
    const [value, setValue] = React.useState('otis');
    return (
      <div className="w-[280px]">
        <Combobox
          options={MARQUES}
          value={value}
          onValue={setValue}
          ariaLabel="Marque machine"
          placeholder="Rechercher une marque"
        />
      </div>
    );
  },
};

/** Rien de retenu : le champ invite à taper plutôt qu'à dérouler. */
export const Vide: Story = {
  render: function Rendu() {
    const [value, setValue] = React.useState('');
    return (
      <div className="w-[280px]">
        <Combobox
          options={MARQUES}
          value={value}
          onValue={setValue}
          ariaLabel="Marque machine"
          placeholder="Rechercher une marque"
        />
      </div>
    );
  },
};

/**
 * Une valeur que le catalogue ne connaît pas s'écrit telle quelle. La taire
 * reviendrait à effacer à l'écran ce que la base contient.
 */
export const HorsCatalogue: Story = {
  render: function Rendu() {
    const [value, setValue] = React.useState('ASCENSEURS DU MIDI');
    return (
      <div className="w-[280px]">
        <Combobox
          options={MARQUES}
          value={value}
          onValue={setValue}
          ariaLabel="Marque machine"
        />
      </div>
    );
  },
};

/**
 * **Une liste qui déborde, et qui ne coupe pas d'entrée en deux.**
 *
 * C'est le cas du sélecteur d'agence, celui que Louis ouvre en premier. La liste
 * est bornée à dix entrées — 10 × 24 px, plus quatre de marge en haut et en bas
 * — donc ce qu'on voit du bord est une entrée entière, jamais un demi-glyphe.
 *
 * Et les entrées ont la densité d'un MENU : elles héritaient de celle de la
 * palette ⌘K, trente-six pixels de haut pour un mot.
 */
export const ListeQuiDeborde: Story = {
  render: function Rendu() {
    const [value, setValue] = React.useState('');
    return (
      <div className="h-[420px] w-[280px]">
        <Combobox
          options={MARQUES}
          value={value}
          onValue={setValue}
          ariaLabel="Marque machine"
          placeholder="Rechercher une marque"
        />
      </div>
    );
  },
};
