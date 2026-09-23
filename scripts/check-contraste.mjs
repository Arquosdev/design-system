// Vérifie que chaque paire texte/fond posée par un composant reste lisible, et
// qu'aucun composant ne tape dans la palette brute.
//
//   node scripts/check-contraste.mjs [--liste]
//
// Un ratio ne se juge pas à l'œil : la variante `success` de `Badge` a vécu à
// 2,77 pour 1 sans que personne le voie.
//
// LIMITE : le contrôle n'apparie que ce qui vit dans la MÊME chaîne de classes.
// Un fond sur le parent et une couleur sur l'enfant lui échappent —
// `check-contraste-rendu.mjs` les voit, lui.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { colors, palette, tagPalette } from '../src/colors.ts';
import { fontSize } from '../src/typography.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = join(ROOT, 'components');

// WCAG 2.1 : 4,5 pour du texte courant, 3 pour du gros texte (≥ 24px, ou
// ≥ 18,66px en gras) et pour les éléments non textuels.
const SEUIL_TEXTE = 4.5;
const SEUIL_GROS = 3;

/** Ce que vaut une classe Tailwind, côté token. */
function resoudre(classe) {
  // `bg-success-bg` → colors.successBg ; `text-orange-700` → palette.orange[700]
  const nu = classe.replace(/^(bg|text|border)-/, '');

  const rampe = /^(blue|marine|orange|green|red|grey)-(\d{2,3})$/.exec(nu);
  if (rampe) return palette[rampe[1]]?.[Number(rampe[2])] ?? null;

  // Le vocabulaire shadcn traduit par `tokens.tailwind.css`.
  const ALIAS = {
    background: colors.bg,
    foreground: colors.text,
    primary: colors.primary,
    'primary-foreground': colors.textOnDark,
    secondary: palette.grey[100],
    'secondary-foreground': colors.text,
    destructive: colors.danger,
    'destructive-foreground': colors.textOnDark,
    muted: colors.bgMuted,
    'muted-foreground': colors.textMuted,
    accent: palette.blue[50],
    'accent-foreground': colors.primary,
  };
  if (ALIAS[nu]) return ALIAS[nu];

  const camel = nu.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return colors[camel] ?? colors[nu] ?? null;
}

const lineaire = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * lineaire(r) + 0.7152 * lineaire(g) + 0.0722 * lineaire(b);
}

export function ratio(a, b) {
  const [haut, bas] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (haut + 0.05) / (bas + 0.05);
}

/**
 * Les paires d'une chaîne de classes.
 *
 * On ne lit que les chaînes qui posent un fond ET une couleur de texte : une
 * classe de texte seule hérite d'un fond qu'on ne connaît qu'au call site, et
 * deviner ce fond produirait des alertes fausses — c'est ainsi qu'un contrôle
 * finit désactivé.
 *
 * CE QUE ÇA NE COUVRE PAS, et il faut le savoir plutôt que de croire le
 * contraire : une paire répartie sur deux éléments. Un fond posé sur le parent
 * et l'encre sur l'enfant échappent entièrement au contrôle — le cas existe
 * dans la fiche (`bandeau-releve.tsx` pose `bg-blue-50` sur son div et
 * `text-blue-700` sur un span à l'intérieur). Ce contrôle ferme la classe de
 * défaut la plus fréquente, pas toutes. Le panneau d'accessibilité de la
 * vitrine, lui, mesure le rendu réel et voit ces cas-là.
 */
function pairesDe(source) {
  const trouvees = [];
  for (const [, chaine] of source.matchAll(/'([^']*\b(?:bg|text)-[^']*)'/g)) {
    const fond = /(?:^|\s)(bg-[\w-]+)/.exec(chaine)?.[1];
    const texte = /(?:^|\s)(text-[\w-]+)/.exec(chaine)?.[1];
    if (!fond || !texte) continue;
    if (fond.includes('transparent') || texte.includes('transparent')) continue;

    const hFond = resoudre(fond);
    const hTexte = resoudre(texte);
    if (!hFond || !hTexte) continue; // taille de police, opacité, inconnu

    trouvees.push({ classes: `${fond} / ${texte}`, fond: hFond, texte: hTexte });
  }
  return trouvees;
}

