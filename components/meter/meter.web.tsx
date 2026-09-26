'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { borner, proportionTone, type ProportionTone } from '../_lib/proportion';

const TONES: Record<ProportionTone | 'info', string> = {
  // Un état prévu, normal, qui n'appelle aucun regard (design-eu).
  info: 'bg-primary',
  success: 'bg-success',
  // `warning` et non `accent` : voir la note de `Gauge`, même défaut.
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export interface MeterProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'role'> {
  /** De 0 à 100. Borné plutôt que de dessiner une barre aberrante. */
  value: number;
  /** Ce que la proportion mesure. Lu par les lecteurs d'écran avec la valeur. */
  label: string;
  tone?: ProportionTone | 'info';
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
        className="h-1 shrink-0 overflow-hidden rounded-none bg-border-soft"
        style={{ width: width }}
      >
        <span
          className={cn('block h-full rounded-none', TONES[tone ?? proportionTone(pct)])}
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
