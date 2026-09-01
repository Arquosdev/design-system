import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isEmpty, choiceMenu, valueText, EMPTY } from './field-row.logic.ts';

const STATES = [
  { value: 'bon', label: 'Bon' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'mauvais', label: 'Mauvais' },
] as const;

describe('menuDeChoix', () => {
  it('propose « — choisir — » quand rien n’est retenu, et ne retient rien', () => {
    const { choices, chosen } = choiceMenu('', STATES);
    strictEqual(choices[0].label, '— choisir —');
    strictEqual(chosen, '');
  });

  it('retient la valeur en base quand elle correspond à une option', () => {
    const { choices, chosen } = choiceMenu('moyen', STATES);
    strictEqual(chosen, 'moyen');
    strictEqual(choices.length, STATES.length, 'aucune entrée ne s’ajoute');
  });

  /**
   * Le cas qui a motivé la fonction : la ligne affiche un LIBELLÉ, le menu
   * manipule des VALEURS. Poser « Moyen » comme valeur du sélecteur ne
   * correspond à aucune option — le navigateur coche alors la première, et le
   * menu s’ouvre en annonçant « Bon » sur un composant qui est « Moyen ».
   */
  it('retrouve la valeur quand on lui donne le libellé', () => {
    strictEqual(choiceMenu('Moyen', STATES).chosen, 'moyen');
  });

  /**
   * Une marque saisie à la main, un jeton qu’un relevé a laissé : la retirer
   * reviendrait à la remplacer en silence dès l’ouverture du menu.
   */
  it('garde en tête une valeur absente du catalogue', () => {
    const { choices, chosen } = choiceMenu('SCHINDLR', STATES);
    strictEqual(chosen, 'SCHINDLR');
    deepStrictEqual(choices[0], { value: 'SCHINDLR', label: 'SCHINDLR' });
    strictEqual(choices.length, STATES.length + 1);
  });

  it('traite une valeur multiple comme vide — ce menu est à choix unique', () => {
    strictEqual(choiceMenu(['bon', 'moyen'], STATES).chosen, '');
  });

  it('traite null comme vide', () => {
    strictEqual(choiceMenu(null, STATES).choices[0].label, '— choisir —');
  });
});

describe('texteDeValeur', () => {
  it('dit « Non renseigné » plutôt qu’un tiret, pour tout ce qui est vide', () => {
    for (const empty of [null, undefined, '', '   ', [] as string[]]) {
      strictEqual(valueText(empty), EMPTY, `échoue sur ${JSON.stringify(empty)}`);
    }
  });

  it('rend la valeur telle quelle quand il y en a une', () => {
    strictEqual(valueText('630'), '630');
  });

  it('joint les valeurs multiples par des virgules', () => {
    strictEqual(valueText(['Cuvette', 'Gaine']), 'Cuvette, Gaine');
  });

  it('ne confond pas « 0 » avec du vide — c’est une mesure', () => {
    strictEqual(valueText('0'), '0');
  });
});

describe('estVide', () => {
  it('suit texteDeValeur, y compris sur les espaces seuls', () => {
    strictEqual(isEmpty('  '), true);
    strictEqual(isEmpty('0'), false);
    strictEqual(isEmpty([]), true);
    strictEqual(isEmpty(['Cuvette']), false);
  });
});
