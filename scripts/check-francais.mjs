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
/*
  `None[A-Z]?` et non `None` seul : la seule entrée de cette liste qui soit un
  motif plutôt qu'un mot, et elle l'est pour une raison mesurée.

  Le renommage automatique n'a pas écrit « None », il a NUMÉROTÉ ses
  occurrences — « NoneB measure relevée. » dans `DataTable`, chassée par la
  v2.10.4, et « NoneA choices ne correspond. » dans `Combobox`, restée jusqu'au
  31/08/2026. Or `\bNone\b` ne voit ni l'une ni l'autre : la frontière de mot
  qu'il exige après « None » n'existe pas devant une lettre. Le garde portait
  donc `NoneB` en dur, ce qui l'a rendu aveugle à `NoneA` — et l'aurait rendu
  aveugle à `NoneC`. La forme du renommage se déclare une fois plutôt que de
  s'énumérer à chaque fois qu'on en trouve une de plus.
*/
const INTERDITS = [
  'Save', 'Cancel', 'Delete', 'Close', 'Search', 'None[A-Z]?', 'Add', 'Edit',
  'Remove', 'Submit', 'Confirm', 'Apply', 'Reset', 'Back', 'Next', 'Previous',
  'Loading', 'Retry', 'Yes', 'empties', 'measure', 'measures',
];
const MOTIF = new RegExp(`\\b(${INTERDITS.join('|')})\\b`);

/*
  Les PROPS QUI PORTENT DE LA PROSE.

  Fermée, comme `INTERDITS`, et pour la même raison : la plupart des attributs
  s'écrivent en anglais à bon droit — `value`, `name`, `variant`, `tone`,
  `icon`, `role`, `className` ne sont pas des libellés, ce sont des clés. Seuls
  ceux-ci s'affichent tels quels à un utilisateur.

  **Sans eux, le garde était aveugle à un quart de ce qu'il cherchait.** Il ne
  lisait que le texte entre deux balises, et `title="NoneA document"` sur la
  fiche d'`EmptyState` lui a échappé — trouvé le 31/08/2026, en même temps que
  les deux « NoneA champ » du `Command`. Un attribut est le second endroit où un
  libellé vit, et le renommage automatique n'a pas fait la différence.
*/
const PROPS_DE_PROSE = [
  'title', 'label', 'placeholder', 'hint', 'detail', 'description',
  'unit', 'libelle', 'entete', 'vide', 'phrase', 'sansNom', 'texte',
];

/*
  Le texte que le rendu affiche, aux DEUX endroits où il vit : entre deux
  balises, et dans la valeur d'un attribut de prose.

  **Ce découpage reste un découpage de texte, et il faut savoir ce qu'il rate.**
  Le jumeau de ce script dans le dépôt web lit l'arbre syntaxique, ce qui lui
  fait voir le JSX niché dans une expression. **Sa méthode ne se recopie PAS
  telle quelle ici, contrairement à ce qu'annonçait la documentation** : ce
  dépôt est sur TypeScript 7, dont le paquet n'expose que `version` et
  `versionMajorMinor` — il n'y a plus d'API de compilateur à appeler. Mesuré le
  31/08/2026 : `ts.ScriptTarget` y vaut `undefined`. Porter la méthode
  demanderait un analyseur en dépendance, ce qui est un choix à faire, pas un
  copier-coller.
*/
function textesRendus(source) {
  const textes = [];
  for (const t of source.matchAll(/>([^<>{}]+)</g)) {
    const brut = t[1].trim();
    if (brut) textes.push(brut);
  }
  // Les attributs de prose, dont la valeur est une chaîne littérale.
  const attributs = new RegExp(`\\b(?:${PROPS_DE_PROSE.join('|')})=\\{?["'\`]([^"'\`]+)["'\`]`, 'g');
  for (const t of source.matchAll(attributs)) {
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
