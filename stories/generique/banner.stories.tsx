import type { Meta, StoryObj } from '@storybook/react-vite';

import { Banner } from '../../components/banner/banner.web';
import specification from '../../components/banner/banner.spec.md?raw';
import { choices, docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Banner',
  component: Banner,
  parameters: docsDe(specification),
  args: { children: 'Jeu de démonstration — aucune donnée réelle.', icon: 'info' as const },
  argTypes: { tone: choices(['info', 'warning', 'danger'], 'Le registre du bandeau.') },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * `info` pour une condition neutre qu'il faut connaître, `attention` pour ce qui
 * dégrade sans bloquer, `danger` pour ce qui empêche.
 *
 * Le ton passe par la couleur **et par les mots** : un bandeau orange sans texte
 * explicite n'est lisible ni d'un daltonien, ni en balayage rapide.
 */
export const LesTroisTons: Story = {
  render: () => (
    <div className="flex w-[620px] flex-col gap-sm">
      <Banner icon="info">Jeu de démonstration — aucune donnée réelle.</Banner>
      <Banner tone="warning" icon="offline">
        Hors row — les modifications partiront à la reconnexion.
      </Banner>
      <Banner tone="danger" icon="blocking">
        Session expirée — rechargez la page pour continuer.
      </Banner>
    </div>
  ),
};

/** Le bandeau peut porter ce qu'on peut faire, à sa droite. */
export const AvecUneAction: Story = {
  render: () => (
    <Banner
      className="w-[620px]"
      icon="info"
      action={
        <a href="#" className="shrink-0 underline underline-offset-2">
          Ouvrir un appareil
        </a>
      }
    >
      Jeu de démonstration — aucune donnée réelle.
    </Banner>
  ),
};
