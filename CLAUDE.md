# Design system Arquos — mode d'emploi pour les agents

Ce repo est la **source de vérité unique** du design Arquos : les tokens (couleurs,
typographie, espacements, arrondis) et les composants partagés. Les apps mobile
(`Arquosdev/mobile`) et web (`Arquosdev/fiche-equipement`) le consomment.

## Avant tout : les principes de design

Quatre principes disent **comment décider**, et ils sont les mêmes pour tout le
monde — designer, développeur, agent :

1. **Au service de la tâche en cours** — l'écran sert la tâche du moment ; tout
   le reste attend qu'on la lui demande.
2. **Une friction à la mesure du risque** — autant de gestes que l'action est
   difficile à défaire.
3. **Simple pour celui qui s'en sert** — simple ne veut pas dire facile : c'est
   le système qui prend la charge.
4. **Réutiliser par défaut** — un motif déjà connu ne s'apprend pas deux fois.

Ce que ça donne appliqué aux écrans d'Arquos est réuni dans les **règles
d'écran** : sept règles nées de défauts réels du produit, à commencer par **ne
jamais montrer ce qui n'est pas**. Un « ✓ Enregistré » sur une valeur qui ne part
nulle part, un jeu de démonstration servi sur un vrai appareil, une case qu'on
coche et qui n'écrit rien : le produit a porté ces trois défauts, et chacun a
coûté une journée.

Les deux pages sont dans la vitrine. Les lire avant d'écrire un écran ; chaque
fiche de composant les décline ensuite dans sa section « Quand NE PAS
l'utiliser ».

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
La CI le vérifie désormais (`npm run contraste`) : un `bg-blue-50` dans un
composant fait échouer la PR.

**Les teintes d'état vont par paire.** Un fond teinté et l'encre qui s'y pose se
nomment ensemble, parce qu'ils se choisissent ensemble :

| Fond | Encre | Pour dire |
| --- | --- | --- |
| `bg-success-bg` | `text-on-success-bg` | conforme, validé |
| `bg-danger-bg` | `text-on-danger-bg` | bloquant, en erreur |
| `bg-warning-bg` | `text-on-warning-bg` | à confirmer, non bloquant |
| `bg-info-bg` | `text-on-info-bg` | retenu, renseigné, décidé |

Ne **jamais** poser `text-success` sur `bg-success-bg` : c'est 2,77 pour 1, et le
badge « Conforme » a vécu ainsi jusqu'au 25/08/2026. Le contrôle refuse la paire.

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

**Icônes** — le jeu officiel est **Phosphor**. Ne jamais dessiner une icône à la
main, ne jamais importer Phosphor directement dans une app : passer par le
**rôle**.

```tsx
import { Icon } from '@arquos/design-system/web';
<Icon role="supprimer" size="sm" />        // ✅
<Trash size={16} />                        // ❌ le dessin, pas le rôle
```

Les 35 rôles sont dans `src/icons.ts` (`icones`), avec les tailles (`iconSize`,
défaut `md` = 18) et les graisses (`iconWeight`). Si le rôle manque, **l'ajouter
là** — deux lignes dans `src/icons.ts`, une dans `components/icon/icon.web.tsx`.
Le contourner en important Phosphor dans l'app, c'est ce qui a fait dessiner
« rechercher » et « suivant » deux fois, différemment.

Côté mobile, `Icon` n'existe pas encore : importer le dessin depuis
`phosphor-react-native` en lisant son nom dans `icones`, et la taille dans
`iconSize`.

## Saisir une valeur : quel composant

Six primitives, et le choix se fait sur **ce que la valeur est**, pas sur son
apparence :

| La valeur… | Prendre |
| --- | --- |
| se tape, courte | `Input` |
| se rédige, longue | `Textarea` |
| se choisit parmi 2 à 5 options visibles | `RadioGroup` |
| se choisit parmi 6 à 20 | `Select` |
| se cherche au-delà de 20 | `Combobox` |
| est vraie ou fausse, validée plus tard | `Checkbox` |
| est vraie ou fausse, **appliquée aussitôt** | `Switch` |

Chaque champ prend un `Label` associé — par `htmlFor`, ou en l'enveloppant.

**Le piège** : `Checkbox` et `Switch` ne sont pas interchangeables. Une case
attend un « Enregistrer », un interrupteur s'applique en basculant. Poser un
interrupteur dans un formulaire qui se valide promet un effet immédiat qui
n'arrive pas — le produit a déjà porté ce défaut.

**Modifier une valeur déjà affichée dans une fiche ne relève d'aucune des six** :
c'est `FieldRow`, qui bascule la ligne en saisie, valide à la perte de focus et
rend la valeur d'avant sur Échap.

