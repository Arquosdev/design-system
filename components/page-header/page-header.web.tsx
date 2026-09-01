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
      {/*
        La ligne du titre a une hauteur MINIMALE, celle d'un bouton.

        Sans elle, l'en-tête mesurait 65 pixels sur une liste qui porte un
        bouton de création et 55 sur une liste qui n'en a pas : on passait de
        l'une à l'autre et le titre sautait de six pixels. Deux écrans qui font
        la même chose ne doivent pas se dessiner différemment selon ce qu'ils
        ont à offrir.

        `36px` est la hauteur d'un `Button` en taille normale. Elle est écrite
        en dur ici comme elle l'est déjà dans `Button` et dans `RecordRail` :
        le design system n'a pas de token de hauteur de contrôle, et en créer un
        est une décision d'échelle à part.
      */}
      <div className="flex min-h-(--arq-control-md) items-center gap-sm">
        {/*
          Le titre et son décompte s'alignent sur la LIGNE DE BASE entre eux —
          deux corps différents alignés autrement se lisent de travers — mais
          le groupe entier se centre dans la ligne.

          Ils étaient alignés sur la ligne de base des ACTIONS, ce qui faisait
          descendre le titre de six pixels dès qu'un bouton paraissait. La
          hauteur minimale de la ligne réglait la hauteur de l'en-tête ; celle-ci
          règle la place du titre dedans.
        */}
        <span className="flex items-baseline gap-sm">
          <h1 className="text-title-large text-text">{title}</h1>
          {count !== undefined && (
            <span className="text-title tabular-nums text-text-muted">{count}</span>
          )}
        </span>
        {actions && <span className="ml-auto">{actions}</span>}
      </div>
    </div>
  );
}
