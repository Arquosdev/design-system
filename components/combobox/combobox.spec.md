---
name: Combobox
statut: beta
couche: generique
role: Choisir dans une liste trop longue pour être parcourue, en la filtrant.
mots_cles: [combobox, recherche, autocompletion, liste, choix, marque, modele]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — les menus de marque et de modèle]
---

# Combobox

Le motif « combobox » de shadcn — `Popover` + `Command` — empaqueté en un
composant. shadcn le donne en recette à recopier ; on en fait un composant,
parce qu'une recette recopiée à dix endroits diverge à dix endroits, et que le
seul choix qui compte à l'appel est « quelle liste, quelle valeur ».

## Quand l'utiliser

- **Au-delà de douze choix.** `Select` s'arrête là ; plus loin, faire défiler
  n'est plus choisir.
- Quand la valeur est connue de celui qui la cherche : il tape « OTIS » et la
  liste se referme sur ce qu'il veut.

## Quand NE PAS l'utiliser

- **En deçà de douze choix** → `Select`. Un champ de recherche devant quatre
  entrées est un obstacle de plus, pas un service.
- **Pour chercher dans toute la fiche** → `Command` en plein écran (⌘K). Ce
  composant choisit une valeur dans UN champ.
- **Quand la valeur peut être hors liste** — une marque qu'aucun catalogue ne
  connaît : il faut alors doubler d'une saisie libre, comme le fait `FieldRow`
  avec son entrée « Autre ».

## Le seuil

`SEUIL_RECHERCHE` vaut **12**, mesuré sur la fiche équipement le 25/08/2026 :
206 champs à menu en ont douze ou moins, les sept autres montent à 50, 114,
376. Entre les deux il n'y a personne — la frontière peut donc être franche.

## Props

| Prop          | Type                          | Défaut          | Rôle |
| ------------- | ----------------------------- | --------------- | ---- |
| `options`     | `{valeur, libelle}[]`         | —               | La liste |
| `valeur`      | `string`                      | —               | Ce qui est retenu ; hors catalogue, s'affiche tel quel |
| `onValeur`    | `(valeur: string) => void`    | —               | |
| `placeholder` | `string`                      | `— choisir —`   | Quand rien n'est retenu |
| `invite`      | `string`                      | `Rechercher…`   | Dans le champ de recherche |
| `ariaLabel`   | `string`                      | —               | Quand aucun libellé visible ne nomme la gâchette |
| `desactive`   | `boolean`                     | `false`         | |

## Anatomie

- Gâchette : mêmes traits que celle de `Select` — 28 px, arrondi
  `radius.control`, contour `colors.border` — pour qu'un champ à menu ait la
  même tête, qu'il soit court ou long
- Panneau : à la largeur de sa gâchette, 220 px au moins
- Entrée retenue : fond `palette.blue[50]`, texte `palette.blue[700]` en demi-gras
- Liste vide : « Aucun choix ne correspond. »

## États

- **Ouvert** : le focus va au champ de recherche, pas à la première entrée. On
  ouvre une liste de trois cents valeurs pour y taper, pas pour la parcourir.
- **Valeur hors catalogue** : écrite telle quelle sur la gâchette. La taire
  reviendrait à effacer à l'écran ce que la base contient.
