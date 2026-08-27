// Construit l'index des composants à partir de l'en-tête de chaque fiche
// `components/<nom>/<nom>.spec.md`.
//
//   node scripts/build-catalog.mjs [--check]
//
// Produit :
//   dist/catalog.json  — index machine-lisible (ce qu'un agent lit en premier)
//   components/README.md — le même index, en table, pour les humains
//
// Objectif : qu'un agent réponde à « existe-t-il déjà un composant pour ça ? »
// en lisant UN fichier, sans parcourir les implémentations.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Où vivent les apps, quand elles sont là.
 *
 * Chemins voisins : le poste de développement les a, la CI non. Le contrôle des
 * chemins de `remplace` s'adapte — voir plus bas.
 */
const REPOS = {
  mobile: join(ROOT, '..', 'myarquos-mobile'),
  web: join(ROOT, '..', 'fiche-equipement'),
};
const COMPONENTS = join(ROOT, 'components');
const DIST = join(ROOT, 'dist');

/**
 * Lecteur d'en-tête YAML volontairement minimal : il couvre exactement le schéma
 * de `_TEMPLATE.spec.md` (scalaires, listes en ligne, un niveau d'imbrication).
 * Si le schéma s'enrichit, prendre une vraie dépendance YAML plutôt que
 * d'étendre ceci.
 */
function parseFrontmatter(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${file} : en-tête YAML manquant`);

  const out = {};
  let parent = null;

  for (const raw of match[1].split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '').trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indented = /^\s{2,}\S/.test(line);
    const [, key, rest] = line.match(/^\s*([\w-]+):\s*(.*)$/) ?? [];
    if (!key) continue;

    const value =
      rest === ''
        ? null
        : rest.startsWith('[')
          ? rest
              .slice(1, rest.lastIndexOf(']'))
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean)
          : rest.replace(/^['"]|['"]$/g, '');

    if (indented && parent) {
      out[parent][key] = value ?? [];
    } else if (value === null) {
      parent = key;
      out[key] = {};
    } else {
      parent = null;
      out[key] = value;
    }
  }
  return out;
}

const REQUIRED = ['name', 'status', 'role', 'keywords', 'platforms', 'layer'];

/**
 * Les deux couches, et ce qui les sépare.
 *
 * Ce n'est PAS l'atomic design : classer par taille (atome, molécule, organisme)
 * répond à une question que personne ne se pose en travaillant. Celle-ci se pose
 * tous les jours — « est-ce que je touche à une brique que tout le monde
 * partage, ou à quelque chose qui ne vaut que pour l'ascenseur ? »
 */
const LAYERS = {
  generique: {
    title: 'Générique',
    what:
      "Une mécanique que n'importe quelle application aurait — bouton, modale, " +
      'onglets. Elle vient de shadcn/Radix, ou elle le pourrait.',
  },
  metier: {
    title: 'Métier',
    what:
      "Elle porte l'ascenseur : son vocabulaire, ses états, ses règles. " +
      "shadcn n'a rien d'équivalent, et c'est normal.",
  },
};

function collect() {
  if (!existsSync(COMPONENTS)) return [];

  const entries = [];
  for (const dir of readdirSync(COMPONENTS, { withFileTypes: true })) {
    if (!dir.isDirectory() || dir.name.startsWith('_')) continue;

    const spec = join(COMPONENTS, dir.name, `${dir.name}.spec.md`);
    if (!existsSync(spec)) {
      throw new Error(`components/${dir.name}/ : fiche ${dir.name}.spec.md manquante`);
    }

    const meta = parseFrontmatter(readFileSync(spec, 'utf8'), spec);
    const missing = REQUIRED.filter((k) => !meta[k]);
    if (missing.length) {
      throw new Error(`${spec} : clés manquantes dans l'en-tête — ${missing.join(', ')}`);
    }

    if (!LAYERS[meta.layer]) {
      throw new Error(
        `${spec} : couche « ${meta.layer} » inconnue — attendu ${Object.keys(LAYERS).join(' ou ')}`,
      );
    }

    // Une plateforme déclarée sans implémentation est un piège : l'agent croirait
    // le composant disponible et écrirait un import qui n'existe pas.
    const fichiers = {};
    for (const plateforme of meta.platforms) {
      const ext = plateforme === 'mobile' ? 'native.tsx' : 'web.tsx';
      const impl = join(COMPONENTS, dir.name, `${dir.name}.${ext}`);
      if (!existsSync(impl)) {
        throw new Error(
          `${spec} : plateforme « ${plateforme} » déclarée mais ${dir.name}.${ext} est absent`,
        );
      }
      fichiers[plateforme] = `components/${dir.name}/${dir.name}.${ext}`;
    }

    // Les fichiers d'app que le composant remplace : vérifiés s'ils sont
    // atteignables, ignorés sinon.
    //
    // Le champ `remplace` sert à répondre à « ce composant existe-t-il déjà
    // ailleurs, sous un autre nom ? » — c'est ce qui a permis de cartographier
    // 32 fichiers du mobile. Une carte fausse est pire qu'une carte absente :
    // elle envoie chercher un fichier qui n'est plus là.
    //
    // Les dépôts d'app ne sont pas toujours présents (la CI ne cloue que
    // celui-ci). On ne vérifie donc QUE ce qu'on peut voir, et on se tait sur
    // le reste plutôt que de bloquer sur une absence qui n'est pas une faute.
    for (const [plateforme, chemins] of Object.entries(meta.replaces ?? {})) {
      const depot = REPOS[plateforme];
      if (!depot || !existsSync(depot)) continue;
      for (const brut of chemins) {
        // Les entrées portent parfois une précision après un tiret cadratin :
        // « components/Button.tsx — la variante pleine ».
        const chemin = String(brut).split('—')[0].trim();
        if (!chemin || chemin.includes(' ')) continue;
        if (!existsSync(join(depot, chemin))) {
          throw new Error(
            `${spec} : remplace.${plateforme} cite « ${chemin} », introuvable dans ${depot}`,
          );
        }
      }
    }

    // La logique métier, quand elle existe : c'est ce qu'un agent doit lire pour
    // savoir ce que le composant sait de l'ascenseur, sans traverser du JSX.
    // Voir CONVERGENCE.md — le vocabulaire converge entre plateformes, le rendu
    // non.
    if (existsSync(join(COMPONENTS, dir.name, `${dir.name}.logic.ts`))) {
      fichiers.logique = `components/${dir.name}/${dir.name}.logic.ts`;
    }

    entries.push({
      ...meta,
      dossier: `components/${dir.name}`,
      specFile: `components/${dir.name}/${dir.name}.spec.md`,
      fichiers,
    });
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

