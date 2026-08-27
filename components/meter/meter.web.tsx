'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { borner, proportionTone, type ProportionTone } from '../_lib/proportion';

const TONES: Record<ProportionTone, string> = {
  success: 'bg-success',
  warning: 'bg-accent',
  danger: 'bg-danger',
};

export interface MeterProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'role'> {
  /** De 0 à 100. Borné plutôt que de dessiner une barre aberrante. */
  value: number;
  /** Ce que la proportion mesure. Lu par les lecteurs d'écran avec la valeur. */
  label: string;
  tone?: ProportionTone;
  /** Largeur de la barre. Une série n'est comparable que si elle est constante. */
  width?: number;
  /** Le chiffre à côté de la barre. Le masquer ne se justifie que dans une cellule déjà chiffrée. */
  figure?: boolean;
}

export function Meter({
  value,
  label,
  tone,
  width = 64,
  figure = true,
  className,
  ...props
}: MeterProps) {
  const pct = borner(value);

  return (
    <span className={cn('inline-flex items-center gap-sm', className)} {...props}>
      <span
        role="img"
        aria-label={`${label} : ${pct} %`}
        className="h-1 shrink-0 overflow-hidden rounded-full bg-border-soft"
        style={{ width: width }}
      >
        <span
          className={cn('block h-full rounded-full', TONES[tone ?? proportionTone(pct)])}
          style={{ width: `${pct}%` }}
        />
      </span>
      {figure && (
        <span aria-hidden className="tabular-nums text-caption text-text-muted">
          {pct} %
        </span>
      )}
    </span>
  );
}