## Les apps ne bougent pas — mais le registre, si

Les apps (`mobile`, `fiche-equipement`) restent volontairement sur leur version
épinglée le temps que la base se construise. **Ne pas proposer de les mettre à
jour**, ni de reprendre leur code : la bascule se fera d'un coup, plus tard.

En revanche, **toute PR qui change une règle ou une API s'inscrit dans
`MIGRATION.md`** — ce qu'elle casse, ce qu'il faudra reprendre, et combien
d'endroits sont concernés. Sans ce registre, la bascule groupée se fera à
l'aveugle.

## Regarder le design system

La vitrine Storybook publie chaque composant avec **sa fiche**, et les tokens
avec leurs valeurs réelles :

    https://arquosdev.github.io/design-system/

En local : `npm run storybook`. Elle ne duplique rien — les pages lisent
`components/<nom>/<nom>.spec.md` et `dist/tokens.json`. Une documentation
recopiée à la main diverge au premier changement, et c'est alors la vitrine
qu'on croit.

**Ajouter un composant, c'est aussi lui écrire une story** dans
`stories/<couche>/<nom>.stories.tsx`. La CI construit la vitrine : une story qui
vise un composant dont les props ont changé fait échouer la PR.

## Les deux couches

Chaque fiche déclare une `couche`, et c'est ce qui range le dépôt comme la
vitrine :

- **`generique`** — une mécanique que n'importe quelle application aurait :
  bouton, modale, onglets, palette de recherche. Elle vient de shadcn/Radix, ou
  elle le pourrait. La toucher engage tout le monde.
- **`metier`** — elle porte l'ascenseur : son vocabulaire, ses états, ses
  règles. `FieldRow` sait qu'une valeur absente se dit « Non renseigné » ;
  `PhotoTile` sait qu'une photo manquante est une information.

Le doute se tranche ainsi : **une application de comptabilité en voudrait-elle
telle quelle ?** Oui → `generique`.

Ce n'est **pas** de l'atomic design, et c'est délibéré : classer par taille
(atome, molécule, organisme) répond à une question que personne ne se pose en
travaillant. Celle-ci se pose tous les jours.

## Les composants

Chaque composant vit dans `components/<nom>/` :

| Fichier | Contenu |
| --- | --- |
| `<nom>.spec.md` | La fiche : rôle, **quand ne pas l'utiliser**, props, états, accessibilité |
| `<nom>.logic.ts` | Le métier sans React : vocabulaire, seuils, règles |
| `<nom>.web.tsx` | Implémentation web |
| `<nom>.native.tsx` | Implémentation React Native |

**Le métier ne s'écrit pas dans une implémentation.** Un mot, un seuil, une règle
de décision vont dans `<nom>.logic.ts` — sans React, donc lisibles et testables
sans navigateur ni simulateur. C'est ce qui empêche « Non renseigné » de devenir
« — » sur l'autre plateforme. Les classes et les styles restent, eux, dans le
fichier de plateforme.

Où l'on va exactement — ce qui converge, ce qui a le droit de diverger, et par
quoi l'on commence — est écrit dans **`CONVERGENCE.md`**. Le lire avant de
proposer un composant natif.

**Lire la fiche avant l'implémentation.** Elle contient la section « Quand NE PAS
l'utiliser », qui est ce qui évite les détournements — l'implémentation ne le dit pas.

Web et mobile partagent **les mêmes noms de props et les mêmes valeurs**. Si tu
constates une divergence non documentée dans la fiche, c'est un bug, pas une liberté.

### Ajouter un composant

**Toujours dans cet ordre.**

1. **Chercher dans `dist/catalog.json`.** Le besoin y figure peut-être déjà.
2. **Chercher chez shadcn/ui** — voir ci-dessous. C'est la règle posée par Thomas.
3. Copier `components/_TEMPLATE.spec.md` vers `components/<nom>/<nom>.spec.md`, le remplir.
   Y déclarer sa `couche` — voir « Les deux couches » plus haut.
4. Écrire les implémentations des plateformes déclarées dans l'en-tête.
5. Écrire sa story dans `stories/<couche>/<nom>.stories.tsx`.
6. `npm run catalog` — régénère `dist/catalog.json` et `components/README.md`.

La CI refuse une plateforme déclarée sans implémentation, une couche inconnue, un
catalogue non régénéré, ou une vitrine qui ne construit plus.

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
- Écrire de la documentation dans une story : elle vit dans la fiche, que la
  story affiche. Deux textes divergent toujours.
