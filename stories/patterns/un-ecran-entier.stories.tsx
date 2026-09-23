import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Badge } from '../../components/badge/badge.web';
import { Banner } from '../../components/banner/banner.web';
import { Button } from '../../components/button/button.web';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card/card.web';
import { DataTable } from '../../components/data-table/data-table.web';
import { FieldRow } from '../../components/field-row/field-row.web';
import { Icon } from '../../components/icon/icon.web';
import { NavList } from '../../components/nav-list/nav-list.web';
import { SegmentedTabs } from '../../components/segmented-tabs/segmented-tabs.web';
import { Skeleton } from '../../components/skeleton/skeleton.web';

/**
 * **Le système assemblé, avec du contenu réel.**
 *
 * Les 97 autres histoires montrent un composant isolé. Or les décisions qui font
 * mal ne sont pas dans le bouton : elles sont dans la densité, le rythme
 * vertical, et la cohabitation d'un rail, d'une carte et d'un tableau sur la
 * même page.
 *
 * Cet écran reprend la fiche d'équipement — les vraies rubriques, les vrais
 * champs, les vraies cotes. C'est ce qu'un designer regarde en premier, et ce
 * qui révèle les défauts d'espacement qu'aucune histoire isolée ne montre.
 */
const meta = {
  title: 'Patterns/Un écran entier',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const RUBRIQUES = [
  { id: 'ensemble', label: "Vue d'ensemble" },
  { id: 'photos', label: 'Photos', count: 42 },
  { id: 'technique', label: 'Données techniques', count: 18 },
  { id: 'client', label: 'Client & immeuble', count: 9 },
  { id: 'cotes', label: 'Cotes', count: 24 },
  { id: 'ecarts', label: 'Écarts', count: 4 },
  { id: 'safety', label: 'Étude de sécurité', count: '1 NC' },
  { id: 'documents', label: 'Documents', count: 12 },
];

export const FicheDEquipement: Story = {
  render: function Ecran() {
    const [onglet, setOnglet] = React.useState('specFile');
    const [rubrique, setRubrique] = React.useState('client');

    return (
      <div className="flex h-[760px] flex-col bg-bg">
        <Banner icon="info">
          Jeu de démonstration — aucune donnée réelle.
        </Banner>

        <div className="flex min-h-0 flex-1">
          {/* Le rail : recherche, bascule, rubriques. */}
          <aside className="flex w-[284px] shrink-0 flex-col gap-base overflow-y-auto border-r border-border-soft bg-bg-subtle p-base">
            <button
              type="button"
              className="flex h-[36px] shrink-0 items-center gap-sm rounded-control border border-border bg-bg px-md text-left text-small text-text-muted outline-none hover:bg-bg-muted focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon role="search" size="sm" />
              <span className="min-w-0 flex-1 truncate">Rechercher un champ</span>
            </button>

            <SegmentedTabs
              ariaLabel="Contenu du rail"
              value={onglet}
              onChange={setOnglet}
              segments={[
                { id: 'specFile', label: 'Fiche', count: 8 },
                { id: 'composants', label: 'Composants', count: 15 },
              ]}
            />

            <NavList items={RUBRIQUES} current={rubrique} onChoose={setRubrique} />
          </aside>

          <main className="min-w-0 flex-1 overflow-y-auto p-xl">
            <div className="mb-lg flex flex-wrap items-start justify-between gap-base">
              <div>
                <h1 className="text-title font-bold tracking-tight text-text">Client &amp; immeuble</h1>
                <p className="mt-xxs text-small text-text-muted">
                  Le client, l’immeuble et ses accès.
                </p>
              </div>
              <Button>Compléter</Button>
            </div>

            <div className="flex flex-col gap-lg">
              <Card>
                <CardHeader>
                  <CardTitle>Immeuble</CardTitle>
                  <Badge variant="success">Conforme</Badge>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <FieldRow label="Immeuble" value="Imm. 1 Rue Max Fauchon" />
                  <FieldRow label="Adresse" value="1 rue Max Fauchon, 29200 Brest" />
                  <FieldRow label="Cage / desserte" value="Hall d’entrée" />
                  <FieldRow label="Accès machinerie" value="Toiture — clé 3B" status="to_check" />
                  <FieldRow label="Nombre de logements" value="48" />
                  <FieldRow label="Gardien sur site" value={null} />
                </CardContent>
              </Card>

              <DataTable
                title="Baies palières"
                note="Les cotes sont en mm."
                columns={['Niveau', 'Largeur', 'Hauteur', 'Retombée']}
                rows={[
                  ['Rez-de-chaussée', '900', '2000', '340'],
                  ['Niveau 1', '900', '2000', '340'],
                  ['Niveau 2', '900', '2000', ''],
                  ['Niveau 3', '800', '2000', '360'],
                ]}
              />

              {/* Une zone encore en attente : le squelette occupe sa place au
                  lieu de laisser un blanc qui se lirait comme « il n'y a rien ». */}
              <section aria-busy="true" className="flex flex-col gap-sm">
                <h2 className="text-subhead font-semibold text-text">Écarts ouverts</h2>
                <div className="flex flex-col gap-sm rounded-md border border-border-soft p-base">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between gap-base">
                      <Skeleton className="h-4 w-[46%]" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    );
  },
};
