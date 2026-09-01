import { ok, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { cn } from './cn.ts';

/*
  Ce que ces tests tiennent n'est pas une préférence de style : c'est la
  possibilité, pour un appelant, de surcharger un composant du système.

  Sans l'échelle d'espacement déclarée à tailwind-merge, `cn('p-base', 'p-0')`
  rendait `p-base p-0` — les deux classes, et l'ordre de la feuille décidait. Le
  défaut du composant gagnait donc contre l'intention de l'appelant, en silence.
  Le sélecteur d'agence a porté ce bogue quatre jours et trois corrections
  inutiles, chacune ayant cherché le remplissage là où il n'était pas.
*/
describe('cn surcharge les espacements du système', () => {
  it('un p-0 de l’appelant efface le p-base du composant', () => {
    strictEqual(cn('p-base', 'p-0'), 'p-0');
  });

  it('un p-0 efface aussi les axes séparés', () => {
    strictEqual(cn('px-base py-xl', 'p-0'), 'p-0');
  });

  it('deux valeurs de la même échelle : la dernière gagne', () => {
    strictEqual(cn('p-base', 'p-sm'), 'p-sm');
    strictEqual(cn('gap-md', 'gap-sm'), 'gap-sm');
    strictEqual(cn('py-xs', 'py-0'), 'py-0');
  });

  /* La régression que la déclaration des tailles de texte avait corrigée : elle
     doit tenir en même temps, une taille n'étant pas une couleur. */
  it('une taille de texte n’efface pas une couleur de texte', () => {
    ok(cn('text-text-on-dark', 'text-small').includes('text-text-on-dark'));
    ok(cn('text-text-on-dark', 'text-small').includes('text-small'));
  });
});
