import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '../../components/icon/icon.web';
import specification from '../../components/icon/icon.spec.md?raw';
import { icones, type IconRole } from '../../src/icons';
import { choix, docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Icon',
  component: Icon,
  parameters: docsDe(specification),
  args: { role: 'rechercher' as IconRole },
  argTypes: {
    role: choix(Object.keys(icones), 'Le rôle métier — pas le nom du dessin.'),
    size: choix(['xs', 'sm', 'md', 'lg', 'xl'], '14, 16, 18, 22 ou 28 px.'),
    weight: choix(['default', 'actif', 'discret'], 'bold, fill ou regular.'),
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * **Le vocabulaire, les tailles et les graisses sont des fondations**, pas des
 * démonstrations de composant : ils vivent dans Fondations → Icônes. Les dire
 * aussi ici les ferait diverger au premier changement.
 *
 * Ce qui reste sur cette page est le comportement propre au composant.
 */
export const LaCouleurEstHeritee: Story = {
  render: () => (
    <div className="flex flex-col gap-sm">
      {[
        ['text-text', 'Texte courant'],
        ['text-text-muted', 'Texte secondaire'],
        ['text-primary', 'Action'],
        ['text-danger', 'Écart bloquant'],
        ['text-success', 'Conforme'],
      ].map(([classe, libelle]) => (
        <p key={classe} className={`flex items-center gap-sm text-body ${classe}`}>
          <Icon role="ecart" />
          {libelle}
        </p>
      ))}
    </div>
  ),
};

/**
 * Sans `label`, l'icône est masquée aux lecteurs d'écran — c'est le cas par
 * défaut, et le bon dans la grande majorité des emplois. `label` ne se met que
 * sur une icône qui porte SEULE une information.
 */
export const QuandElleParleSeule: Story = {
  render: () => (
    <div className="flex items-center gap-xl">
      <span className="flex items-center gap-sm text-body text-text">
        <Icon role="ecart" />
        Écart relevé
        <code className="text-caption text-text-muted">décorative</code>
      </span>
      <span className="flex items-center gap-sm">
        <Icon role="ecart" label="Écart relevé" className="text-danger" />
        <code className="text-caption text-text-muted">avec label</code>
      </span>
    </div>
  ),
};
