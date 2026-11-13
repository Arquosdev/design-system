---
name: SectionTable
status: beta
layer: generique
role: Montrer la collection d'une rubrique de fiche, titrée et comptée, dans le tableau d'un bord à l'autre de la zone.
keywords: [tableau, rubrique, fiche, collection, contrats, états, relevés, équipements, écarts, sous-tableau]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# SectionTable

## Quand l'utiliser

- **Toute rubrique de fiche qui montre des lignes** : les Contrats d'un client,
  les États des composants d'un équipement, les Relevés d'une affaire, les
  Écarts d'un équipement.
- Quand les lignes se corrigent en place : les cellules restent celles de
  `RecordTable`, on y met ce qu'on veut (une étiquette qui ouvre un menu, une
  valeur à pointillés).

C'est **le** tableau des fiches (Thomas, 09/11/2026 : « on utilise toujours ce
tableau »). Il porte d'un coup ce qui se réglait rubrique par rubrique et
finissait par différer :

| Règle | Ce que le composant fait |
| --- | --- |
| Le titre dit combien | `title` puis `count` en gris (défaut : `rows.length`) |
| Le tableau touche les bords | retrait de côté sur le titre et le pied, pas sur le tableau |
| Un seul filet | au-dessus du tableau ; pas en dessous |
| Densité des listes | jamais `compact` : la prop n'existe pas ici |
| Une icône par en-tête | `icon` **obligatoire** sur `identity` et sur chaque colonne |

## Quand NE PAS l'utiliser

- **Pour l'écran d'une liste** (Équipements, Affaires, la liste d'un module) →
  `RecordTable` dans l'écran de liste, avec sa barre d'outils, ses filtres et sa
  sélection. `SectionTable` n'a ni barre d'outils de liste, ni pagination.
- **Pour les champs d'un seul objet** → `FieldRow`.
- **Pour comparer des mesures** (cotes d'un niveau à l'autre) → `DataTable`.
- **Pour trois éléments sans attributs** → une liste à filets. Un tableau à une
  colonne promet une comparaison qui n'a pas lieu.

## Props

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `title` | `string` | — | Le nom de la rubrique |
| `count` | `number` | `rows.length` | Le total, pas les lignes rendues |
| `description` | `ReactNode` | — | Une phrase sous le titre |
| `actions` | `ReactNode` | — | À droite du titre (sous lui sur un téléphone) |
| `rows` | `readonly T[]` | — | Les lignes |
| `rowKey` | `(row) => string` | — | La clé d'une ligne |
| `identity` | `{ header, icon, render, value?, label? }` | — | La colonne d'identité, icône comprise |
| `columns` | `SectionColumn<T>[]` | — | `RecordColumn` dont `icon` est obligatoire ; une colonne sans en-tête (les gestes d'une ligne) n'en montre pas |
| `onOpen` | `(row) => void` | — | Ouvre l'enregistrement ; absent, l'identité n'est pas un lien |
| `empty` | `ReactNode` | — | À la place du tableau quand il est vide |
| `footer` | `ReactNode` | — | Sous le tableau : « 25 sur 300 · Voir tout » |
| `sort` | voir `RecordTable` | — | Trier par un clic sur l'en-tête ; l'état appartient à l'écran |
| `selection` | voir `RecordTable` | — | Cocher des lignes pour agir dessus : un devis sur des écarts |
| `toolbar` | `ReactNode` | — | Entre le titre et le tableau : puces de filtre, bandeau |
| `detail` | `(row) => ReactNode` | — | Le détail d'une ligne, déplié sous elle par un chevron ; `null` = pas de détail |
| `group` | `(row) => string` | — | Une bande avant chaque groupe (lignes déjà rangées) : l'année |
| `activeKey` | `string \| null` | — | La ligne choisie : fond d'information, filet bleu à gauche |
| `headingLevel` | `2 \| 3` | `2` | `3` sous une sous-rubrique déjà titrée |
| `onAdd` | `() => void` | — | La ligne « + » discrète en fin de tableau, façon Airtable : le geste de création de l'en-tête de la fiche (voir `RecordTable`) |
| `addLabel` | `string` | — | Son nom : `aria-label` et info-bulle (« Nouvelle note », « Ajouter un relevé ») |

Les icônes de nature viennent du vocabulaire : `fieldText` (texte),
`fieldNumber` (nombre, montant, année), `fieldDate`, `fieldChoice` (une valeur
d'une liste, un état), `fieldYesNo` (oui ou non), `fieldPerson`, `fieldPlace`,
`fieldLink`, `fieldGauge`.

## Exemples

```tsx
import { EmptyState, SectionTable } from '@arquos/design-system/web';

<SectionTable
  title="Contrats"
  rows={contrats}
  rowKey={(c) => c.id}
  identity={{ header: 'Contrat', icon: 'fieldText', render: (c) => c.numero }}
  columns={[
    { id: 'formule', header: 'Formule', icon: 'fieldChoice', render: (c) => c.formule },
    { id: 'debut', header: 'Date d’effet', icon: 'fieldDate', render: (c) => c.debut },
  ]}
  onOpen={(c) => ouvrir(c.id)}
  empty={<EmptyState density="section" icon="contract" title="Aucun contrat" />}
/>
```

## Accessibilité

- Le titre est un vrai titre (`h2`, ou `h3`), et son compte en fait partie :
  un lecteur d'écran entend « Contrats 4 ».
- Le reste est celui de `RecordTable` : en-têtes de colonnes, identité en lien
  quand `onOpen` est donné, carte par ligne sous 640 px.

## Sur mobile

Sous 640 px, chaque ligne devient une carte (comportement de `RecordTable`) :
marquer `phone: true` les deux colonnes qui doivent rester visibles.
