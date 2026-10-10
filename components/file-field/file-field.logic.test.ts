import { ok, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { aide, correspond, refus, tailleLisible, trier } from './file-field.logic.ts';

const Mo = 1024 * 1024;
const f = (name: string, type: string, size = 1000) => ({ name, type, size });

describe('FileField : le calcul', () => {
  it('dit un poids comme on le dit', () => {
    strictEqual(tailleLisible(20 * Mo), '20 Mo');
    strictEqual(tailleLisible(1.5 * Mo), '1,5 Mo');
    strictEqual(tailleLisible(300 * 1024), '300 Ko');
    strictEqual(tailleLisible(512), '512 o');
  });

  it('lit accept comme le navigateur : extension, type exact, famille', () => {
    ok(correspond(f('Devis.PDF', 'application/pdf'), 'application/pdf,.pdf'));
    ok(correspond(f('photo.jpg', 'image/jpeg'), 'image/*'));
    ok(!correspond(f('plan.dwg', 'application/acad'), 'application/pdf,image/*'));
    ok(correspond(f('x.bin', 'application/octet-stream'), undefined));
  });

  it('ne refuse pas un HEIC dont le navigateur ignore le type, si son extension est permise', () => {
    ok(correspond(f('IMG_0001.HEIC', ''), 'image/jpeg,.heic'));
    ok(!correspond(f('IMG_0001.HEIC', ''), 'image/*'));
  });

  it('dit pourquoi un fichier est refusé', () => {
    strictEqual(refus(f('plan.dwg', 'x/y'), { accept: '.pdf', acceptLabel: 'PDF' }), '« plan.dwg » n’est pas accepté. Formats acceptés : PDF.');
    strictEqual(refus(f('gros.pdf', 'application/pdf', 32 * Mo), { accept: '.pdf', maxSize: 20 * Mo }), '« gros.pdf » pèse 32 Mo, au-delà des 20 Mo permis.');
    strictEqual(refus(f('vide.pdf', 'application/pdf', 0), { accept: '.pdf' }), '« vide.pdf » est vide.');
    strictEqual(refus(f('ok.pdf', 'application/pdf', Mo), { accept: '.pdf', maxSize: 20 * Mo }), null);
  });

  it('refuse un choix en entier dès qu’un fichier ne passe pas', () => {
    const r = trier([f('a.jpg', 'image/jpeg'), f('b.dwg', 'x/y')], { accept: 'image/*', acceptLabel: 'JPEG ou PNG' });
    strictEqual(r.retenus.length, 0);
    ok(r.raison?.includes('b.dwg'));
    strictEqual(trier([f('a.jpg', 'image/jpeg')], { accept: 'image/*' }).retenus.length, 1);
  });

  it('borne le nombre de fichiers d’un choix', () => {
    strictEqual(trier([f('a.jpg', 'image/jpeg'), f('b.jpg', 'image/jpeg')], { max: 1 }).raison, '1 fichier au plus.');
    strictEqual(trier([f('a.jpg', 'image/jpeg')], { max: 0 }).raison, 'Aucun fichier de plus ne peut être joint.');
  });

  it('compose la ligne d’aide', () => {
    strictEqual(aide({ acceptLabel: 'PDF', maxSize: 20 * Mo }), 'PDF · 20 Mo au plus');
    strictEqual(aide({}), '');
  });
});
