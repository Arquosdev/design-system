'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { borner, proportionTone } from '../_lib/proportion';

/*
  UNE PROPORTION, SOBREMENT (Louis, 12/11/2026, carte Connaissance de l'équipement). Seules la
  barre et les cases pleines portent une couleur, celle du seuil ; le texte autour reste neutre.
*/

const TONES = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  primary: 'bg-primary',
  // Une quantité sans jugement (le stock d'une pièce au-dessus de son seuil).
  neutral: 'bg-text-subtle',
} as const;

export interface ProgressBarProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'role'> {
  /** De 0 à 100, borné. */
  value: number;
  /** Ce que la barre mesure, pour un lecteur d'écran. */
  label: string;
  /** La couleur ; par défaut celle du seuil de la proportion. */
  tone?: keyof typeof TONES;
}

/** Une fine barre de progression : 4 px, arrondie, la piste au gris des filets. */
export function ProgressBar({ value, label, tone, className, ...props }: ProgressBarProps) {
  const pct = borner(value);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn('h-xs w-full overflow-hidden rounded-full bg-border-soft', className)}
      {...props}
    >
      <div className={cn('h-full rounded-full', TONES[tone ?? proportionTone(pct)])} style={{ width: `${pct}%` }} />
    </div>
  );
}
