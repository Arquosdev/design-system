import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { realChoices, displayedText, displayedPlaceholder } from './combobox.logic.ts';

/* Ce que `menuDeChoix` fabrique pour un champ vide : la sentinelle du `Select`
   en tête, puis les vraies marques. */
const AVEC_SENTINELLE = [
  { value: '', label: '— choisir —' },
  { value: 'SEMATIC', label: 'SEMATIC' },
  { value: 'FERMATOR', label: 'FERMATOR' },
];

describe('choixReels', () => {
  it('écarte la sentinelle du Select', () => {
    deepStrictEqual(
      realChoices(AVEC_SENTINELLE).map((o) => o.value),
      ['SEMATIC', 'FERMATOR'],
    );
  });

  it('ne touche à rien quand il n’y en a pas', () => {
    const sans = [{ value: 'OTIS', label: 'OTIS' }];
    deepStrictEqual(realChoices(sans), sans);
  });
});

describe('contenuAffiche', () => {
  it('laisse le champ VIDE quand rien n’est retenu', () => {
    // Le défaut du 04/09/2026 : la sentinelle s'affichait comme une saisie, et
    // la frappe s'y collait.
    strictEqual(displayedText(AVEC_SENTINELLE, '', false, ''), '');
  });

  it('montre le libellé de la valeur retenue', () => {
    strictEqual(displayedText(AVEC_SENTINELLE, 'SEMATIC', false, ''), 'SEMATIC');
  });

  it('garde une valeur hors catalogue telle quelle', () => {
    strictEqual(displayedText(AVEC_SENTINELLE, 'MARQUE INCONNUE', false, ''), 'MARQUE INCONNUE');
  });

  it('montre la frappe dès que le champ est ouvert', () => {
    strictEqual(displayedText(AVEC_SENTINELLE, 'SEMATIC', true, 'FER'), 'FER');
  });
});

describe('invitAffichee', () => {
  it('rend l’invite ordinaire quand rien n’est retenu', () => {
    strictEqual(displayedPlaceholder(AVEC_SENTINELLE, '', true, 'Rechercher…'), 'Rechercher…');
  });

  it('garde la valeur retenue en filigrane pendant qu’on tape', () => {
    // Sans ça, ouvrir le champ efface sous les yeux ce qu'on venait remplacer.
    strictEqual(displayedPlaceholder(AVEC_SENTINELLE, 'SEMATIC', true, 'Rechercher…'), 'SEMATIC');
  });

  it('garde une valeur hors catalogue telle quelle', () => {
    strictEqual(displayedPlaceholder(AVEC_SENTINELLE, 'INCONNUE', true, 'Rechercher…'), 'INCONNUE');
  });

  it('rend l’invite ordinaire une fois le champ fermé', () => {
    // Fermé, c'est `contenuAffiche` qui montre la valeur : l'invite ne sert plus.
    strictEqual(displayedPlaceholder(AVEC_SENTINELLE, 'SEMATIC', false, 'Rechercher…'), 'Rechercher…');
  });
});
