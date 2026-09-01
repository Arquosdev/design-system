import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { NavList } from '../../components/nav-list/nav-list.web';
import specification from '../../components/nav-list/nav-list.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Métier/NavList',
  component: NavList,
  parameters: docsDe(specification),
} satisfies Meta<typeof NavList>;

export default meta;
type Story = StoryObj<typeof meta>;

const RUBRIQUES = [
  { id: 'overview', label: "Vue d'ensemble" },
  { id: 'photos', label: 'Photos', count: 57 },
  { id: 'tech', label: 'Données techniques', count: 88 },
  { id: 'general', label: 'Client & immeuble', count: 23 },
  { id: 'cotes', label: 'Cotes', count: 215 },
  { id: 'etats', label: 'États & remplacements', count: '7 à rempl.' },
  { id: 'ecarts', label: 'Écarts', count: 4 },
  { id: 'eds', label: 'Étude de sécurité', count: '1 NC' },
  { id: 'docs', label: 'Documents' },
];

/** Le rail de la fiche équipement. Le compteur dit ce que contient la rubrique. */
export const Defaut: Story = {
  args: { items: RUBRIQUES, current: 'tech', onChoose: () => {} },
  render: function Rendu(args) {
    const [current, setCurrent] = React.useState(args.current);
    return (
      <div className="w-[268px] rounded-md bg-bg-muted p-base">
        <NavList {...args} current={current} onChoose={setCurrent} />
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
    current: 'overview',
    onChoose: () => {},
    items: RUBRIQUES.map((r) => ({ ...r, count: r.count === undefined ? undefined : '…' })),
  },
};

/**
 * En mode relevé, une rubrique qu'aucun relevé n'alimente n'est pas cliquable :
 * mieux vaut un menu qui refuse d'y aller qu'une rubrique ouverte et vide.
 */
export const RubriquesHorsPerimetre: Story = {
  ...Defaut,
  args: {
    current: 'tech',
    onChoose: () => {},
    items: [
      { id: 'overview', label: "Vue d'ensemble" },
      { id: 'photos', label: 'Photos', count: 57 },
      { id: 'tech', label: 'Données techniques', count: '+62' },
      { id: 'general', label: 'Client & immeuble', count: '—', disabled: true },
      { id: 'cotes', label: 'Cotes', count: '+194' },
      { id: 'eds', label: 'Étude de sécurité', count: '—', disabled: true },
    ],
  },
};

/** Avec un intitulé repliable, pour les quinze composants d'un appareil. */
export const Repliable: Story = {
  ...Defaut,
  args: {
    title: 'Composants',
    collapsible: true,
    current: 'c:machine',
    onChoose: () => {},
    items: [
      { id: 'c:machine', label: 'Machine', count: 152 },
      { id: 'c:armoire', label: 'Armoire de manœuvre', count: 33 },
      { id: 'c:cabine', label: 'Cabine', count: 43 },
      { id: 'c:limiteur', label: 'Limiteur de vitesse', count: 27 },
    ],
  },
};
