'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { analyser, domaineDe, lienSansSortie, type Bloc, type EnLigne } from './markdown.logic';

/*
  Le texte d'une réponse de l'assistant, mis en forme : titres, listes,
  tableaux, citations, code et liens (inventaire du 10/10/2026 : le web rendait
  le markdown à la main, sans titres ni tableaux, et laissait les adresses en
  texte brut).

  Il ne fait AUCUNE navigation lui-même : `renderLink` décide de ce qu'est un
  lien. L'application y pose son `Link` pour un chemin interne (pas de
  rechargement de page), une ancre ordinaire pour une adresse web. Sans lui, un
  chemin interne est une ancre, une adresse externe s'ouvre dans un onglet neuf.

  Les tailles suivent le texte courant de l'interface (`text-small`) : une
  réponse est une partie d'écran, pas un article. Les titres montent d'un cran,
  pas de trois.
*/

export interface MarkdownProps {
  /** Le texte en markdown. */
  children: string;
  /** Comment rendre un lien ; `href` est déjà vérifié (chemin, web, courriel, téléphone). */
  renderLink?: (href: string, enfants: React.ReactNode, cle: string) => React.ReactNode;
  /**
   * Un lien qui sort de l'application : un lien (`lien`, par défaut) ou du TEXTE
   * suivi de son domaine (`texte`). `texte` pour ce qu'écrit un modèle : un
   * contenu piégé ne peut plus y cacher des données dans l'adresse d'un lien.
   */
  externes?: 'lien' | 'texte';
  className?: string;
}

const externe = (href: string) => /^https?:\/\//i.test(href);

export function Markdown({ children, renderLink, externes = 'lien', className }: MarkdownProps) {
  const blocs = React.useMemo(() => analyser(children), [children]);
  const lien = (href: string, enfants: React.ReactNode, cle: string) =>
    renderLink ? renderLink(href, enfants, cle) : (
      <a key={cle} href={href} {...(externe(href) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
        {enfants}
      </a>
    );

  const ligne = (morceaux: readonly EnLigne[], cle: string): React.ReactNode[] => morceaux.map((m, k) => {
    const c = `${cle}.${k}`;
    switch (m.type) {
      case 'texte': return <React.Fragment key={c}>{m.texte}</React.Fragment>;
      case 'gras': return <strong key={c} className="font-semibold text-text">{ligne(m.enfants, c)}</strong>;
      case 'italique': return <em key={c}>{ligne(m.enfants, c)}</em>;
      case 'code': return <code key={c} className="rounded-control bg-bg-muted px-[5px] py-px font-mono text-[0.92em] text-text">{m.texte}</code>;
      case 'lien':
        if (externes === 'texte' && !lienSansSortie(m.href)) {
          return (
            <React.Fragment key={c}>
              {ligne(m.enfants, c)}
              <span className="text-text-muted"> ({domaineDe(m.href)})</span>
            </React.Fragment>
          );
        }
        return lien(m.href, ligne(m.enfants, c), c);
    }
  });

  const bloc = (b: Bloc, cle: string): React.ReactNode => {
    switch (b.type) {
      case 'titre': {
        const Balise = (`h${b.niveau + 2}`) as 'h3' | 'h4' | 'h5';
        return (
          <Balise key={cle} className={cn('mt-sm font-semibold text-text first:mt-0', b.niveau === 1 ? 'text-subhead' : 'text-body')}>
            {ligne(b.enfants, cle)}
          </Balise>
        );
      }
      case 'paragraphe':
        return <p key={cle} className="whitespace-pre-line">{ligne(b.enfants, cle)}</p>;
      case 'liste': {
        const Balise = b.ordonnee ? 'ol' : 'ul';
        return (
          <Balise key={cle} start={b.ordonnee && b.debut !== 1 ? b.debut : undefined}
            className={cn('flex flex-col gap-xxs pl-lg', b.ordonnee ? 'list-decimal' : 'list-disc', 'marker:text-text-muted')}>
            {b.elements.map((e, k) => (
              <li key={`${cle}.${k}`} className="pl-xxs">
                {ligne(e.enfants, `${cle}.${k}`)}
                {e.sousListe ? <div className="mt-xxs">{bloc(e.sousListe, `${cle}.${k}.s`)}</div> : null}
              </li>
            ))}
          </Balise>
        );
      }
      case 'tableau':
        return (
          // Un tableau large défile de côté DANS la réponse, jamais le panneau.
          <div key={cle} className="max-w-full overflow-x-auto rounded-block border border-border-soft">
            <table className="w-full border-collapse text-small">
              <thead className="bg-bg-subtle">
                <tr>
                  {b.entete.map((c, k) => (
                    <th key={k} scope="col" className={cn('border-b border-border-soft px-sm py-xs text-left font-semibold whitespace-nowrap text-text', alignement(b.alignements[k]))}>
                      {ligne(c, `${cle}.h${k}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.lignes.map((r, i) => (
                  <tr key={i} className="border-b border-border-soft last:border-b-0">
                    {r.map((c, k) => (
                      <td key={k} className={cn('px-sm py-xs align-top', alignement(b.alignements[k]))}>{ligne(c, `${cle}.${i}.${k}`)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'citation':
        return <blockquote key={cle} className="flex flex-col gap-sm border-l-2 border-border-soft pl-md text-text-muted">{b.blocs.map((x, k) => bloc(x, `${cle}.${k}`))}</blockquote>;
      case 'code':
        return (
          <pre key={cle} className="max-w-full overflow-x-auto rounded-block bg-bg-muted px-md py-sm font-mono text-caption leading-relaxed text-text">
            <code>{b.texte}</code>
          </pre>
        );
      case 'filet':
        return <hr key={cle} className="border-0 border-t border-border-soft" />;
    }
  };

  return (
    <div data-slot="markdown" className={cn('flex min-w-0 flex-col gap-sm text-small leading-relaxed text-text', className)}>
      {blocs.map((b, k) => bloc(b, String(k)))}
    </div>
  );
}

const alignement = (a: 'gauche' | 'centre' | 'droite' | null) =>
  a === 'centre' ? 'text-center' : a === 'droite' ? 'text-right tabular-nums' : '';
