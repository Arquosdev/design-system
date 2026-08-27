'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { borner, tonProportion, type TonProportion } from '../_lib/proportion';

const TONS: Record<TonProportion, string> = {
  success: 'bg-success',
  warning: 'bg-accent',
  danger: 'bg-danger',
};

export interface MeterProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'role'> {
  /** De 0 à 100. Borné plutôt que de dessiner une barre aberrante. */
  valeur: number;
  /** Ce que la proportion mesure. Lu par les lecteurs d'écran avec la valeur. */
  label: string;
  ton?: TonProportion;
  /** Largeur de la barre. Une série n'est comparable que si elle est constante. */
  largeur?: number;
  /** Le chiffre à côté de la barre. Le masquer ne se justifie que dans une cellule déjà chiffrée. */
  chiffre?: boolean;
}

export function Meter({
  valeur,
  label,
  ton,
  largeur = 64,
  chiffre = true,
  className,
  ...props
}: MeterProps) {
  const pct = borner(valeur);

  return (
    <span className={cn('inline-flex items-center gap-sm', className)} {...props}>
      <span
        role="img"
        aria-label={`${label} : ${pct} %`}
        className="h-1 shrink-0 overflow-hidden rounded-full bg-border-soft"
        style={{ width: largeur }}
      >
        <span
          className={cn('block h-full rounded-full', TONS[ton ?? tonProportion(pct)])}
          style={{ width: `${pct}%` }}
        />
      </span>
      {chiffre && (
        <span aria-hidden className="tabular-nums text-caption text-text-muted">
          {pct} %
        </span>
      )}
    </span>
  );
}
