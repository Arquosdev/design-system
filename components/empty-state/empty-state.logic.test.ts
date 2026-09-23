import { strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { FAILURES, failureKind } from './empty-state.logic.ts';

describe('natureDeLEchec', () => {
  /**
   * Ce que la distinction achète : hors ligne, réessayer tout de suite ne sert
   * à rien. Un message générique enverrait le technicien appuyer en boucle dans
   * une gaine sans réseau.
   */
  it('reconnaît une coupure réseau sous ses formulations courantes', () => {
    for (const message of [
      'Failed to fetch',
      'NetworkError when attempting to fetch resource',
      'net::ERR_INTERNET_DISCONNECTED',
      'The device is offline',
      'network request failed',
    ]) {
      strictEqual(failureKind(new Error(message)), 'offline', `échoue sur « ${message} »`);
    }
  });

  it('range tout le reste dans « inconnu »', () => {
    strictEqual(failureKind(new Error('500 Internal Server Error')), 'unknown');
    strictEqual(failureKind(new Error('Jeton expiré')), 'unknown');
  });

  /**
   * Volontairement grossier : on ne classe pas les erreurs, on répond à
   * « réessayer maintenant a-t-il une chance de marcher ? ». Un faux positif
   * enverrait attendre un réseau qui n’est pas en cause.
   */
  it('ne se laisse pas prendre par une valeur qui n’est pas une erreur', () => {
    strictEqual(failureKind(null), 'unknown');
    strictEqual(failureKind(undefined), 'unknown');
    strictEqual(failureKind({ code: 500 }), 'unknown');
  });

  it('accepte une erreur passée sous forme de texte', () => {
    strictEqual(failureKind('Failed to fetch'), 'offline');
  });
});

describe('ECHECS', () => {
  it('donne à chaque cas une icône, un titre et un conseil', () => {
    for (const [nature, f] of Object.entries(FAILURES)) {
      strictEqual(typeof f.icon, 'string', nature);
      strictEqual(f.title.length > 0, true, nature);
      strictEqual(f.hint.length > 0, true, nature);
    }
  });

  it('ne dit pas la même chose dans les deux cas — sinon la distinction ne sert à rien', () => {
    strictEqual(FAILURES['offline'].title === FAILURES.unknown.title, false);
    strictEqual(FAILURES['offline'].icon === FAILURES.unknown.icon, false);
  });
});
