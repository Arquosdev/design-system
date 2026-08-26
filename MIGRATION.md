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
| Valeurs de token modifiées | **0** |
| Tokens retirés | **0** |
| Exports retirés du point d'entrée web | **0** |

Tout ce qui est arrivé depuis est **additif**. Une app peut monter de treize
versions d'un coup sans qu'une ligne cesse de compiler.

Le coût de la migration n'est donc pas la rupture. C'est **l'adoption des
règles** : ce qui a été écrit depuis ne s'applique pas tout seul au code
existant, qui continue de fonctionner en restant à côté.

## Ce que chaque app aura à reprendre

Compté sur `main` de chaque dépôt, le 25/08/2026.

### `fiche-equipement` — épinglée en v1.18.0

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
| `fiche-equipement` | `v1.18.0` | 3 versions, purement additives |
| `myarquos-mobile` | `v0.1.0` | 20 versions, purement additives |

Mettre à jour se fait en une ligne dans `package.json`, puis `npm install` :

```json
"@arquos/design-system": "github:Arquosdev/design-system#v1.21.0"
```

> Ne pas épingler `v1.15.0` ni `v1.18.0` : ces deux tags pointent à côté de
> `main` — voir l'historique de `check-version.mjs`. `v1.19.0` et au-delà sont
> sains.
