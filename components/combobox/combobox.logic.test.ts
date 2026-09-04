import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { choixReels, contenuAffiche } from './combobox.logic.ts';

/* Ce que `menuDeChoix` fabrique pour un champ vide : la sentinelle du `Select`
   en tête, puis les vraies marques. */
const AVEC_SENTINELLE = [
  { valeur: '', libelle: '— choisir —' },
  { valeur: 'SEMATIC', libelle: 'SEMATIC' },
  { valeur: 'FERMATOR', libelle: 'FERMATOR' },
];

describe('choixReels', () => {
  it('écarte la sentinelle du Select', () => {
    deepStrictEqual(
      choixReels(AVEC_SENTINELLE).map((o) => o.valeur),
      ['SEMATIC', 'FERMATOR'],
    );
  });

  it('ne touche à rien quand il n’y en a pas', () => {
    const sans = [{ valeur: 'OTIS', libelle: 'OTIS' }];
    deepStrictEqual(choixReels(sans), sans);
  });
});

describe('contenuAffiche', () => {
  it('laisse le champ VIDE quand rien n’est retenu', () => {
    // Le défaut du 04/09/2026 : la sentinelle s'affichait comme une saisie, et
    // la frappe s'y collait.
    strictEqual(contenuAffiche(AVEC_SENTINELLE, '', false, ''), '');
  });

  it('montre le libellé de la valeur retenue', () => {
    strictEqual(contenuAffiche(AVEC_SENTINELLE, 'SEMATIC', false, ''), 'SEMATIC');
  });

  it('garde une valeur hors catalogue telle quelle', () => {
    strictEqual(contenuAffiche(AVEC_SENTINELLE, 'MARQUE INCONNUE', false, ''), 'MARQUE INCONNUE');
  });

  it('montre la frappe dès que le champ est ouvert', () => {
    strictEqual(contenuAffiche(AVEC_SENTINELLE, 'SEMATIC', true, 'FER'), 'FER');
  });
});
