# Monter une app vers la version courante

Ce document existe parce que la stratégie est **la base d'abord, la bascule
ensuite** : on ne touche pas aux apps pendant que le design system se construit,
et on applique tout d'un coup quand il est solide.

Une bascule groupée se fait à l'aveugle si personne n'a noté, au fil de l'eau, ce
qu'elle coûtera. C'est ce que ce fichier note.

## 2.24.0 — le site vitrine a son propre espace

`colors.night` et les quatre jetons de la 2.23.0 (`textOnNight`, `textOnNightMuted`, `textOnNightSubtle`, `deviceFrame`) quittent `colors` pour `site.color` (`src/site.ts`). En CSS, `--arq-color-night` devient `--arq-site-color-night`, et les autres `--arq-site-color-*`. Le site arquos.eu est le seul consommateur ; l'application n'a rien à changer.

## La bonne nouvelle, mesurée

**Rien ne casse.** Vérifié tag par tag depuis la `v0.1.0` :

| | Depuis v0.1.0 |
| --- | --- |
| Valeurs de token modifiées | **1** — `colors.success`, voir la règle 8 |
| Tokens retirés | **1** — `colors.night` et les jetons ajoutés en 2.23.0, déplacés dans `site.color` en 2.24.0 ; le site est leur seul consommateur |
| Exports retirés du point d'entrée web | **0** |

Tout ce qui est arrivé depuis est **additif**. Une app peut monter de treize
versions d'un coup sans qu'une ligne cesse de compiler.

Le coût de la migration n'est donc pas la rupture. C'est **l'adoption des
règles** : ce qui a été écrit depuis ne s'applique pas tout seul au code
existant, qui continue de fonctionner en restant à côté.

## Ce que chaque app aura à reprendre

Compté sur `main` de chaque dépôt, le 25/08/2026.

### `fiche-equipement` — épinglée en v1.40.0

Reprise le 14/09/2026. La colonne « restant » ne compte plus que ce qui n'a pas
de token pour l'accueillir.

| À reprendre | Au 25/08 | Restant | Pourquoi |
| --- | --- | --- | --- |
| `text-text-subtle` sur du texte | 33 | **0** | 3,14 pour 1 sur blanc, il en faut 4,5 → `text-text-muted`. Les 3 occurrences qui subsistent portent une icône, ce que la règle autorise |
| Couleurs écrites en dur | 14 | **0** | La règle du dépôt : toujours un token |
| Tailles de texte en dur | 3 | **0** | Un préréglage, jamais une valeur → `text-overline` |
| Largeurs de saisie et de panneau en dur | 6 | **0** | Les tokens `largeur` — et deux de plus en v1.40.0, `lecture` et `rail` |
| Palette brute | 0 | 0 | Déjà repris |
| Teintes d'état non appairées | 0 | 0 | Déjà repris |

Restent **40 valeurs en pixels**, toutes de la géométrie de contrôle : hauteurs
de puces, de pastilles, de champs dessinés à la main. Ce n'est pas un token qui
leur manque — le design system écrit les siennes pareil (`h-[36px]` sur
`Button`, `size-[30px]` sur `IconButton`). C'est un composant. Ces valeurs
tomberont quand la fiche cessera de dessiner ses contrôles, pas avant.

### `myarquos-mobile` — épinglée en v0.1.0

| À reprendre | Combien | Pourquoi |
| --- | --- | --- |
| `palette.grey[400]` | **54** | C'est `textSubtle` : à réserver aux icônes et bordures |
| Couleurs écrites en dur | **46** | La règle du dépôt |
| Imports directs de Phosphor | **60 fichiers** | Passer par le rôle (`icones.supprimer`), pas par le dessin |

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
`<Icon role="supprimer" />`, `icones.supprimer` côté mobile — et non par le nom
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

## `leading-none` rendait une hauteur nulle — corrigé en v1.35.0

Jusqu'à la v1.34.0, le thème Tailwind publiait `--spacing-none: 0px`. Tailwind
résout `leading-none` contre l'espace des **espacements** dès qu'une clé de ce
nom y figure : toute classe `leading-none` rendait donc `line-height: 0`.

Le composant le plus touché est **`Label`**, qui la porte : sa hauteur tombait à
zéro et son texte débordait sur ce qui était posé dessous. Invisible tant que le
libellé est *à côté* du champ — la ligne est centrée sur le champ, plus haut.
Se voit dès qu'on l'empile *au-dessus*, la forme normale d'un formulaire.
Constaté dans la fiche équipement le 11/09/2026.

`--spacing-none` n'est plus publié dans le thème Tailwind (il reste dans
`--arq-space-none` et dans l'API TypeScript). Un espace nul s'écrit `p-0`,
`gap-0` : Tailwind le fournit déjà, et aucun `*-none` d'espacement n'était
employé dans les deux apps.

