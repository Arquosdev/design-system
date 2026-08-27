import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fondation, Section, group, rampe } from '../atelier';

const meta: Meta = {
  title: 'Fondations/Couleurs',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

const RAMPES = ['blue', 'marine', 'orange', 'green', 'red', 'grey'];

export const Couleurs: Story = {
  name: 'Couleurs',
  render: () => (
    <Fondation
      title="Couleurs"
      what="Vingt-cinq couleurs sémantiques posées sur six rampes. Dans un écran, on ne nomme jamais une teinte : on nomme une intention."
    >
      <Section
        title="Sémantiques"
        what="À employer dans le code applicatif. `colors.primary` dit une intention, `palette.blue[500]` ne dit qu'une teinte — et la CI refuse la seconde dans un composant."
      >
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
          {group('color').map(([name, t]) => (
            <div key={name} className="flex gap-md rounded-md border border-border-soft p-sm">
              <span
                className="size-[44px] shrink-0 rounded-control border border-border-soft"
                style={{ background: t.$value }}
              />
              <div className="min-w-0">
                <div className="text-small font-semibold text-text">{name}</div>
                <div className="text-caption tabular-nums text-text-muted">{t.$value}</div>
                {t.$description ? (
                  <p className="mt-xxs text-pretty text-caption text-text-muted">{t.$description}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Les teintes d'état vont par paire"
        what="Un fond teinté et l'encre qui s'y pose se nomment ensemble, parce qu'ils se choisissent ensemble. `bg-success-bg` avec `text-on-success-bg`, jamais avec `text-success` : cette seconde paire donne 2,77 pour 1, et le badge « Conforme » a vécu ainsi jusqu'au 25/08/2026."
      >
        {/* Les quatre paires écrites en clair, jamais composées.
            `bg-${etat}-bg` marcherait ici — par accident : les composants
            emploient déjà ces classes littéralement, donc Tailwind les a
            générées. Une paire propre à cette page échouerait en silence. */}
        <div className="flex flex-wrap gap-md">
          {(
            [
              ['success', 'bg-success-bg', 'text-on-success-bg'],
              ['danger', 'bg-danger-bg', 'text-on-danger-bg'],
              ['warning', 'bg-warning-bg', 'text-on-warning-bg'],
              ['info', 'bg-info-bg', 'text-on-info-bg'],
            ] as const
          ).map(([state, fond, encre]) => (
            <div
              key={state}
              className="flex flex-col gap-xs rounded-md border border-border-soft p-base"
            >
              <span
                className={`self-start rounded-control px-sm py-xxs text-caption font-semibold ${fond} ${encre}`}
              >
                Conforme
              </span>
              <code className="text-caption text-text-muted">{fond}</code>
              <code className="text-caption text-text-muted">{encre}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Palette"
        what="Les rampes brutes, de 50 (clair) à 800 (foncé). Utiles pour composer un token sémantique — jamais dans un écran."
      >
        <div className="flex flex-col gap-xs">
          {RAMPES.map((name) => (
            <div key={name} className="flex items-center gap-md">
              <span className="w-[80px] shrink-0 text-caption text-text-muted">{name}</span>
              <div className="flex flex-1 gap-xxs">
                {rampe(name).map(([nuance, t]) => (
                  <span
                    key={nuance}
                    title={`${name} ${nuance} — ${t.$value}`}
                    className="h-[32px] flex-1 rounded-sm"
                    style={{ background: t.$value }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Fondation>
  ),
};
