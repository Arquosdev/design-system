'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';

export interface NavItem {
  cle: string;
  label: string;
  /**
   * Ce que contient la rubrique. Une chaîne est acceptée pour pouvoir dire
   * « … » tant qu'on ne sait pas — `0` affirmerait qu'il n'y a rien.
   */
  compteur?: number | string;
  desactive?: boolean;
}

export interface NavListProps {
  titre: string;
  items: readonly NavItem[];
  courant?: string;
  onChoisir: (cle: string) => void;
  className?: string;
}

export function NavList({ titre, items, courant, onChoisir, className }: NavListProps) {
  return (
    <div className={cn('shrink-0', className)}>
      <div className="px-xs pb-sm text-caption font-bold tracking-wide text-text-subtle uppercase">
        {titre}
      </div>
      <div className="flex flex-col gap-xxs">
        {items.map((item) => {
          const actif = item.cle === courant;
          return (
            <button
              key={item.cle}
              type="button"
              // `aria-current` en plus du fond teinté : la couleur seule ne dit
              // rien à un lecteur d'écran.
              aria-current={actif ? 'page' : undefined}
              disabled={item.desactive}
              onClick={() => onChoisir(item.cle)}
              className={cn(
                'flex w-full items-center gap-sm rounded-control px-xs py-sm text-left text-small outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary',
                'disabled:pointer-events-none disabled:opacity-50',
                actif
                  ? 'bg-blue-50 font-semibold text-blue-700'
                  : 'text-text hover:bg-bg-muted',
              )}
            >
              <span className="flex-1">{item.label}</span>
              {item.compteur !== undefined && item.compteur !== '' ? (
                // Chasse fixe : sans elle les nombres dansent d'une ligne à l'autre.
                <span className="shrink-0 tabular-nums text-small text-text-subtle">
                  {item.compteur}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
