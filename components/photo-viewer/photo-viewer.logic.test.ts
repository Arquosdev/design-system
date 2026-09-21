import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { boiteDessinee } from './photo-viewer.logic.ts';

describe('boiteDessinee', () => {
  it('centre une photo debout dans une boîte large', () => {
    // Le cas qui a fait sortir le bouton du cliché : 900 × 1600 dans 760 × 800.
    const b = boiteDessinee({ l: 0, t: 0, w: 760, h: 800 }, { w: 900, h: 1600 });
    assert.equal(Math.round(b.h), 800);
    assert.equal(Math.round(b.w), 450);
    assert.equal(Math.round(b.l), 155);
    assert.equal(Math.round(b.t), 0);
  });

  it('centre une photo couchée dans une boîte haute', () => {
    const b = boiteDessinee({ l: 0, t: 0, w: 800, h: 800 }, { w: 1600, h: 900 });
    assert.equal(Math.round(b.w), 800);
    assert.equal(Math.round(b.h), 450);
    assert.equal(Math.round(b.t), 175);
  });

  it('ne bouge rien quand la boîte a déjà le bon format', () => {
    const b = boiteDessinee({ l: 12, t: 34, w: 400, h: 300 }, { w: 800, h: 600 });
    assert.deepEqual(
      { l: b.l, t: b.t, w: b.w, h: b.h },
      { l: 12, t: 34, w: 400, h: 300 },
    );
  });

  it("rend la boîte de l'élément tant que l'image n'a pas chargé", () => {
    // Sans dimensions naturelles, aucun calcul n'a de sens — et surtout, rien
    // ne doit atterrir hors de l'écran.
    const element = { l: 5, t: 6, w: 100, h: 200 };
    assert.deepEqual(boiteDessinee(element, { w: 0, h: 0 }), element);
  });

  it('tient le décalage du parent', () => {
    const b = boiteDessinee({ l: 100, t: 50, w: 400, h: 400 }, { w: 200, h: 400 });
    assert.equal(Math.round(b.l), 200);
    assert.equal(Math.round(b.t), 50);
  });
});
