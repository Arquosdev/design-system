---
name: Combobox
statut: beta
couche: generique
role: Choisir dans une liste trop longue pour être parcourue, en la filtrant.
mots_cles: [combobox, recherche, autocompletion, liste, choix, marque, modele]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — les menus de marque et de modèle]
  mobile: [components/EntityPickerField.tsx]
---

# Combobox

**Un seul champ**, où l'on tape, et la liste qui se resserre dessous.

La première version en avait deux : une gâchette qu'on ouvrait, puis une barre
de recherche qui apparaissait dedans. Deux gestes et deux boîtes pour choisir un
mot — et la barre, empruntée à la palette ⌘K, était deux fois plus haute que le
champ qui l'avait ouverte. C'est la forme que shadcn a fini par retenir aussi :
chez eux `ComboboxInput` EST le champ.

L'entrée se fait sur la primitive `cmdk` plutôt que sur notre `CommandInput`,
qui habille la palette plein écran et porte sa hauteur.

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
  avec son entrée « Autre ».Entre les deux il n'y a personne — la frontière peut donc être franche.

## Props

| Prop          | Type                          | Défaut          | Rôle |
| ------------- | ----------------------------- | --------------- | ---- |
| `options`     | `{valeur, libelle}[]`         | —               | La liste |
| `valeur`      | `string`                      | —               | Ce qui est retenu ; hors catalogue, s'affiche tel quel |
| `onValeur`    | `(valeur: string) => void`    | —               | |
| `placeholder` | `string`                      | `Rechercher…`   | Quand rien n'est retenu |
| `autoFocus`   | `boolean`                     | `false`         | Le champ prend le focus dès qu'il paraît |
| `ariaLabel`   | `string`                      | —               | Quand aucun libellé visible ne nomme la gâchette |
| `desactive`   | `boolean`                     | `false`         | |

## Anatomie

- Champ : mêmes traits que la gâchette de `Select`, au pixel — 32 px, arrondi `radius.control`, contour `colors.border`, ombre `shadow.card`, retrait `spacing.md` — pour qu'un champ à menu ait la même tête, court ou long
- Liste : à la largeur du champ, 220 px au moins, **240 px de haut au plus** — celle de la palette monte à 400, ce qui couvre un écran de fiche

## États

- **Au repos** : le champ montre la valeur retenue, comme un menu fermé.
- **Ouvert** : la frappe remplace l'affichage, et le focus ne quitte jamais le
  champ — la liste se resserre pendant qu'on tape. Ouvrir n'efface rien : tant
  qu'on n'a pas tapé, la valeur d'avant reste écrite.
- **Échap** : referme et rend la valeur d'avant.
- **Valeur hors catalogue** : écrite telle quelle. La taire reviendrait à
  effacer à l'écran ce que la base contient.
