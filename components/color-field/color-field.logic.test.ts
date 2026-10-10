import { ok, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SUGGESTIONS, blancLisible, contraste, normaliser, versHex, versTsv } from './color-field.logic.ts';

describe('ColorField : le calcul', () => {
  it('lit un code sous ses formes courantes, et refuse le reste', () => {
    strictEqual(normaliser('0d5ab7'), '#0D5AB7');
    strictEqual(normaliser(' #0D5AB7 '), '#0D5AB7');
    strictEqual(normaliser('#08f'), '#0088FF');
    strictEqual(normaliser('#0D5AB'), null);
    strictEqual(normaliser('bleu'), null);
  });

  it('va et revient entre HEX et TSV sans perdre la couleur', () => {
    for (const hex of ['#0D5AB7', '#FFFFFF', '#000000', '#FF0000', '#7E22CE', '#B45309']) {
      strictEqual(versHex(versTsv(hex)), hex);
    }
  });

  it('mesure le contraste comme le WCAG', () => {
    strictEqual(Math.round(contraste('#000000', '#FFFFFF') * 10) / 10, 21);
    strictEqual(contraste('#FFFFFF', '#FFFFFF'), 1);
    ok(!blancLisible('#FACC15'), 'un jaune vif ne porte pas un texte blanc');
  });

  it('ne propose que des couleurs qui portent un texte blanc', () => {
    for (const hex of SUGGESTIONS) ok(blancLisible(hex), `${hex} : ${contraste(hex, '#FFFFFF').toFixed(2)}`);
  });
});
