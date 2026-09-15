# Monter une app vers la version courante

Ce document existe parce que la stratégie est **la base d'abord, la bascule
ensuite** : on ne touche pas aux apps pendant que le design system se construit,
et on applique tout d'un coup quand il est solide.

Une bascule groupée se fait à l'aveugle si personne n'a noté, au fil de l'eau, ce
qu'elle coûtera. C'est ce que ce fichier note.

## La bonne nouvelle, mesurée

**Rien ne casse.** Vérifié tag par tag depuis la `v0.1.0` :

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
