import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../../components/badge/badge.web';
import { EmptyState } from '../../components/empty-state/empty-state.web';
import { Meter } from '../../components/meter/meter.web';
import { RecordTable } from '../../components/record-table/record-table.web';
import type { SortState } from '../../components/record-table/record-table.logic';
import specification from '../../components/record-table/record-table.spec.md?raw';
import { docsDe } from '../fiche';

type Equipement = {
  id: string;
  numero: string;
  type: string;
  adresse: string;
  contrat: 'Parc' | 'Hors parc';
  technicien: string | null;
  annee: number | null;
  taux: number;
};

const PARC: Equipement[] = [
  { id: '1', numero: '53 A 0147 01', type: 'Ascenseur', adresse: '3 Rue des Archives, Laval', contrat: 'Parc', technicien: 'Bertrand Schweitzer', annee: 1994, taux: 92 },
  { id: '2', numero: '53 A 0155 01', type: 'Monte-charge', adresse: '17 Rue du Lycée, Laval', contrat: 'Parc', technicien: 'Julien Marchand', annee: 2003, taux: 78 },
  { id: '3', numero: '53 A 0163 01', type: 'Porte/fermeture', adresse: '28 Bd de Tours, Laval', contrat: 'Hors parc', technicien: null, annee: null, taux: 41 },
  { id: '4', numero: '53 A 0171 01', type: 'Ascenseur', adresse: '11 Av. de Verdun, Laval', contrat: 'Parc', technicien: 'Karim Benali', annee: 1979, taux: 22 },
  { id: '5', numero: '53 A 0144 01', type: 'Élévateur', adresse: '7 Rue Haute, Saint-Berthevin', contrat: 'Hors parc', technicien: null, annee: 2014, taux: 8 },
];

const NOT_FILLED = <span className="text-text-muted">Non renseigné</span>;

const COLUMNS = [
  { id: 'type', header: 'Type', render: (e: Equipement) => e.type, value: (e: Equipement) => e.type },
  { id: 'adresse', header: 'Adresse', width: '16rem', render: (e: Equipement) => e.adresse, value: (e: Equipement) => e.adresse },
  {
    id: 'contrat',
    header: 'Contrat',
    render: (e: Equipement) =>
      e.contrat === 'Parc' ? <Badge variant="info">Parc</Badge> : <Badge variant="muted">Hors parc</Badge>,
    value: (e: Equipement) => e.contrat,
  },
  { id: 'technicien', header: 'Technicien', render: (e: Equipement) => e.technicien ?? NOT_FILLED, value: (e: Equipement) => e.technicien },
  { id: 'annee', header: 'Année', numeric: true, render: (e: Equipement) => e.annee ?? NOT_FILLED, value: (e: Equipement) => e.annee },
  {
    id: 'taux',
    header: 'Taux de connaissance',
    width: '11rem',
    render: (e: Equipement) => <Meter value={e.taux} label="Taux de connaissance" />,
    value: (e: Equipement) => e.taux,
  },
];

const IDENTITY = {
  header: "N° d'équipement",
  render: (e: Equipement) => e.numero,
  value: (e: Equipement) => e.numero,
};

const meta = {
  title: 'Composants/Générique/RecordTable',
  component: RecordTable,
  parameters: { ...docsDe(specification), layout: 'padded' },
  args: {
    rows: PARC,
    columns: COLUMNS,
    rowKey: (e: Equipement) => e.id,
    identity: IDENTITY,
  },
} satisfies Meta<typeof RecordTable<Equipement>>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ avecSelection = true }: { avecSelection?: boolean }) {
  const [sort, setTri] = React.useState<SortState | null>(null);
  const [chosen, setChosen] = React.useState<Set<string>>(new Set());

  return (
    <RecordTable<Equipement>
      rows={PARC}
      columns={COLUMNS}
      rowKey={(e) => e.id}
      identity={IDENTITY}
      onOpen={() => {}}
      sort={{ state: sort, onChange: setTri }}
      selection={
        avecSelection
          ? { values: chosen, onChange: setChosen, name: 'équipement' }
          : undefined
      }
    />
  );
}

export const Defaut: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Cliquer un en-tête trie, le recliquer inverse, le recliquer encore retire le tri — sans ce troisième pas, on ne peut plus revenir à l'ordre d'origine. Trier « Année » montre que les valeurs absentes partent en fin de liste dans les deux sens.",
      },
    },
  },
  render: () => <Demo />,
};

export const SansSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Sans `selection`, la colonne de cases disparaît et l'identité se colle au bord. Une liste qu'on ne traite pas par lots n'a pas à porter des cases inertes.",
      },
    },
  },
  render: () => <Demo avecSelection={false} />,
};

export const Vide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Un tableau vide avec ses en-têtes laisse croire à un filtre mal réglé plutôt qu'à une liste vide. On passe un `EmptyState` en `vide`.",
      },
    },
  },
  render: () => (
    <RecordTable<Equipement>
      rows={[]}
      columns={COLUMNS}
      rowKey={(e) => e.id}
      identity={IDENTITY}
      empty={
        <EmptyState
          icon="filter"
          title="Aucun équipement ne correspond"
          hint="Trois filtres sont actifs. En retirer un élargira la recherche."
        />
      }
    />
  ),
};
