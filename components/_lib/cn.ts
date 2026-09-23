import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { typography } from '../../src/typography.ts';

/**
 * Les noms de nos préréglages typographiques, tels que Tailwind les expose
 * (`text-body`, `text-title-lg`…).
 *
 * Dérivés de la source plutôt que recopiés : une liste tenue à la main finirait
 * par oublier un préréglage, et l'oubli est invisible — la classe de couleur
 * disparaîtrait en silence sur les composants qui l'emploient.
 */
const TEXT_SIZES = Object.keys(typography).map((name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
);

/**
 * tailwind-merge doit savoir lesquelles de nos classes `text-*` sont des
 * TAILLES et lesquelles sont des COULEURS. Sans cette déclaration il range tout
 * `text-…` inconnu dans le même groupe, et la dernière écrase la première :
 * `text-text-on-dark text-small` perdait sa couleur, ce qui donnait du texte
 * sombre sur un fond bleu foncé — illisible, et silencieux.
 */
/**
 * Nos noms d'espacement, tels que Tailwind les expose (`p-base`, `gap-sm`,
 * `mx-lg`…). Dérivés des jetons plutôt que recopiés, pour la même raison que
 * les tailles de texte.
 */
const SPACINGS = [
  'none', 'xxs', 'xs', 'sm', 'md', 'base', 'lg', 'xl',
  '2xl', '3xl', '4xl', '5xl',
];

/**
 * tailwind-merge doit AUSSI connaître notre échelle d'espacement, faute de quoi
 * un composant du système ne peut pas être surchargé par son appelant.
 *
 * **C'était un défaut réel et coûteux.** `p-base` n'entre dans aucun groupe que
 * tailwind-merge reconnaisse — il attend `p-4`, `p-px`, `p-[16px]`. Il ne voyait
 * donc aucun conflit entre `p-base` et un `p-0` passé en `className`, gardait
 * les DEUX, et laissait l'ordre de la feuille trancher : le défaut du composant
 * gagnait, en silence.
 *
 * Mesuré le 31/08/2026 sur le sélecteur d'agence : `class="… p-base … p-0"`,
 * padding calculé de 16 pixels. Louis l'a signalé quatre fois, et trois
 * corrections successives ont porté sur le remplissage sans effet — parce que
 * le remplissage n'était pas le sujet, l'impossibilité de le surcharger l'était.
 *
 * Le défaut valait pour tous les axes : `p`, `px`, `py`, `m`, `gap`, `space`,
 * `inset`, `w`, `h`. Les déclarer ici les rend surchargeables d'un coup.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: SPACINGS,
    },
  },
  override: {
    classGroups: {
      'font-size': [{ text: TEXT_SIZES }],
    },
  },
});

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
