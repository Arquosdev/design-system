import { strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { STATUSES, statusEntry, statusKey, statusLabel } from './status-badge.logic.ts';

describe('statusKey', () => {
  it('ramène un code de la base, un mot de Bubble et la clé elle-même à la même clé', () => {
    strictEqual(statusKey('survey', 'relev_s_en_cours'), 'inProgress');
    strictEqual(statusKey('survey', 'En cours'), 'inProgress');
    strictEqual(statusKey('survey', 'inProgress'), 'inProgress');
  });

  it('reconnaît le « Non résolu » de myArquos comme un écart ouvert', () => {
    strictEqual(statusKey('discrepancy', 'Non résolu'), 'open');
  });

  it('ne devine pas un statut inconnu', () => {
    strictEqual(statusKey('quote', 'perdu'), undefined);
    strictEqual(statusKey('quote', null), undefined);
  });
});

describe('la table', () => {
  it('donne à « Assigné » la même couleur partout : le bleu de ce qui est prévu', () => {
    strictEqual(statusEntry('survey', 'assigned')?.tone, 'info');
  });

  it('ne met jamais un refus ou une clôture en rouge', () => {
    for (const [objet, table] of Object.entries(STATUSES)) {
      for (const [cle, e] of Object.entries(table)) {
        if (/refus|écart|résili|archiv/i.test(e.label)) strictEqual(e.tone, 'muted', `${objet}.${cle}`);
      }
    }
  });

  it('garde chaque mot à trois mots au plus', () => {
    for (const table of Object.values(STATUSES)) {
      for (const e of Object.values(table)) {
        strictEqual(e.label.split(/\s+/).length <= 3, true, e.label);
      }
    }
  });

  it('parle au client avec ses mots au portail', () => {
    strictEqual(statusLabel('quote', 'sent', 'client'), 'À valider');
    strictEqual(statusLabel('quote', 'sent'), 'Envoyé');
    strictEqual(statusLabel('quote', 'draft', 'client'), 'Brouillon');
    strictEqual(statusEntry('quote', 'sent')?.clientTone, 'warning');
  });
});
