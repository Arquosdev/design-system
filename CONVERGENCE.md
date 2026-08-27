# Web et mobile : ce qui converge, ce qui diverge

Ce document existe parce que le dépôt promettait un design system « partagé par
les apps mobile et web » sans dire ce que « partagé » voulait dire. Un
développeur mobile qui lisait le `README` cherchait des composants qui
n'existaient pas.

## L'état réel, mesuré

| | Web | Mobile |
| --- | --- | --- |
| Composants dans ce dépôt | 27 | **0** |
| Composants dans l'app | — | 51, chez elle |
| Tokens | depuis ce dépôt | depuis ce dépôt |

Le mobile reçoit les **tokens**, et rien d'autre. Ce n'est pas un oubli : le web
avait l'urgence, et construire deux fois coûte cher. Mais il fallait l'écrire.

## Où l'on va

**Un seul design system. Des tokens partagés comme source unique. Deux
bibliothèques de composants distinctes**, `.web.tsx` et `.native.tsx`, qui
gardent **les mêmes noms**.

Trois choses convergent, et une troisième n'avait nulle part où vivre jusqu'ici :

| Ce qui converge | Où ça vit |
| --- | --- |
| Les valeurs — couleurs, typo, espacements, arrondis, icônes | `src/*.ts` |
| Les **noms** — de composants comme de props | l'en-tête de chaque fiche |
| La **logique métier** — le vocabulaire et les règles | `<name>.logic.ts` |

Ce qui diverge, et qui a le droit de diverger : **les interactions, la densité,
la navigation**. Un design system mobile qui copie les motifs web donne une app
qui sent le web. Un panneau latéral arrive par la droite en 460 px sur un écran ;
son équivalent mobile monte du bas avec une poignée. Même rôle, même nom, gestes
différents.

**La nuance qui compte** : « les mêmes props » ne tient pas jusqu'au bout. Si les
interactions divergent, les props qui les décrivent divergent avec elles —
`onClick` contre `onPress`, des crans de hauteur qui n'existent que sur mobile.
La règle exacte est donc :

> Mêmes noms toujours. Mêmes props quand le sens le permet. **Toute divergence
> est écrite dans la fiche** — une divergence non documentée est un bug, pas une
> liberté.

## La logique métier, enfin chez elle

Un fichier `<name>.logic.ts` à côté des implémentations, qui **n'importe pas
React**. Il porte le vocabulaire et les règles ; le rendu reste dans le fichier
de plateforme.

```
components/field-row/
  field-row.logic.ts   ← « Non renseigné », les statuts, choiceMenu()
  field-row.web.tsx    ← les classes Tailwind
  field-row.native.tsx ← les styles React Native (à venir)
```

Ce qui se gagne : `choiceMenu()` était déjà une fonction pure, enfermée dans un
fichier `.web.tsx`. Les règles deviennent lisibles et testables **sans navigateur
ni simulateur**, et « Non renseigné » ne peut plus devenir « — » d'un côté.

Ce qui va dans la logique : les mots, les seuils, les règles de décision.
Ce qui n'y va pas : les classes, les styles, tout ce qui est une couleur ou une
distance — ce sont des tokens, ils ont déjà leur maison.

## Par où l'on commence — pas par où l'on croit

Le premier mouvement va **du mobile vers le design system**, l'inverse de tout ce
qu'on a fait jusqu'ici.

Cinq concepts existent sur mobile et manquent au dépôt partagé. Pendant ce temps,
le web les a réécrits à la main — le squelette de chargement neuf fois dans la
seule fiche d'équipement.

| Depuis le mobile | État | Ce qui est passé |
| --- | --- | --- |
| `Skeleton` | ✅ v1.20.0 | La brique générique. **Les huit squelettes d'écran restent dans l'app** : ils épousent une mise en page qui n'appartient pas au design system. |
| `EmptyState` | ✅ v1.20.0 | Le composant **et sa décision** — hors-ligne ou erreur — qui passe en `empty-state.logic.ts`. |
| `Avatar` | ✅ v1.20.0 | Tel quel, aux tokens près. |
| `OfflineBanner` | ⚠️ partiellement | **Sa coque seulement**, sous le nom `Banner`. Sa plomberie — routeur, contexte de synchronisation, débounce de 1,5 s — appartient à l'app et y reste. |
| `SubmitOverlay` | ❌ non | Un voile animé pour l'envoi d'un relevé. **Aucun écran web n'en a besoin** : le porter serait construire pour personne. À reprendre le jour où un envoi long existe côté web. |

Ensuite seulement, et **composant par composant, quand le mobile en a besoin** :
porter en `.native.tsx` ce que le mobile duplique déjà. Vouloir les 27 d'un coup,
c'est des mois pour un bénéfice qui n'arrive qu'à la fin.

## La correspondance, aujourd'hui

Chaque fiche déclare dans son en-tête les fichiers mobiles que le composant
absorbe (`replaces.mobile`). **32 fichiers y sont cartographiés**, tous vérifiés
présents. `dist/catalog.json` les expose : un agent lit la correspondance sans
ouvrir un seul fichier.

Cinq composants portent déjà le même nom des deux côtés — `Button`, `Card`,
`Input`, `IconButton`, `SegmentedTabs`. Vingt autres font la même chose sous un
nom différent : `StatusPill` et `Tag` sont des `Badge`, `SearchBar` est un
`Command`, `ZoomImageOverlay` est un `PhotoViewer`, trois « Sheet » différents
sont un `Sheet`.

La convergence n'est donc pas un projet neuf : c'est la **réconciliation de
choses qui existent déjà en double**.

## La stratégie : la base d'abord, la bascule ensuite

**On ne touche pas aux apps pendant que le design system se construit.** Elles
restent sur leur version épinglée, et l'on applique toutes les mises à jour d'un
coup quand la base est solide. C'est une décision de Thomas, prise le 25/08/2026.

Ce que ça implique, et qui n'est pas gratuit : une bascule groupée se fait à
l'aveugle si personne ne note, au fil de l'eau, ce qu'elle coûtera.
**`MIGRATION.md` tient ce registre** — ce qui casse (rien, à ce jour), ce qu'il
faudra reprendre, et combien d'endroits sont concernés dans chaque app.

Toute PR qui change une règle ou une API doit l'y inscrire. Sans ça, le registre
ment au moment où l'on en a besoin.

## Ce qui reste ouvert

- **Le mobile épingle la v0.1.0** — vingt versions en arrière, mais l'écart est
  purement additif : rien n'a changé de valeur, rien n'a été retiré. La montée
  est donc sans risque le jour où on la fera.
- **Aucun composant `.native.tsx` n'existe encore.** Ce document dit où l'on va,
  pas où l'on est.
- **Les survols n'ont pas d'équivalent tactile.** Les paires sémantiques n'ont
  pas de « cran au-dessus » comme les rampes brutes en avaient ; le web s'en sort
  par la luminosité, le mobile devra trouver autre chose.
