import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { estVide, menuDeChoix, texteDeValeur, VIDE } from './field-row.logic.ts';

const ETATS = [
  { value: 'bon', label: 'Bon' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'mauvais', label: 'Mauvais' },
] as const;

describe('menuDeChoix', () => {
  it('propose « — choisir — » quand rien n’est retenu, et ne retient rien', () => {
    const { choix, retenue } = menuDeChoix('', ETATS);
    strictEqual(choix[0].label, '— choisir —');
    strictEqual(retenue, '');
  });

  it('retient la valeur en base quand elle correspond à une option', () => {
    const { choix, retenue } = menuDeChoix('moyen', ETATS);
    strictEqual(retenue, 'moyen');
    strictEqual(choix.length, ETATS.length, 'aucune entrée ne s’ajoute');
  });

  /**
   * Le cas qui a motivé la fonction : la ligne affiche un LIBELLÉ, le menu
   * manipule des VALEURS. Poser « Moyen » comme valeur du sélecteur ne
   * correspond à aucune option — le navigateur coche alors la première, et le
   * menu s’ouvre en annonçant « Bon » sur un composant qui est « Moyen ».
   */
  it('retrouve la valeur quand on lui donne le libellé', () => {
    strictEqual(menuDeChoix('Moyen', ETATS).retenue, 'moyen');
  });

  /**
   * Une marque saisie à la main, un jeton qu’un relevé a laissé : la retirer
   * reviendrait à la remplacer en silence dès l’ouverture du menu.
   */
  it('garde en tête une valeur absente du catalogue', () => {
    const { choix, retenue } = menuDeChoix('SCHINDLR', ETATS);
    strictEqual(retenue, 'SCHINDLR');
    deepStrictEqual(choix[0], { value: 'SCHINDLR', label: 'SCHINDLR' });
    strictEqual(choix.length, ETATS.length + 1);
  });

  it('traite une valeur multiple comme vide — ce menu est à choix unique', () => {
    strictEqual(menuDeChoix(['bon', 'moyen'], ETATS).retenue, '');
  });

  it('traite null comme vide', () => {
    strictEqual(menuDeChoix(null, ETATS).choix[0].label, '— choisir —');
  });
});

describe('texteDeValeur', () => {
  it('dit « Non renseigné » plutôt qu’un tiret, pour tout ce qui est vide', () => {
    for (const vide of [null, undefined, '', '   ', [] as string[]]) {
      strictEqual(texteDeValeur(vide), VIDE, `échoue sur ${JSON.stringify(vide)}`);
    }
  });

  it('rend la valeur telle quelle quand il y en a une', () => {
    strictEqual(texteDeValeur('630'), '630');
  });

  it('joint les valeurs multiples par des virgules', () => {
    strictEqual(texteDeValeur(['Cuvette', 'Gaine']), 'Cuvette, Gaine');
  });

  it('ne confond pas « 0 » avec du vide — c’est une mesure', () => {
    strictEqual(texteDeValeur('0'), '0');
  });
});

describe('estVide', () => {
  it('suit texteDeValeur, y compris sur les espaces seuls', () => {
    strictEqual(estVide('  '), true);
    strictEqual(estVide('0'), false);
    strictEqual(estVide([]), true);
    strictEqual(estVide(['Cuvette']), false);
  });
});
