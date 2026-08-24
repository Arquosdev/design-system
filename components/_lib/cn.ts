import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { typography } from '../../src/typography';

/**
 * Les noms de nos préréglages typographiques, tels que Tailwind les expose
 * (`text-body`, `text-title-lg`…).
 *
 * Dérivés de la source plutôt que recopiés : une liste tenue à la main finirait
 * par oublier un préréglage, et l'oubli est invisible — la classe de couleur
 * disparaîtrait en silence sur les composants qui l'emploient.
 */
const TAILLES_DE_TEXTE = Object.keys(typography).map((nom) =>
  nom.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
);

/**
 * tailwind-merge doit savoir lesquelles de nos classes `text-*` sont des
 * TAILLES et lesquelles sont des COULEURS. Sans cette déclaration il range tout
 * `text-…` inconnu dans le même groupe, et la dernière écrase la première :
 * `text-text-on-dark text-small` perdait sa couleur, ce qui donnait du texte
 * sombre sur un fond bleu foncé — illisible, et silencieux.
 */
const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      'font-size': [{ text: TAILLES_DE_TEXTE }],
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