**À faire pendant la bascule :** retirer les `leading-<n>` ajoutés à la main
pour contourner le défaut. `fiche-equipement` en porte trois, dans
`src/app/fiche/sections/modifier.tsx`.

## Les radios vont jusqu'à six — v1.38.0

La limite était à cinq. Les listes fermées du relevé en comptent très souvent
six : « Type ouverture porte cabine » a cinq entrées dans la maquette et six
dans le jeu d'options réel, l'articulée s'y déclinant en manuelle et
automatique. Un écran de saisie basculait donc en menu déroulant le champ même
que sa maquette montrait en radios.

**À faire pendant la bascule :** rien n'est cassé — c'est une règle, pas une
API. Un écran qui choisit son contrôle d'après le nombre d'options doit
seulement remonter son seuil de cinq à six.

## « Autre » marche aussi sur un choix multiple — v1.43.0

`FieldRow` porte un drapeau `autre` depuis longtemps : il dit qu'un jeu
d'options est OUVERT — le relevé coche l'option « Autre » et écrit le texte dans
une colonne jumelle. L'éditeur à UN choix l'honorait ; l'éditeur à CASES
l'ignorait.

Conséquence mesurée sur la fiche équipement : trois champs — type d'alimentation
générale, contrôle d'accès de la boîte à boutons cabine, contrôle d'accès de la
gâche — n'offraient aucune saisie libre, et une valeur déjà saisie par le terrain
était **invisible** dans l'éditeur, donc perdue au premier enregistrement.

L'éditeur à cases montre maintenant une pastille « Autre » qui ouvre une saisie,
et il rend la valeur libre qu'il a reçue. `partagerLeChoixMultiple` fait le
partage entre ce que le catalogue reconnaît et ce qu'il ne reconnaît pas ; une
seule valeur libre est retenue, parce que la colonne jumelle n'en porte qu'une.

Depuis la **v1.45.0**, `partagerLeChoixMultiple` distingue en plus le MOT
« Autre » — que le relevé écrit dans la colonne pour dire « il y a un texte à
côté » — de la valeur saisie elle-même. Sans cette distinction, la saisie libre
s'ouvrait préremplie avec le mot « Autre » au lieu du texte réel, qui vit dans
sa propre colonne.

`partagerLeChoixMultiple` est exportée du point d'entrée web depuis la v1.44.0 :
un écran qui écrit son propre éditeur à cases applique ainsi la MÊME règle que la
ligne de champ, au lieu d'en écrire une seconde qui finira par en diverger.

**À faire pendant la bascule :** rien n'est cassé, c'est additif. Un écran qui
sert un champ à choix multiple ouvert doit seulement penser à passer `autre`.

## Ce que le design system ne verra pas pour vous

Le contrôle de contraste n'apparie que ce qui vit dans **la même chaîne de
classes**. Un fond posé sur le parent et une couleur sur l'enfant lui échappent —
trois défauts sont passés par là en une seule journée. Pendant la bascule,
**mesurer le rendu**, pas seulement lancer le contrôle.

## Où en est chaque app

| App | Épinglée | Écart |
| --- | --- | --- |
| `fiche-equipement` | `v1.35.0` | à jour |
| `myarquos-mobile` | `v0.1.0` | 32 versions, purement additives |

Mettre à jour se fait en une ligne dans `package.json`, puis `npm install` :

```json
"@arquos/design-system": "github:Arquosdev/design-system#v1.21.0"
```

> Ne pas épingler `v1.15.0` ni `v1.18.0` : ces deux tags pointent à côté de
> `main` — voir l'historique de `check-version.mjs`. `v1.19.0` et au-delà sont
> sains.

## v2.16.0 — le site vitrine entre dans le design system (20/09/2026)

Additif, rien à reprendre dans les apps. Deux tokens et une page de vitrine :

- `colors.night` (`#04122A`), la surface de nuit du site arquos.eu. L'application ne s'en sert pas. *(Déplacé en 2.24.0 vers `site.color.night`.)*
- `fontFamilyMono` (DM Mono), pour les valeurs de données. `--arq-font-mono` en CSS, `--font-mono` sous Tailwind. L'application reste en DM Sans partout tant qu'elle n'en a pas l'usage.
- La page **Fondations → Marque et site vitrine** dit ce que le site ajoute à la charte sans la contredire : angles droits, plaques, lignes, mockups, jumeau 3D. Le code du site vit dans `Arquosdev/site`.

## v2.22.0 — l'action de la visionneuse passe sur la photo (21/09/2026)

**Rupture, un seul appelant.** `PhotoViewerAction` gagne un champ **requis** :

```diff
 action={{
   libelle: 'Agrandir',
+  icone: 'agrandir',
   onAction: (photo) => ouvrirAilleurs(photo.url),
 }}
```

