import { deepStrictEqual, ok, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { analyser, domaineDe, enLigne, hrefSur, lienSansSortie, texteBrut } from './markdown.logic.ts';

describe('Markdown : en ligne', () => {
  it('lit le gras, l’italique, le code et les liens', () => {
    deepStrictEqual(enLigne('un **mot** et *un autre*'), [
      { type: 'texte', texte: 'un ' },
      { type: 'gras', enfants: [{ type: 'texte', texte: 'mot' }] },
      { type: 'texte', texte: ' et ' },
      { type: 'italique', enfants: [{ type: 'texte', texte: 'un autre' }] },
    ]);
    deepStrictEqual(enLigne('le code `ma2zs_a`'), [{ type: 'texte', texte: 'le code ' }, { type: 'code', texte: 'ma2zs_a' }]);
    deepStrictEqual(enLigne('[l’équipement](/equipment/12)'), [{ type: 'lien', href: '/equipment/12', enfants: [{ type: 'texte', texte: 'l’équipement' }] }]);
  });

  it('laisse un astérisque isolé et un nom à tirets bas tels quels', () => {
    deepStrictEqual(enLigne('3 * 4 = 12'), [{ type: 'texte', texte: '3 * 4 = 12' }]);
    deepStrictEqual(enLigne('le champ type_galets'), [{ type: 'texte', texte: 'le champ type_galets' }]);
  });

  it('fait d’une adresse nue un lien, sans sa ponctuation', () => {
    const m = enLigne('voir https://arquos.eu/aide.');
    deepStrictEqual(m[1], { type: 'lien', href: 'https://arquos.eu/aide', enfants: [{ type: 'texte', texte: 'https://arquos.eu/aide' }] });
  });

  it('refuse un lien qui exécuterait quelque chose', () => {
    ok(!hrefSur('javascript:alert(1)'));
    ok(!hrefSur('//ailleurs.com'));
    ok(hrefSur('/clients/3'));
    deepStrictEqual(enLigne('[clic](javascript:alert(1))')[0].type, 'texte');
  });
});

describe('Markdown : blocs', () => {
  it('lit titres, listes et paragraphes d’une réponse type', () => {
    const b = analyser('## Appels ouverts\n\nTrois appels :\n\n1. **Panne** au 12 rue X\n2. Bruit\n   - en montée\n3. Porte\n\nÀ affecter.');
    deepStrictEqual(b.map((x) => x.type), ['titre', 'paragraphe', 'liste', 'paragraphe']);
    const liste = b[2] as Extract<(typeof b)[number], { type: 'liste' }>;
    strictEqual(liste.ordonnee, true);
    strictEqual(liste.elements.length, 3);
    ok(liste.elements[1].sousListe, 'la sous-liste se rattache à son élément');
  });

  it('lit un tableau, ses alignements, et une cellule échappée', () => {
    const b = analyser('| Équipement | Appels |\n|:--|--:|\n| 53 A 1 | 2 |\n| a \\| b | 4 |');
    strictEqual(b.length, 1);
    const t = b[0] as Extract<(typeof b)[number], { type: 'tableau' }>;
    deepStrictEqual(t.alignements, ['gauche', 'droite']);
    strictEqual(t.lignes.length, 2);
    strictEqual((t.lignes[1][0][0] as { texte: string }).texte, 'a | b');
  });

  it('garde un bloc de code, une citation et un filet', () => {
    deepStrictEqual(analyser('```\nligne 1\nligne 2\n```')[0], { type: 'code', langage: null, texte: 'ligne 1\nligne 2' });
    strictEqual(analyser('> attention')[0].type, 'citation');
    strictEqual(analyser('avant\n\n---\n\naprès')[1].type, 'filet');
  });

  it('n’efface jamais un texte qu’il ne reconnaît pas', () => {
    const src = 'Une ligne @@bizarre## et ~~barré~~';
    strictEqual(texteBrut(src), src);
  });

  it('rend un texte nu pour copier', () => {
    strictEqual(texteBrut('**Bonjour** [ici](/a)\n\n- un\n- deux'), 'Bonjour ici\n\n• un\n• deux');
  });
});

describe('Markdown : les liens qui sortent de l’application', () => {
  it('reconnaît ce qui ne sort pas : chemin, ancre, courriel et téléphone sans paramètre', () => {
    ok(lienSansSortie('/equipment/12'));
    ok(lienSansSortie('#haut'));
    ok(lienSansSortie('mailto:contact@exemple.fr'));
    ok(lienSansSortie('tel:+33612345678'));
    ok(!lienSansSortie('https://evil.example/f?d=clients'));
    ok(!lienSansSortie('//evil.example'));
    ok(!lienSansSortie('mailto:x@evil.example?body=donnees'));
  });
  it('dit le domaine d’une adresse', () => {
    strictEqual(domaineDe('https://evil.example/f?d=1'), 'evil.example');
  });
});
