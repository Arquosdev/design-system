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

export interface SlotRowProps extends React.ComponentPropsWithoutRef<'ul'> {
  /** Les cases, dans l'ordre : leur nom (info-bulle) et si elles sont remplies. */
  slots: readonly { name: string; filled: boolean }[];
  /** Ce que la rangée compte, pour un lecteur d'écran : « Photos essentielles ». */
  label: string;
  tone?: keyof typeof TONES;
}

/**
 * Une rangée de petites cases (10 px, 4 px d'écart) : pleine pour ce qui est fait, contour
 * seul pour ce qui manque, le nom de chacune en info-bulle. Elle se lit d'un coup d'œil, là
 * où une liste de vingt noms gonflait la carte.
 */
export function SlotRow({ slots, label, tone = 'primary', className, ...props }: SlotRowProps) {
  return (
    <ul aria-label={label} className={cn('flex flex-wrap gap-xs', className)} {...props}>
      {slots.map((s, i) => (
        <li
          key={`${i}-${s.name}`}
          title={`${s.name} : ${s.filled ? 'prise' : 'manquante'}`}
          className={cn('size-2.5 rounded-[2px]', s.filled ? TONES[tone] : 'border border-border')}
        >
          <span className="sr-only">{`${s.name} : ${s.filled ? 'prise' : 'manquante'}`}</span>
        </li>
      ))}
    </ul>
  );
}
