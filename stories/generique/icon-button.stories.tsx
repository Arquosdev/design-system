import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '../../components/icon/icon.web';
import { IconButton } from '../../components/icon-button/icon-button.web';
import specification from '../../components/icon-button/icon-button.spec.md?raw';
import { choix, docsDe } from '../fiche';

// Le dessin vient du vocabulaire, pas d'un tracé recopié : voir Générique/Icon.
const Telechargement = () => <Icon role="telecharger" size="xs" />;

const meta = {
  title: 'Composants/Générique/IconButton',
  component: IconButton,
  parameters: docsDe(specification),
  args: { label: 'Télécharger le rapport', icon: <Telechargement /> },
  argTypes: {
    variant: choix(['outline', 'soft', 'ghost'], 'Le poids visuel du bouton.'),
    size: choix(['sm', 'md'], '30 px ou 36 px.'),
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <IconButton label="Contour" icon={<Telechargement />} />
      <IconButton label="Doux" variant="soft" icon={<Telechargement />} />
      <IconButton label="Discret" variant="ghost" icon={<Telechargement />} />
    </div>
  ),
};

/**
 * `label` est **obligatoire**, et c'est le point du composant : sans texte
 * visible, c'est la seule chose qu'un lecteur d'écran peut annoncer. Il sert
 * aussi d'infobulle au survol — les deux disent la même chose.
 */
export const LeNomCompte: Story = {
  args: { label: 'Télécharger « Rapport de contrôle 2026.pdf »' },
};
