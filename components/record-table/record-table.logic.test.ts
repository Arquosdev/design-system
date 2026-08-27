import { strictEqual, deepStrictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  compare,
  paginationLabel,
  selectionLabel,
  nextSort,
} from './record-table.logic.ts';

describe('triSuivant', () => {
  it('démarre en croissant sur une colonne neuve', () => {
    deepStrictEqual(nextSort(null, 'annee'), { column: 'annee', direction: 'asc' });
  });

  it('bascule en décroissant au deuxième clic', () => {
    deepStrictEqual(nextSort({ column: 'annee', direction: 'asc' }, 'annee'), {
      column: 'annee',
      direction: 'desc',
    });
  });

  it('retire le tri au troisième clic — l’ordre d’origine porte un sens', () => {
    strictEqual(nextSort({ column: 'annee', direction: 'desc' }, 'annee'), null);
  });

  it('repart de zéro quand on change de colonne', () => {
    deepStrictEqual(nextSort({ column: 'annee', direction: 'desc' }, 'taux'), {
      column: 'taux',
      direction: 'asc',
    });
  });
});

describe('comparer', () => {
  it('range les nombres', () => {
    strictEqual(compare(1978, 2014, 'asc') < 0, true);
    strictEqual(compare(1978, 2014, 'desc') > 0, true);
  });

  it('range le texte selon le français, chiffres compris', () => {
    strictEqual(compare('Équipement 2', 'Équipement 10', 'asc') < 0, true);
  });

  it('renvoie les valeurs absentes en fin de liste, dans les deux sens', () => {
    strictEqual(compare(null, 1978, 'asc') > 0, true);
    strictEqual(compare(null, 1978, 'desc') > 0, true);
    strictEqual(compare('', 'Ascenseur', 'desc') > 0, true);
  });
});

describe('libelleSelection', () => {
  it('accorde le singulier', () => {
    strictEqual(selectionLabel(1, 'équipement'), '1 équipement sélectionné');
  });

  it('accorde le pluriel', () => {
    strictEqual(selectionLabel(5, 'équipement'), '5 équipements sélectionnés');
  });

  it('accepte un pluriel irrégulier', () => {
    strictEqual(selectionLabel(3, 'travail', 'travaux'), '3 travaux sélectionnés');
  });

  it('dit « sélectionné », jamais « retenu »', () => {
    strictEqual(selectionLabel(2, 'écart').includes('retenu'), false);
  });
});

describe('libellePagination', () => {
  it('situe la page dans le total', () => {
    strictEqual(paginationLabel(1, 25, 184), '1 à 25 sur 184');
  });

  it('dit le vide plutôt que « 0 à 0 sur 0 »', () => {
    strictEqual(paginationLabel(0, 0, 0), 'Aucun élément');
  });
});
