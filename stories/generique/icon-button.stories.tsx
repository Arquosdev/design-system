import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '../../components/icon/icon.web';
import { IconButton } from '../../components/icon-button/icon-button.web';
import specification from '../../components/icon-button/icon-button.spec.md?raw';
import { choices, docsDe } from '../fiche';

// Le dessin vient du vocabulaire, pas d'un tracé recopié : voir Générique/Icon.
const Telechargement = () => <Icon role="download" size="xs" />;

const meta = {
  title: 'Composants/Générique/IconButton',
  component: IconButton,
  parameters: docsDe(specification),
  args: { label: 'Télécharger le rapport', icon: <Telechargement /> },
  argTypes: {
    variant: choices(['outline', 'soft', 'ghost'], 'Le poids visuel du bouton.'),
    size: choices(['sm', 'md'], '30 px ou 36 px.'),
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

/**
 * **Le geste est impossible ici, et le bouton peut dire pourquoi.** La plaque
 * grise est celle de `Button` : les deux se retrouvent côte à côte dans une
 * barre d'outils, et deux gris différents s'y verraient.
 *
 * L'infobulle devient « nom — raison ». Le nom reste devant : sans texte
 * visible, la raison seule laisserait chercher de quel bouton il s'agit.
 */
export const Inactif: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <IconButton
        label="Télécharger le rapport"
        inactive
        inactiveReason="le rapport n’est pas encore signé"
        icon={<Telechargement />}
      />
      <IconButton
        label="Télécharger le rapport"
        variant="soft"
        inactive
        inactiveReason="le rapport n’est pas encore signé"
        icon={<Telechargement />}
      />
      <IconButton
        label="Télécharger le rapport"
        variant="ghost"
        inactive
        inactiveReason="le rapport n’est pas encore signé"
        icon={<Telechargement />}
      />
    </div>
  ),
};
