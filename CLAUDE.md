# Design system Arquos — pour les agents

Source de vérité unique du design : tokens et composants partagés. Consommé par
`Arquosdev/mobile` et `Arquosdev/fiche-equipement`.

## Les cinq règles

1. **Chercher dans `dist/catalog.json` avant d'écrire un composant.** Le rôle
   cherché y figure peut-être.
2. **Chercher chez shadcn/ui avant d'en créer un.** Voir « Partir de shadcn ».
3. **Jamais une valeur de design en dur.** Ni `#0D5AB7`, ni `16px`, ni `z-50`,
   ni `duration-200`. Toujours un token.
4. **Jamais la palette brute dans un composant.** `colors.primary`, pas
   `palette.blue[500]`. La CI le refuse.
5. **Ne pas mettre les apps à jour.** Elles restent sur leur version le temps
   que la base se construise ; la bascule se fera d'un coup. Toute PR qui change
   une règle ou une API s'inscrit dans `MIGRATION.md`.

Si le token ou le composant manque : ne pas l'inventer dans l'app, l'ajouter ici.

## Choisir un token

| | |
| --- | --- |
| Couleur | `colors.*` — jamais `palette.*` |
| Espacement | base 4 ; `base` (16) par défaut, `sm` (8) entre proches |
| Arrondi | `md` (8) ; `full` seulement sur un carré |
| Typographie | les préréglages (`typography.body`), jamais recombiner |
| Icône | un **rôle** (`<Icon role="supprimer" />`), jamais un dessin |
| Empilement | `z-(--arq-layer-flottant)`, jamais `z-50` |
| Durée | `duration-(--arq-duration-normal)`, jamais `duration-200` |

Chaque token porte une description dans `dist/tokens.json` : la lire plutôt que
deviner d'après le nom.

**Trois pièges de couleur.**

- `textSubtle` **n'est pas une couleur de texte** (3,14 sur blanc). Icônes,
  chevrons, bordures. Pour un texte discret : `textMuted` (5,34).
- **Les teintes d'état vont par paire** : `bg-success-bg` avec
  `text-on-success-bg`. Jamais `text-success` dessus (2,77). Idem `danger`,
  `warning`, `info`.
- **Ne jamais ajouter de taille de police.** L'échelle est calibrée sur l'usage.

**Empilement — la règle qui tient l'échelle** : un élément flottant passe
au-dessus de la surface qui l'a ouvert. Toute surface pouvant contenir un menu se
place donc sous `flottant`.

| | | |
| --- | --- | --- |
| `panneau` | 50 | panneau latéral, tiroir |
| `flottant` | 60 | menu, sélecteur, infobulle |
| `plein-ecran` | 70 | visionneuse, palette |
| `notification` | 80 | ce qui reste visible quoi qu'il arrive |

## Modifier un token

1. Éditer `src/<fichier>.ts`
2. `npm run build` — régénère `dist/`
3. Prendre un **numéro de version libre** (la CI refuse un numéro déjà taggé)
4. Committer `src/` et `dist/` ensemble

## Saisir une valeur : quel composant

| La valeur… | Prendre |
| --- | --- |
| se tape, courte | `Input` |
| se rédige, longue | `Textarea` |
| se choisit parmi 2 à 5 visibles | `RadioGroup` |
| parmi 6 à 20 | `Select` |
| au-delà de 20 | `Combobox` |
| vraie/fausse, validée plus tard | `Checkbox` |
| vraie/fausse, **appliquée aussitôt** | `Switch` |
| **déjà affichée dans une fiche** | `FieldRow` |

`Checkbox` et `Switch` ne sont pas interchangeables : la case attend un
« Enregistrer », l'interrupteur s'applique en basculant.

## Anatomie d'un composant

| Fichier | Contenu |
| --- | --- |
| `<nom>.spec.md` | La fiche : rôle, **quand NE PAS l'utiliser**, props, états, accessibilité |
| `<nom>.logic.ts` | Le métier sans React : vocabulaire, seuils, règles |
| `<nom>.web.tsx` | Implémentation web |
| `<nom>.native.tsx` | Implémentation React Native |

**Lire la fiche avant l'implémentation** : elle seule dit quand le composant est
le mauvais choix.