/** Le seuil dépend de la taille : un badge en 12px n'a pas droit au 3 pour 1. */
function seuilPour(source) {
  const grosse = new Set(
    Object.entries(fontSize)
      .filter(([, px]) => px >= 24)
      .map(([name]) => `text-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`),
  );
  return [...grosse].some((c) => source.includes(c)) ? SEUIL_GROS : SEUIL_TEXTE;
}

/**
 * La palette brute dans un composant.
 *
 * `CLAUDE.md` l'interdit — `colors.primary`, jamais `palette.blue[500]` — mais
 * rien ne le vérifiait, et cinq composants posaient `bg-blue-50 text-blue-700`
 * à la main pour dire « cette entrée est retenue ». Une teinte employée cinq
 * fois mérite son nom : c'est ce qui permet de la changer une seule fois.
 *
 * Dérogation : écrire `palette-brute-ok:` suivi de la raison sur une ligne de
 * commentaire juste au-dessus. Une échappatoire qui demande une phrase reste
 * rare ; une règle sans échappatoire finit désactivée.
 */
function paletteBrute(source) {
  const rows = source.split('\n');
  const fautes = [];
  rows.forEach((row, i) => {
    const autorisee = rows
      .slice(Math.max(0, i - 4), i)
      .some((l) => l.includes('palette-brute-ok:'));
    if (autorisee) return;
    for (const [, classe] of row.matchAll(
      /\b((?:bg|text|border)-(?:blue|marine|orange|green|red|grey)-\d{2,3})\b/g,
    )) {
      fautes.push({ row: i + 1, classe });
    }
  });
  return fautes;
}

/**
 * Les marques de réserve posées en `textSubtle`.
 *
 * WCAG traite le texte d'un `placeholder` comme du texte : il lui faut 4,5, et
 * `textSubtle` est à 3,14 sur blanc. C'est le cas qu'on croit décoratif et qui
 * ne l'est pas — sept composants le portaient avant le 25/08/2026.
 *
 * Le contrôle est étroit à dessein : il ne vise que ce motif exact, qu'on sait
 * faux à coup sûr, plutôt que de deviner un fond hérité et de crier pour rien.
 */
function reservesTropClaires(source) {
  return [...source.matchAll(/placeholder:text-text-subtle/g)].map(() => 'placeholder:text-text-subtle');
}

const list = process.argv.includes('--liste');
const echecs = [];
const brutes = [];
const reserves = [];
let controlees = 0;

// Les paires d'état, vérifiées À LA SOURCE et non dans les classes.
//
// `pairesDe` n'apparie que ce qui vit dans la même chaîne : une paire posée sur
// deux éléments lui échappe. Et pour l'état inactif, `check-contraste-rendu`
// n'aide pas non plus — **axe exempte du contraste tout ce qui porte `disabled`
// ou `aria-disabled`**. Le libellé grisé d'un bouton était donc mesuré par
// personne, alors que c'est du texte qu'on doit lire pour comprendre pourquoi
// le geste est impossible.
//
// Les mesurer ici les tient quoi qu'il arrive à l'usage : c'est la déclaration
// du jeton qui est contrôlée, pas la façon dont un composant l'écrit.
const PAIRES = [
  ['successBg', 'onSuccessBg'],
  ['dangerBg', 'onDangerBg'],
  ['warningBg', 'onWarningBg'],
  // `onInfoBg` vaut `primary` : l'exception voulue par Louis le 31/08/2026 pour
  // que l'état sélectionné porte l'encre de la marque. 5,56 — au-dessus du
  // seuil, en dessous de AAA, et c'est assumé. Ce contrôle la mesure, il ne la
  // défait pas.
  ['infoBg', 'onInfoBg'],
  ['infoBg', 'textOnInfoBg'],
  ['inactiveBg', 'onInactiveBg'],
];

const pairesFaibles = [];
for (const [fond, encre] of PAIRES) {
  const r = ratio(colors[encre], colors[fond]);
  if (list) console.log(`  ${r >= SEUIL_TEXTE ? '✓' : '✗'} ${`${encre} sur ${fond}`.padEnd(40)} ${r.toFixed(2)}`);
  if (r < SEUIL_TEXTE) pairesFaibles.push({ fond, encre, r });
}
if (pairesFaibles.length) {
  console.error(`\n✗ ${pairesFaibles.length} paire(s) de jetons sous le seuil :\n`);
  for (const p of pairesFaibles) {
    console.error(`  ${p.encre} sur ${p.fond} : ${p.r.toFixed(2)} pour 1, il en faut ${SEUIL_TEXTE}`);
  }
  console.error('\n  Assombrir l\'encre dans src/colors.ts : le fond d\'état reste très clair.\n');
  process.exit(1);
}

