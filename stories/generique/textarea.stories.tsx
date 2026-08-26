import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from '../../components/textarea/textarea.web';
import specification from '../../components/textarea/textarea.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Textarea',
  component: Textarea,
  parameters: docsDe(specification),
  args: { placeholder: 'Ce que le technicien a constaté sur place' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { render: (a) => <Textarea {...a} className="w-[420px]" /> };

/**
 * Le champ **grandit avec son contenu** au lieu de faire défiler. Sur un
 * commentaire de trois lignes, une barre de défilement interne cache ce qu'on
 * vient d'écrire — et on ne se relit pas.
 */
export const IlGranditAvecLeTexte: Story = {
  render: () => (
    <Textarea
      className="w-[420px]"
      defaultValue={
        'Porte palière niveau 3 : jeu de 8 mm au vantail droit, frottement audible à la fermeture.\n' +
        'Le seuil est marqué côté cabine. Reprise à prévoir avec le remplacement du patin.'
      }
    />
  ),
};

export const Desactive: Story = {
  render: () => <Textarea disabled defaultValue="Relevé clos" className="w-[420px]" />,
};
