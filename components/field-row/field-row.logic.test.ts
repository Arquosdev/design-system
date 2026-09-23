import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isEmpty,
  choiceMenu,
  dateText,
  splitMultipleChoice,
  valueText,
  EMPTY,
} from './field-row.logic.ts';

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

describe('texteDeDate — l’ISO qu’on stocke, rendu lisible', () => {
  it('rend une date ISO en français', () => {
    strictEqual(dateText('2026-09-12'), '12/09/2026');
    strictEqual(dateText('1978-03-04'), '04/03/1978');
  });

  it('dit « Non renseigné » sur une date absente, comme les autres genres', () => {
    strictEqual(dateText(null), EMPTY);
    strictEqual(dateText(''), EMPTY);
    strictEqual(dateText(undefined), EMPTY);
  });

  /*
    Un champ peut porter une date approximative saisie à la main. La cacher
    parce qu'elle n'est pas de l'ISO serait pire que la montrer.
  */
  it('laisse passer ce qui n’est pas de l’ISO', () => {
    strictEqual(dateText('vers 1978'), 'vers 1978');
    strictEqual(dateText('12/09/2026'), '12/09/2026');
  });

  it('ne prétend pas lire une date ISO impossible', () => {
    strictEqual(dateText('2026-02-31'), '2026-02-31');
  });
});

describe('partagerLeChoixMultiple', () => {
  const ACCES = [
    { value: 'digicode', label: 'Digicode' },
    { value: 'badge', label: 'Badge' },
  ] as const;

  it('sépare les valeurs du catalogue de la valeur saisie', () => {
    const { known, free } = splitMultipleChoice(
      ['digicode', 'Clé plate n°4', 'badge'],
      ACCES,
    );
    deepStrictEqual(known, ['digicode', 'badge']);
    strictEqual(free, 'Clé plate n°4');
  });

  /* L'attente a changé le 22/09/2026, et c'est la correction elle-même : le
     libellé était reconnu, mais RENDU tel quel. L'appelant comparait ensuite à
     `o.value`, et sur un jeu où les deux diffèrent aucune pastille ne
     s'allumait. Reconnaître et traduire sont la même opération. */
  it('reconnaît une valeur donnée par son libellé, et rend celle du menu', () => {
    const { known, free } = splitMultipleChoice(['Digicode'], ACCES);
    deepStrictEqual(known, ['digicode']);
    strictEqual(free, '');
  });

  it('ne retient qu’une valeur libre — la colonne jumelle n’en porte qu’une', () => {
    const { free } = splitMultipleChoice(['Clé plate', 'Clé carrée'], ACCES);
    strictEqual(free, 'Clé plate');
  });

  it('ignore les valeurs blanches', () => {
    const { known, free } = splitMultipleChoice(['  ', 'badge'], ACCES);
    deepStrictEqual(known, ['badge']);
    strictEqual(free, '');
  });
});

describe('partagerLeChoixMultiple — le mot « Autre »', () => {
  const ACCES = [
    { value: 'digicode', label: 'Digicode' },
    { value: 'badge', label: 'Badge' },
  ] as const;

  it('ne prend pas le mot « Autre » pour la valeur saisie', () => {
    const { known, free, marked } = splitMultipleChoice(
      ['digicode', 'Autre'],
      ACCES,
    );
    deepStrictEqual(known, ['digicode']);
    strictEqual(free, '');
    strictEqual(marked, true);
  });

  it('rend le texte réel quand il est là, à côté du mot', () => {
    const { free, marked } = splitMultipleChoice(
      ['Autre', 'Clé plate n°4'],
      ACCES,
    );
    strictEqual(free, 'Clé plate n°4');
    strictEqual(marked, true);
  });

  it('dit non quand le mot n’y est pas', () => {
    strictEqual(splitMultipleChoice(['digicode'], ACCES).marked, false);
  });
});

describe('partagerLeChoixMultiple — libellé reçu, valeur rendue', () => {
  const CAMES = [
    { value: 'came_fixe', label: 'Came fixe' },
    { value: 'came_mobile', label: 'Came mobile' },
  ] as const;

  it('rend la valeur du menu quand on lui donne le libellé', () => {
    // Le cas réel : la fiche équipement affiche « Came fixe », le menu porte
    // `came_fixe`. Sans traduction, l'appelant compare à `o.value` et aucune
    // pastille ne s'allume.
    const r = splitMultipleChoice(['Came fixe', 'Came mobile'], CAMES);
    deepStrictEqual(r.known, ['came_fixe', 'came_mobile']);
    strictEqual(r.free, '');
  });

  it('rend la valeur inchangée quand on lui donne déjà la valeur', () => {
    const r = splitMultipleChoice(['came_mobile'], CAMES);
    deepStrictEqual(r.known, ['came_mobile']);
  });

  it('mélange les deux formes sans se tromper', () => {
    const r = splitMultipleChoice(['Came fixe', 'came_mobile'], CAMES);
    deepStrictEqual(r.known, ['came_fixe', 'came_mobile']);
  });

  it("laisse la valeur libre hors du menu, telle qu'elle est écrite", () => {
    const r = splitMultipleChoice(['Came fixe', 'une came bricolée'], CAMES);
    deepStrictEqual(r.known, ['came_fixe']);
    strictEqual(r.free, 'une came bricolée');
  });
});
