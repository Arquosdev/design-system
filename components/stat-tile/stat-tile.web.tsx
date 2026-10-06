import * as React from 'react';

import { cn } from '../_lib/cn';

export interface StatTileProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
  unit?: string;
  /** Précision sous la mesure (« 4 personnes », « gaine maçonnée »). */
  detail?: string;
}

export function StatTile({ label, value, unit, detail, className, ...props }: StatTileProps) {
  const empty = !value;
  return (
    <div
      className={cn(
        'rounded-block border border-border-soft bg-bg p-base',
        // L'arête marine signale un chiffre ; une tuile vide n'en porte pas,
        // sans quoi six cases « — » pesaient autant que six mesures.
        empty ? 'border-border-soft' : 'border-t-2 border-t-brand',
        className,
      )}
      {...props}
    >
      <div className="text-caption font-medium text-text-muted">{label}</div>
      <div className="mt-xs flex items-baseline gap-xs">
        <span
          className={cn(
            'text-display font-bold tracking-tight break-words',
            empty ? 'text-text-muted' : 'text-brand',
          )}
        >
          {empty ? '—' : value}
        </span>
        {/* Une unité sans nombre devant ne veut rien dire. */}
        {unit && !empty ? <span className="text-small text-text-muted">{unit}</span> : null}
      </div>
      {detail ? <div className="mt-xxs text-caption text-text-muted">{detail}</div> : null}
    </div>
  );
}
