---
name: RecordLayout
status: beta
layer: metier
role: Poser la fiche d'un objet — deux colonnes, chacune avec son propre défilement.
keywords: [fiche, gabarit, rail, rubriques, deux colonnes, defilement, sommaire]
platforms: [web]
replaces:
  web:
    - stories — « Un écran entier / Fiche d'équipement », markup recopié dans l'app
---

# RecordLayout

La mise en page d'une fiche : un rail de rubriques à gauche, la zone lue à
droite, et chacun son défilement.

Elle vivait dans une story, donc en markup d'histoire. La première fiche l'a
recopiée, les neuf suivantes ont recopié la copie, et les dimensions en dur — la
largeur du rail, la hauteur du bouton de recherche — se retrouvaient à deux
endroits sans qu'on sache lequel faisait foi.

## Quand l'utiliser

- La page d'UN enregistrement, quand il porte assez de rubriques pour qu'un
  sommaire vaille mieux qu'un défilement.
- Dès sept rubriques : c'est là que des onglets horizontaux cassent, et le rail
  en tient quinze.

## Quand NE PAS l'utiliser

- **Pour une liste d'enregistrements** → `RecordTable`. Le gabarit pose UN
  objet ; la liste en pose mille.
- **Pour un objet à trois rubriques** → les poser à la suite. Un sommaire de
  trois entrées coûte une colonne et n'épargne rien.
- **Pour un formulaire** → `Drawer` ou `Sheet`. On remplit un formulaire d'un
  bout à l'autre ; on ne le parcourt pas.

## Ce que le composant tient, et que l'hôte n'a pas à savoir

- **Le mono-zone.** La page ne défile pas ; le rail et la zone défilent chacun
  de leur côté. Sans cela les rubriques disparaissent dès qu'on descend, et on
  ne sait plus où l'on est.
- **La largeur du rail**, partagée avec son squelette. Écrite deux fois, la
  fiche sautait de seize pixels au moment où le menu arrivait.
- **La zone est un `div`, pas un `main`.** Le shell porte déjà ce repère, et
  deux `main` imbriqués sont une faute que les lecteurs d'écran signalent.

## Les pièces

| Composant | Rôle |
| --- | --- |
| `RecordLayout` | Le cadre des deux colonnes |
| `RecordRail` | La colonne de gauche : recherche, bascule, rubriques |
| `RecordRailSkeleton` | Le rail pendant le chargement |
| `RecordZone` | La zone lue, avec son défilement |

## Props

`RecordRail` :

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | Ce que ce menu parcourt |
| `recherche` | `{ label, onOuvrir }` | — | Absente = pas de bouton |
| `onglets` | `{ ariaLabel, value, onChange, segments }` | — | Deux familles de rubriques |
| `items` | `NavItem[]` | — | Les rubriques et leurs compteurs |
| `current` | `string` | — | Celle qui est ouverte |
| `onChoose` | `(id) => void` | — | En choisir une |

## Exemples

```tsx
<RecordLayout className="min-h-0 flex-1">
  <RecordRail
    ariaLabel="Sections de la fiche"
    recherche={{ label: 'Rechercher un champ', onOuvrir: ouvrirRecherche }}
    items={rubriques}
    current={courante}
    onChoose={setRubrique}
  />
  <RecordZone>{contenu}</RecordZone>
</RecordLayout>
```

L'en-tête n'en fait pas partie : le fil d'Ariane d'une fiche sort de la
déclaration de son objet, qui appartient à l'application.
