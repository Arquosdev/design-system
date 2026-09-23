import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fondation, Section, group } from '../atelier';

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
      title="Espacements, bordures et arrondis"
      what="Une échelle base 4 pour les distances, une échelle calibrée sur l'usage pour les angles. Ajouter une valeur intermédiaire « parce qu'il manque 2 px » est le premier pas du drift."
    >
      <Section
        title="Espacements"
        what="`base` (16) est le rembourrage par défaut d'une carte ou d'un formulaire ; `sm` (8) l'écart entre deux éléments proches."
      >
        <div className="flex flex-col gap-sm">
          {group('spacing').map(([name, t]) => (
            <div key={name} className="flex items-center gap-md">
              <span className="w-[64px] shrink-0 text-small text-text-muted">{name}</span>
              <span className="w-[64px] shrink-0 text-caption tabular-nums text-text-muted">
                {t.$value}
              </span>
              <span className="h-[14px] rounded-sm bg-primary" style={{ width: t.$value }} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Bordures"
        what="Deux épaisseurs, parce que le produit n'en emploie que deux. `epais` dit qu'un champ est en cours de saisie — un demi-pixel suffit à le distinguer sans décaler la mise en page."
      >
        <div className="flex flex-wrap gap-lg">
          {group('borderWidth').map(([name, t]) => (
            <div key={name} className="flex flex-col items-center gap-xs">
              <span
                className="block size-[56px] rounded-md border-primary bg-bg"
                style={{ borderStyle: 'solid', borderWidth: t.$value }}
              />
              <span className="text-caption text-text-muted">{name}</span>
              <span className="text-caption tabular-nums text-text-muted">{t.$value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Arrondis"
        what="`md` (8) est la référence : cartes, champs, boutons. `control` (5) vient de l'identité de marque. `full` uniquement sur un élément carré — pastille, avatar."
      >
        <div className="flex flex-wrap gap-md">
          {group('radius').map(([name, t]) => (
            <div key={name} className="flex flex-col items-center gap-xs">
              <span
                className="size-[64px] border-(length:--arq-border-epais) border-primary bg-info-bg"
                style={{ borderRadius: t.$value }}
              />
              <span className="text-caption text-text-muted">{name}</span>
              <span className="text-caption tabular-nums text-text-muted">{t.$value}</span>
            </div>
          ))}
        </div>
      </Section>
    </Fondation>
  ),
};
