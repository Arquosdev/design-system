// Vérifie que chaque paire texte/fond posée par un composant reste lisible.
//
//   node scripts/check-contraste.mjs [--liste]
//
// Pourquoi ce script existe : le 25/08/2026, la variante `success` de `Badge`
// — le badge le plus affiché du produit — posait du vert 600 sur du vert 100,
// soit 2,77 pour 1. Il en faut 4,5. Personne ne l'avait vu, parce que rien ne
// regardait. Un ratio ne se juge pas à l'œil : il se calcule.
//
// Le contrôle lit les classes Tailwind des composants, les traduit en tokens,
// et refuse toute paire sous le seuil. Il ne remplace pas un test
// d'accessibilité complet (rôles, libellés, clavier) — il ferme la classe de
// défaut la plus grave et la plus silencieuse.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { colors, palette } from '../src/colors.ts';
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
      .map(([nom]) => `text-${nom.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`),
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
  const lignes = source.split('\n');
  const fautes = [];
  lignes.forEach((ligne, i) => {
    const autorisee = lignes
      .slice(Math.max(0, i - 4), i)
      .some((l) => l.includes('palette-brute-ok:'));
    if (autorisee) return;
    for (const [, classe] of ligne.matchAll(
      /\b((?:bg|text|border)-(?:blue|marine|orange|green|red|grey)-\d{2,3})\b/g,
    )) {
      fautes.push({ ligne: i + 1, classe });
    }
  });
  return fautes;
}

const liste = process.argv.includes('--liste');
const echecs = [];
const brutes = [];
let controlees = 0;

for (const nom of readdirSync(COMPONENTS).filter((n) => !n.startsWith('_'))) {
  const fichier = join(COMPONENTS, nom, `${nom}.web.tsx`);
  if (!existsSync(fichier)) continue;

  const source = readFileSync(fichier, 'utf8');
  const seuil = seuilPour(source);

  for (const paire of pairesDe(source)) {
    controlees++;
    const r = ratio(paire.texte, paire.fond);
    if (liste) {
      console.log(`  ${r >= seuil ? '✓' : '✗'} ${nom.padEnd(15)} ${paire.classes.padEnd(46)} ${r.toFixed(2)}`);
    }
    if (r < seuil) echecs.push({ nom, ...paire, r, seuil });
  }

  for (const faute of paletteBrute(source)) brutes.push({ nom, ...faute });
}

if (echecs.length) {
  console.error(`\n✗ ${echecs.length} paire(s) sous le seuil de lisibilité :\n`);
  for (const e of echecs) {
    console.error(`  ${e.nom} — ${e.classes}`);
    console.error(`    ${e.texte} sur ${e.fond} : ${e.r.toFixed(2)} pour 1, il en faut ${e.seuil}`);
    console.error(`    Prendre un cran plus foncé dans la rampe, le fond ne bouge pas.\n`);
  }
  process.exit(1);
}

if (brutes.length) {
  console.error(`\n✗ ${brutes.length} usage(s) de la palette brute dans un composant :\n`);
  for (const b of brutes) {
    console.error(`  ${b.nom}.web.tsx:${b.ligne} — ${b.classe}`);
  }
  console.error(
    `\n  Prendre un token sémantique (\`bg-info-bg\`, \`text-on-success-bg\`…),\n` +
      `  ou l'ajouter dans src/colors.ts s'il manque. En dernier recours, écrire\n` +
      `  \`palette-brute-ok:\` et la raison en commentaire au-dessus de la ligne.\n`,
  );
  process.exit(1);
}

console.log(`✓ contraste : ${controlees} paire(s) au-dessus du seuil`);
console.log('✓ palette : aucun composant ne tape dans les rampes brutes');