Le bouton n'affiche plus son libellé : il est en icône, rond, posé dans le coin
bas-droit de la photo au lieu de l'en-tête. `libelle` reste requis — il nomme le
bouton pour les lecteurs d'écran et s'affiche en infobulle.

Le vocabulaire d'icônes gagne le rôle **`agrandir`** (`MagnifyingGlassPlus`) :
voir plus grand ce qu'on regarde déjà. La loupe et non un `+` nu, parce que le
`+` seul veut dire « ajouter » chez Arquos et qu'un dessin ne peut pas porter
les deux sens.

## v2.25.0 — la visionneuse porte plusieurs actions (22/09/2026)

**Rupture, un seul appelant.** `action` devient `actions`, au pluriel :

```diff
-action={{ libelle: 'Agrandir', icone: 'agrandir', onAction: agrandir }}
+actions={[
+  { libelle: 'Télécharger', icone: 'telecharger', onAction: telecharger },
+  { libelle: 'Ouvrir dans un nouvel onglet', icone: 'ouvrirAilleurs', onAction: ouvrir },
+]}
```

Les boutons se posent en rangée dans le coin bas-droit de la photo, ancrés à
droite : ajouter une action ne déplace pas les précédentes. Trois au plus — la
fiche du composant dit pourquoi le menu ne gagne qu'au-delà.

**Le vocabulaire d'icônes échange un rôle.** `agrandir` (`MagnifyingGlassPlus`)
disparaît — il n'avait qu'un usage, la fenêtre Bubble abandonnée le 22/09 — et
`ouvrirAilleurs` (`ArrowSquareOut`) le remplace : sortir de l'écran courant pour
voir la chose ailleurs, jamais grossir ce qu'on a déjà sous les yeux. Ajouté et
retiré en un jour, donc sans autre consommateur que la fiche équipement.

## v2.27.0 — le chevron d'une entrée dépliante va du bas vers le haut (22/09/2026)

Additif, rien à reprendre. `NavList` : le chevron d'une entrée à `enfants`
pointait vers la DROITE fermé et vers le BAS ouvert — la convention d'un chevron
de gauche, celui qui ouvre une branche d'arborescence. Posé à droite d'une ligne
il se lit comme un menu déroulant : **bas fermé, haut ouvert**. Thomas, le
22/09/2026 : « pointe vers le bas quand fermé et pointe vers le haut quand
ouvert ».

Le chevron d'un `titre` + `repliable`, lui, ne bouge pas : c'est un titre de
section, à gauche, et la convention d'arborescence y est la bonne.

La vitrine gagne la vue `EntreeDepliante` : `enfants` existait depuis la v2.18.0
sans qu'aucune story ne le montre, et c'est pour cela que ce chevron n'avait
jamais été regardé.

## v2.28.0 — toute la ligne d'une entrée dépliante referme (22/09/2026)

Additif, rien à reprendre. `NavList` : la ligne d'une entrée à `enfants` ne
basculait que si elle portait la PASTILLE. Depuis la v2.26.0, un enfant qui
porte la clé de sa mère éteint celle-ci tant que le groupe est ouvert — la ligne
ne refermait donc plus jamais. Thomas, le 22/09/2026 : « je dois pouvoir fermer
la rubrique photo en cliquant sur toute la zone de photos ».

La bascule se décide désormais sur « est-on DANS le groupe ? » — la rubrique
mère ou l'une de ses sections — et non sur la pastille. Dehors, la ligne mène,
même si le groupe était resté ouvert derrière soi.

## v2.30.0 — les choix multiples se reconnaissent, quelle que soit la forme reçue (22/09/2026)

Additif, rien à reprendre. `partagerLeChoixMultiple` reconnaissait une valeur
donnée par son LIBELLÉ mais la rendait telle quelle. L'appelant comparait
ensuite à `o.value` : sur un jeu où valeur et libellé diffèrent, aucune pastille
ne s'allumait dans l'éditeur en ligne, alors que la fiche montre le champ
renseigné. Les **neuf** champs à choix multiples de la fiche équipement étaient
dans ce cas, « type de came » compris.

`connues` sort désormais en **valeur de menu**. Reconnaître une valeur et la
rendre sous le nom du menu sont la même opération ; les séparer laissait à
chaque appelant le soin de la refaire.

Le choix UNIQUE en ligne ne bougeait pas : il passe par `menuDeChoix`, qui
traduisait déjà.

## v2.31.0 — la carte et l'accordéon posent la même barre (22/09/2026)

Additif. `CardHeader` passait `bg-muted` (#F6F7F9) là où le déclencheur
d'`Accordion` pose `bg-bg-subtle` (#FCFDFE). Les deux encadrent les mêmes blocs
dans un même écran, et deux gris à quelques pixels l'un de l'autre se lisent
comme un défaut. La carte prend la teinte de l'accordéon — c'est elle que la
fiche équipement emploie partout ailleurs, en-têtes de tableau compris.
