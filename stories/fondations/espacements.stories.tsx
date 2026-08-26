import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fondation, Section, groupe } from '../atelier';

const meta: Meta = {
  title: 'Fondations/Espacements et arrondis',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const EspacementsEtArrondis: Story = {
  name: 'Espacements et arrondis',
  render: () => (
    <Fondation
      titre="Espacements et arrondis"
      quoi="Une échelle base 4 pour les distances, une échelle calibrée sur l'usage pour les angles. Ajouter une valeur intermédiaire « parce qu'il manque 2 px » est le premier pas du drift."
    >
      <Section
        titre="Espacements"
        quoi="`base` (16) est le rembourrage par défaut d'une carte ou d'un formulaire ; `sm` (8) l'écart entre deux éléments proches."
      >
        <div className="flex flex-col gap-sm">
          {groupe('spacing').map(([nom, t]) => (
            <div key={nom} className="flex items-center gap-md">
              <span className="w-[64px] shrink-0 text-small text-text-muted">{nom}</span>
              <span className="w-[64px] shrink-0 text-caption tabular-nums text-text-muted">
                {t.$value}
              </span>
              <span className="h-[14px] rounded-sm bg-primary" style={{ width: t.$value }} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        titre="Arrondis"
        quoi="`md` (8) est la référence : cartes, champs, boutons. `control` (5) vient de l'identité de marque. `full` uniquement sur un élément carré — pastille, avatar."
      >
        <div className="flex flex-wrap gap-md">
          {groupe('radius').map(([nom, t]) => (
            <div key={nom} className="flex flex-col items-center gap-xs">
              <span
                className="size-[64px] border-[1.5px] border-primary bg-info-bg"
                style={{ borderRadius: t.$value }}
              />
              <span className="text-caption text-text-muted">{nom}</span>
              <span className="text-caption tabular-nums text-text-muted">{t.$value}</span>
            </div>
          ))}
        </div>
      </Section>
    </Fondation>
  ),
};
