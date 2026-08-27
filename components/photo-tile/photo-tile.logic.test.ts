import { strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { estEnTravers } from './photo-tile.logic.ts';

// Le cadre des vignettes de la fiche : 3 pour 4.
const FRAME = 0.75;

describe('estEnTravers', () => {
  it('dit non tant que la photo est dans le sens du cadre', () => {
    strictEqual(estEnTravers(3, 4, FRAME), false, 'le cadre exact');
    // Le cas cité dans le commentaire : sur du 0,77 dans du 0,75 on rogne trois
    // pour cent, personne ne le voit.
    strictEqual(estEnTravers(770, 1000, FRAME), false);
  });

  it('dit oui sur une photo à l’horizontale', () => {
    strictEqual(estEnTravers(4, 3, FRAME), true);
    strictEqual(estEnTravers(1920, 1080, FRAME), true, 'une capture d’écran');
  });

  it('dit oui sur une photo plus étroite que le cadre', () => {
    strictEqual(estEnTravers(400, 1200, FRAME), true, 'un panoramique vertical');
  });

  /**
   * Avant le chargement, les dimensions valent zéro. Parier sur le cas
   * majoritaire évite que les trois quarts des vignettes changent d’avis après
   * coup — un écran qui se réorganise sous les yeux se lit comme un défaut.
   */
  it('parie sur le cas majoritaire quand les dimensions manquent', () => {
    strictEqual(estEnTravers(0, 0, FRAME), false);
    strictEqual(estEnTravers(800, 0, FRAME), false);
    strictEqual(estEnTravers(0, 600, FRAME), false);
  });

  it('suit le rapport qu’on lui donne — web et mobile n’ont pas la même densité', () => {
    // Dans un cadre CARRÉ, la tolérance se déplace avec lui.
    strictEqual(estEnTravers(1, 1, 1), false, 'une photo carrée y est chez elle');
    strictEqual(estEnTravers(16, 9, 1), true, 'une capture d’écran, non');

    // Et une 3:4 y reste acceptable : la recadrer coûte 25 % de sa hauteur,
    // ce qui se voit mais ne détruit pas l’image. Le seuil de 35 % est là pour
    // séparer un rognage d’un massacre, pas pour exiger un rapport exact —
    // ce test l’a d’abord affirmé à tort.
    strictEqual(estEnTravers(3, 4, 1), false);
  });
});
