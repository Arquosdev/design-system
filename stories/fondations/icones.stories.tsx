import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '../../components/icon/icon.web';
import { iconSize, icones, type IconRole } from '../../src/icons';
import { Fondation, Section } from '../atelier';

const meta: Meta = {
  title: 'Fondations/Icônes',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

const GROUPES: { titre: string; roles: IconRole[] }[] = [
  { titre: 'Se déplacer', roles: ['suivant', 'precedent', 'deplier', 'replier', 'aller', 'fermer'] },
  {
    titre: 'Agir',
    roles: ['rechercher', 'ajouter', 'modifier', 'supprimer', 'telecharger', 'filtrer', 'plusDActions', 'dicter', 'arreter'],
  },
  {
    titre: 'Dire un état',
    roles: ['conforme', 'coche', 'ecart', 'bloquant', 'attention', 'information', 'sansObjet', 'horsLigne', 'synchronisation', 'synchronisationSuspendue'],
  },
  { titre: 'Photos', roles: ['photo', 'photos', 'prendreUnePhoto', 'photoIndisponible', 'changerDeCamera'] },
  { titre: 'Le métier', roles: ['document', 'etiquette', 'securite', 'intervention', 'mesure', 'assistanceIA'] },
];

export const Icones: Story = {
  name: 'Icônes',
  render: () => (
    <Fondation
      titre="Icônes"
      quoi="Le jeu officiel est Phosphor, et l'on passe toujours par un rôle — jamais par le nom du dessin. C'est ce qui permet de changer une icône partout d'un coup, et ce qui a manqué le jour où « rechercher » a été dessiné deux fois, différemment."
    >
      <Section
        titre="La règle"
        quoi="Le rôle dit ce qu'on veut faire, le dessin n'est qu'une conséquence. Si le rôle manque, l'ajouter dans `src/icons.ts` plutôt qu'importer Phosphor dans une app."
      >
        <pre className="overflow-x-auto rounded-md border border-border-soft bg-bg-muted p-base text-caption text-text">
{`<Icon role="supprimer" size="sm" />   {/* ✅ le rôle */}
<Trash size={16} />                   {/* ❌ le dessin */}`}
        </pre>
      </Section>

      <Section
        titre={`Le vocabulaire — ${Object.keys(icones).length} rôles`}
        quoi="Groupés par intention. C'est la planche à regarder avant d'écrire un écran : si le rôle cherché y figure, le prendre."
      >
        <div className="flex flex-col gap-xl">
          {GROUPES.map((g) => (
            <div key={g.titre}>
              <h3 className="mb-md text-caption font-bold uppercase tracking-wide text-text-muted">
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
            </div>
          ))}
        </div>
      </Section>

      <Section
        titre="Tailles"
        quoi="`md` (18) est le défaut. L'échelle est calibrée sur l'usage réel du mobile : ne pas en ajouter, prendre l'échelon voisin."
      >
        <div className="flex items-end gap-xl">
          {(Object.keys(iconSize) as (keyof typeof iconSize)[]).map((t) => (
            <div key={t} className="flex flex-col items-center gap-xs">
              <Icon role="ecart" size={t} />
              <code className="text-caption tabular-nums text-text-muted">
                {t} · {iconSize[t]}
              </code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        titre="Graisses"
        quoi="Le choix est sémantique, pas esthétique. `actif` (fill) quand l'icône EST la chose — une pastille d'état, un onglet sélectionné. `default` (bold) quand elle accompagne un texte. `discret` reste rare : le mobile ne s'en sert que neuf fois sur 459."
      >
        <div className="flex items-center gap-xl">
          {(['default', 'actif', 'discret'] as const).map((g) => (
            <div key={g} className="flex flex-col items-center gap-xs">
              <Icon role="conforme" weight={g} size="xl" className="text-success" />
              <code className="text-caption text-text-muted">{g}</code>
            </div>
          ))}
        </div>
      </Section>
    </Fondation>
  ),
};
