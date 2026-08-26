import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import catalogue from '../../dist/catalog.json';
import { Input } from '../../components/input/input.web';
import { Badge } from '../../components/badge/badge.web';
import { EmptyState } from '../../components/empty-state/empty-state.web';
import { Icon } from '../../components/icon/icon.web';
import { icones, type IconRole } from '../../src/icons';

/**
 * **La page à ouvrir quand on ne connaît pas encore les noms.**
 *
 * La recherche de Storybook cherche par nom de composant ou par chemin — elle
 * ne lit pas les mots-clés des fiches. Taper « supprimer » n'y donne donc aucun
 * résultat, alors que le rôle existe.
 *
 * Cette page comble ce trou : elle lit `dist/catalog.json` et filtre sur le
 * rôle, les mots-clés et le nom. Rien n'y est écrit à la main, donc rien ne peut
 * y diverger.
 */
const meta = {
  title: 'Prise en main/Par où commencer',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Composant {
  name: string;
  role: string;
  couche: string;
  statut: string;
  mots_cles: string[];
  dossier: string;
}

/** Sans accent ni casse : « écart » doit se trouver en tapant « ecart ». */
const nu = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const Chercher: Story = {
  render: function Index() {
    const [q, setQ] = React.useState('');
    const composants = catalogue.composants as Composant[];

    const filtres = React.useMemo(() => {
      const terme = nu(q.trim());
      if (!terme) return composants;
      return composants.filter((c) =>
        nu([c.name, c.role, ...(c.mots_cles ?? [])].join(' ')).includes(terme),
      );
    }, [q, composants]);

    const parCouche = (couche: string) => filtres.filter((c) => c.couche === couche);

    // Les 35 rôles d'icône sont le vocabulaire « je veux faire X » le plus riche
    // du dépôt, et il ne vit pas dans les mots-clés des fiches. Sans ça,
    // chercher « supprimer » ne mène pas à la corbeille.
    const rolesTrouves = React.useMemo(() => {
      const terme = nu(q.trim());
      if (!terme) return [] as IconRole[];
      return (Object.keys(icones) as IconRole[]).filter((r) => nu(r).includes(terme));
    }, [q]);

    return (
      <div className="mx-auto flex max-w-[860px] flex-col gap-lg p-xl">
        <header className="flex flex-col gap-sm">
          <h1 className="text-title font-bold tracking-tight text-text">Par où commencer</h1>
          <p className="max-w-[62ch] text-body text-text-muted">
            Cherchez par ce que vous voulez <strong className="text-text">faire</strong>, pas par le
            nom du composant. « supprimer », « vide », « attente », « choisir » — les mots-clés des
            fiches sont interrogés ici, ce que la recherche de Storybook ne fait pas.
          </p>
        </header>

        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ex. supprimer, chargement, choisir dans une liste…"
          aria-label="Chercher un composant par son rôle"
        />

        {rolesTrouves.length ? (
          <section className="flex flex-col gap-sm rounded-md border border-info-bg bg-info-bg p-base">
            <h2 className="text-caption font-bold uppercase tracking-wide text-on-info-bg">
              {rolesTrouves.length > 1 ? 'Ce sont des rôles d’icône' : 'C’est un rôle d’icône'}
            </h2>
            <ul className="flex flex-wrap gap-md">
              {rolesTrouves.map((r) => (
                <li key={r} className="flex items-center gap-xs text-small text-on-info-bg">
                  <Icon role={r} size="sm" />
                  <code className="font-semibold">{r}</code>
                </li>
              ))}
            </ul>
            <p className="text-caption text-on-info-bg">
              S’écrit <code>&lt;Icon role=&quot;{rolesTrouves[0]}&quot; /&gt;</code> — voir
              Générique → Icon.
            </p>
          </section>
        ) : null}

        {filtres.length === 0 && rolesTrouves.length === 0 ? (
          <EmptyState
            icone="rechercher"
            titre="Aucun composant pour ce besoin"
            conseil="Essayez un mot plus général — « liste », « saisie », « état ». S’il n’existe vraiment rien, c’est peut-être un composant à créer."
          />
        ) : filtres.length ? (
          <>
            <p className="text-caption text-text-muted">
              {filtres.length} composant{filtres.length > 1 ? 's' : ''} sur {composants.length}
            </p>
            {(['generique', 'metier'] as const).map((couche) =>
              parCouche(couche).length ? (
                <section key={couche} className="flex flex-col gap-sm">
                  <h2 className="text-caption font-bold uppercase tracking-wide text-text-muted">
                    {couche === 'generique' ? 'Générique' : 'Métier'}
                  </h2>
                  <ul className="flex flex-col divide-y divide-border-soft rounded-md border border-border-soft">
                    {parCouche(couche).map((c) => (
                      <li key={c.name} className="flex flex-col gap-xxs p-base">
                        <div className="flex flex-wrap items-baseline gap-sm">
                          <span className="text-body font-semibold text-text">{c.name}</span>
                          {c.statut !== 'stable' ? (
                            <Badge variant="warning">{c.statut}</Badge>
                          ) : null}
                        </div>
                        <p className="text-small text-text-muted">{c.role}</p>
                        <p className="text-caption text-text-muted">
                          {(c.mots_cles ?? []).join(' · ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null,
            )}
          </>
        ) : null}
      </div>
    );
  },
};
