import * as React from 'react';

import { cn } from '../_lib/cn';
import { borner, proportionTone } from '../_lib/proportion';

export interface GaugeProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'role'> {
  /** De 0 à 100. Borné plutôt que de dessiner un arc aberrant. */
  value: number;
  label: string;
  size?: number;
  tone?: 'success' | 'warning' | 'danger';
  /**
   * Ce qui se pose au CREUX de l'anneau — le seul endroit libre de la jauge.
   *
   * Prévu pour un bouton : le taux dit combien on sait, et le creux ouvre le
   * détail de ce qui manque. Rien d'autre n'a sa place là — un chiffre s'y
   * confondrait avec le pourcentage, à deux centimètres de lui.
   */
  centered?: React.ReactNode;
}

const TONES = {
  success: 'var(--color-success)',
  warning: 'var(--color-accent)',
  danger: 'var(--color-danger)',
} as const;

export function Gauge({
  value,
  label,
  size = 64,
  tone,
  centered,
  className,
  ...props
}: GaugeProps) {
  const pct = borner(value);
  const rayon = size / 2 - 5;
  const circumference = 2 * Math.PI * rayon;
  const couleur = TONES[tone ?? proportionTone(pct)];

  return (
    <div
      role="img"
      aria-label={`${label} : ${pct} %`}
      className={cn('flex items-center gap-md', className)}
      {...props}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {/* La piste reste visible à 0 % : un cercle disparu se lit comme une
            panne d'affichage. */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={rayon}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="7"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={rayon}
          fill="none"
          stroke={couleur}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(circumference * pct) / 100} ${circumference}`}
          // Départ à midi plutôt qu'à trois heures.
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {/* Centré par `inset-0 m-auto` : la taille de l'anneau est une propriété,
          et un décalage calculé se déréglerait à la première autre taille. */}
      {centered ? (
        <div className="absolute inset-0 m-auto flex size-fit items-center justify-center">
          {centered}
        </div>
      ) : null}
      </div>
      <div>
        <div className="text-title font-bold text-text">{pct} %</div>
        <div className="text-caption text-text-muted">{label}</div>
      </div>
    </div>
  );
}
