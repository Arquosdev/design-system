'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { ProgressBar } from '../progress/progress.web';
import { borner, type ProportionTone } from '../_lib/proportion';


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
      {/* LA barre de progression du design system, et aucune autre (Louis, 12/11/2026) : coins
          entièrement arrondis, 4 px, même règle de couleur par seuil que la fiche. */}
      <ProgressBar
        value={pct}
        label={label}
        tone={tone === 'info' ? 'primary' : tone}
        className="shrink-0"
        style={{ width: width }}
      />
      {figure && (
        <span aria-hidden className="tabular-nums text-caption text-text-muted">
          {pct} %
        </span>
      )}
    </span>
  );
}
