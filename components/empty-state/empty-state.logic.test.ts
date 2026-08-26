import { strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ECHECS, natureDeLEchec } from './empty-state.logic.ts';

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
      strictEqual(natureDeLEchec(new Error(message)), 'hors-ligne', `échoue sur « ${message} »`);
    }
  });

  it('range tout le reste dans « inconnu »', () => {
    strictEqual(natureDeLEchec(new Error('500 Internal Server Error')), 'inconnu');
    strictEqual(natureDeLEchec(new Error('Jeton expiré')), 'inconnu');
  });

  /**
   * Volontairement grossier : on ne classe pas les erreurs, on répond à
   * « réessayer maintenant a-t-il une chance de marcher ? ». Un faux positif
   * enverrait attendre un réseau qui n’est pas en cause.
   */
  it('ne se laisse pas prendre par une valeur qui n’est pas une erreur', () => {
    strictEqual(natureDeLEchec(null), 'inconnu');
    strictEqual(natureDeLEchec(undefined), 'inconnu');
    strictEqual(natureDeLEchec({ code: 500 }), 'inconnu');
  });

  it('accepte une erreur passée sous forme de texte', () => {
    strictEqual(natureDeLEchec('Failed to fetch'), 'hors-ligne');
  });
});

describe('ECHECS', () => {
  it('donne à chaque cas une icône, un titre et un conseil', () => {
    for (const [nature, f] of Object.entries(ECHECS)) {
      strictEqual(typeof f.icone, 'string', nature);
      strictEqual(f.titre.length > 0, true, nature);
      strictEqual(f.conseil.length > 0, true, nature);
    }
  });

  it('ne dit pas la même chose dans les deux cas — sinon la distinction ne sert à rien', () => {
    strictEqual(ECHECS['hors-ligne'].titre === ECHECS.inconnu.titre, false);
    strictEqual(ECHECS['hors-ligne'].icone === ECHECS.inconnu.icone, false);
  });
});
