'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';

export interface Segment {
  cle: string;
  label: string;
  compteur?: number | string;
}

export interface SegmentedTabsProps {
  segments: readonly Segment[];
  valeur: string;
  onChanger: (cle: string) => void;
  /** Ce que ce groupe sépare, pour l'annoncer aux lecteurs d'écran. */
  ariaLabel: string;
  className?: string;
}

export function SegmentedTabs({
  segments,
  valeur,
  onChanger,
  ariaLabel,
  className,
}: SegmentedTabsProps) {
  // Les flèches déplacent la sélection : c'est ce qu'un lecteur d'écran attend
  // d'un groupe d'onglets, et ce qui évite de tabuler à travers chaque segment.
  const auClavier = (e: React.KeyboardEvent) => {
    const pas = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const i = segments.findIndex((s) => s.cle === valeur);
    const suivant = segments[(i + pas + segments.length) % segments.length];
    onChanger(suivant.cle);
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={auClavier}
      className={cn('flex gap-xxs rounded-md bg-bg-muted p-xxs', className)}
    >
      {segments.map((segment) => {
        const actif = segment.cle === valeur;
        return (
          <button
            key={segment.cle}
            type="button"
            role="tab"
            aria-selected={actif}
            // Un seul segment est atteignable au Tab ; les flèches font le reste.
            tabIndex={actif ? 0 : -1}
            onClick={() => onChanger(segment.cle)}
            className={cn(
              // `flex-1` et non la largeur du texte : sinon la piste tressaute
              // d'un onglet à l'autre quand les libellés sont inégaux.
              'flex flex-1 items-center justify-center gap-sm rounded-control px-sm py-sm text-small outline-none',
              // Un libellé ne se coupe jamais en deux lignes : « Tous les
              // champs » rendait « Tous les / champs », et la piste doublait de
              // hauteur. Mieux vaut une piste qui dépasse — l'appelant la fait
              // passer à la ligne — qu'un onglet illisible.
              'whitespace-nowrap',
              // Et jamais plus étroit que son contenu. `flex-1` partage la
              // place en parts égales, y compris quand elle manque : l'onglet
              // se retrouvait plus court que son texte, qui débordait alors sur
              // le compteur — « Tous les champs239 », collés. `min-w-fit` pose
              // le plancher ; la part égale ne joue qu'au-dessus.
              'min-w-fit',
              'focus-visible:ring-2 focus-visible:ring-primary',
              // Même règle que `NavList` : un segment au repos est en `medium`,
              // le segment courant garde `semibold`. Les deux composants se
              // touchent en haut du rail, un écart de graisse entre eux se
              // verrait tout de suite.
              actif
                ? 'bg-bg font-semibold text-text shadow-card'
                : 'font-medium text-text-muted',
            )}
          >
            {/*
              Le libellé est doublé d'un fantôme en `semibold`, superposé dans
              la même cellule de grille. C'est lui qui donne sa largeur au
              segment : sans ça, la largeur se calcule sur la graisse COURANTE,
              et le segment qui devient actif — donc plus gras — ne rentre plus
              dans la place qu'il occupait. Il se coupait alors en deux lignes,
              ce qui se voyait sur « Face 1 » à côté de « Face 2 ».
            */}
            <span className="grid grid-cols-1 grid-rows-1 place-items-center">
              <span className="col-start-1 row-start-1">{segment.label}</span>
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 font-semibold"
              >
                {segment.label}
              </span>
            </span>
            {segment.compteur !== undefined && segment.compteur !== '' ? (
              <span
                className={cn(
                  'tabular-nums',
                  actif ? 'font-semibold text-primary' : 'text-text-muted',
                )}
              >
                {segment.compteur}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
