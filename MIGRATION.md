# Monter une app vers la version courante

## v2.12.0 — un bouton non cliquable le dit, et peut dire pourquoi

**Rien à changer** : `disabled` fait ce qu'il faisait. Ce qui s'ouvre est une
autre façon d'être indisponible, `inactive`, à prendre partout où une raison
existe.

Louis, le 01/09/2026, sur le bouton « Nouvel équipement » d'une liste sans
agence choisie : « il me paraît bizarre dans le format, on dirait que c'est un
bouton qui est cliquable. Est-ce qu'il ne faudrait pas un état de bouton non
cliquable […] en grisé ».

**Deux défauts, et le second ne se voyait pas.**

`disabled` pose `pointer-events-none` : le bouton ne reçoit ni survol ni focus,
donc il ne peut PAS porter d'infobulle ni ouvrir de `Popover`. La seule façon
d'apprendre pourquoi le geste est impossible était de le tenter — et il ne se
passait rien.

Et `opacity-50` gardait la couleur de la variante. Mesuré au rendu, dans Chrome :
libellé blanc sur du bleu fondu, **2,34 pour 1** ; libellé d'un `outline` fondu
sur blanc, **2,06**. Deux fois sous le seuil de 4,5 — et invisibles des deux
contrôles du dépôt, ce qui explique que personne ne l'ait vu : le lecteur de
classes ne sait pas fondre une opacité, et **axe exempte du contraste tout ce qui
porte `disabled` ou `aria-disabled`**.

**Ce que fait `inactive`.**

```tsx
// La raison en infobulle, quand le bouton est seul.
<Button inactive inactiveReason="Choisissez une agence pour créer un équipement">
  Nouvel équipement
</Button>

// La raison déjà écrite à l'écran : pas d'`inactiveReason`, elle serait lue deux fois.
<Button inactive>Nouveau client</Button>
```

- `aria-disabled` et non `disabled` : le bouton reste dans l'ordre de tabulation,
  reçoit le survol, et peut donc déclencher un `Popover` d'explication ;
- le clic est avalé par le composant — un `onClick` posé dessus ne part pas, et
  l'appelant n'a rien à se rappeler ;
- une plaque grise pleine, **la même pour les six variantes**. C'est ce que Louis
  demande : un bouton indisponible doit cesser de ressembler à la variante qu'il
  était, sinon il continue de promettre son geste.

`IconButton` porte le même état, avec la même surface. Son infobulle devient
« nom — raison » : le nom reste devant, sans texte visible la raison seule
laisserait chercher de quel bouton il s'agit.

**Deux jetons neufs**, `inactiveBg` (gris 100) et `onInactiveBg` (gris 600) —
`bg-inactive-bg` et `text-on-inactive-bg`. Mesurés : **5,99 pour 1**.

**Et un contrôle de plus, parce que la mesure manquait.**
`scripts/check-contraste.mjs` apparie maintenant les couples de jetons À LA
SOURCE — `successBg`/`onSuccessBg`, `infoBg`/`onInfoBg`, `inactiveBg`/
`onInactiveBg`… — et non plus seulement ce qu'une chaîne de classes écrit d'un
bloc. C'est le seul endroit d'où l'état inactif est visible : le rendu ne l'est
pas, axe l'exempte.

L'exception de `onInfoBg` — l'encre de l'état sélectionné vaut `primary`, voulu
par Louis le 31/08/2026 — est mesurée par ce contrôle, pas défaite : 5,56, au-
dessus du seuil.

**À prendre côté `web`** : `components/create-without-agency.tsx` passe de
`<Button variant="outline" disabled>` à `<Button inactive>`. La phrase visible
reste, sans `inactiveReason`. La bascule se fait avec le reste des apps, pas
avant.

## v2.10.3 — un bouton se reconnaît

**Rien à changer.** `Button` porte `data-arq="button"`, ce qui permet à un test
de dire si un bouton vient d'ici ou s'il a été redessiné à la main.

Écrit après un vert trompeur : un test comparait la hauteur, le rayon et le
corps de deux boutons pour vérifier qu'ils étaient les mêmes, et un bouton
recopié à la main passait, ses valeurs étant tirées des mêmes tokens. Il
divergeait pourtant dès qu'on le survolait ou le désactivait, états qu'une
mesure statique ne prend pas.

## v2.10.2 — quand une largeur est réglée, c'est la colonne qui décide

**Rien à changer**, et une app qui monte y gagne : le texte d'une cellule suit
enfin la largeur de sa colonne.

`RecordTable` enveloppe le contenu d'une cellule dans une boîte à points de
suite dès qu'une largeur est réglée, et cette boîte suivait bien la colonne. Le
rendu de cellule, lui, gardait le plafond qu'il se donne pour l'autre état —
celui où le tableau est en mise en page automatique et où, sans plafond, une
valeur très longue étirerait la colonne. Résultat : le texte se coupait au même
endroit à toute largeur. Mesuré sur une liste d'équipements, colonne portée à
566 pixels : l'enveloppe suivait à 542, le texte restait borné à 240, avec trois
cents pixels de blanc derrière lui.

L'enveloppe ramène maintenant son contenu à sa propre largeur. Le plafond du
rendu garde donc son rôle en mise en page automatique, et cesse de commander dès
qu'une colonne a une largeur à elle.

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
