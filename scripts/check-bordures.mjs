// UN CONTENANT A LA BORDURE DOUCE (Louis, 06 et 12/10/2026 : les cadres gris
// foncé « trop violents », « pas beaux »). Carte, bloc, encart, séparateur :
// `border-border-soft`. La bordure marquée `border-border` dit « ici on
// clique » : elle est réservée aux contrôles (champ, bouton, case, menu).
//
// Ce contrôle lit chaque chaîne de classes et refuse :
//  - `rounded-block` avec `border-border` (un bloc est un contenant) ;
//  - `divide-border` (un séparateur de lignes est un contenant) ;
//  - `border-[tblrxy]` avec `border-border` sans `rounded-control` (un trait
//    de séparation, pas le bord d'un contrôle).
// Un contrôle qui prend la forme d'un bloc (zone de dépôt, champ de saisie de
// l'assistant) le déclare par un commentaire « bordure: contrôle » sur sa ligne
// ou celle d'avant.
//
// Usage : node scripts/check-bordures.mjs <dossier>... (défaut : components)

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dossiers = process.argv.slice(2).length ? process.argv.slice(2) : ['components'];
const fichiers = [];
const parcourir = (d) => {
  for (const n of readdirSync(d)) {
    if (n === 'node_modules' || n.startsWith('.')) continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) parcourir(p);
    else if (/\.tsx$/.test(n) && !/\.native\.tsx$/.test(n)) fichiers.push(p);
  }
};
for (const d of dossiers) parcourir(d);

// `border-border` exactement : ni -soft, ni -strong.
const MARQUEE = /(^|[\s'"`:])border-border(?![-\w])/;
const fautes = [];
for (const f of fichiers) {
  const lignes = readFileSync(f, 'utf8').split('\n');
  lignes.forEach((l, i) => {
    if (/bordure: contrôle/.test(l) || /bordure: contrôle/.test(lignes[i - 1] ?? '')) return;
    for (const m of l.matchAll(/(['"`])([^'"`]*)\1/g)) {
      const c = m[2];
      const raison =
        /(^|\s)divide-border(?![-\w])/.test(c) ? 'divide-border sur un séparateur'
          : /(^|\s)rounded-block(\s|$)/.test(c) && MARQUEE.test(c) ? 'rounded-block avec border-border'
            : /(^|\s)border-[tblrxy](-\d)?(\s|$)/.test(c) && MARQUEE.test(c) && !/rounded-control/.test(c) ? 'trait de séparation en border-border'
              : null;
      if (raison) fautes.push(`${relative(process.cwd(), f)}:${i + 1} · ${raison}`);
    }
  });
}

if (fautes.length) {
  console.error(`Bordure marquée sur un contenant (prendre border-border-soft) :\n  ${fautes.join('\n  ')}`);
  process.exit(1);
}
console.log(`Bordures : ${fichiers.length} fichiers lus, aucun contenant en bordure marquée.`);
