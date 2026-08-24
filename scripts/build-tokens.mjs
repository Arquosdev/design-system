// Génère les formats dérivés des tokens depuis la source TypeScript (`src/`).
//
//   node scripts/build-tokens.mjs
//
// Produit dans `dist/` :
//   tokens.css   — variables CSS, consommées par le web (fiche équipement, Bubble)
//   tokens.json  — format W3C Design Tokens, lisible par les agents et les outils design
//
// `src/*.ts` reste la seule source de vérité : ne jamais éditer `dist/` à la main.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { palette, core, colors } from '../src/colors.ts';
import { fontSize, fontWeight, lineHeight, letterSpacing, typography } from '../src/typography.ts';
import { spacing } from '../src/spacing.ts';
import { radius } from '../src/radius.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

// Préfixe des variables CSS. Court pour rester lisible dans le HTML embarqué
// Bubble, distinctif pour ne pas entrer en collision avec les styles Bubble.
const NS = 'arq';

// Descriptions rattachées aux tokens sémantiques. Elles voyagent jusque dans le
// JSON : c'est ce qu'un agent lit pour choisir le bon token sans deviner.
const DESCRIPTIONS = {
  color: {
    primary: 'Accent interactif principal — CTA, liens, état actif.',
    primaryDark: 'Variante foncée de primary — état pressé, survol.',
    brand: 'Surface de marque dominante — en-têtes, blocs héros.',
    accent: "Mise en avant, attention — à réserver aux éléments qui doivent capter l'œil.",
    success: 'État de réussite — validation, conformité, synchronisation terminée.',
    successBg: 'Fond des éléments en état de réussite (pastilles, bandeaux).',
    danger: 'État de danger — erreur, écart bloquant, action destructrice.',
    dangerBg: 'Fond des éléments en état de danger.',
    warning: 'État de vigilance — information à confirmer, écart non bloquant.',
    bg: 'Fond de page par défaut.',
    bgMuted: 'Fond secondaire — sections, cartes posées sur le fond de page.',
    border: 'Bordures et séparateurs.',
    text: 'Texte courant.',
    textMuted: 'Texte secondaire — libellés, métadonnées.',
    textSubtle: 'Texte tertiaire — placeholders, texte désactivé.',
    textOnDark: 'Texte posé sur une surface foncée (brand, primary).',
    black: 'Noir pur — overlays, ombres. Éviter pour du texte, préférer `text`.',
  },
  spacing: {
    none: 'Aucun espace.',
    xxs: 'Micro-espace — séparateurs internes, points.',
    xs: 'Très petit — paddings serrés.',
    sm: 'Petit — écart entre éléments proches.',
    md: 'Moyen.',
    base: 'Défaut — padding standard des cartes et formulaires.',
    lg: 'Grand.',
    xl: 'Très grand.',
    '2xl': 'Séparation de sections.',
    '3xl': 'Séparation large.',
    '4xl': 'Séparation très large.',
    '5xl': 'Respiration maximale — écrans vides, écrans de démarrage.',
  },
  radius: {
    none: 'Angles droits.',
    sm: 'Léger — petits éléments, pastilles carrées.',
    md: 'Défaut — cartes, champs, boutons.',
    lg: 'Marqué — cartes de premier plan.',
    xl: 'Très marqué — feuilles modales.',
    '2xl': 'Prononcé.',
    '3xl': 'Très prononcé.',
    full: 'Pilule ou cercle parfait — à appliquer sur un élément carré.',
  },
};

/** Nom CSS sûr : `2xl` → `2xl`, `titleLarge` → `title-large`. */
const kebab = (key) => String(key).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// ---------------------------------------------------------------- CSS

