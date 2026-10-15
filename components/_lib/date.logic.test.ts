import { strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { dateCourte } from './date.ts';

const MAINTENANT = new Date('2026-10-15T12:00:00Z');

describe('dateCourte', () => {
  it('écrit une date de l’année en cours sans l’année', () => {
    strictEqual(dateCourte('2026-10-15', { maintenant: MAINTENANT }), '15 oct.');
  });

  it('écrit l’année d’une autre année, et toujours quand on la demande', () => {
    strictEqual(dateCourte('2025-06-25', { maintenant: MAINTENANT }), '25 juin 2025');
    strictEqual(dateCourte('2026-10-15', { maintenant: MAINTENANT, avecAnnee: true }), '15 oct. 2026');
  });

  it('n’invente pas d’heure pour une date seule', () => {
    strictEqual(dateCourte('2026-10-15', { maintenant: MAINTENANT, heure: true }), '15 oct.');
  });

  it('écrit l’heure connue à l’heure de Paris, minuit compris', () => {
    strictEqual(dateCourte('2026-10-15T14:04:00Z', { maintenant: MAINTENANT, heure: true }), '15 oct., 16 h 04');
    strictEqual(dateCourte('2026-10-14T22:00:00Z', { maintenant: MAINTENANT, heure: true }), '15 oct., 0 h 00');
  });

  it('passe d’une année à l’autre au 31 décembre, à l’heure de Paris', () => {
    strictEqual(dateCourte('2026-12-31T23:30:00Z', { maintenant: MAINTENANT }), '1 janv. 2027');
    strictEqual(dateCourte('2026-12-31', { maintenant: MAINTENANT }), '31 déc.');
  });

  it('rend vide une valeur absente ou illisible', () => {
    strictEqual(dateCourte(null), '');
    strictEqual(dateCourte('pas une date'), '');
  });
});
