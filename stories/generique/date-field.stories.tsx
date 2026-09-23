import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { DateField } from '../../components/date-field/date-field.web';
import { todayISO, toDisplay } from '../../components/date-field/date-field.logic';
import specification from '../../components/date-field/date-field.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/DateField',
  component: DateField,
  // Le couple obligatoire, que chaque histoire reprend à son compte : elles
  // tiennent la valeur en état pour montrer ce que l'appelant reçoit.
  args: { value: '1978-03-04', onValue: () => {} },
  parameters: docsDe(specification),
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Ce que l'appelant reçoit est affiché sous le champ, et c'est le point de la
 * démonstration : on tape `12/09/2026`, il reçoit `2026-09-12`.
 */
export const Defaut: Story = {
  render: function Rendu() {
    const [value, setValue] = React.useState<string | null>('1978-03-04');
    return (
      <div className="flex max-w-[280px] flex-col gap-sm">
        <DateField value={value} onValue={setValue} ariaLabel="Date de mise en service" />
        <Sortie value={value} />
      </div>
    );
  },
};

/** Un champ qui n'a pas encore de date. La réserve dit le format attendu. */
export const Vide: Story = {
  render: function Rendu() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="flex max-w-[280px] flex-col gap-sm">
        <DateField value={value} onValue={setValue} ariaLabel="Date de visite" />
        <Sortie value={value} />
      </div>
    );
  },
};

/**
 * Taper `31/02/2026` ou `12/09/20`. Le champ refuse, et l'appelant reçoit
 * `null` — il ne détient jamais une date que l'utilisateur ne voit plus.
 *
 * C'est aussi le couple qui a corrompu les données côté serveur : les jours
 * 1 à 12 passaient en silence dans le mauvais mois, les suivants faisaient
 * lever une erreur brute.
 */
export const FrappeRefusee: Story = {
  render: function Rendu() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="flex max-w-[280px] flex-col gap-sm">
        <DateField value={value} onValue={setValue} ariaLabel="Date d’échéance" />
        <Sortie value={value} />
        <p className="text-caption text-text-muted">
          À essayer : « 31/02/2026 », puis sortir du champ.
        </p>
      </div>
    );
  },
};

/** Bornée : rien avant le 1er janvier 2026, rien après aujourd'hui. */
export const Bornee: Story = {
  render: function Rendu() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="flex max-w-[280px] flex-col gap-sm">
        <DateField
          value={value}
          onValue={setValue}
          ariaLabel="Date du relevé"
          min="2026-01-01"
          max={todayISO()}
        />
        <Sortie value={value} />
      </div>
    );
  },
};

/**
 * Un intervalle, et la règle qui le tient : le `max` du début suit la fin, le
 * `min` de la fin suit le début. Le calendrier grise le reste, donc l'ordre ne
 * peut pas s'inverser.
 */
export const Intervalle: Story = {
  render: function Rendu() {
    const [debut, setDebut] = React.useState<string | null>('2026-09-01');
    const [fin, setFin] = React.useState<string | null>('2026-09-30');
    return (
      <div className="flex max-w-[560px] items-start gap-md">
        <div className="flex-1">
          <div className="mb-xxs text-caption text-text-muted">À partir du</div>
          <DateField value={debut} onValue={setDebut} ariaLabel="À partir du" max={fin} />
        </div>
        <div className="flex-1">
          <div className="mb-xxs text-caption text-text-muted">Jusqu’au</div>
          <DateField value={fin} onValue={setFin} ariaLabel="Jusqu’au" min={debut} />
        </div>
      </div>
    );
  },
};

/** Figé : ni la frappe ni le calendrier. */
export const Desactive: Story = {
  render: () => (
    <div className="max-w-[280px]">
      <DateField value="1978-03-04" onValue={() => {}} ariaLabel="Date de mise en service" disabled />
    </div>
  ),
};

/**
 * Le service a refusé la valeur pour une raison que le champ ne peut pas voir.
 * `invalid` marque la bordure sans inventer de message : celui-ci appartient à
 * qui connaît le refus.
 */
export const RefuseParLeService: Story = {
  render: () => (
    <div className="max-w-[280px]">
      <DateField value="2026-09-12" onValue={() => {}} ariaLabel="Date d’échéance" invalid />
    </div>
  ),
};

/** Ce que l'appelant reçoit, en regard de ce que l'écran montre. */
function Sortie({ value }: { value: string | null }) {
  return (
    <dl className="rounded-control bg-bg-muted p-sm text-caption">
      <div className="flex gap-sm">
        <dt className="w-[92px] shrink-0 text-text-muted">à l’écran</dt>
        <dd className="font-semibold text-text">{toDisplay(value) || '—'}</dd>
      </div>
      <div className="mt-xxs flex gap-sm">
        <dt className="w-[92px] shrink-0 text-text-muted">value</dt>
        <dd className="font-semibold text-text">{value === null ? 'null' : value}</dd>
      </div>
    </dl>
  );
}
