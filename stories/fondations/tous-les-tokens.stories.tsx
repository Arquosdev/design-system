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

interface Ligne {
  groupe: string;
  nom: string;
  valeur: string;
  description?: string;
  /** Comment le nommer dans chaque vocabulaire. */
  ts: string;
  tailwind?: string;
  css?: string;
  apercu?: React.ReactNode;
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
function classesDeCouleur(nom: string): string {
  const k = kebab(nom);
  if (/^on[A-Z]/.test(nom)) return `text-${k}`; // encre d'une teinte de fond
  if (/Bg$/.test(nom) || /^bg/.test(nom)) return `bg-${k}`; // fond seulement
  if (/^text/.test(nom)) return `text-${k}`;
  if (/^border/.test(nom)) return `border-${k}`;
  // Couleurs pleines : fond avec du texte clair, ou texte sur fond clair.
  return `bg-${k} · text-${k}`;
}

const entrees = (groupe: string) =>
  Object.entries(table[groupe] ?? {}).filter(([c]) => !c.startsWith('$'));

/**
 * Chaque famille dit comment se nomme un de ses tokens dans les trois
 * vocabulaires. C'est ce qui manque partout ailleurs : la page Couleurs montre
 * les teintes, mais ne dit pas qu'`onSuccessBg` s'écrit `text-on-success-bg` en
 * Tailwind et `--arq-color-on-success-bg` en CSS.
 */
const FAMILLES: {
  groupe: string;
  titre: string;
  ts: (n: string) => string;
  tailwind?: (n: string) => string;
  css?: (n: string) => string;
  apercu?: (v: string) => React.ReactNode;
}[] = [
  {
    groupe: 'color',
    titre: 'Couleur',
    ts: (n) => `colors.${n}`,
    tailwind: classesDeCouleur,
    css: (n) => `--arq-color-${kebab(n)}`,
    apercu: (v) => (
      <span
        className="block size-[26px] rounded-control border border-border-soft"
        style={{ background: v }}
      />
    ),
  },
  {
    groupe: 'spacing',
    titre: 'Espacement',
    ts: (n) => `spacing.${n}`,
    tailwind: (n) => `p-${kebab(n)} · gap-${kebab(n)}`,
    css: (n) => `--arq-space-${kebab(n)}`,
    apercu: (v) => <span className="block h-[10px] rounded-sm bg-primary" style={{ width: v }} />,
  },
  {
    groupe: 'radius',
    titre: 'Arrondi',
    ts: (n) => `radius.${n}`,
    tailwind: (n) => `rounded-${kebab(n)}`,
    css: (n) => `--arq-radius-${kebab(n)}`,
    apercu: (v) => (
      <span
        className="block size-[26px] border-[1.5px] border-primary bg-info-bg"
        style={{ borderRadius: v }}
      />
    ),
  },
  {
    groupe: 'fontSize',
    titre: 'Taille de police',
    ts: (n) => `fontSize.${n}`,
    tailwind: (n) => `text-${kebab(n)}`,
    css: (n) => `--arq-font-size-${kebab(n)}`,
    apercu: (v) => (
      <span className="leading-none text-text" style={{ fontSize: v }}>
        Aa
      </span>
    ),
  },
  {
    groupe: 'shadow',
    titre: 'Élévation',
    ts: (n) => `shadow.${n}`,
    tailwind: (n) => `shadow-${kebab(n)}`,
    css: (n) => `--arq-shadow-${kebab(n)}`,
    apercu: (v) => (
      <span className="block size-[26px] rounded-md bg-bg" style={{ boxShadow: v }} />
    ),
  },
  {
    groupe: 'iconSize',
    titre: 'Taille d’icône',
    ts: (n) => `iconSize.${n}`,
    tailwind: (n) => `size-icon-${kebab(n)}`,
    css: (n) => `--arq-icon-${kebab(n)}`,
  },
  {
    groupe: 'duration',
    titre: 'Durée',
    ts: (n) => `duration.${n}`,
    tailwind: (n) => `duration-(--arq-duration-${kebab(n)})`,
    css: (n) => `--arq-duration-${kebab(n)}`,
  },
  {
    groupe: 'layers',
    titre: 'Empilement',
    ts: (n) => `layers.${n}`,
    tailwind: (n) => `z-(--arq-layer-${kebab(n)})`,
    css: (n) => `--arq-layer-${kebab(n)}`,
  },
  { groupe: 'fontWeight', titre: 'Graisse', ts: (n) => `fontWeight.${n}` },
  { groupe: 'lineHeight', titre: 'Interligne', ts: (n) => `lineHeight.${n}` },
  { groupe: 'letterSpacing', titre: 'Approche', ts: (n) => `letterSpacing.${n}` },
  { groupe: 'iconWeight', titre: 'Graisse d’icône', ts: (n) => `iconWeight.${n}` },
  { groupe: 'core', titre: 'Couleurs de marque', ts: (n) => `core.${n}`,
    apercu: (v) => (
      <span className="block size-[26px] rounded-control border border-border-soft" style={{ background: v }} />
    ) },
];

const LIGNES: Ligne[] = FAMILLES.flatMap((f) =>
  entrees(f.groupe).map(([nom, t]) => {
    const valeur = String((t as Brut).$value ?? '');
    return {
      groupe: f.titre,
      nom,
      valeur,
      description: (t as Brut).$description,
      ts: f.ts(nom),
      tailwind: f.tailwind?.(nom),
      css: f.css?.(nom),
      apercu: f.apercu?.(valeur),
    };
  }),
);

const nu = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const TousLesTokens: Story = {
  name: 'Tous les tokens',
  render: function Page() {
    const [q, setQ] = React.useState('');

    const filtrees = React.useMemo(() => {
      const terme = nu(q.trim());
      if (!terme) return LIGNES;
      return LIGNES.filter((l) =>
        nu([l.nom, l.valeur, l.groupe, l.ts, l.tailwind, l.css, l.description].join(' ')).includes(
          terme,
        ),
      );
    }, [q]);

    const groupes = [...new Set(filtrees.map((l) => l.groupe))];

    return (
      <Fondation
        titre="Tous les tokens"
        quoi="La table de référence : chaque token avec sa valeur et ses trois façons de se nommer — TypeScript, classe Tailwind, variable CSS. Les autres pages de fondations enseignent ; celle-ci sert à chercher."
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
          pire encore : 1,79. La colonne « Comment l’écrire » ne propose donc que les utilitaires
          qui ont un sens pour chaque token.
        </p>

        <p className="mb-lg text-caption text-text-muted">
          {filtrees.length} token{filtrees.length > 1 ? 's' : ''} sur {LIGNES.length} · lus dans{' '}
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
                  {filtrees
                    .filter((l) => l.groupe === g)
                    .map((l) => (
                      <tr key={l.ts} className="border-t border-border-soft align-top">
                        <td className="px-sm py-sm">{l.apercu}</td>
                        <td className="px-sm py-sm">
                          <div className="font-semibold text-text">{l.nom}</div>
                          {l.description ? (
                            <p className="mt-xxs max-w-[46ch] text-pretty text-caption text-text-muted">
                              {l.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-sm py-sm tabular-nums text-text-muted">
                          {l.valeur}
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
