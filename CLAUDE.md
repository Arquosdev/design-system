# Design system Arquos — mode d'emploi pour les agents

Ce repo est la **source de vérité unique** du design Arquos : les tokens (couleurs,
typographie, espacements, arrondis) et les composants partagés. Les apps mobile
(`Arquosdev/mobile`) et web (`Arquosdev/fiche-equipement`) le consomment.

## Les deux règles qui comptent

**1. Avant d'écrire un composant, lire `dist/catalog.json`.** Il liste tous les
composants existants avec leur rôle et leurs mots-clés. Si le besoin y figure déjà,
réutiliser — ne pas réécrire une variante locale.

**2. Ne jamais écrire une valeur de design en dur.** Pas de `#0D5AB7`, pas de
`padding: 16px`, pas de `borderRadius: 8`. Toujours un token.

Si le token ou le composant dont tu as besoin n'existe pas : ne l'invente pas dans
l'app. Ouvre le sujet — soit l'existant convient, soit il faut l'ajouter ici.

## Où sont les tokens

| Tu écris du…            | Tu importes…                                         |
| ----------------------- | ---------------------------------------------------- |
| TypeScript / React Native | `import { colors, spacing, radius, typography } from '@arquos/design-system'` |
| CSS / HTML (web, Bubble) | `dist/tokens.css` → variables `var(--arq-color-primary)` |
| Autre outil / analyse    | `dist/tokens.json` (format W3C Design Tokens, avec descriptions) |

`dist/` est **généré**. La source est `src/*.ts`.

## Modifier un token

1. Éditer le fichier concerné dans `src/` (`colors.ts`, `typography.ts`, `spacing.ts`, `radius.ts`).
2. Lancer `npm run build` — régénère `dist/tokens.css` et `dist/tokens.json`.
3. Committer `src/` **et** `dist/` ensemble.

La CI (`npm run check`) refuse toute PR où `dist/` a divergé de `src/`.

## Choisir le bon token

**Couleurs** — prendre dans `colors` (sémantique), jamais dans `palette` (ramps brutes).
`colors.primary` pour une action, `colors.danger` pour une erreur, `colors.textMuted`
pour un libellé secondaire. Chaque token porte une description dans `dist/tokens.json` :
la lire plutôt que de deviner d'après le nom.

**Espacements** — échelle base 4. `spacing.base` (16) est le padding par défaut d'une
carte ou d'un formulaire. `spacing.sm` (8) pour l'écart entre éléments proches.

**Arrondis** — `radius.md` (8) est la référence pour cartes, champs et boutons.
`radius.full` uniquement sur un élément carré (pastille, avatar).

**Typographie** — utiliser les presets (`typography.body`, `typography.title`…) plutôt
que de recombiner taille + graisse + interligne. Côté web, les classes équivalentes
existent : `.arq-text-body`, `.arq-text-title`…

**Ne jamais ajouter de nouvelle taille de police.** L'échelle a été calibrée sur
l'usage réel ; toute taille supplémentaire est du drift.

## Les composants

Chaque composant vit dans `components/<nom>/` :

| Fichier | Contenu |
| --- | --- |
| `<nom>.spec.md` | La fiche : rôle, **quand ne pas l'utiliser**, props, états, accessibilité |
| `<nom>.web.tsx` | Implémentation web |
| `<nom>.native.tsx` | Implémentation React Native |

**Lire la fiche avant l'implémentation.** Elle contient la section « Quand NE PAS
l'utiliser », qui est ce qui évite les détournements — l'implémentation ne le dit pas.

Web et mobile partagent **les mêmes noms de props et les mêmes valeurs**. Si tu
constates une divergence non documentée dans la fiche, c'est un bug, pas une liberté.

### Ajouter un composant

1. Copier `components/_TEMPLATE.spec.md` vers `components/<nom>/<nom>.spec.md`, le remplir.
2. Écrire les implémentations des plateformes déclarées dans l'en-tête.
3. `npm run catalog` — régénère `dist/catalog.json` et `components/README.md`.

La CI refuse une plateforme déclarée sans implémentation, ou un catalogue non régénéré.

## À ne pas faire

- Éditer `dist/` ou `components/README.md` à la main — le prochain build écrase tout.
- Référencer `palette.blue[500]` dans du code applicatif — utiliser `colors.primary`.
- Ajouter une valeur intermédiaire à une échelle « parce qu'il manque 2px ».
- Créer un composant sans avoir cherché dans `dist/catalog.json` d'abord.