**Le métier ne s'écrit pas dans une implémentation.** Un mot, un seuil, une règle
vont dans `<nom>.logic.ts` — testable sans navigateur. Les classes et styles
restent côté plateforme. Voir `CONVERGENCE.md`.

### Ajouter un composant

1. Chercher dans `dist/catalog.json`
2. Chercher chez shadcn/ui
3. Copier `components/_TEMPLATE.spec.md`, le remplir, déclarer sa `couche`
4. Écrire les implémentations des plateformes déclarées
5. Écrire sa story : `stories/<couche>/<nom>.stories.tsx`, titrée
   `Composants/<Couche>/<Nom>`
6. Tester la logique si elle existe : `<nom>.logic.test.ts`
7. `npm run catalog`

### Statut

| | |
| --- | --- |
| `stable` | API arrêtée. La changer passe par `MIGRATION.md`. |
| `beta` | L'API peut bouger. **État par défaut d'un composant neuf.** |
| `déprécié` | La fiche dit par quoi le remplacer. |

**Passer à `stable` demande les deux** : consommé en production, ET API stable
depuis deux versions. Ne pas promouvoir par confort.

### Les deux couches

- **`generique`** — une mécanique que n'importe quelle application aurait. Vient
  de shadcn/Radix, ou pourrait.
- **`metier`** — porte l'ascenseur : son vocabulaire, ses états, ses règles.

Le doute se tranche ainsi : **une application de comptabilité en voudrait-elle
telle quelle ?** Oui → `generique`.

Ce n'est pas de l'atomic design, et c'est délibéré : classer par taille répond à
une question que personne ne se pose en travaillant.

## Partir de shadcn

```bash
npx shadcn@latest add <composant>
```

Écrit dans `components/ui/`. Déplacer vers `components/<nom>/<nom>.web.tsx`,
habiller aux tokens, écrire la fiche.

**Garder** : les noms de variantes et de tailles (`default`, `secondary`,
`outline`, `ghost`, `destructive`, `link` ; `default`, `sm`, `lg`, `icon`), la
composition plutôt que les props de configuration, les primitives Radix.

**Changer** : les couleurs, qui viennent des tokens. `tokens.tailwind.css`
traduit leur vocabulaire une seule fois — ne jamais le redéfinir dans une app.

**Ajouter** : les variantes que le métier réclame. Étendre la `cva`, pas forker.

**Remplacer les icônes Lucide par le vocabulaire Phosphor.**

## Ce que la CI refuse

`npm run check` : types, numéro de version, dérivés non régénérés, catalogue
périmé, chemins de `remplace` cassés, paire de couleurs illisible, palette brute,
tests. Puis `npm run vitrine` et `npm run contraste-rendu`, qui mesure le
contraste dans un vrai navigateur.

**Deux contrôles de contraste, et il faut savoir lequel voit quoi.**
`contraste` lit les classes — rapide, mais n'apparie que ce qui vit dans la même
chaîne. `contraste-rendu` mesure le rendu et voit ce que l'autre ne peut pas :
fond sur le parent, opacité, couleur posée par une animation.

## La vitrine

<https://arquosdev.github.io/design-system/> · en local `npm run storybook`

| Section | Contenu |
| --- | --- |
| **Prise en main** | Introduction, Installer, Par où commencer |
| **Fondations** | Les règles de décision d'abord, les styles ensuite |
| **Composants** | Générique, puis Métier |
| **Patterns** | Le système assemblé dans un écran réel |

Elle ne duplique rien : les pages lisent `components/<nom>/<nom>.spec.md` et
`dist/tokens.json`.

Un agent cherche dans `dist/catalog.json` ; la page « Par où commencer » offre la
même recherche aux humains.

## Un piège : les classes `text-*`

Tailwind emploie `text-` pour la taille **et** la couleur. `tailwind-merge` ne
connaît pas nos noms : sans configuration il range `text-small` et
`text-text-on-dark` dans le même groupe et ne garde que le dernier — la couleur
disparaît en silence.

`components/_lib/cn.ts` lui déclare nos tailles. **Ne jamais remplacer `cn()` par
`clsx`** dans un composant.

## À ne pas faire

- Éditer `dist/` ou `components/README.md` à la main
- Ajouter une valeur intermédiaire à une échelle « parce qu'il manque 2 px »
- Écrire de la documentation dans une story : elle vit dans la fiche
- Mettre les apps à jour
