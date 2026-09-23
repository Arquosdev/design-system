---
name: DataTable
status: beta
layer: metier
role: Présenter des mesures en lignes et colonnes, quand la comparaison colonne par colonne est le sujet.
keywords: [tableau, table, grille, cotes, mesures, colonnes, lignes]
platforms: [web]
replaces:
  web:
    - public/fiche/index.html — levelTables, grille recopiée inline
  mobile: [components/full-form/NiveauxTable.tsx]
---

# DataTable

## Quand l'utiliser

- Des mesures que l'on lit en les comparant : les cotes d'une baie palière d'un
  niveau à l'autre, une section de gaine.
- Quand les mêmes colonnes se répètent pour chaque ligne.

## Quand NE PAS l'utiliser

- **Pour une liste de champs d'un seul objet** → `FieldRow` dans un `Accordion`.
  Un tableau à une seule ligne n'aide personne à comparer quoi que ce soit.
- **Pour une liste d'éléments cliquables** (documents, relevés) → une liste de
  lignes. Un tableau invite à comparer des colonnes ; une liste, à ouvrir un
  élément.
- **Pour de la saisie.** Ce composant est en lecture. Un tableau éditable est un
  autre sujet, avec ses propres questions de validation et d'enregistrement.

## Props

| Prop       | Type         | Défaut | Rôle                                              |
| ---------- | ------------ | ------ | ------------------------------------------------- |
| `title`    | `string`     | —      | En-tête du tableau                                 |
| `note`     | `string`     | —      | Précision affichée à côté du titre (« cotes en mm ») |
| `columns` | `string[]`   | —      | Les en-têtes, dans l'ordre                         |
| `rows`   | `string[][]` | —      | Les valeurs. Chaque ligne suit l'ordre des colonnes |

## Exemples

```tsx
import { DataTable } from '@arquos/design-system/web';

<DataTable
  title="Baies palières"
  note="Les cotes sont en mm"
  columns={['Niveau', 'Côte B', 'Côte HSL']}
  rows={[['5', '300', '—']]}
/>
```

## Anatomie

- Cellules : `typography.small`, `colors.text` ; une valeur absente s'affiche « — » en `colors.textSubtle`
- Le tableau défile horizontalement dans sa carte, la page jamais

## États

- **Aucune ligne** : afficher la carte avec un mot qui le dit. Un tableau qui
  disparaît laisse croire que la mesure n'existe pas, au lieu qu'elle est à prendre.
- **Beaucoup de colonnes** : le tableau défile, il ne se comprime pas — des
  cotes tassées deviennent illisibles, et une cote mal lue est une cote fausse.

## Accessibilité

Un vrai `<table>` avec `<th scope="col">` : c'est ce qui permet à un lecteur
d'écran d'annoncer « Côte B, 300 » plutôt que « 300 » seul. Ne pas le remplacer
par une grille de `<div>`, même si le rendu est identique.
