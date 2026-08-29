---
name: RecordTable
status: beta
layer: generique
role: Parcourir une collection d'enregistrements, en comparer quelques attributs, en sélectionner plusieurs et en ouvrir un.
keywords: [liste, listing, tableau, collection, sélection, tri, colonnes, équipements, affaires, relevés]
platforms: [web]
replaces:
  web:
    - web/components/liste/table-liste.tsx
  mobile: []
---

# RecordTable

## Quand l'utiliser

- Une liste d'objets métier qu'on parcourt pour en ouvrir un : les équipements
  d'un parc, les affaires d'une agence, les relevés d'une semaine.
- Quand plusieurs objets se traitent ensemble : cocher six équipements pour
  lancer une campagne de relevés.

C'est le composant de onze écrans d'Arquos. Les listes se ressemblent parce
qu'elles font le même travail, et un utilisateur qui a appris l'une les connaît
toutes.

## Quand NE PAS l'utiliser

- **Pour comparer des mesures d'un même objet** (les cotes d'une baie palière
  d'un niveau à l'autre) → `DataTable`. Là, la comparaison colonne par colonne
  est le sujet, et il n'y a rien à ouvrir ni à sélectionner.
- **Pour les champs d'un seul objet** → `FieldRow` dans un `Accordion`.
- **Pour naviguer entre les rubriques d'un écran** → `NavList`. Ici chaque ligne
  est un enregistrement, pas une destination.
- **Pour trois lignes sans colonnes** → une liste de liens. Un tableau à trois
  lignes promet une comparaison qui n'a pas lieu.

## Props

| Prop        | Type                                   | Défaut | Rôle                                                     |
| ----------- | -------------------------------------- | ------ | -------------------------------------------------------- |
| `rows`    | `readonly T[]`                         | —      | Les enregistrements                                       |
| `columns`  | `readonly RecordColumn<T>[]`          | —      | Les colonnes défilantes, dans l'ordre                     |
| `rowKey`     | `(row: T) => string`                 | —      | L'identifiant stable d'une ligne                          |
| `identity`  | `{ header, render, value? }`           | —      | La colonne qui nomme la ligne ; elle reste visible        |
| `onOpen`  | `(row: T) => void`                   | —      | Sans lui, l'identité ne devient pas cliquable             |
| `selection` | `{ values, onChange, name, plural?, feminine? }` | — | Sans elle, pas de colonne de cases. `feminine` accorde le décompte : « 3 affaires sélectionnées » |
| `sort`       | `{ state, onChange }`                   | —      | Sans lui, les en-têtes ne sont pas cliquables             |
| `empty`      | `ReactNode`                            | —      | Ce qui remplace le tableau quand il n'y a aucune ligne    |

`RecordColumn<T>` : `{ id, header, render, value?, width?, numeric?, sortable? }`.
`render` produit la cellule ; `value` dit sur quoi trier quand ce n'est pas ce
qui s'affiche — une pastille « Parc » se trie sur le texte, pas sur le nœud.

## Exemples

```tsx
import { RecordTable, type SortState } from '@arquos/design-system/web';

const [sort, setTri] = React.useState<SortState | null>(null);
const [chosen, setChosen] = React.useState<Set<string>>(new Set());

<RecordTable
  rows={equipements}
  rowKey={(e) => e.id}
  identity={{ header: "N° d'équipement", render: (e) => e.numero, value: (e) => e.numero }}
  onOpen={(e) => router.push(`/equipements/${e.id}`)}
  selection={{ values: chosen, onChange: setChosen, name: 'équipement' }}
  sort={{ state: sort, onChange: setTri }}
  columns={[
    { id: 'type', header: 'Type', render: (e) => e.type },
    { id: 'annee', header: 'Année', numeric: true, render: (e) => e.annee ?? 'Non renseigné', value: (e) => e.annee },
  ]}
/>
```

## Logique partagée

`record-table.logic.ts` porte les mots et les règles :

- **« sélectionnés », jamais « retenus »** — « retenu » dit un choix arbitré,
  alors qu'il ne s'agit que de cases cochées. Un test l'interdit.
- **Le tri fait trois pas** : croissant, décroissant, plus de tri. Le troisième
  compte : sans lui, on ne peut plus revenir à l'ordre d'origine, qui porte
  souvent un sens (l'ordre d'import, l'ordre de saisie).
- **Une valeur absente part en fin de liste dans les deux sens.** Trier par
  année croissante pour trouver les appareils les plus anciens ne doit pas
  ramener d'abord ceux dont l'année n'est pas renseignée.

## Anatomie

- En-tête : `colors.bgSubtle`, `typography.caption` en `bold`, en **majuscules**
  avec `.5px` d'interlettrage, `colors.textMuted`. Les capitales font la
  différence de nature entre le nom d'une colonne et une valeur : sur vingt-cinq
  lignes de texte à la même graisse, l'œil ne retrouve plus la ligne d'en-tête.
- En-tête collé en haut (`sticky top-0`) : le tableau défile, ses en-têtes non.
  Sans cela on lit une valeur sans savoir de quelle colonne elle vient dès la
  dixième ligne.
- Ligne : fond `colors.bg`, séparateur `colors.borderSoft`, survol `colors.bgMuted`
- Ligne cochée : `colors.infoBg` — la même teinte que la barre d'actions qu'elle
  alimente, pour qu'on voie d'où vient le décompte
- Cellule : `spacing.md` horizontal, `10px` vertical
- Case à cocher : colonne de `40px`, dont `spacing.xl` de marge à gauche ; la
  colonne d'identité se cale donc à `left: 40px` quand elle se fige
- Dernière colonne : `spacing.xl` à droite, pour que la valeur ne touche pas le
  bord de l'écran
- Identité : `colors.primary`, en `semibold`
- Colonne numérique : alignée à droite, chiffres à chasse fixe — sans quoi les
  nombres dansent d'une ligne à l'autre

Le tableau utilise `border-separate` et porte ses traits sur les cellules, non
sur les lignes : en `border-collapse`, une cellule figée perd sa bordure au
défilement.

## États

- **Aucune ligne** : passer un `EmptyState` en `empty`. Un tableau vide avec ses
  en-têtes laisse croire à un filtre mal réglé plutôt qu'à une liste vide.
- **Beaucoup de colonnes** : le tableau défile horizontalement, la page jamais.
  La case et l'identité restent en place — sans cela, on ne sait plus ce qui est
  coché ni de quelle ligne on lit les valeurs. C'est le cas normal ici : les
  équipements offrent vingt-quatre colonnes, les affaires dix-neuf.
- **Beaucoup de lignes** : ce composant ne pagine pas. La pagination appartient
  à l'écran, qui seul sait combien d'éléments existent au-delà de ceux chargés.
- **Sélection en cours** : le décompte est annoncé aux lecteurs d'écran par une
  région `aria-live`. La barre d'actions visible appartient à l'écran.

## Accessibilité

Un vrai `<table>` avec `<th scope="col">`, et `aria-sort` sur la colonne triée :
c'est ce qui permet d'annoncer « Année, trié par ordre croissant ».

Chaque case porte un `aria-label` qui nomme sa ligne, sans quoi un lecteur
d'écran annonce vingt-cinq cases identiques. La case d'en-tête dit ce qu'elle
fera : « Tout sélectionner » ou « Tout désélectionner ».

Le tri se déclenche par un vrai bouton dans l'en-tête, donc atteignable au
clavier. La flèche de sens est décorative : c'est `aria-sort` qui porte
l'information.
