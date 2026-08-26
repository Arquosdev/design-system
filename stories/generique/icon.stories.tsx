import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '../../components/icon/icon.web';
import specification from '../../components/icon/icon.spec.md?raw';
import { icones, iconSize, type IconRole } from '../../src/icons';
import { choix, docsDe } from '../fiche';

const meta = {
  title: 'Générique/Icon',
  component: Icon,
  parameters: docsDe(specification),
  args: { role: 'rechercher' as IconRole },
  argTypes: {
    role: choix(Object.keys(icones), "Le rôle métier — pas le nom du dessin."),
    size: choix(['xs', 'sm', 'md', 'lg', 'xl'], '14, 16, 18, 22 ou 28 px.'),
    weight: choix(['default', 'actif', 'discret'], 'bold, fill ou regular.'),
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

const GROUPES: { titre: string; roles: IconRole[] }[] = [
  { titre: 'Se déplacer', roles: ['suivant', 'precedent', 'deplier', 'replier', 'aller', 'fermer'] },
  {
    titre: 'Agir',
    roles: ['rechercher', 'ajouter', 'modifier', 'supprimer', 'telecharger', 'filtrer', 'plusDActions', 'dicter', 'arreter'],
  },
  {
    titre: 'Dire un état',
    roles: ['conforme', 'ecart', 'bloquant', 'attention', 'information', 'sansObjet', 'horsLigne', 'synchronisation', 'synchronisationSuspendue'],
  },
  { titre: 'Photos', roles: ['photo', 'photos', 'prendreUnePhoto', 'photoIndisponible', 'changerDeCamera'] },
  { titre: 'Le métier', roles: ['document', 'etiquette', 'securite', 'intervention', 'mesure', 'assistanceIA'] },
];

/**
 * Les 35 rôles du vocabulaire, groupés par intention. **C'est la page à
 * regarder avant d'écrire un écran** : si le rôle cherché y figure, le prendre ;
 * s'il n'y figure pas, l'ajouter dans `src/icons.ts` plutôt qu'importer Phosphor
 * dans l'app.
 *
 * Sous chaque dessin, son rôle en gras et le nom Phosphor en dessous — le
 * second ne sert qu'à retrouver l'icône sur phosphoricons.com.
 */
export const LeVocabulaire: Story = {
  render: () => (
    <div className="flex flex-col gap-xl">
      {GROUPES.map((g) => (
        <section key={g.titre}>
          <h3 className="mb-md text-small font-semibold uppercase tracking-wide text-text-muted">
            {g.titre}
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-sm">
            {g.roles.map((role) => (
              <div
                key={role}
                className="flex flex-col items-center gap-xs rounded-md border border-border-soft p-md text-center"
              >
                <Icon role={role} size="lg" className="text-text" />
                <code className="break-all text-caption font-semibold text-text">{role}</code>
                <code className="text-caption text-text-muted">{icones[role]}</code>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

/**
 * `md` (18) est le défaut. `xs` et `sm` servent dans les tableaux denses, `lg`
 * dans les en-têtes et la barre de navigation, `xl` sur un écran vide.
 *
 * L'échelle est calibrée sur l'usage réel du mobile. Ne pas en ajouter :
 * prendre l'échelon voisin.
 */
export const Tailles: Story = {
  render: () => (
    <div className="flex items-end gap-xl">
      {(Object.keys(iconSize) as (keyof typeof iconSize)[]).map((t) => (
        <div key={t} className="flex flex-col items-center gap-xs">
          <Icon role="ecart" size={t} />
          <code className="text-caption text-text-muted">
            {t} · {iconSize[t]}
          </code>
        </div>
      ))}
    </div>
  ),
};

/**
 * La graisse dit quelque chose, elle ne décore pas.
 *
 * `default` (bold) quand l'icône accompagne un texte — c'est le cas courant.
 * `actif` (fill) quand l'icône **est** la chose : la pastille d'un état, l'onglet
 * sélectionné. `discret` (regular) reste rare : le mobile ne s'en sert que neuf
 * fois sur 459.
 */
export const Graisses: Story = {
  render: () => (
    <div className="flex items-center gap-xl">
      {(['default', 'actif', 'discret'] as const).map((g) => (
        <div key={g} className="flex flex-col items-center gap-xs">
          <Icon role="conforme" weight={g} size="xl" className="text-success" />
          <code className="text-caption text-text-muted">{g}</code>
        </div>
      ))}
    </div>
  ),
};

/**
 * La couleur est **héritée**. L'icône n'a pas de prop de couleur : elle suit
 * celle de son parent. C'est ce qui lui permet de vivre dans un texte muté, un
 * bouton primaire ou un badge d'erreur sans variante supplémentaire.
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
