# Design system Arquos — mode d'emploi pour les agents

Ce repo est la **source de vérité unique** du design Arquos : les tokens (couleurs,
typographie, espacements, arrondis) et les composants partagés. Les apps mobile
(`Arquosdev/mobile`) et web (`Arquosdev/fiche-equipement`) le consomment.

## Les trois règles qui comptent

**1. Avant d'écrire un composant, lire `dist/catalog.json`.** Il liste tous les
composants existants avec leur rôle et leurs mots-clés. Si le besoin y figure déjà,
réutiliser — ne pas réécrire une variante locale.

**2. Avant de créer un composant, chercher chez shadcn/ui.** Voir la section
« Partir de shadcn » plus bas. Un composant écrit de zéro là où shadcn en a un est
du travail perdu, et un comportement clavier de moins.

**3. Ne jamais écrire une valeur de design en dur.** Pas de `#0D5AB7`, pas de
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

**Toujours dans cet ordre.**

1. **Chercher dans `dist/catalog.json`.** Le besoin y figure peut-être déjà.
2. **Chercher chez shadcn/ui** — voir ci-dessous. C'est la règle posée par Thomas.
3. Copier `components/_TEMPLATE.spec.md` vers `components/<nom>/<nom>.spec.md`, le remplir.
4. Écrire les implémentations des plateformes déclarées dans l'en-tête.
5. `npm run catalog` — régénère `dist/catalog.json` et `components/README.md`.

La CI refuse une plateforme déclarée sans implémentation, ou un catalogue non régénéré.

## Partir de shadcn

Le dépôt est configuré pour le CLI shadcn (`components.json`, alias `@/`) :

```bash
npx shadcn@latest add <composant>
```

Il écrit dans `components/ui/` et résout `cn` vers `components/_lib/cn`. Déplacer
ensuite le fichier dans `components/<nom>/<nom>.web.tsx`, l'habiller aux tokens, et
lui écrire sa fiche.

**Ce qu'on garde de shadcn, systématiquement :**

- **Les noms de variantes et de tailles** — `default`, `secondary`, `outline`,
  `ghost`, `destructive`, `link` ; `default`, `sm`, `lg`, `icon`. C'est ce qui permet
  de coller un extrait de leur documentation sans le retoucher.
- **La composition** plutôt que les props de configuration : `Card` + `CardHeader` +
  `CardContent`, pas `<Card titre=… />`.
- **Les primitives Radix** qu'il embarque, pour tout ce qui touche au clavier et aux
  lecteurs d'écran : modale, menu, infobulle, sélecteur, accordéon.

**Ce qu'on change :** les couleurs, qui viennent des tokens. `tokens.tailwind.css`
traduit le vocabulaire shadcn (`--primary`, `--secondary`, `--ring`…) vers les tokens
Arquos, **une seule fois**. Ne jamais redéfinir ces variables dans une app.

**Ce qu'on ajoute :** les variantes que shadcn n'a pas et que le métier réclame —
`success` et `warning` sur `Badge`, par exemple. Étendre la `cva`, ne pas forker.

**Quand shadcn n'a rien :** `FieldRow`, `PhotoTile`, `Gauge`, `StatTile`, `NavList`,
`DataTable` sont écrits de zéro — ils portent le métier ascenseur, pas une mécanique
générique. Le dire dans la fiche du composant, pour que le suivant ne cherche pas.

## Un piège à connaître : les classes `text-*`

Tailwind utilise le préfixe `text-` pour **deux choses** : la taille et la
couleur. `tailwind-merge`, qui dédoublonne les classes dans `cn()`, ne connaît
pas nos noms — sans configuration il range `text-small` et `text-text-on-dark`
dans le même groupe et ne garde que le dernier. La couleur disparaît, en
silence : on obtient du texte sombre sur un fond foncé.

`components/_lib/cn.ts` lui déclare donc la liste de nos tailles, dérivée de
`src/typography.ts`. Rien à faire pour ajouter un préréglage : il est repris
automatiquement. Mais **ne pas remplacer `cn()` par un simple `clsx`** dans un
composant, ce serait rouvrir le trou.

## À ne pas faire

- Éditer `dist/` ou `components/README.md` à la main — le prochain build écrase tout.
- Référencer `palette.blue[500]` dans du code applicatif — utiliser `colors.primary`.
- Ajouter une valeur intermédiaire à une échelle « parce qu'il manque 2px ».
- Créer un composant sans avoir cherché dans `dist/catalog.json` d'abord.