function buildCss() {
  const lines = [];
  const section = (title) => lines.push('', `  /* ${title} */`);

  section('Palette — ramps brutes. Préférer les tokens sémantiques ci-dessous.');
  for (const [ramp, shades] of Object.entries(palette)) {
    if (typeof shades === 'string') {
      lines.push(`  --${NS}-palette-${ramp}: ${shades};`);
      continue;
    }
    for (const [shade, value] of Object.entries(shades)) {
      lines.push(`  --${NS}-palette-${ramp}-${shade}: ${value};`);
    }
  }

  section('Marque');
  for (const [key, value] of Object.entries(core)) {
    lines.push(`  --${NS}-core-${kebab(key)}: ${value};`);
  }

  section('Couleurs sémantiques — à utiliser dans le code applicatif');
  for (const [key, value] of Object.entries(colors)) {
    lines.push(`  --${NS}-color-${kebab(key)}: ${value};`);
  }

  section('Espacements (base 4)');
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --${NS}-space-${kebab(key)}: ${value}px;`);
  }

  section('Arrondis');
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --${NS}-radius-${kebab(key)}: ${value}px;`);
  }

  section('Typographie');
  for (const [key, value] of Object.entries(fontSize)) {
    lines.push(`  --${NS}-font-size-${kebab(key)}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(fontWeight)) {
    lines.push(`  --${NS}-font-weight-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(lineHeight)) {
    lines.push(`  --${NS}-line-height-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(letterSpacing)) {
    lines.push(`  --${NS}-letter-spacing-${kebab(key)}: ${value}px;`);
  }

  // Presets typographiques : une classe par preset, pour appliquer taille +
  // graisse + interligne d'un seul coup — l'équivalent web de `typography.body`.
  const presets = Object.entries(typography).map(([key, preset]) => {
    const decls = [
      `  font-size: ${preset.fontSize}px;`,
      `  font-weight: ${preset.fontWeight};`,
      `  line-height: ${preset.lineHeight}px;`,
    ];
    if (preset.letterSpacing !== undefined) {
      decls.push(`  letter-spacing: ${preset.letterSpacing}px;`);
    }
    return `.${NS}-text-${kebab(key)} {\n${decls.join('\n')}\n}`;
  });

  return [
    '/* Tokens Arquos — GÉNÉRÉ, ne pas éditer à la main.',
    ' * Source : src/*.ts — régénérer avec `npm run build`.',
    ' */',
    '',
    ':root {' + lines.join('\n') + '\n}',
    '',
    '/* Presets typographiques prêts à l\'emploi. */',
    presets.join('\n\n'),
    '',
  ].join('\n');
}

// --------------------------------------------------------------- JSON

// Format W3C Design Tokens (`$type` / `$value` / `$description`) : c'est le
// standard que lisent Figma, Style Dictionary et les agents. Les descriptions
// rendent le fichier auto-suffisant — pas besoin d'ouvrir le code pour choisir.
function group(entries, type, unit = '', descriptions = {}) {
  const out = {};
  for (const [key, value] of Object.entries(entries)) {
    out[key] = {
      $type: type,
      $value: unit ? `${value}${unit}` : value,
      ...(descriptions[key] ? { $description: descriptions[key] } : {}),
    };
  }
  return out;
}

function buildJson() {
  const paletteGroup = {};
  for (const [ramp, shades] of Object.entries(palette)) {
    paletteGroup[ramp] =
      typeof shades === 'string'
        ? { $type: 'color', $value: shades }
        : group(shades, 'color');
  }

  return {
    $schema: 'https://tr.designtokens.org/format/',
    $description:
      "Tokens du design system Arquos. Source de vérité : src/*.ts du repo Arquosdev/design-system. " +
      "Utiliser les tokens sémantiques (color, spacing, radius, typography) plutôt que la palette brute.",
    palette: {
      $description: 'Ramps brutes 50→800. Ne pas référencer directement depuis le code applicatif.',
      ...paletteGroup,
    },
    core: {
      $description: 'Les quatre couleurs de marque Arquos.',
      ...group(core, 'color'),
    },
    color: {
      $description: 'Couleurs sémantiques — le vocabulaire à employer dans le code.',
      ...group(colors, 'color', '', DESCRIPTIONS.color),
    },
    spacing: {
      $description: 'Échelle base 4. `base` (16px) est le padding par défaut.',
      ...group(spacing, 'dimension', 'px', DESCRIPTIONS.spacing),
    },
    radius: {
      $description: 'Arrondis. `md` (8px) est la référence.',
      ...group(radius, 'dimension', 'px', DESCRIPTIONS.radius),
    },
    fontSize: {
      $description: "Échelle typographique. `body` (16px) est la taille du texte courant. Ne pas ajouter de nouvelle taille.",
      ...group(fontSize, 'dimension', 'px'),
    },
    fontWeight: group(fontWeight, 'fontWeight'),
    lineHeight: {
      $description: 'Multiplicateurs à appliquer à la taille de police.',
      ...group(lineHeight, 'number'),
    },
    letterSpacing: group(letterSpacing, 'dimension', 'px'),
    typography: {
      $description: 'Combinaisons prêtes à l\'emploi — préférer ces presets à une recomposition manuelle.',
      ...Object.fromEntries(
        Object.entries(typography).map(([key, preset]) => [
          key,
          {
            $type: 'typography',
            $value: {
              fontSize: `${preset.fontSize}px`,
              fontWeight: preset.fontWeight,
              lineHeight: `${preset.lineHeight}px`,
              ...(preset.letterSpacing !== undefined
                ? { letterSpacing: `${preset.letterSpacing}px` }
                : {}),
            },
          },
        ]),
      ),
    },
  };
}

// --------------------------------------------------------------- write

const outputs = [
  ['tokens.css', buildCss()],
  ['tokens.json', JSON.stringify(buildJson(), null, 2) + '\n'],
];

// `--check` ne réécrit rien et sort en erreur si `dist/` a divergé de `src/`.
// C'est ce que lance la CI : impossible de merger une modif de token sans avoir
// régénéré les formats dérivés.
if (process.argv.includes('--check')) {
  const stale = outputs.filter(([name, content]) => {
    const path = join(DIST, name);
    return !existsSync(path) || readFileSync(path, 'utf8') !== content;
  });

  if (stale.length > 0) {
    console.error(
      `✗ dist/ n'est pas à jour : ${stale.map(([n]) => n).join(', ')}\n` +
        '  Lance `npm run build` et committe le résultat.',
    );
    process.exit(1);
  }
  console.log('✓ dist/ est à jour avec src/');
} else {
  mkdirSync(DIST, { recursive: true });
  for (const [name, content] of outputs) {
    writeFileSync(join(DIST, name), content);
    console.log(`✓ dist/${name}  (${content.split('\n').length} lignes)`);
  }
}
