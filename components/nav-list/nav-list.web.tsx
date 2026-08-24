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
  /**
   * Intitulé du groupe. À omettre quand ce qui précède le dit déjà — un onglet
   * « Composants » suivi d'un intitulé « COMPOSANTS » ne fait que répéter.
   */
  titre?: string;
  items: readonly NavItem[];
  courant?: string;
  onChoisir: (cle: string) => void;
  /** Rend l'intitulé cliquable, pour replier le groupe. */
  repliable?: boolean;
  /** Ouvert au premier rendu. Sans effet si le groupe n'est pas repliable. */
  ouvertParDefaut?: boolean;
  className?: string;
}

export function NavList({
  titre,
  items,
  courant,
  onChoisir,
  repliable = false,
  ouvertParDefaut = true,
  className,
}: NavListProps) {
  const [ouvert, setOuvert] = React.useState(ouvertParDefaut);
  // Un groupe replié qui contient la rubrique ouverte la cacherait : on le
  // laisse déplié tant qu'elle est dedans.
  const contientCourant = items.some((i) => i.cle === courant);
  const deplie = !repliable || ouvert || contientCourant;

  const intitule = (
    <span className="flex-1 text-left text-caption font-bold tracking-wide uppercase">
      {titre}
    </span>
  );

  return (
    <div className={cn('shrink-0', className)}>
      {!titre ? null : repliable ? (
        <button
          type="button"
          aria-expanded={deplie}
          onClick={() => setOuvert(!deplie)}
          className="flex w-full items-center gap-sm rounded-control px-xs pb-sm text-text-subtle outline-none hover:text-text focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronBas ouvert={deplie} />
          {intitule}
          <span className="shrink-0 tabular-nums text-small">{items.length}</span>
        </button>
      ) : (
        <div className="flex px-xs pb-sm text-text-subtle">{intitule}</div>
      )}

      <div className={cn('flex flex-col gap-xxs', !deplie && 'hidden')}>
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

function ChevronBas({ ouvert }: { ouvert: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="22"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        'shrink-0 transition-transform duration-200',
        ouvert ? 'rotate-0' : '-rotate-90',
      )}
    >
      <path d="M48 96l80 80 80-80" />
    </svg>
  );
}
