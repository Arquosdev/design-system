import type { Meta, StoryObj } from '@storybook/react-vite';

import tokens from '../../dist/tokens.json';

/**
 * Les tokens, lus depuis `dist/tokens.json`.
 *
 * Ce fichier est GÉNÉRÉ depuis `src/*.ts`, et la CI refuse toute divergence :
 * ce que cette page montre est donc, par construction, ce que les applications
 * emploient. Une planche de couleurs recopiée à la main aurait menti au premier
 * changement de teinte.
 */
const meta: Meta = {
  title: 'Design system/Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Écrits une fois en TypeScript, générés vers quatre formats : ' +
          '`tokens.css` pour Bubble, `tokens.tailwind.css` pour le web, ' +
          '`tokens.json` au format W3C pour les outils et les agents, et les ' +
          'sources TypeScript pour React Native.\n\n' +
          'Chaque token porte une description : la lire plutôt que de deviner ' +
          "d'après le nom. C'est elle qui évite qu'on choisisse au hasard.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type Token = { $value: string; $description?: string };
type Groupe = Record<string, Token>;

/* `tokens.json` mêle des groupes de tokens et deux clés de tête (`$schema`,
   `$description`) : on passe par `unknown` plutôt que de décrire une forme que
   le générateur pourrait enrichir demain. */
const table = tokens as unknown as Record<string, Groupe>;
const groupe = (nom: string): [string, Token][] =>
  Object.entries(table[nom] ?? {}).filter(([cle]) => !cle.startsWith('$'));

/** Une rampe de la palette : `palette.blue` porte ses neuf nuances. */
const rampe = (nom: string): [string, Token][] => {
  const p = (table.palette as unknown as Record<string, Groupe>)?.[nom];
  return p ? Object.entries(p).filter(([cle]) => !cle.startsWith('$')) : [];
};

function Section({ titre, quoi, children }: { titre: string; quoi: string; children: React.ReactNode }) {
  return (
    <section className="mb-2xl">
      <h2 className="text-title font-bold tracking-tight text-text">{titre}</h2>
      <p className="mt-xs mb-base max-w-[720px] text-pretty text-small text-text-muted">{quoi}</p>
      {children}
    </section>
  );
}

export const Couleurs: Story = {
  render: () => (
    <div className="p-xl">
      <Section
        titre="Couleurs sémantiques"
        quoi="À employer dans le code applicatif. Jamais la palette brute : `colors.primary` dit une intention, `palette.blue[500]` ne dit qu'une teinte."
      >
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
          {groupe('color').map(([nom, t]) => (
            <div key={nom} className="flex gap-md rounded-md border border-border-soft p-sm">
              <span
                className="size-[44px] shrink-0 rounded-control border border-border-soft"
                style={{ background: t.$value }}
              />
              <div className="min-w-0">
                <div className="text-small font-semibold text-text">{nom}</div>
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
        titre="Palette"
        quoi="Les rampes brutes, de 50 (clair) à 800 (foncé). Utiles pour composer un token sémantique — pas dans un écran."
      >
        <div className="flex flex-col gap-xs">
          {['blue', 'marine', 'orange', 'green', 'red', 'grey'].map((nomRampe) => (
            <div key={nomRampe} className="flex items-center gap-md">
              <span className="w-[80px] shrink-0 text-caption text-text-muted">{nomRampe}</span>
              <div className="flex flex-1 gap-xxs">
                {rampe(nomRampe).map(([nuance, t]) => (
                  <span
                    key={nuance}
                    title={`${nomRampe} ${nuance} — ${t.$value}`}
                    className="h-[32px] flex-1 rounded-sm"
                    style={{ background: t.$value }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Typographie: Story = {
  render: () => (
    <div className="p-xl">
      <Section
        titre="Typographie"
        quoi="Des préréglages, pas des briques à recombiner. L'échelle est calibrée sur l'usage réel du produit : ne jamais y ajouter de taille, toute taille supplémentaire est du drift."
      >
        <div className="flex flex-col gap-base">
          {groupe('typography').map(([nom, t]) => {
            const preset = t as unknown as Record<string, string>;
            return (
              <div key={nom} className="border-b border-border-soft pb-base last:border-b-0">
                <div className="text-caption tabular-nums text-text-muted">
                  {nom} — {preset.fontSize ?? ''} / {preset.fontWeight ?? ''}
                </div>
                <div
                  className="mt-xxs text-text"
                  style={{
                    fontSize: preset.fontSize,
                    fontWeight: preset.fontWeight,
                    lineHeight: preset.lineHeight,
                    letterSpacing: preset.letterSpacing,
                  }}
                >
                  Ascenseur ORONA — 630 kg, 7 niveaux
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  ),
};

export const EspacementsEtArrondis: Story = {
  name: 'Espacements et arrondis',
  render: () => (
    <div className="p-xl">
      <Section
        titre="Espacements"
        quoi="Échelle base 4. `base` (16) est le rembourrage par défaut d'une carte ou d'un formulaire ; `sm` (8) l'écart entre deux éléments proches."
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
        quoi="`md` (8) est la référence : cartes, champs, boutons. `full` uniquement sur un élément carré — pastille, avatar."
      >
        <div className="flex flex-wrap gap-md">
          {groupe('radius').map(([nom, t]) => (
            <div key={nom} className="flex flex-col items-center gap-xs">
              <span
                className="size-[64px] border-[1.5px] border-primary bg-blue-50"
                style={{ borderRadius: t.$value }}
              />
              <span className="text-caption text-text-muted">{nom}</span>
              <span className="text-caption tabular-nums text-text-muted">{t.$value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section titre="Élévation" quoi="Trois ombres, et pas une de plus.">
        <div className="flex flex-wrap gap-lg">
          {groupe('shadow').map(([nom, t]) => (
            <div
              key={nom}
              className="flex size-[120px] flex-col items-center justify-center gap-xxs rounded-md bg-bg"
              style={{ boxShadow: t.$value }}
            >
              <span className="text-small font-semibold text-text">{nom}</span>
              {t.$description ? (
                <span className="max-w-[100px] text-center text-caption text-text-muted">
                  {t.$description}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};
