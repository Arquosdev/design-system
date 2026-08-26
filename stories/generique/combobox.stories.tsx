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
].map((m) => ({ valeur: m.toLowerCase().replace(/ /g, '_'), libelle: m }));

const meta = {
  title: 'Composants/Générique/Combobox',
  component: Combobox,
  parameters: docsDe(specification),
  // Chaque histoire rend son propre exemple, mais `StoryObj<typeof meta>` exige
  // quand même les props obligatoires : sans ces valeurs par défaut, `tsc`
  // refuse les histoires qui n'ont qu'un `render`.
  args: { options: MARQUES, valeur: 'otis', onValeur: () => {} },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Un champ, et la liste qui se resserre dessous à mesure qu'on tape. */
export const Defaut: Story = {
  render: function Rendu() {
    const [valeur, setValeur] = React.useState('otis');
    return (
      <div className="w-[280px]">
        <Combobox
          options={MARQUES}
          valeur={valeur}
          onValeur={setValeur}
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
    const [valeur, setValeur] = React.useState('');
    return (
      <div className="w-[280px]">
        <Combobox
          options={MARQUES}
          valeur={valeur}
          onValeur={setValeur}
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
    const [valeur, setValeur] = React.useState('ASCENSEURS DU MIDI');
    return (
      <div className="w-[280px]">
        <Combobox
          options={MARQUES}
          valeur={valeur}
          onValeur={setValeur}
          ariaLabel="Marque machine"
        />
      </div>
    );
  },
};
