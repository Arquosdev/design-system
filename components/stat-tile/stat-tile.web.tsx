import * as React from 'react';

import { cn } from '../_lib/cn';

export interface StatTileProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  valeur: string;
  unite?: string;
  /** Précision sous la mesure (« 4 personnes », « gaine maçonnée »). */
  detail?: string;
}

export function StatTile({ label, valeur, unite, detail, className, ...props }: StatTileProps) {
  const vide = !valeur;
  return (
    <div
      className={cn('rounded-md border border-border-soft bg-bg p-base', className)}
      {...props}
    >
      <div className="text-caption text-text-muted">{label}</div>
      <div className="mt-xs flex items-baseline gap-xs">
        <span
          className={cn(
            'text-headline font-bold break-words',
            vide ? 'text-text-muted' : 'text-text',
          )}
        >
          {vide ? '—' : valeur}
        </span>
        {/* Une unité sans nombre devant ne veut rien dire. */}
        {unite && !vide ? <span className="text-small text-text-muted">{unite}</span> : null}
      </div>
      {detail ? <div className="mt-xxs text-caption text-text-muted">{detail}</div> : null}
    </div>
  );
}
