import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components/command/command.web';
import { Button } from '../../components/button/button.web';
import specification from '../../components/command/command.spec.md?raw';
import { docsDe } from '../fiche';

const meta: Meta = {
  title: 'Générique/Command',
  component: CommandDialog,
  subcomponents: { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem },
  parameters: { ...docsDe(specification), layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const CHAMPS = [
  { groupe: 'Données techniques · Données techniques générales', label: 'Charge utile', valeur: '300' },
  { groupe: 'Données techniques · Données techniques générales', label: 'Vitesse (m/s)', valeur: '1' },
  { groupe: 'Données techniques · Module GSM', label: 'Marque module GSM', valeur: 'SCHINDLER' },
  { groupe: 'Machine · Machine', label: 'Diamètre poulie (mm)', valeur: '' },
  { groupe: 'Machine · Machine', label: 'Marque', valeur: 'ORONA' },
];

/**
 * La palette de la fiche équipement : 810 champs sur un appareil, qu'on
 * atteindrait autrement en faisant défiler neuf rubriques.
 */
export const Defaut: Story = {
  render: function Rendu() {
    const [ouverte, setOuverte] = React.useState(false);
    const [question, setQuestion] = React.useState('');

    const q = question.trim().toLowerCase();
    const retenus = q
      ? CHAMPS.filter(
          (c) =>
            c.label.toLowerCase().includes(q) || c.valeur.toLowerCase().includes(q),
        )
      : CHAMPS;

    const groupes = [...new Set(retenus.map((c) => c.groupe))];

    return (
      <>
        <Button onClick={() => setOuverte(true)}>Rechercher un champ (⌘K)</Button>
        <CommandDialog
          titre="Recherche de champ"
          open={ouverte}
          onOpenChange={setOuverte}
          shouldFilter={false}
        >
          <CommandInput
            value={question}
            onValueChange={setQuestion}
            placeholder="Rechercher un champ (ex. diamètre, GSM, charge)…"
          />
          <CommandList>
            <CommandEmpty>Aucun champ ne correspond.</CommandEmpty>
            {groupes.map((g) => (
              <CommandGroup key={g} heading={g}>
                {retenus
                  .filter((c) => c.groupe === g)
                  .map((c) => (
                    <CommandItem key={c.label} value={c.label} onSelect={() => setOuverte(false)}>
                      <span className="min-w-0 flex-1 truncate">{c.label}</span>
                      <span
                        className={
                          c.valeur
                            ? 'shrink-0 font-semibold text-text-muted'
                            : 'shrink-0 text-text-muted'
                        }
                      >
                        {c.valeur || 'Non renseigné'}
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};
