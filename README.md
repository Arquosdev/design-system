# @arquos/design-system

**Un design system pensé pour les agents.**
Les règles d'usage vivent dans le dépôt, pas dans les têtes.

Source de vérité unique du design Arquos : couleurs, typographie, espacements,
arrondis, icônes, et les composants partagés.

| | |
| --- | --- |
| 🤖 **Tu es un agent ?** | [`CLAUDE.md`](CLAUDE.md) — les règles, en dense |
| 👀 **Tu veux le regarder ?** | [**La vitrine**](https://arquosdev.github.io/design-system/) — Prise en main → Fondations → Composants → Patterns |
| 🧭 **Tu ne connais pas les noms ?** | [**Par où commencer**](https://arquosdev.github.io/design-system/?path=/story/prise-en-main-par-o%C3%B9-commencer--chercher) — chercher par ce qu'on veut *faire* |
| 🚚 **Tu montes une app ?** | [`MIGRATION.md`](MIGRATION.md) — ce que la bascule coûtera |
| 📱 **Web et mobile ?** | [`CONVERGENCE.md`](CONVERGENCE.md) — ce qui converge, ce qui diverge |

## Ce que « pensé pour les agents » veut dire

Vérifiable, fichier par fichier :

- **Chaque token porte sa description** dans `dist/tokens.json` — à quoi il sert,
  pas seulement sa valeur.
- **Chaque composant a une fiche** avec une section **« Quand NE PAS
  l'utiliser »**. C'est elle qui évite les détournements : l'implémentation ne
  dit jamais dans quels cas elle est le mauvais choix.
- **Le catalogue est lisible par une machine** (`dist/catalog.json`) : un agent
  répond à « existe-t-il déjà un composant pour ça ? » en lisant un fichier.
- **La CI refuse le drift** — voir plus bas.
- **La vitrine ne duplique rien** : elle affiche les fiches et les tokens tels
  qu'ils sont dans le dépôt.

## Deux couches, pas cinq niveaux

Pas d'atomic design : classer par taille répond à une question que personne ne se
pose en travaillant. Chaque fiche déclare sa **couche** :

- **Générique** — une mécanique que n'importe quelle application aurait.
- **Métier** — elle porte l'ascenseur : son vocabulaire, ses états, ses règles.

Le doute se tranche ainsi : *une application de comptabilité en voudrait-elle
telle quelle ?*

## Contenu

Les tokens s'écrivent **une fois** en TypeScript (`src/`) et se lisent dans
**quatre formats** (`dist/`, généré).

| Source | |
| --- | --- |
| `colors.ts` | `palette` (rampes 50-800), `core`, `colors` (sémantiques) |
| `typography.ts` | tailles, graisses, interlignes, préréglages |
| `spacing.ts` · `radius.ts` | échelle base 4 · arrondis |
| `elevation.ts` | `shadow` (CSS) et `shadowNative` (React Native) |
| `icons.ts` | `iconSize`, `iconWeight`, `icones` — le vocabulaire Phosphor |
| `motion.ts` · `layers.ts` · `border.ts` | durées et courbe · empilement · épaisseurs de bordure |

| Généré | Pour qui |
| --- | --- |
| `tokens.tailwind.css` | Le web sous Tailwind v4 — `@theme` + compatibilité shadcn |
| `tokens.css` | Le web sans Tailwind — variables `var(--arq-*)` |
| `tokens.json` | Les agents et les outils — [W3C Design Tokens](https://tr.designtokens.org/format/), descriptions incluses |
| `catalog.json` | Les agents — l'index des composants |

`dist/` est régénéré par `npm run build` et **committé**.

## Installer

```json
{ "dependencies": { "@arquos/design-system": "github:Arquosdev/design-system#v1.28.0" } }
```

Épingler un tag, jamais `#main`. Éviter `v1.15.0` et `v1.18.0`, qui pointent à
côté.

```ts
import { colors, spacing, radius, typography } from '@arquos/design-system';
```

Côté web, trois lignes de CSS puis les composants :

```css
@import 'tailwindcss';
@import '@arquos/design-system/tokens.tailwind.css';
@source '../../node_modules/@arquos/design-system';
```

```tsx
import { Button, FieldRow, EmptyState } from '@arquos/design-system/web';
```

La troisième ligne CSS n'est pas facultative : sans elle, Tailwind ne cherche pas
les classes dans le paquet et la page sort nue.

Les icônes demandent `@phosphor-icons/react` (web) ou `phosphor-react-native`
(mobile).

**La page [Installer](https://arquosdev.github.io/design-system/?path=/docs/prise-en-main-installer--docs)** de la vitrine dit le reste : le développement
local, le sans-Tailwind, les pièges de cache.

## Ce que la CI refuse

| Contrôle | Ce qu'il attrape |
| --- | --- |
| `tsc --noEmit` | une erreur de typage |
| `check-version` | un numéro de version déjà publié sous un tag |
| `build-tokens --check` | un `dist/` non régénéré |
| `build-catalog --check` | une plateforme sans implémentation, un chemin de `remplace` cassé |
| `check-contraste` | une paire texte/fond illisible, une palette brute |
| `npm test` | une règle métier cassée |
| `check-contraste-rendu` | un texte illisible **au rendu** — il mesure le fond réellement peint |

Le dernier voit ce que le statique ne peut pas : fond sur le parent, opacité,
couleur posée par une animation. Il a trouvé 92 textes illisibles le jour de son
écriture.

## Faire évoluer

1. Modifier `src/`
2. `npm run build`
3. Prendre un numéro de version **libre**
4. Committer `src/` et `dist/` ensemble, puis `git tag vX.Y.Z && git push --tags`

## Bonnes pratiques

- ✅ Les tokens sémantiques (`colors.primary`), pas les valeurs brutes
- ✅ Un token manquant s'ajoute **ici**, pas dans l'app
- ❌ Pas de token dérivé au call site (`spacing.base * 1.5`)
- ❌ Pas d'édition de `dist/` à la main

## État

- **v1.31.0** (août 2026) — **Les épaisseurs de bordure deviennent des tokens.** `border-[1.5px]` était écrit à la main douze fois, dont six dans la fiche.
- **v1.30.0** (août 2026) — **Tous les tokens** : la table de référence, 90 entrées avec leurs trois façons de se nommer — TypeScript, classe Tailwind, variable CSS.
- **v1.29.0** (août 2026) — Le logo et le favicon Arquos dans la vitrine. Pages « Principes » et « Règles d'écran » resserrées de 40 %, sections `Anatomie` réduites à ce que le code ne dit pas.
- **v1.28.0** (août 2026) — Documentation resserrée : l'essentiel, sans les récits.
- **v1.27.0** — La vitrine change de plan : Prise en main → Fondations → Composants → Patterns, sur le modèle d'Atlassian. Quatre fondations qui manquaient, une page « Installer », l'interface habillée aux tokens.
- **v1.26.0** — 22 tests sur la logique métier, un statut de composant défini, les chemins de `remplace` vérifiés.
- **v1.24.0** — Le contraste se mesure au rendu, dans un vrai navigateur.
- **v1.23.0** — Tokens de mouvement et d'empilement.
- **v1.22.0** — `MIGRATION.md` : le registre de ce qu'une montée coûtera.
- **v1.21.0** — `textSubtle` n'est plus une couleur de texte ; plus une seule icône dessinée à la main.
- **v1.20.0** — `Skeleton`, `EmptyState`, `Banner`, `Avatar` remontés du mobile.
- **v1.18.0** — Les fondations de la convergence : `CONVERGENCE.md`, la logique métier dans `<nom>.logic.ts`.
- **v1.17.0** — Les six primitives de formulaire.
- **v1.16.0** — Les teintes d'état vont par paire ; la CI refuse une couleur illisible.
- **v1.13.0** — Phosphor devient le jeu d'icônes officiel.
- **v1.0.0** — Button, Card et Badge repris sur la base shadcn/ui.
- **v0.1.0** (juin 2026) — Version initiale : couleurs, typographie, spacing, radius.
