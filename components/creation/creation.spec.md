---
name: Creation
status: beta
layer: generique
role: Redonne le bouton de création de l'en-tête là où l'on regarde ce qui manque, dans l'état vide et sous un tableau.
keywords: [création, nouveau, ajouter, ligne d'ajout, état vide, doublon, AddRow, CreationButton]
platforms: [web]
replaces:
  web: []
---

# Creation

`AddRow`, `CreationButton`, `useHeaderCreation` et `LIBELLE_DE_CREATION`.

Le bouton de création reste en haut à droite de l'en-tête, et **le même geste**
se retrouve dans le corps de la page (Louis, 12/11/2026, d'après ClickUp, Notion
et Linear) :

- dans l'état vide, un bouton contour « + Nouvelle note » ;
- en dernière ligne d'un tableau, une ligne discrète « + Nouvelle note ».

Rien ne se câble écran par écran. `PageHeader` et l'en-tête de fiche marquent
leur zone de boutons (`data-actions-en-tete`). Le doublon y lit le bouton dont
le libellé CRÉE (`LIBELLE_DE_CREATION`) et le déclenche. C'est le même geste,
avec son panneau et ses droits, et non une seconde porte qui pourrait diverger.

## Quand l'utiliser

- Rarement à la main : `EmptyState` pose `CreationButton` quand on ne lui donne
  pas d'action, et `SectionTable` pose `AddRow` sous ses lignes.
- Un tableau écrit sans `SectionTable` qui accepte des créations : poser
  `<AddRow />` juste après lui.

## Quand NE PAS l'utiliser

- **Pour une action qui ne crée pas.** Le doublon ne recopie que ce qui
  commence par « Nouveau », « Nouvelle », « Nouvel », « Ajouter », « Déposer »,
  « Déclarer » ou « Noter ». Un « Exporter » reste dans l'en-tête.
- **Dans un panneau.** `CreationButton` se tait dans un `[role=dialog]` ou sous
  `[data-sans-creation]` : le bouton de la page n'y a pas de sens.
- **Pour une création propre au bloc.** Si l'état vide crée autre chose que
  l'en-tête, il prend `actionLabel` et `onAction`, pas le doublon.

## Props

| Pièce | Prop | Rôle |
| --- | --- | --- |
| `AddRow` | `className?` | Retouche de mise en page ; la ligne ne paraît pas sans bouton de création dans l'en-tête |
| `CreationButton` | `className?` | Idem, dans un état vide |
| `useHeaderCreation(enabled?)` | `boolean` | Rend `{ label, trigger }` du bouton d'en-tête actif, ou `null` |

Le bouton de l'en-tête se relit **au moment du clic** : React remplace ce nœud à
son gré, et un clic sur un nœud détaché ne fait rien.

## Exemples

```tsx
import { AddRow, RecordTable } from '@arquos/design-system/web';

<RecordTable rows={notes} columns={colonnes} rowKey={(n) => n.id} />
<AddRow />
```

## Accessibilité

Deux boutons portent le même nom, celui de l'en-tête et son doublon : c'est voulu,
ils font la même chose. Un test qui vise le bouton par son nom prend le premier,
celui de l'en-tête, qui le précède dans le document.