for (const name of readdirSync(COMPONENTS).filter((n) => !n.startsWith('_'))) {
  const fichier = join(COMPONENTS, name, `${name}.web.tsx`);
  if (!existsSync(fichier)) continue;

  const source = readFileSync(fichier, 'utf8');
  const seuil = seuilPour(source);

  for (const paire of pairesDe(source)) {
    controlees++;
    const r = ratio(paire.texte, paire.fond);
    if (list) {
      console.log(`  ${r >= seuil ? '✓' : '✗'} ${name.padEnd(15)} ${paire.classes.padEnd(46)} ${r.toFixed(2)}`);
    }
    if (r < seuil) echecs.push({ name, ...paire, r, seuil });
  }

  for (const faute of paletteBrute(source)) brutes.push({ name, ...faute });
  for (const classe of reservesTropClaires(source)) reserves.push({ name, classe });
}

if (echecs.length) {
  console.error(`\n✗ ${echecs.length} paire(s) sous le seuil de lisibilité :\n`);
  for (const e of echecs) {
    console.error(`  ${e.name} — ${e.classes}`);
    console.error(`    ${e.texte} sur ${e.fond} : ${e.r.toFixed(2)} pour 1, il en faut ${e.seuil}`);
    console.error(`    Prendre un cran plus foncé dans la rampe, le fond ne bouge pas.\n`);
  }
  process.exit(1);
}

if (brutes.length) {
  console.error(`\n✗ ${brutes.length} usage(s) de la palette brute dans un composant :\n`);
  for (const b of brutes) {
    console.error(`  ${b.name}.web.tsx:${b.row} — ${b.classe}`);
  }
  console.error(
    `\n  Prendre un token sémantique (\`bg-info-bg\`, \`text-on-success-bg\`…),\n` +
      `  ou l'ajouter dans src/colors.ts s'il manque. En dernier recours, écrire\n` +
      `  \`palette-brute-ok:\` et la raison en commentaire au-dessus de la ligne.\n`,
  );
  process.exit(1);
}

if (reserves.length) {
  console.error(`\n✗ ${reserves.length} marque(s) de réserve en \`textSubtle\` :\n`);
  for (const r of reserves) console.error(`  ${r.name}.web.tsx — ${r.classe}`);
  console.error(
    `\n  Une marque de réserve est du texte pour WCAG : il lui faut 4,5, et\n` +
      `  \`textSubtle\` est à 3,14 sur blanc. Prendre \`placeholder:text-text-muted\`.\n`,
  );
  process.exit(1);
}

// Les teintes catégorielles ne passent pas par des classes Tailwind : `Tag`
// les pose en style inline, parce que le libellé décide de la teinte au
// rendu. Elles se vérifient donc ici, à la source.
const tagsFaibles = [];
for (const [nom, { bg, ink }] of Object.entries(tagPalette)) {
  const surFond = ratio(ink, bg);
  const surBlanc = ratio(ink, '#FFFFFF');
  if (surFond < SEUIL_TEXTE || surBlanc < SEUIL_TEXTE) {
    tagsFaibles.push({ nom, surFond, surBlanc });
  }
}
if (tagsFaibles.length) {
  console.error(`\n✗ ${tagsFaibles.length} teinte(s) de \`tagPalette\` sous le seuil :\n`);
  for (const t of tagsFaibles) {
    console.error(`  ${t.nom} — ${t.surFond.toFixed(2)} sur son fond, ${t.surBlanc.toFixed(2)} sur blanc`);
  }
  console.error('\n  Assombrir l\'encre : le fond doit rester très clair.\n');
  process.exit(1);
}

console.log(`✓ paires d'état : ${PAIRES.length} paire(s) de jetons lisibles`);
console.log(`✓ contraste : ${controlees} paire(s) au-dessus du seuil`);
console.log(`✓ teintes catégorielles : ${Object.keys(tagPalette).length} paire(s) lisibles`);
console.log('✓ palette : aucun composant ne tape dans les rampes brutes');
