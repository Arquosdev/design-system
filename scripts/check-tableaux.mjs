// UNE RUBRIQUE DE FICHE PREND `SectionTable` (Thomas, 09/11/2026 : « on utilise
// toujours ce tableau »). Le modèle est la rubrique Contrats d'une fiche client :
// le titre et son compte, le tableau d'un bord à l'autre, un filet au-dessus, la
// densité des listes et une icône par en-tête. `SectionTable` les porte d'un coup ;
// un `RecordTable` posé à la main dans une fiche les règle au cas par cas, et
// finit par différer (États était compact, sans icônes ni compte, à côté de
// Contrats).
//
// Ce contrôle lit les fichiers d'une FICHE — un chemin qui passe par `[id]`, ou
// un composant de `record/` — et refuse :
//  - `<RecordTable` : prendre `SectionTable` ;
//  - `density="compact"` : une rubrique se lit, elle ne se balaie pas.
// Un tableau de fiche qui n'est pas une rubrique (le tableau d'un panneau, un
// journal) le déclare par un commentaire « tableau: hors rubrique » sur sa ligne
// ou celle d'avant, avec sa raison.
//
// Usage : node scripts/check-tableaux.mjs <dossier>... (défaut : components)

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

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

/* Une fiche : un segment `[id]` (ou `[cle]`…) dans le chemin, ou le dossier `record`. */
const deFiche = (f) => f.split(sep).some((s) => /^\[[^\]]+\]$/.test(s) || s === 'record');

const fautes = [];
let lus = 0;
for (const f of fichiers.filter(deFiche)) {
  lus += 1;
  const lignes = readFileSync(f, 'utf8').split('\n');
  lignes.forEach((l, i) => {
    if (/tableau: hors rubrique/.test(l) || /tableau: hors rubrique/.test(lignes[i - 1] ?? '')) return;
    if (/^\s*(\/\/|\*|\/\*)/.test(l)) return;
    const raison = /<RecordTable\b/.test(l) ? 'RecordTable dans une fiche : prendre SectionTable'
      : /density=["']compact["']/.test(l) ? 'density="compact" dans une fiche'
        : null;
    if (raison) fautes.push(`${relative(process.cwd(), f)}:${i + 1} · ${raison}`);
  });
}

if (fautes.length) {
  console.error(`Tableau de fiche hors du modèle (prendre SectionTable, ou dire « tableau: hors rubrique ») :\n  ${fautes.join('\n  ')}`);
  process.exit(1);
}
console.log(`Tableaux : ${lus} fichiers de fiche lus, chaque rubrique prend SectionTable.`);
