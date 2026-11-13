---
name: Creation
status: beta
layer: generique
role: Redonne le bouton de création de l'en-tête là où l'on regarde ce qui manque, dans l'état vide et en fin de tableau.
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
- en fin de tableau, la ligne « + » de `RecordTable` et `SectionTable` (`onAdd`,
  `addLabel`, Louis, 13/11/2026, façon Airtable) : l'icône puis le libellé
  écrit, fine et grise. L'écran lui passe le `trigger` et le `label` de
  `useHeaderCreation`.

Rien ne se câble écran par écran. `PageHeader` et l'en-tête de fiche marquent
leur zone de boutons (`data-actions-en-tete`). Le doublon y lit le bouton dont
le libellé CRÉE (`LIBELLE_DE_CREATION`) et le déclenche. C'est le même geste,
avec son panneau et ses droits, et non une seconde porte qui pourrait diverger.

## Quand l'utiliser

- Rarement à la main : `EmptyState` pose `CreationButton` quand on ne lui donne
  pas d'action.
- **En fin de tableau, la ligne « + » de `RecordTable`**, pas `AddRow`
  (Louis, 13/11/2026) : `onAdd={creation.trigger}` et `addLabel`. `AddRow`,
  la ligne « + Nouveau … » d'avant, trop grosse, est dépréciée et reste
  exportée pour ne casser aucun appelant.
- Sur une fiche, `useHeaderCreation(true, '[data-emplacement-en-tete]')` ne lit
  que l'emplacement où monte le bouton de la rubrique affichée : un tableau ne
  déclenche pas le bouton d'une autre rubrique.

Quand une zone porte PLUSIEURS gestes (la rubrique Relevés d'une affaire :
« Ajouter un relevé » et « Nouveau relevé »), **créer passe avant rattacher** :
la ligne « + » d'un tableau fait naître une ligne, comme chez Airtable, et le
rattachement reste le bouton de l'en-tête.

## Quand NE PAS l'utiliser

- **Pour une action qui ne crée pas.** Le doublon ne recopie que ce qui
  commence par « Nouveau », « Nouvelle », « Nouvel », « Ajouter », « Couvrir »,
  « Déposer », « Déclarer » ou « Noter ». Un « Exporter » reste dans l'en-tête.
- **Dans un panneau.** `CreationButton` se tait dans un `[role=dialog]` ou sous
  `[data-sans-creation]` : le bouton de la page n'y a pas de sens.
- **Pour une création propre au bloc.** Si l'état vide crée autre chose que
  l'en-tête, il prend `actionLabel` et `onAction`, pas le doublon.

## Props

| Pièce | Prop | Rôle |
| --- | --- | --- |
| `AddRow` | `className?` | Déprécié (13/11/2026) : la ligne « + » de `RecordTable` la remplace |
| `CreationButton` | `className?` | Idem, dans un état vide |
| `useHeaderCreation(enabled?, zones?)` | `boolean`, sélecteur CSS | Rend `{ label, trigger }` du bouton de création actif des zones (défaut : `[data-actions-en-tete]`), ou `null` |

Le bouton de l'en-tête se relit **au moment du clic** : React remplace ce nœud à
son gré, et un clic sur un nœud détaché ne fait rien.

## Exemples

```tsx
import { RecordTable, useHeaderCreation } from '@arquos/design-system/web';

const creation = useHeaderCreation();
<RecordTable
  rows={notes} columns={colonnes} rowKey={(n) => n.id} identity={identite}
  onAdd={creation?.trigger} addLabel={creation?.label}
/>
```

## Accessibilité

Deux boutons portent le même nom, celui de l'en-tête et son doublon (le texte de
l'un, l'`aria-label` de la ligne « + ») : c'est voulu, ils font la même chose. Un test qui vise le bouton par son nom prend le premier,
celui de l'en-tête, qui le précède dans le document.
