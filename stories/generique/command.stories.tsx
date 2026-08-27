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
  title: 'Composants/Générique/Command',
  component: CommandDialog,
  subcomponents: { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem },
  parameters: { ...docsDe(specification), layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const CHAMPS = [
  { group: 'Données techniques · Données techniques générales', label: 'Charge utile', value: '300' },
  { group: 'Données techniques · Données techniques générales', label: 'Vitesse (m/s)', value: '1' },
  { group: 'Données techniques · Module GSM', label: 'Marque module GSM', value: 'SCHINDLER' },
  { group: 'Machine · Machine', label: 'Diamètre poulie (mm)', value: '' },
  { group: 'Machine · Machine', label: 'Marque', value: 'ORONA' },
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
            c.label.toLowerCase().includes(q) || c.value.toLowerCase().includes(q),
        )
      : CHAMPS;

    const groupes = [...new Set(retenus.map((c) => c.group))];

    return (
      <>
        <Button onClick={() => setOuverte(true)}>Rechercher un champ (⌘K)</Button>
        <CommandDialog
          title="Recherche de champ"
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
            <CommandEmpty>NoneA champ ne correspond.</CommandEmpty>
            {groupes.map((g) => (
              <CommandGroup key={g} heading={g}>
                {retenus
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <CommandItem key={c.label} value={c.label} onSelect={() => setOuverte(false)}>
                      <span className="min-w-0 flex-1 truncate">{c.label}</span>
                      <span
                        className={
                          c.value
                            ? 'shrink-0 font-semibold text-text-muted'
                            : 'shrink-0 text-text-muted'
                        }
                      >
                        {c.value || 'Non renseigné'}
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
