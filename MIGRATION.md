# Monter une app vers la version courante

## v2.10.1 — la case à cocher est au milieu de sa ligne

**Rien à changer** : c'est une correction d'affichage dans `RecordTable`.

La case était posée en élément EN LIGNE, donc sur la ligne de base du texte de
sa cellule et non au milieu de celle-ci. Mesuré sur une liste de trente et un
mille appareils : centre de la ligne à 241 pixels, centre de la case à 238. Trois
pixels qu'on ne voit pas sur une ligne et qu'on voit sur vingt-cinq.

Le pixel qui reste après correction est la bordure basse de la ligne, comptée
dans sa boîte mais pas dans la zone où son contenu se centre. Le supprimer
demanderait de décaler la case vers le bas, c'est-à-dire de la décentrer.

## v2.10.0 — `Command` a deux tailles

**Celle-ci ne casse rien** : `size` vaut `default` si on ne la pose pas, et
`default` est exactement ce que ces pièces faisaient jusqu'ici. Rien à changer
dans une app qui monte.

Ce qui s'ouvre : `<Command size="sm">` habille un menu au lieu d'une palette.
Entrée de trente-six pixels au lieu de cinquante-deux, texte courant au lieu du
sous-titre, retraits de douze au lieu de seize, liste bornée à deux cent
quarante au lieu de quatre cents. La taille descend aux pièces par un contexte :
on la pose sur `Command`, pas sur chacune.

**À prendre dès que ces pièces vivent dans un `PopoverContent`.** À la taille
par défaut, l'invite de recherche se coupe dans une boîte de deux cent
quatre-vingts pixels et dix lignes remplissent l'écran. `Combobox` avait déjà
rencontré ce mur et l'avait contourné en s'adressant directement à `cmdk` ; ce
contournement peut maintenant se remplacer par la taille déclarée.

## v2.0.0 — l'API passe à l'anglais

**Celle-ci casse.** C'est la première, et elle est délibérée : jusqu'à la
`v1.32.1` l'API était en français (`lignes`, `colonnes`, `entete`, `rendu`)
au-dessus d'une base de données en anglais, ce qui obligeait à traduire à chaque
frontière. Voir `web/docs/decisions/0003-anglais-pour-le-code-francais-pour-l-ecran.md`.

La règle est désormais : **anglais pour ce qu'une machine lit** (props, types,
exports, rôles d'icônes, clés de métadonnées), **français pour ce qui se lit
comme de la prose** (libellés affichés, commentaires, specs, noms de stories).

### Qui doit bouger, et quand

| App | Épingle | Effet |
| --- | --- | --- |
| `web` | `file:../design-system` | migrée en même temps que ce changement |
| `fiche-equipement` | `github:…#v1.18.0` | **rien ne bouge** tant que l'épingle ne change pas |
| `mobile` | `github:…#v0.1.0` | **rien ne bouge** |
| `back-office` | `github:…#main` | déclare la dépendance sans l'utiliser : sans effet |

Aucune app en production ne casse aujourd'hui. Le coût est reporté au jour où
`fiche-equipement` (17 fichiers) et `mobile` (1 fichier) changeront d'épingle.

### Table de correspondance

| Avant | Après |
| --- | --- |
| `lignes` · `colonnes` · `ligne` | `rows` · `columns` · `row` |
| `cleDe` · `cle` | `rowKey` · `id` |
| `identite` · `entete` · `rendu` | `identity` · `header` · `render` |
| `valeur` · `valeurs` | `value` · `values` |
| `largeur` · `numerique` · `triable` | `width` · `numeric` · `sortable` |
| `tri` · `etat` · `sens` | `sort` · `state` · `direction` |
| `'croissant'` · `'decroissant'` | `'asc'` · `'desc'` |
| `onOuvrir` · `onChanger` · `onChoisir` | `onOpen` · `onChange` · `onChoose` |
| `nom` · `pluriel` · `libelle` | `name` · `plural` · `label` |
| `ton` · `titre` · `compteur` · `taille` | `tone` · `title` · `count` · `size` |
| `vide` · `actif` · `icone` | `empty` · `active` · `icon` |
| `ColonneRecord` · `EtatTri` · `SensTri` | `RecordColumn` · `SortState` · `SortDirection` |
| `libelleSelection` · `libellePagination` | `selectionLabel` · `paginationLabel` |
| `triSuivant` · `comparer` | `nextSort` · `compare` |
| `EmptyStateErreur` | `EmptyStateError` |
| `BannerTon` · `ToastTon` · `ToastContexte` | `BannerTone` · `ToastTone` · `ToastContext` |
| `FieldStatut` · `FieldSauvegarde` | `FieldStatus` · `FieldSave` |
| `'renseigne'` · `'manquant'` · `'a_verifier'` | `'filled'` · `'missing'` · `'to_check'` |
| `icones` et ses rôles (`supprimer`, `ecart`…) | `icons` (`delete`, `discrepancy`…) |
| front-matter `statut` · `couche` · `mots_cles` | `status` · `layer` · `keywords` |

Les **libellés affichés restent en français** : `NOT_TAKEN` vaut toujours
« Non prise », et les noms de stories (« Avec son intitulé », « Dans la fiche »)
n'ont pas bougé.


Ce document existe parce que la stratégie est **la base d'abord, la bascule
ensuite** : on ne touche pas aux apps pendant que le design system se construit,
et on applique tout d'un coup quand il est solide.

