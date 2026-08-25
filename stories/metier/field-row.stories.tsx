import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FieldRow } from '../../components/field-row/field-row.web';
import specification from '../../components/field-row/field-row.spec.md?raw';
import { choix, docsDe } from '../fiche';

const meta = {
  title: 'Métier/FieldRow',
  component: FieldRow,
  parameters: docsDe(specification),
  args: { label: 'Charge utile (kg)', value: '630' },
  argTypes: {
    kind: choix(['text', 'number', 'choice', 'multi'], "L'éditeur qui s'ouvre au clic."),
    statut: choix(['renseigne', 'manquant', 'a_verifier'], "L'état de la DONNÉE."),
    sauvegarde: choix(
      ['encours', 'ok', 'echec'],
      "Où en est l'ENREGISTREMENT de la dernière correction.",
    ),
  },
} satisfies Meta<typeof FieldRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cliquer la valeur ouvre la saisie, sans quitter la page. */
export const Defaut: Story = {
  render: function Rendu(args) {
    const [valeur, setValeur] = React.useState(args.value);
    return (
      <div className="max-w-[520px]">
        <FieldRow {...args} value={valeur} onSave={(v) => setValeur(v)} />
      </div>
    );
  },
};

/**
 * Une valeur absente s'annonce en toutes lettres. Un tiret laisse croire à une
 * donnée sans objet ; « Non renseigné » dit qu'il manque quelque chose — et la
 * ligne reste cliquable pour le combler.
 */
export const NonRenseignee: Story = { ...Defaut, args: { label: 'Année d’installation', value: null } };

/** Sans `onSave`, ou avec `readOnly` : le soulignement pointillé disparaît. */
export const LectureSeule: Story = {
  args: { label: 'Taux de connaissance', value: '82 %', readOnly: true },
};

/**
 * Le menu s'ouvre sur la valeur du champ. La ligne affiche un libellé
 * (« Moyen »), le menu manipule des valeurs en base (`moyen`) : sans la
 * traduction, le navigateur cocherait la première option.
 */
export const AChoix: Story = {
  ...Defaut,
  args: {
    label: 'État global',
    value: 'Moyen',
    kind: 'choice',
    options: [
      { value: 'bon', label: 'Bon' },
      { value: 'moyen', label: 'Moyen' },
      { value: 'mauvais', label: 'Mauvais' },
    ],
  },
};

export const ChoixMultiple: Story = {
  ...Defaut,
  args: {
    label: 'Types de service',
    value: ['passant'],
    kind: 'multi',
    options: [
      { value: 'passant', label: 'Passant' },
      { value: 'equerre', label: "D'équerre" },
      { value: 'simple', label: 'Simple' },
    ],
  },
};

/** Le retour d'enregistrement appartient à la ligne : un bandeau en bas d'écran
 *  ne dirait pas QUEL champ a échoué. */
export const Enregistrement: Story = {
  render: () => (
    <div className="max-w-[520px]">
      <FieldRow label="Charge utile (kg)" value="630" onSave={() => {}} sauvegarde="encours" />
      <FieldRow label="Vitesse (m/s)" value="1" onSave={() => {}} sauvegarde="ok" />
      <FieldRow label="Marque" value="ORONA" onSave={() => {}} sauvegarde="echec" />
    </div>
  ),
};

/**
 * Deux pictos discrets, et ils ne disent pas la même chose : **la photo dit où**
 * la valeur a été lue — la plaque, l'étiquette ; **le schéma dit comment** la
 * mesure se prend.
 */
export const PhotoEtSchema: Story = {
  render: () => (
    <div className="max-w-[520px]">
      <FieldRow
        label="Charge utile (kg)"
        value="630"
        onSave={() => {}}
        photos={[{ nom: 'Plaque de charge' }, { nom: 'Boîte à boutons cabine' }]}
        onVoirPhotos={() => {}}
      />
      <FieldRow
        label="Réservation adhérence (mm)"
        value="1 250"
        onSave={() => {}}
        schemas={[{ nom: 'MA2RCT SCH RESERVATION ADHERENCE' }]}
        onVoirSchemas={() => {}}
      />
    </div>
  ),
};

/** La recherche vient d'y emmener : la ligne défile sous les yeux et s'allume. */
export const Designee: Story = { args: { label: 'Module GSM', value: 'Oui', repere: true } };
