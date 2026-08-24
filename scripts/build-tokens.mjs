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
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typography,
} from '../src/typography.ts';
import { spacing } from '../src/spacing.ts';
import { radius } from '../src/radius.ts';
import { shadow } from '../src/elevation.ts';

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
    borderSoft: 'Bordure discrète — séparateurs internes, contour de carte.',
  },
  shadow: {
    card: 'Cartes et surfaces posées sur le fond de page.',
    pop: 'Menus, popovers, feuilles modales.',
    fab: 'Bouton flottant — ombre teintée de bleu.',
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
    control: 'Pastilles et petits contrôles — hérité de l\'identité de marque.',
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

  section('Élévation');
  for (const [key, value] of Object.entries(shadow)) {
    lines.push(`  --${NS}-shadow-${kebab(key)}: ${value};`);
  }

  section('Typographie');
  lines.push(`  --${NS}-font-sans: ${fontFamily};`);
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
      `  font-family: var(--${NS}-font-sans);`,
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
    shadow: {
      $description: 'Trois niveaux d\'élévation, chacun attaché à un usage précis.',
      ...group(shadow, 'shadow', '', DESCRIPTIONS.shadow),
    },
    fontFamily: {
      $type: 'fontFamily',
      $value: fontFamily,
      $description:
        'DM Sans est la seule police de la marque. Côté React Native, utiliser `fontFamilyNative` : le gras synthétique rend mal sur Android.',
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

// ----------------------------------------------------- Tailwind v4 + shadcn

// Tailwind v4 se configure en CSS : ce que déclare `@theme` devient des classes
// utilitaires (`--color-primary` → `bg-primary`, `--radius-md` → `rounded-md`).
//
// Le second bloc est la couche de compatibilité shadcn/ui : ses composants sont
// écrits contre un vocabulaire fixe (`--background`, `--primary`, `--ring`…).
// On le branche UNE FOIS sur les tokens Arquos, ici. Sans ça, chaque app
// recopierait son propre mapping et repartirait en drift.
function buildTailwind() {
  const theme = [];
  const push = (name, value) => theme.push(`  ${name}: ${value};`);

  theme.push('  /* Couleurs sémantiques */');
  for (const [key, value] of Object.entries(colors)) {
    push(`--color-${kebab(key)}`, value);
  }

  theme.push('', '  /* Palette — pour les cas que le sémantique ne couvre pas */');
  for (const [ramp, shades] of Object.entries(palette)) {
    if (typeof shades === 'string') {
      push(`--color-${ramp}`, shades);
      continue;
    }
    for (const [shade, value] of Object.entries(shades)) {
      push(`--color-${ramp}-${shade}`, value);
    }
  }

  theme.push('', '  /* Espacements */');
  for (const [key, value] of Object.entries(spacing)) {
    push(`--spacing-${kebab(key)}`, `${value}px`);
  }

  theme.push('', '  /* Arrondis */');
  for (const [key, value] of Object.entries(radius)) {
    push(`--radius-${kebab(key)}`, `${value}px`);
  }

  theme.push('', '  /* Typographie */');
  push('--font-sans', fontFamily);
  for (const [key, preset] of Object.entries(typography)) {
    // En Tailwind v4, `--text-x` et `--text-x--line-height` se combinent : une
    // seule classe `text-body` pose la taille ET l'interligne.
    push(`--text-${kebab(key)}`, `${preset.fontSize}px`);
    push(`--text-${kebab(key)}--line-height`, `${preset.lineHeight}px`);
    push(`--text-${kebab(key)}--font-weight`, preset.fontWeight);
    if (preset.letterSpacing !== undefined) {
      push(`--text-${kebab(key)}--letter-spacing`, `${preset.letterSpacing}px`);
    }
  }
  for (const [key, value] of Object.entries(fontWeight)) {
    push(`--font-weight-${kebab(key)}`, value);
  }

  theme.push('', '  /* Élévation */');
  for (const [key, value] of Object.entries(shadow)) {
    push(`--shadow-${kebab(key)}`, value);
  }

  // Vocabulaire attendu par les composants shadcn/ui, traduit en tokens Arquos.
  // `*-foreground` = la couleur du texte posé sur la surface correspondante.
  const shadcn = [
    ['--background', colors.bg],
    ['--foreground', colors.text],
    ['--card', colors.bg],
    ['--card-foreground', colors.text],
    ['--popover', colors.bg],
    ['--popover-foreground', colors.text],
    ['--primary', colors.primary],
    ['--primary-foreground', colors.textOnDark],
    /* Chez Arquos, une action secondaire est le bleu doux, pas un gris. On
       aligne le vocabulaire shadcn dessus plutôt que de forker ses composants :
       un `variant="secondary"` collé depuis leur site sort ainsi juste. */
    ['--secondary', palette.blue[50]],
    ['--secondary-foreground', palette.blue[700]],
    ['--muted', colors.bgMuted],
    ['--muted-foreground', colors.textMuted],
    ['--accent', palette.blue[50]], // survol / état actif discret, pas l'orange
    ['--accent-foreground', colors.primaryDark],
    ['--destructive', colors.danger],
    ['--destructive-foreground', colors.textOnDark],
    /* Hors vocabulaire shadcn, mais indispensables ici : une fiche d'équipement
       parle sans cesse de conforme et de vigilance. Nos composants les
       déclarent en variantes supplémentaires, comme shadcn invite à le faire. */
    ['--success', colors.success],
    ['--success-foreground', colors.textOnDark],
    ['--warning', colors.accent],
    ['--warning-foreground', colors.text],
    ['--border', colors.border],
    ['--input', colors.border],
    ['--ring', colors.primary],
    ['--radius', `${radius.md}px`],
  ];

  return [
    '/* Thème Tailwind v4 — GÉNÉRÉ, ne pas éditer à la main.',
    ' * Source : src/*.ts — régénérer avec `npm run build`.',
    ' *',
    ' * Usage dans une app :',
    ' *   @import "tailwindcss";',
    ' *   @import "@arquos/design-system/tokens.tailwind.css";',
    ' */',
    '',
    '@theme {',
    theme.join('\n'),
    '}',
    '',
    '/* Compatibilité shadcn/ui : ses composants lisent ces noms-là.',
    ' * Ne pas les redéfinir dans les apps — la traduction se fait ici. */',
    ':root {',
    shadcn.map(([name, value]) => `  ${name}: ${value};`).join('\n'),
    '}',
    '',
    '@theme inline {',
    shadcn
      .filter(([name]) => name !== '--radius')
      .map(([name]) => `  --color-${name.slice(2)}: var(${name});`)
      .join('\n'),
    '}',
    '',
    "/* Ouverture et fermeture d'un contenu de hauteur inconnue. Radix publie la",
    " * hauteur mesurée dans --radix-accordion-content-height : c'est le seul",
    " * moyen d'animer vers `auto`, que CSS ne sait pas interpoler. */",
    '@theme {',
    '  --animate-accordion-down: accordion-down 200ms ease-out;',
    '  --animate-accordion-up: accordion-up 200ms ease-out;',
    '',
    '  @keyframes accordion-down {',
    '    from { height: 0; }',
    '    to { height: var(--radix-accordion-content-height); }',
    '  }',
    '  @keyframes accordion-up {',
    '    from { height: var(--radix-accordion-content-height); }',
    '    to { height: 0; }',
    '  }',
    '}',
    '',
    '/* Désigner une ligne qu’on vient d’atteindre par la recherche.',
    " * Le fond tient d'abord, puis s'efface : un fondu qui commence tout de suite",
    " * se rate quand l'œil arrive après le défilement. Le libellé se souligne en",
    ' * même temps — le fond dit « ici », le trait dit « ce champ-là ».',
    ' * Le trait est posé en permanence en transparent et n’anime que sa couleur :',
    ' * une text-decoration qui apparaîtrait d’un coup ferait sauter la ligne de',
    ' * base sur certains navigateurs. */',
    '@theme {',
    `  --animate-repere: repere 3200ms ease-out;`,
    `  --animate-repere-libelle: repere-libelle 3200ms ease-out;`,
    '',
    '  @keyframes repere {',
    `    0%, 38% { background-color: ${palette.blue[50]}; }`,
    '    100% { background-color: transparent; }',
    '  }',
    '  @keyframes repere-libelle {',
    `    0%, 38% { text-decoration-color: ${colors.primary}; }`,
    '    100% { text-decoration-color: transparent; }',
    '  }',
    '}',
    '',
    '/* Un panneau qui entre par le bord — la primitive Radix `Dialog` attend une',
    " * vraie animation pour retarder le démontage : une simple `transition` ferait",
    ' * disparaître le panneau d’un coup à la fermeture. */',
    '@theme {',
    '  --animate-voile-entree: voile-entree 200ms ease-out;',
    '  --animate-voile-sortie: voile-sortie 200ms ease-in;',
    '  --animate-tiroir-entree: tiroir-entree 260ms cubic-bezier(0.32, 0.72, 0, 1);',
    '  --animate-tiroir-sortie: tiroir-sortie 200ms ease-in;',
    '',
    '  @keyframes voile-entree { from { opacity: 0; } to { opacity: 1; } }',
    '  @keyframes voile-sortie { from { opacity: 1; } to { opacity: 0; } }',
    '  @keyframes tiroir-entree {',
    '    from { transform: translateX(100%); }',
    '    to { transform: translateX(0); }',
    '  }',
    '  @keyframes tiroir-sortie {',
    '    from { transform: translateX(0); }',
    '    to { transform: translateX(100%); }',
    '  }',
    '}',
    '',
    '/* Mouvement réduit : le repère ne clignote pas, il tient plus longtemps puis',
    ' * s’efface. Le supprimer laisserait sans réponse la question « où suis-je ? ». */',
    '@media (prefers-reduced-motion: reduce) {',
    '  @theme {',
    '    @keyframes repere {',
    `      0%, 80% { background-color: ${palette.blue[50]}; }`,
    '      100% { background-color: transparent; }',
    '    }',
    '    @keyframes repere-libelle {',
    `      0%, 80% { text-decoration-color: ${colors.primary}; }`,
    '      100% { text-decoration-color: transparent; }',
    '    }',
    '  }',
    '}',
    '',
  ].join('\n');
}

// --------------------------------------------------------------- write

const outputs = [
  ['tokens.css', buildCss()],
  ['tokens.tailwind.css', buildTailwind()],
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
