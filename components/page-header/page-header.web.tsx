'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

export interface PageHeaderProps {
  /** Le nom de l'écran. Pluriel pour une liste, singulier pour une fiche. */
  title: string;
  /**
   * D'où l'on vient. Sur une fiche, c'est la liste dont elle sort.
   *
   * Sans lui, on arrive sur un enregistrement sans savoir comment revenir —
   * et le bouton du navigateur ne suffit pas : on peut arriver là par un lien.
   */
  parent?: { label: string; href: string };
  /** Ce qu'on regarde, au bout du fil. Défaut : le titre. */
  current?: string;
  /** Un décompte à côté du titre : le nombre de résultats d'une liste. */
  count?: string | number;
  /** Ce qui s'aligne à droite : une action sur l'écran entier. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * L'en-tête d'un écran : d'où l'on vient, ce qu'on regarde, ce qu'on peut faire.
 *
 * Il ne défile pas avec le contenu — il dit où l'on est, et cette information
 * ne doit pas disparaître au premier coup de molette.
 */
export function PageHeader({
  title,
  parent,
  current,
  count,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn('shrink-0 border-b border-border-soft px-xl pt-base pb-md', className)}
    >
      {parent && (
        <nav aria-label="Fil d’Ariane" className="mb-xs flex items-center gap-sm text-small text-text-muted">
          <a
            href={parent.href}
            className="rounded-control font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {parent.label}
          </a>
          <Icon role="next" className="size-3 text-text-subtle" aria-hidden />
          <span className="truncate font-medium text-text">{current ?? title}</span>
        </nav>
      )}
      <div className="flex items-baseline gap-sm">
        <h1 className="text-title-large text-text">{title}</h1>
        {count !== undefined && (
          <span className="text-title tabular-nums text-text-muted">{count}</span>
        )}
        {actions && <span className="ml-auto">{actions}</span>}
      </div>
    </div>
  );
}
