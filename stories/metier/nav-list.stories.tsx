import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { NavList } from '../../components/nav-list/nav-list.web';
import specification from '../../components/nav-list/nav-list.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Métier/NavList',
  component: NavList,
  parameters: docsDe(specification),
} satisfies Meta<typeof NavList>;

export default meta;
type Story = StoryObj<typeof meta>;

const RUBRIQUES = [
  { cle: 'overview', label: "Vue d'ensemble" },
  { cle: 'photos', label: 'Photos', compteur: 57 },
  { cle: 'tech', label: 'Données techniques', compteur: 88 },
  { cle: 'general', label: 'Client & immeuble', compteur: 23 },
  { cle: 'cotes', label: 'Cotes', compteur: 215 },
  { cle: 'etats', label: 'États & remplacements', compteur: '7 à rempl.' },
  { cle: 'ecarts', label: 'Écarts', compteur: 4 },
  { cle: 'eds', label: 'Étude de sécurité', compteur: '1 NC' },
  { cle: 'docs', label: 'Documents' },
];

/** Le rail de la fiche équipement. Le compteur dit ce que contient la rubrique. */
export const Defaut: Story = {
  args: { items: RUBRIQUES, courant: 'tech', onChoisir: () => {} },
  render: function Rendu(args) {
    const [courant, setCourant] = React.useState(args.courant);
    return (
      <div className="w-[268px] rounded-md bg-bg-muted p-base">
        <NavList {...args} courant={courant} onChoisir={setCourant} />
      </div>
    );
  },
};

/**
 * Un compteur peut être une chaîne : « … » tant qu'on ne sait pas. « 0 »
 * affirmerait qu'il n'y a rien, ce qui n'est pas la même chose.
 */
export const CompteursInconnus: Story = {
  ...Defaut,
  args: {
    courant: 'overview',
    onChoisir: () => {},
    items: RUBRIQUES.map((r) => ({ ...r, compteur: r.compteur === undefined ? undefined : '…' })),
  },
};

/**
 * En mode relevé, une rubrique qu'aucun relevé n'alimente n'est pas cliquable :
 * mieux vaut un menu qui refuse d'y aller qu'une rubrique ouverte et vide.
 */
export const RubriquesHorsPerimetre: Story = {
  ...Defaut,
  args: {
    courant: 'tech',
    onChoisir: () => {},
    items: [
      { cle: 'overview', label: "Vue d'ensemble" },
      { cle: 'photos', label: 'Photos', compteur: 57 },
      { cle: 'tech', label: 'Données techniques', compteur: '+62' },
      { cle: 'general', label: 'Client & immeuble', compteur: '—', desactive: true },
      { cle: 'cotes', label: 'Cotes', compteur: '+194' },
      { cle: 'eds', label: 'Étude de sécurité', compteur: '—', desactive: true },
    ],
  },
};

/** Avec un intitulé repliable, pour les quinze composants d'un appareil. */
export const Repliable: Story = {
  ...Defaut,
  args: {
    titre: 'Composants',
    repliable: true,
    courant: 'c:machine',
    onChoisir: () => {},
    items: [
      { cle: 'c:machine', label: 'Machine', compteur: 152 },
      { cle: 'c:armoire', label: 'Armoire de manœuvre', compteur: 33 },
      { cle: 'c:cabine', label: 'Cabine', compteur: 43 },
      { cle: 'c:limiteur', label: 'Limiteur de vitesse', compteur: 27 },
    ],
  },
};
