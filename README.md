# @arquos/design-system

Source de vérité unique pour les **tokens de design** d'Arquos : couleurs, typographie, espacements, arrondis. Importé par l'app mobile (`Arquosdev/mobile`) et le futur module web.

## Pourquoi ce repo existe

Avoir UN seul endroit pour les valeurs de design garantit que :
- **Le mobile et le web restent visuellement cohérents** (impossible que le bleu d'un côté drifte par rapport à l'autre)
- **Les changements sont triviaux** : changer la couleur d'accent = modifier 1 ligne dans `colors.ts`, bumper la version, mettre à jour la dépendance dans les apps
- **Le design est versionné** comme du code

## Contenu

| Fichier | Tokens |
|---|---|
| `src/colors.ts` | `palette` (ramps 50-800), `core` (4 brand), `colors` (aliases sémantiques) |
| `src/typography.ts` | `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `typography` (presets) |
| `src/spacing.ts` | Échelle base-4 de `none` à `5xl` |
| `src/radius.ts` | Arrondis de `none` à `full` (pill) |

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

## Faire évoluer le design system

1. **Modifier un token** = modifier le fichier correspondant dans `src/`
2. **Bumper la version** dans `package.json` (semver : 0.1.X pour fixes, 0.X.0 pour ajouts, X.0.0 pour breaking changes)
3. **Tag git** : `git tag v0.X.0 && git push --tags`
4. **Mettre à jour les apps** : changer `#vX.Y.Z` dans leur `package.json`, puis `npm install`

## Bonnes pratiques

- ✅ Préférer les **tokens sémantiques** (`colors.primary`, `spacing.base`) aux valeurs brutes (`palette.blue[500]`, `16`)
- ✅ Si une nouvelle taille ou couleur est nécessaire, **l'ajouter ici** plutôt que la hardcoder dans l'app
- ❌ **Ne pas faire dériver** un token côté app (ex : `spacing.base * 1.5`) — créer un nouveau token nommé à la place
- ❌ **Ne pas commit de composants UI** dans ce repo — il ne contient que des **tokens** (couleurs/tailles/etc.). Pour des composants partagés (Button, Card…), on créera plus tard un autre repo `@arquos/ui` selon les besoins.

## État

- **v0.1.0** (juin 2026) — version initiale : couleurs (depuis `mobile/lib/theme/colors.ts`), typographie/spacing/radius extraits de l'usage réel du repo mobile.
