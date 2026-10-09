import * as React from 'react';

import { iconSize } from '../../src/icons';
import { cn } from '../_lib/cn';
import { CONSTELLATION } from '../icon/constellation';

/*
  L'assistant RÉFLÉCHIT : la constellation de `aiAssist`, animée (Louis,
  09/10/2026, en voyant l'agent de Mintlify). Une vague part des quatre points
  du centre et gagne le bord ; chaque point s'allume et grossit à son passage.

  L'animation est en SMIL (`<animate>`), dans le dessin lui-même : ni feuille
  de style ni image clé à déclarer, et elle tourne là où le dessin est posé.
  Quand le système demande moins de mouvement, le dessin reste immobile.
*/

const DUREE = 1.6; // secondes, un aller et retour de la vague
const D_CENTRE = Math.SQRT1_2;
/** La distance au centre, en pas de grille, pour retarder chaque point. */
const distance = (x: number, y: number) => Math.hypot((x - 12) / 4.1, (y - 12) / 4.1);

function useMoinsDeMouvement() {
  const [moins, setMoins] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const suivre = () => setMoins(m.matches);
    suivre();
    m.addEventListener('change', suivre);
    return () => m.removeEventListener('change', suivre);
  }, []);
  return moins;
}

export interface ThinkingDotsProps extends Omit<React.SVGProps<SVGSVGElement>, 'role' | 'ref'> {
  /** Échelon de `iconSize`. Défaut `md` (18), comme l'icône qu'il remplace. */
  size?: keyof typeof iconSize;
  /** Ce qui est annoncé au lecteur d'écran. Vide, le dessin est décoratif : un texte voisin dit déjà que l'assistant travaille. */
  label?: string;
}

export function ThinkingDots({ size = 'md', label, className, ...props }: ThinkingDotsProps) {
  const immobile = useMoinsDeMouvement();
  const cote = iconSize[size];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={cote}
      height={cote}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: false })}
      data-role="thinking"
      className={cn('shrink-0', className)}
      {...props}
    >
      {CONSTELLATION.map((p) => {
        const retard = ((distance(p.x, p.y) - D_CENTRE) * DUREE) / 4.5;
        return (
          <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r={p.r} opacity={immobile ? 1 : 0.3}>
            {immobile ? null : (
              <>
                <animate attributeName="opacity" values="0.3;1;0.3" keyTimes="0;0.3;1" dur={`${DUREE}s`} begin={`${retard.toFixed(3)}s`} repeatCount="indefinite" />
                <animate attributeName="r" values={`${p.r * 0.7};${p.r * 1.15};${p.r * 0.7}`} keyTimes="0;0.3;1" dur={`${DUREE}s`} begin={`${retard.toFixed(3)}s`} repeatCount="indefinite" />
              </>
            )}
          </circle>
        );
      })}
    </svg>
  );
}
