import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Input } from '../../components/input/input.web';
import tokens from '../../dist/tokens.json';
import { Fondation } from '../atelier';

const meta: Meta = {
  title: 'Fondations/Tous les tokens',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

/* `tokens.json` mêle des groupes et des clés de tête (`$schema`, `$description`). */
type Brut = { $value?: unknown; $description?: string; [k: string]: unknown };
const table = tokens as unknown as Record<string, Brut>;

interface Row {
  group: string;
  name: string;
  value: string;
  description?: string;
  /** Comment le nommer dans chaque vocabulaire. */
  ts: string;
  tailwind?: string;
  css?: string;
  preview?: React.ReactNode;
}

/** `titleLarge` → `title-large`, comme le générateur. */
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Les utilitaires Tailwind qui ont un sens pour une couleur donnée.
 *
 * Ne pas tout proposer : `text-warning` sur `bg-warning-bg` donne 1,79 pour 1,
 * et `text-success-bg` n'existe comme idée nulle part. Une table de référence qui
 * suggère la mauvaise combinaison enseigne le défaut.
 */
function classesDeCouleur(name: string): string {
  const k = kebab(name);
  if (/^on[A-Z]/.test(name)) return `text-${k}`; // encre d'une teinte de fond
  if (/Bg$/.test(name) || /^bg/.test(name)) return `bg-${k}`; // fond seulement
  if (/^text/.test(name)) return `text-${k}`;
  if (/^border/.test(name)) return `border-${k}`;
  // Couleurs pleines : fond avec du texte clair, ou texte sur fond clair.
  return `bg-${k} · text-${k}`;
}

const entrees = (group: string) =>
  Object.entries(table[group] ?? {}).filter(([c]) => !c.startsWith('$'));

/**
 * Chaque famille dit comment se nomme un de ses tokens dans les trois
 * vocabulaires. C'est ce qui manque partout ailleurs : la page Couleurs montre
 * les teintes, mais ne dit pas qu'`onSuccessBg` s'écrit `text-on-success-bg` en
 * Tailwind et `--arq-color-on-success-bg` en CSS.
 */
const FAMILLES: {
  group: string;
  title: string;
  ts: (n: string) => string;
  tailwind?: (n: string) => string;
  css?: (n: string) => string;
  preview?: (v: string) => React.ReactNode;
}[] = [
  {
    group: 'color',
    title: 'Couleur',
    ts: (n) => `colors.${n}`,
    tailwind: classesDeCouleur,
    css: (n) => `--arq-color-${kebab(n)}`,
    preview: (v) => (
      <span
        className="block size-[26px] rounded-control border border-border-soft"
        style={{ background: v }}
      />
    ),
  },
  {
    group: 'spacing',
    title: 'Espacement',
    ts: (n) => `spacing.${n}`,
    tailwind: (n) => `p-${kebab(n)} · gap-${kebab(n)}`,
    css: (n) => `--arq-space-${kebab(n)}`,
    preview: (v) => <span className="block h-[10px] rounded-sm bg-primary" style={{ width: v }} />,
  },
  {
    group: 'radius',
    title: 'Arrondi',
    ts: (n) => `radius.${n}`,
    tailwind: (n) => `rounded-${kebab(n)}`,
    css: (n) => `--arq-radius-${kebab(n)}`,
    preview: (v) => (
      <span
        className="block size-[26px] border-(length:--arq-border-epais) border-primary bg-info-bg"
        style={{ borderRadius: v }}
      />
    ),
  },
  {
    group: 'fontSize',
    title: 'Taille de police',
    ts: (n) => `fontSize.${n}`,
    tailwind: (n) => `text-${kebab(n)}`,
    css: (n) => `--arq-font-size-${kebab(n)}`,
    preview: (v) => (
      <span className="leading-none text-text" style={{ fontSize: v }}>
        Aa
      </span>
    ),
  },
  {
    group: 'shadow',
    title: 'Élévation',
    ts: (n) => `shadow.${n}`,
    tailwind: (n) => `shadow-${kebab(n)}`,
    css: (n) => `--arq-shadow-${kebab(n)}`,
    preview: (v) => (
      <span className="block size-[26px] rounded-md bg-bg" style={{ boxShadow: v }} />
    ),
  },
  {
    group: 'borderWidth',
    title: 'Bordure',
    ts: (n) => `borderWidth.${n}`,
    tailwind: (n) => `border-(length:--arq-border-${kebab(n)})`,
    css: (n) => `--arq-border-${kebab(n)}`,
    preview: (v) => (
      <span
        className="block size-[26px] rounded-sm border-primary"
        style={{ borderStyle: 'solid', borderWidth: v }}
      />
    ),
  },
  {
    group: 'iconSize',
    title: 'Taille d’icône',
    ts: (n) => `iconSize.${n}`,
    tailwind: (n) => `size-icon-${kebab(n)}`,
    css: (n) => `--arq-icon-${kebab(n)}`,
  },
  {
    group: 'duration',
    title: 'Durée',
    ts: (n) => `duration.${n}`,
    tailwind: (n) => `duration-(--arq-duration-${kebab(n)})`,
    css: (n) => `--arq-duration-${kebab(n)}`,
  },
  {
    group: 'layers',
    title: 'Empilement',
    ts: (n) => `layers.${n}`,
    tailwind: (n) => `z-(--arq-layer-${kebab(n)})`,
    css: (n) => `--arq-layer-${kebab(n)}`,
  },
  { group: 'fontWeight', title: 'Graisse', ts: (n) => `fontWeight.${n}` },
  { group: 'lineHeight', title: 'Interligne', ts: (n) => `lineHeight.${n}` },
  { group: 'letterSpacing', title: 'Approche', ts: (n) => `letterSpacing.${n}` },
  { group: 'iconWeight', title: 'Graisse d’icône', ts: (n) => `iconWeight.${n}` },
  { group: 'core', title: 'Couleurs de marque', ts: (n) => `core.${n}`,
    preview: (v) => (
      <span className="block size-[26px] rounded-control border border-border-soft" style={{ background: v }} />
    ) },
];

const ROWS: Row[] = FAMILLES.flatMap((f) =>
  entrees(f.group).map(([name, t]) => {
    const value = String((t as Brut).$value ?? '');
    return {
      group: f.title,
      name,
      value,
      description: (t as Brut).$description,
      ts: f.ts(name),
      tailwind: f.tailwind?.(name),
      css: f.css?.(name),
      preview: f.preview?.(value),
    };
  }),
);

const nu = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const TousLesTokens: Story = {
  name: 'Tous les tokens',
  render: function Page() {
    const [q, setQ] = React.useState('');

    const filtered = React.useMemo(() => {
      const terme = nu(q.trim());
      if (!terme) return ROWS;
      return ROWS.filter((l) =>
        nu([l.name, l.value, l.group, l.ts, l.tailwind, l.css, l.description].join(' ')).includes(
          terme,
        ),
      );
    }, [q]);

    const groupes = [...new Set(filtered.map((l) => l.group))];

    return (
      <Fondation
        title="Tous les tokens"
        what="La table de référence : chaque token avec sa valeur et ses trois façons de se nommer — TypeScript, classe Tailwind, variable CSS. Les autres pages de fondations enseignent ; celle-ci sert à chercher."
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ex. success, 16px, empilement, rounded…"
          aria-label="Chercher un token"
          className="mb-lg"
        />

        {/* Les paires d'état comptent, et la table ne doit pas laisser croire
            qu'on compose librement. */}
        <p className="mb-lg rounded-md border border-border-soft bg-bg-subtle p-base text-small text-text-muted">
          <strong className="text-text">Les teintes d’état vont par paire.</strong>{' '}
          <code>bg-danger-bg</code> se pose avec <code>text-on-danger-bg</code>, jamais avec{' '}
          <code>text-danger</code> — qui donne 3,39 pour 1. Pour <code>warning</code>, l’écart est
          pire encore : 1,79. La column « Comment l’écrire » ne propose donc que les utilitaires
          qui ont un direction pour chaque token.
        </p>

        <p className="mb-lg text-caption text-text-muted">
          {filtered.length} token{filtered.length > 1 ? 's' : ''} sur {ROWS.length} · lus dans{' '}
          <code>dist/tokens.json</code>, généré depuis <code>src/*.ts</code>
        </p>

        {groupes.map((g) => (
          <section key={g} className="mb-2xl">
            <h2 className="mb-md text-caption font-bold uppercase tracking-wide text-text-muted">
              {g}
            </h2>
            <div className="overflow-x-auto rounded-md border border-border-soft">
              <table className="w-full border-collapse text-small">
                <thead>
                  <tr className="bg-bg-subtle text-left">
                    <th className="w-[44px] px-sm py-xs" />
                    <th className="px-sm py-xs text-caption font-bold uppercase tracking-wide text-text-muted">
                      Token
                    </th>
                    <th className="px-sm py-xs text-caption font-bold uppercase tracking-wide text-text-muted">
                      Valeur
                    </th>
                    <th className="px-sm py-xs text-caption font-bold uppercase tracking-wide text-text-muted">
                      Comment l’écrire
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered
                    .filter((l) => l.group === g)
                    .map((l) => (
                      <tr key={l.ts} className="border-t border-border-soft align-top">
                        <td className="px-sm py-sm">{l.preview}</td>
                        <td className="px-sm py-sm">
                          <div className="font-semibold text-text">{l.name}</div>
                          {l.description ? (
                            <p className="mt-xxs max-w-[46ch] text-pretty text-caption text-text-muted">
                              {l.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-sm py-sm tabular-nums text-text-muted">
                          {l.value}
                        </td>
                        <td className="px-sm py-sm">
                          <div className="flex flex-col gap-xxs text-caption">
                            <code className="text-text">{l.ts}</code>
                            {l.tailwind ? <code className="text-text-muted">{l.tailwind}</code> : null}
                            {l.css ? <code className="text-text-muted">{l.css}</code> : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </Fondation>
    );
  },
};
