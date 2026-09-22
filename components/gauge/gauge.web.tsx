import * as React from 'react';

import { cn } from '../_lib/cn';

export interface GaugeProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'role'> {
  /** De 0 à 100. Borné plutôt que de dessiner un arc aberrant. */
  valeur: number;
  label: string;
  taille?: number;
  tone?: 'success' | 'warning' | 'danger';
  /**
   * Ce qui se pose au CREUX de l'anneau — le seul endroit libre de la jauge.
   *
   * Prévu pour un bouton : le taux dit combien on sait, et le creux ouvre le
   * détail de ce qui manque. Rien d'autre n'a sa place là — un chiffre s'y
   * confondrait avec le pourcentage, à deux centimètres de lui.
   */
  centre?: React.ReactNode;
}

/*
  `--color-warning` ET NON `--color-accent`, qui porte pourtant le même orange.

  `accent` est réécrit par la couche de compatibilité shadcn : elle définit
  `--accent` comme une surface de survol (#E1ECFA, un bleu très pâle) puis
  `--color-accent: var(--accent)`, après la déclaration Arquos. La seconde
  l'emporte, et l'arc du palier moyen se dessinait donc en bleu pâle sur une
  piste grise — **invisible**. Retour client relayé par Thomas le 22/09/2026 :
  « le rendu du disque est bizarre non ? ». Mesuré dans la vitrine : à 54 %,
  aucun arc.

  Le jeton `warning` porte exactement la même couleur, sous un nom que rien ne
  dispute. C'est lui qu'il fallait dès le départ — d'autant que ce palier
  s'appelle « warning ».
*/
const TONS = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
} as const;

/** Sans `tone`, la couleur suit la valeur — mais le chiffre reste toujours écrit. */
function tonAutomatique(valeur: number): keyof typeof TONS {
  if (valeur < 34) return 'danger';
  if (valeur < 67) return 'warning';
  return 'success';
}

export function Gauge({
  valeur,
  label,
  taille = 64,
  tone,
  centre,
  className,
  ...props
}: GaugeProps) {
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
      <div className="relative shrink-0" style={{ width: taille, height: taille }}>
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
      {/* Centré par `inset-0 m-auto` : la taille de l'anneau est une propriété,
          et un décalage calculé se déréglerait à la première autre taille. */}
      {centre ? (
        <div className="absolute inset-0 m-auto flex size-fit items-center justify-center">
          {centre}
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
