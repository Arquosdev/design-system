---
name: RecordTable
statut: beta
couche: generique
role: Parcourir une collection d'enregistrements, en comparer quelques attributs, en sélectionner plusieurs et en ouvrir un.
mots_cles: [liste, listing, tableau, collection, sélection, tri, colonnes, équipements, affaires, relevés]
plateformes: [web]
remplace:
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
| `lignes`    | `readonly T[]`                         | —      | Les enregistrements                                       |
| `colonnes`  | `readonly ColonneRecord<T>[]`          | —      | Les colonnes défilantes, dans l'ordre                     |
| `cleDe`     | `(ligne: T) => string`                 | —      | L'identifiant stable d'une ligne                          |
| `identite`  | `{ entete, rendu, valeur? }`           | —      | La colonne qui nomme la ligne ; elle reste visible        |
| `onOuvrir`  | `(ligne: T) => void`                   | —      | Sans lui, l'identité ne devient pas cliquable             |
| `selection` | `{ valeurs, onChange, nom, pluriel? }` | —      | Sans elle, pas de colonne de cases                        |
| `tri`       | `{ etat, onChange }`                   | —      | Sans lui, les en-têtes ne sont pas cliquables             |
| `vide`      | `ReactNode`                            | —      | Ce qui remplace le tableau quand il n'y a aucune ligne    |

`ColonneRecord<T>` : `{ cle, entete, rendu, valeur?, largeur?, numerique?, triable? }`.
`rendu` produit la cellule ; `valeur` dit sur quoi trier quand ce n'est pas ce
qui s'affiche — une pastille « Parc » se trie sur le texte, pas sur le nœud.

## Exemples

```tsx
import { RecordTable, type EtatTri } from '@arquos/design-system/web';

const [tri, setTri] = React.useState<EtatTri | null>(null);
const [choisis, setChoisis] = React.useState<Set<string>>(new Set());

<RecordTable
  lignes={equipements}
  cleDe={(e) => e.id}
  identite={{ entete: "N° d'équipement", rendu: (e) => e.numero, valeur: (e) => e.numero }}
  onOuvrir={(e) => router.push(`/equipements/${e.id}`)}
  selection={{ valeurs: choisis, onChange: setChoisis, nom: 'équipement' }}
  tri={{ etat: tri, onChange: setTri }}
  colonnes={[
    { cle: 'type', entete: 'Type', rendu: (e) => e.type },
    { cle: 'annee', entete: 'Année', numerique: true, rendu: (e) => e.annee ?? 'Non renseigné', valeur: (e) => e.annee },
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

- En-tête : `colors.bgSubtle`, `typography.small` en `medium`, `colors.textMuted`
- Ligne : fond `colors.bg`, séparateur `colors.borderSoft`, survol `colors.bgMuted`
- Ligne cochée : `colors.infoBg` — la même teinte que la barre d'actions qu'elle
  alimente, pour qu'on voie d'où vient le décompte
- Cellule : `spacing.md` horizontal, `spacing.sm` vertical
- Identité : `colors.primary`, en `medium`
- Colonne numérique : alignée à droite, chiffres à chasse fixe — sans quoi les
  nombres dansent d'une ligne à l'autre

## États

- **Aucune ligne** : passer un `EmptyState` en `vide`. Un tableau vide avec ses
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
