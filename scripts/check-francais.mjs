// Refuse un libellé anglais dans ce qu'un utilisateur lit.
//
//   node scripts/check-francais.mjs
//
// La règle du projet est « anglais pour ce qu'une machine lit, français pour ce
// qui se lit comme de la prose ». Un renommage automatique l'a enfreinte sans
// que rien ne s'en aperçoive : « Enregistrer » est devenu « Save » et
// « Annuler » « Cancel » dans l'éditeur de `FieldRow`, « Aucune mesure
// relevée. » est devenu « NoneB measure relevée. » dans `DataTable`. Vingt-deux
// occurrences, dont quatre dans du code livré, trouvées le 30/08/2026 —
// six mois après.
//
// **Aucun test ne pouvait les voir** : un libellé ne casse rien, il se lit. Le
// contrôle porte donc sur ce que le rendu affiche, et sur lui seul — le texte
// d'un noeud JSX, jamais un nom de prop ni une valeur d'attribut, qui eux
// s'écrivent en anglais à bon droit.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/*
  La liste est FERMÉE, et c'est ce qui la rend utilisable. Un contrôle qui
  tenterait de reconnaître « de l'anglais » se tromperait sur « Machine »,
  « Type », « Attributs » ou « Options », qui s'écrivent pareil dans les deux
  langues. Ces mots-ci n'ont pas d'homographe français.
*/
const INTERDITS = [
  'Save', 'Cancel', 'Delete', 'Close', 'Search', 'None', 'NoneB', 'Add', 'Edit',
  'Remove', 'Submit', 'Confirm', 'Apply', 'Reset', 'Back', 'Next', 'Previous',
  'Loading', 'Retry', 'Yes', 'empties', 'measure', 'measures',
];
const MOTIF = new RegExp(`\\b(${INTERDITS.join('|')})\\b`);

/** Le texte que le rendu affiche : ce qui vit entre deux balises. */
function textesRendus(source) {
  const textes = [];
  for (const t of source.matchAll(/>([^<>{}]+)</g)) {
    const brut = t[1].trim();
    if (brut) textes.push(brut);
  }
  return textes;
}

/** Les blocs de code d'une fiche de composant, qui montrent l'usage réel. */
function exemples(markdown) {
  return [...markdown.matchAll(/```(?:tsx|jsx)\n([\s\S]*?)```/g)].map((m) => m[1]).join('\n');
}

const fautifs = [];

function parcourir(dossier) {
  for (const nom of readdirSync(dossier)) {
    if (nom === 'node_modules' || nom.startsWith('.')) continue;
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) { parcourir(chemin); continue; }

    let source;
    if (/\.(web\.tsx|stories\.tsx)$/.test(nom)) source = readFileSync(chemin, 'utf8');
    else if (/\.spec\.md$/.test(nom)) source = exemples(readFileSync(chemin, 'utf8'));
    else continue;

    for (const texte of textesRendus(source)) {
      const trouve = texte.match(MOTIF);
      if (trouve) fautifs.push(`${relative(ROOT, chemin)} : « ${texte.slice(0, 60)} »`);
    }
  }
}

for (const racine of ['components', 'stories', 'src']) {
  parcourir(join(ROOT, racine));
}

if (fautifs.length) {
  console.log('✗ libellés anglais dans ce qui s’affiche :');
  for (const f of fautifs) console.log(`  ${f}`);
  process.exitCode = 1;
} else {
  console.log('✓ français : aucun libellé anglais dans ce qui s’affiche');
}
