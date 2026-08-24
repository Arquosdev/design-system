import * as React from 'react';

import { cn } from '../_lib/cn';

export interface GaugeProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'role'> {
  /** De 0 à 100. Borné plutôt que de dessiner un arc aberrant. */
  valeur: number;
  label: string;
  taille?: number;
  tone?: 'success' | 'warning' | 'danger';
}

const TONS = {
  success: 'var(--color-success)',
  warning: 'var(--color-accent)',
  danger: 'var(--color-danger)',
} as const;

/** Sans `tone`, la couleur suit la valeur — mais le chiffre reste toujours écrit. */
function tonAutomatique(valeur: number): keyof typeof TONS {
  if (valeur < 34) return 'danger';
  if (valeur < 67) return 'warning';
  return 'success';
}

export function Gauge({ valeur, label, taille = 64, tone, className, ...props }: GaugeProps) {
  const pct = Math.max(0, Math.min(100, Math.round(valeur)));
  const rayon = taille / 2 - 5;
  const circonference = 2 * Math.PI * rayon;
  const couleur = TONS[tone ?? tonAutomatique(pct)];

  return (
    <div
      role="img"
      aria-label={`${label} : ${pct} %`}
      className={cn('flex items-center gap-md', className)}
      {...props}
    >
      <svg width={taille} height={taille} viewBox={`0 0 ${taille} ${taille}`} aria-hidden="true">
        {/* La piste reste visible à 0 % : un cercle disparu se lit comme une
            panne d'affichage. */}
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="7"
        />
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          fill="none"
          stroke={couleur}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(circonference * pct) / 100} ${circonference}`}
          // Départ à midi plutôt qu'à trois heures.
          transform={`rotate(-90 ${taille / 2} ${taille / 2})`}
        />
      </svg>
      <div>
        <div className="text-title font-bold text-text">{pct} %</div>
        <div className="text-caption text-text-muted">{label}</div>
      </div>
    </div>
  );
}