function buildJson(entries) {
  return (
    JSON.stringify(
      {
        $description:
          "Catalogue des composants du design system Arquos. Avant de créer un composant, " +
          "chercher ici : si le rôle recherché y figure, réutiliser plutôt que réécrire. " +
          "Chaque entrée pointe vers sa fiche (`fiche`), qui décrit les props, les états et " +
          "surtout les cas où le composant ne doit PAS être employé.",
        couches: LAYERS,
        composants: entries,
      },
      null,
      2,
    ) + '\n'
  );
}

function buildReadme(entries) {
  const table = (list) => [
    '| Composant | Rôle | Plateformes | Statut |',
    '| --- | --- | --- | --- |',
    ...(list.length
      ? list.map((c) => {
          const platforms = c.platforms
            .map((p) => (p === 'mobile' ? '📱' : '🖥️'))
            .join(' ');
          // Lien relatif à components/, tiré du chemin réel : le nom du
          // composant (FieldRow) ne donne pas toujours celui du dossier.
          const lien = c.specFile.replace(/^components\//, '');
          return `| [${c.name}](${lien}) | ${c.role} | ${platforms} | ${c.status} |`;
        })
      : ["| _(aucun pour l'instant)_ | | | |"]),
  ];

  const sections = Object.entries(LAYERS).flatMap(([id, { title, what }]) => [
    `## ${title}`,
    '',
    what,
    '',
    ...table(entries.filter((c) => c.layer === id)),
    '',
  ]);

  return [
    '# Composants',
    '',
    '> Index généré par `npm run catalog` — ne pas éditer à la main.',
    "> La source de chaque ligne est l'en-tête de la fiche du composant.",
    '',
    'Chaque composant vit dans son dossier, avec sa fiche (`*.spec.md`) et une',
    'implémentation par plateforme (`*.web.tsx`, `*.native.tsx`).',
    '',
    '🖥️ web · 📱 mobile',
    '',
    ...sections,
    '## Ajouter un composant',
    '',
    '1. Copier `_TEMPLATE.spec.md` dans `components/<nom>/<nom>.spec.md` et le remplir.',
    '2. Écrire `<nom>.web.tsx` et/ou `<nom>.native.tsx` — uniquement les plateformes déclarées.',
    '3. `npm run catalog` pour régénérer cet index et `dist/catalog.json`.',
    '',
  ].join('\n');
}

// --------------------------------------------------------------- write

// Une fiche mal formée doit donner un message exploitable, pas une trace Node :
// ce script tourne aussi bien sous les yeux d'un agent que dans la CI.
let entries;
try {
  entries = collect();
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exit(1);
}

const outputs = [
  [join(DIST, 'catalog.json'), buildJson(entries), 'dist/catalog.json'],
  [join(COMPONENTS, 'README.md'), buildReadme(entries), 'components/README.md'],
];

if (process.argv.includes('--check')) {
  const stale = outputs.filter(
    ([path, content]) => !existsSync(path) || readFileSync(path, 'utf8') !== content,
  );
  if (stale.length) {
    console.error(
      `✗ catalogue pas à jour : ${stale.map(([, , label]) => label).join(', ')}\n` +
        '  Lance `npm run catalog` et committe le résultat.',
    );
    process.exit(1);
  }
  console.log(`✓ catalogue à jour (${entries.length} composants)`);
} else {
  mkdirSync(DIST, { recursive: true });
  mkdirSync(COMPONENTS, { recursive: true });
  for (const [path, content, label] of outputs) {
    writeFileSync(path, content);
    console.log(`✓ ${label}`);
  }
  console.log(`  ${entries.length} composant(s) indexé(s)`);
}
