import { strictEqual, deepStrictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  comparer,
  libellePagination,
  libelleSelection,
  triSuivant,
} from './record-table.logic.ts';

describe('triSuivant', () => {
  it('démarre en croissant sur une colonne neuve', () => {
    deepStrictEqual(triSuivant(null, 'annee'), { cle: 'annee', sens: 'croissant' });
  });

  it('bascule en décroissant au deuxième clic', () => {
    deepStrictEqual(triSuivant({ cle: 'annee', sens: 'croissant' }, 'annee'), {
      cle: 'annee',
      sens: 'decroissant',
    });
  });

  it('retire le tri au troisième clic — l’ordre d’origine porte un sens', () => {
    strictEqual(triSuivant({ cle: 'annee', sens: 'decroissant' }, 'annee'), null);
  });

  it('repart de zéro quand on change de colonne', () => {
    deepStrictEqual(triSuivant({ cle: 'annee', sens: 'decroissant' }, 'taux'), {
      cle: 'taux',
      sens: 'croissant',
    });
  });
});

describe('comparer', () => {
  it('range les nombres', () => {
    strictEqual(comparer(1978, 2014, 'croissant') < 0, true);
    strictEqual(comparer(1978, 2014, 'decroissant') > 0, true);
  });

  it('range le texte selon le français, chiffres compris', () => {
    strictEqual(comparer('Équipement 2', 'Équipement 10', 'croissant') < 0, true);
  });

  it('renvoie les valeurs absentes en fin de liste, dans les deux sens', () => {
    strictEqual(comparer(null, 1978, 'croissant') > 0, true);
    strictEqual(comparer(null, 1978, 'decroissant') > 0, true);
    strictEqual(comparer('', 'Ascenseur', 'decroissant') > 0, true);
  });
});

describe('libelleSelection', () => {
  it('accorde le singulier', () => {
    strictEqual(libelleSelection(1, 'équipement'), '1 équipement sélectionné');
  });

  it('accorde le pluriel', () => {
    strictEqual(libelleSelection(5, 'équipement'), '5 équipements sélectionnés');
  });

  it('accepte un pluriel irrégulier', () => {
    strictEqual(libelleSelection(3, 'travail', 'travaux'), '3 travaux sélectionnés');
  });

  it('dit « sélectionné », jamais « retenu »', () => {
    strictEqual(libelleSelection(2, 'écart').includes('retenu'), false);
  });
});

describe('libellePagination', () => {
  it('situe la page dans le total', () => {
    strictEqual(libellePagination(1, 25, 184), '1 à 25 sur 184');
  });

  it('dit le vide plutôt que « 0 à 0 sur 0 »', () => {
    strictEqual(libellePagination(0, 0, 0), 'Aucun élément');
  });
});
