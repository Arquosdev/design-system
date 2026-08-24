import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne des classes Tailwind en laissant la dernière gagner sur un même
 * axe : `cn('p-base', 'p-sm')` donne `p-sm`, pas les deux.
 *
 * C'est ce qui rend la prop `className` d'un composant sûre — l'appelant peut
 * surcharger une valeur sans que l'ordre d'écriture dans la feuille décide.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
