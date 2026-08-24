# @arquos/design-system

Source de vérité unique pour le **design d'Arquos** : couleurs, typographie, espacements, arrondis. Importé par l'app mobile (`Arquosdev/mobile`) et le module web (`Arquosdev/fiche-equipement`).

> 🤖 **Tu es un agent ?** Lis [`CLAUDE.md`](CLAUDE.md) — il dit quoi importer et comment choisir un token.

## Pourquoi ce repo existe

Avoir UN seul endroit pour les valeurs de design garantit que :
- **Le mobile et le web restent visuellement cohérents** (impossible que le bleu d'un côté drifte par rapport à l'autre)
- **Les changements sont triviaux** : changer la couleur d'accent = modifier 1 ligne dans `colors.ts`, bumper la version, mettre à jour la dépendance dans les apps
- **Le design est versionné** comme du code

## Contenu

Les tokens s'écrivent **une fois** en TypeScript (`src/`) et se lisent dans **quatre formats** (`dist/`, généré) — pour que chaque consommateur, humain ou machine, ait le sien.

| Source (`src/`) | Tokens |
|---|---|
| `colors.ts` | `palette` (ramps 50-800), `core` (4 brand), `colors` (aliases sémantiques) |
| `typography.ts` | `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `typography` (presets) |
| `spacing.ts` | Échelle base-4 de `none` à `5xl` |
| `radius.ts` | Arrondis de `none` à `full` (pill) |

| Généré (`dist/`) | Pour qui |
|---|---|
| `tokens.tailwind.css` | Les apps web sous Tailwind v4 — bloc `@theme` + compatibilité shadcn/ui |
| `tokens.css` | Le web sans Tailwind — variables `var(--arq-color-primary)` + classes `.arq-text-body` |
| `tokens.json` | Les agents et les outils design — format [W3C Design Tokens](https://tr.designtokens.org/format/), descriptions incluses |
| `catalog.json` | Les agents — l'index des composants, à lire avant d'en écrire un |

`dist/` est régénéré par `npm run build` et **committé**. La CI (`npm run check`) refuse toute PR où il a divergé de `src/`.

## Comment l'utiliser dans une app

### Installation
Dans le `package.json` de l'app qui consomme (mobile, web…) :

```json
{
  "dependencies": {
    "@arquos/design-system": "github:Arquosdev/design-system#main"
  }
}
```

Puis `npm install`.

> **Pour figer la version** : remplacer `#main` par `#v0.1.0` (un tag git). Pratique pour ne pas être surpris par une mise à jour cassante.

### Import
```ts
import { colors, spacing, radius, typography } from '@arquos/design-system';

const styles = {
  card: {
    backgroundColor: colors.bg,
    padding: spacing.base,           // 16
    borderRadius: radius.md,         // 8
    borderColor: colors.border,
  },
  title: typography.title,           // { fontSize: 20, fontWeight: '600', ... }
};
```

### Ou en bloc
```ts
import { tokens } from '@arquos/design-system';
// tokens.colors, tokens.spacing, tokens.typography…
```

### Côté web (React + Tailwind v4)

```css
/* dans le CSS de l'app */
@import 'tailwindcss';
@import '@arquos/design-system/tokens.tailwind.css';
@source '../../node_modules/@arquos/design-system';
```
```tsx
import { Button, Accordion, FieldRow } from '@arquos/design-system/web';

<Button variant="soft">Compléter</Button>
```

Les tokens deviennent des classes utilitaires : `bg-primary`, `p-base`,
`rounded-md`, `text-title`, `shadow-card`. Les composants shadcn/ui fonctionnent
tels quels — leur vocabulaire (`--primary`, `--ring`, `--radius`) est traduit
vers les tokens Arquos dans la feuille générée.

> **En développement local** : si l'app référence le design system en
> `file:../design-system`, ajouter `install-links=true` au `.npmrc` de l'app.
> Sinon npm crée un lien symbolique, et Turbopack refuse un import CSS qui sort
> de la racine du projet.

### Côté web (CSS sans Tailwind)
Charger la feuille une fois, puis référencer les variables :

```html
<link rel="stylesheet" href="/path/vers/tokens.css">
```
```css
.carte {
  background: var(--arq-color-bg);
  padding: var(--arq-space-base);      /* 16px */
  border-radius: var(--arq-radius-md); /* 8px */
  border: 1px solid var(--arq-color-border);
}
```
```html
<h2 class="arq-text-title">Titre de section</h2>
```

## Faire évoluer le design system

1. **Modifier un token** = modifier le fichier correspondant dans `src/`
2. **Régénérer** : `npm run build` — met à jour tout le contenu de `dist/`
3. **Bumper la version** dans `package.json` (semver : 0.1.X pour fixes, 0.X.0 pour ajouts, X.0.0 pour breaking changes)
4. **Committer `src/` et `dist/` ensemble**, puis tag git : `git tag v0.X.0 && git push --tags`
5. **Mettre à jour les apps** : changer `#vX.Y.Z` dans leur `package.json`, puis `npm install`

## Bonnes pratiques

- ✅ Préférer les **tokens sémantiques** (`colors.primary`, `spacing.base`) aux valeurs brutes (`palette.blue[500]`, `16`)
- ✅ Si une nouvelle taille ou couleur est nécessaire, **l'ajouter ici** plutôt que la hardcoder dans l'app
- ❌ **Ne pas faire dériver** un token côté app (ex : `spacing.base * 1.5`) — créer un nouveau token nommé à la place
- ❌ **Ne pas éditer `dist/` à la main** — le prochain `npm run build` écrase tout

## État

- **v0.2.0** (août 2026) — tokens générés en CSS, thème Tailwind v4 et JSON ; catalogue de composants ; trois premiers composants web (Button, Accordion, FieldRow) ; garde-fou CI ; `CLAUDE.md` pour les agents.
- **v0.1.0** (juin 2026) — version initiale : couleurs (depuis `mobile/lib/theme/colors.ts`), typographie/spacing/radius extraits de l'usage réel du repo mobile.