Une bascule groupée se fait à l'aveugle si personne n'a noté, au fil de l'eau, ce
qu'elle coûtera. C'est ce que ce fichier note.

## Jusqu'à la v1.32.1 : rien ne cassait

Vérifié tag par tag depuis la `v0.1.0`, et toujours vrai **entre ces versions** :

| | Depuis v0.1.0 |
| --- | --- |
| Valeurs de token modifiées | **1** — `colors.success`, voir la règle 8 |
| Tokens retirés | **0** |
| Exports retirés du point d'entrée web | **0** |

Tout ce qui est arrivé depuis est **additif**. Une app peut monter de treize
versions d'un coup sans qu'une ligne cesse de compiler.

Le coût de la migration n'est donc pas la rupture. C'est **l'adoption des
règles** : ce qui a été écrit depuis ne s'applique pas tout seul au code
existant, qui continue de fonctionner en restant à côté.

## Ce que chaque app aura à reprendre

Compté sur `main` de chaque dépôt, le 25/08/2026.

### `specFile-equipement` — épinglée en v1.18.0

| À reprendre | Combien | Pourquoi |
| --- | --- | --- |
| `text-text-subtle` sur du texte | **33** | 3,14 pour 1 sur blanc, il en faut 4,5 → `text-text-muted` |
| Couleurs écrites en dur | **14** | La règle du dépôt : toujours un token |
| Palette brute | 0 | Déjà repris |
| Teintes d'état non appairées | 0 | Déjà repris |

### `myarquos-mobile` — épinglée en v0.1.0

| À reprendre | Combien | Pourquoi |
| --- | --- | --- |
| `palette.grey[400]` | **54** | C'est `textSubtle` : à réserver aux icônes et bordures |
| Couleurs écrites en dur | **46** | La règle du dépôt |
| Imports directs de Phosphor | **60 fichiers** | Passer par le rôle (`icons.delete`), pas par le dessin |

Le mobile ne consomme que les **tokens** — aucun composant. Sa montée de version
est donc sans risque : elle lui ouvre `shadow`, `shadowNative`, `fontFamilyNative`
et le vocabulaire d'icônes, qui lui étaient invisibles.

## Les règles à adopter, par ordre d'importance

**1. Les teintes d'état vont par paire.** `bg-success-bg` avec
`text-on-success-bg`, jamais avec `text-success` (2,77 pour 1). Idem pour
`danger`, `warning`, `info`.

**2. `textSubtle` n'est pas une couleur de texte.** 3,14 sur blanc — il vaut pour
une icône, un chevron, une bordure. Pour un texte discret, `textMuted` (5,34).
Les marques de réserve comptent comme du texte.

**3. Jamais la palette brute dans un composant.** `colors.primary`, pas
`palette.blue[500]`. La CI du design system le refuse chez lui ; les apps
devront suivre.

**4. Jamais une icône dessinée à la main.** Passer par le rôle —
`<Icon role="delete" />`, `icons.delete` côté mobile — et non par le nom
du dessin.

**5. Jamais une valeur de design en dur.** Ni hex, ni pixel, ni rayon.

**6. L'empilement passe par un niveau nommé.** `z-(--arq-layer-flottant)`, pas
`z-50`. Un nombre écrit à la main ne dit pas au-dessus de quoi il doit passer, et
c'est ainsi que quatre composants se sont retrouvés au même niveau.

**7. Les durées de transition sont des tokens.**
`duration-(--arq-duration-normal)`, pas `duration-200`.

**8. `colors.success` a changé de valeur** — vert 600 → vert 700
(`#17A679` → `#0C7C59`). **C'est la première et seule valeur de token modifiée
depuis la v0.1.0.** L'ancienne échouait dans ses deux rôles à 3,1 pour 1 :
illisible en texte sur blanc, illisible sous du texte blanc. Les apps n'ont rien
à faire — le vert s'assombrit tout seul — mais il faut le savoir en regardant
l'écran après la bascule.

**9. Les épaisseurs de bordure sont des tokens.**
`border-(length:--arq-border-epais)`, pas `border-[1.5px]`. La fiche l'écrit à la
main six fois.

## Un piège connu, à traiter pendant la bascule

**Les survols perdent leur cran.** Les rampes brutes permettaient de monter d'un
échelon pour un survol — `blue-100` au-dessus de `blue-50`. Les paires
sémantiques n'ont pas ce cran. Le web s'en sort à la luminosité
(`hover:brightness-95`), qui ne dépend d'aucune teinte nommée.

Le mobile n'a pas de survol, mais il a des états pressés : la question s'y posera
autrement.

## Ce que le design system ne verra pas pour vous

Le contrôle de contraste n'apparie que ce qui vit dans **la même chaîne de
classes**. Un fond posé sur le parent et une couleur sur l'enfant lui échappent —
trois défauts sont passés par là en une seule journée. Pendant la bascule,
**mesurer le rendu**, pas seulement lancer le contrôle.

## Où en est chaque app

| App | Épinglée | Écart |
| --- | --- | --- |
| `specFile-equipement` | `v1.18.0` | 3 versions, purement additives |
| `myarquos-mobile` | `v0.1.0` | 20 versions, purement additives |

Mettre à jour se fait en une ligne dans `package.json`, puis `npm install` :

```json
"@arquos/design-system": "github:Arquosdev/design-system#v1.21.0"
```

> Ne pas épingler `v1.15.0` ni `v1.18.0` : ces deux tags pointent à côté de
> `main` — voir l'historique de `check-version.mjs`. `v1.19.0` et au-delà sont
> sains.
