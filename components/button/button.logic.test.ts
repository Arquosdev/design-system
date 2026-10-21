import { deepStrictEqual, ok, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { availability, availabilityAttributes, blocksActivation, debordTactile } from './button.logic.ts';

describe('availability', () => {
  it('est active quand aucun drapeau n’est posé', () => {
    strictEqual(availability({}), 'active');
  });

  it('distingue inactive de disabled', () => {
    strictEqual(availability({ inactive: true }), 'inactive');
    strictEqual(availability({ disabled: true }), 'disabled');
  });

  /**
   * `disabled` gagne, et c'est le seul arbitrage possible : l'attribut natif
   * retire le bouton de l'ordre de tabulation, donc sa raison ne serait de
   * toute façon jamais lue.
   */
  it('donne disabled quand les deux sont posés', () => {
    strictEqual(availability({ inactive: true, disabled: true }), 'disabled');
  });
});

describe('availabilityAttributes', () => {
  it('ne pose rien sur un bouton actif', () => {
    deepStrictEqual(availabilityAttributes('active'), {});
  });

  /**
   * **Le cœur de l'état inactif.** `aria-disabled` et PAS `disabled` : c'est ce
   * qui garde le bouton focalisable et survolable, donc capable de dire pourquoi
   * il ne fait rien. Poser `disabled` ici rendrait la raison inatteignable — le
   * défaut d'origine.
   */
  it('rend un bouton inactif atteignable : aria-disabled, jamais disabled', () => {
    const attrs = availabilityAttributes('inactive');
    strictEqual(attrs['aria-disabled'], true);
    ok(!('disabled' in attrs), 'un bouton inactif ne porte pas l’attribut natif');
  });

  it('porte la raison en infobulle quand on la donne', () => {
    strictEqual(
      availabilityAttributes('inactive', 'Choisissez une agence')?.title,
      'Choisissez une agence',
    );
  });

  /**
   * Sans raison, pas de `title` VIDE : un attribut présent et vide se lit
   * comme une infobulle blanche au survol.
   */
  it('n’invente pas d’infobulle vide', () => {
    ok(!('title' in availabilityAttributes('inactive')));
  });

  it('pose l’attribut natif pour disabled, et pas aria-disabled', () => {
    const attrs = availabilityAttributes('disabled');
    strictEqual(attrs.disabled, true);
    ok(!('aria-disabled' in attrs), 'doubler l’attribut natif n’ajoute rien');
  });
});

describe('blocksActivation', () => {
  it('avale le geste dès que le bouton n’est pas actif', () => {
    strictEqual(blocksActivation('active'), false);
    strictEqual(blocksActivation('inactive'), true);
    strictEqual(blocksActivation('disabled'), true);
  });
});

describe('debordTactile', () => {
  // Sur le téléphone, rien ne se touche sur moins de 44 points : le petit
  // bouton (36) déborde de 4 de chaque côté, le normal (44) de rien.
  it('porte un petit bouton à 44 points, et laisse le normal tel quel', () => {
    strictEqual(debordTactile(36), 4);
    strictEqual(debordTactile(44), 0);
    strictEqual(debordTactile(30), 7);
    strictEqual(debordTactile(56), 0);
  });
});
