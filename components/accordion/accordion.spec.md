---
name: Accordion
status: stable
layer: generique
role: Grouper des champs sous un titre pliable, pour qu'une page longue reste parcourable.
keywords: [accordeon, groupe, section, plier, deplier, replier]
platforms: [web, mobile]
replaces:
  web:
    - public/fiche/index.html — motif recopié aux lignes 411, 496, 991
  mobile:
    - components/full-form/RubriqueBlock.tsx
    - components/TechnicalDataBlock.tsx
    - components/EssentialCategoriesBlock.tsx
    - components/DiscrepanciesBlock.tsx
    - components/ComplementaryPhotosBlock.tsx
    - components/ContractBlock.tsx
    - components/InformationsBlock.tsx
---

# Accordion

## Quand l'utiliser

- Grouper les champs d'une rubrique de la fiche (« Client », « Immeuble », « Accès »).
- Quand la page contient assez de groupes pour qu'on ne puisse pas tout voir d'un coup.

## Quand NE PAS l'utiliser

- **Pour masquer une information essentielle.** Ce qui est replié est, en pratique,
  rarement lu. Une donnée dont dépend une décision reste visible.
- **Pour un seul groupe.** Un accordéon unique ajoute un clic sans rien organiser :
  utiliser `Card` directement.
- **Pour naviguer entre des vues exclusives** → des onglets, pas un accordéon.

## Props

`Accordion` (racine)

| Prop           | Type                      | Défaut  | Rôle                                        |
| -------------- | ------------------------- | ------- | ------------------------------------------- |
| `type`         | `'single' \| 'multiple'`  | —       | Un seul groupe ouvert à la fois, ou plusieurs |
| `defaultValue` | `string \| string[]`      | —       | Groupes ouverts au premier rendu (non contrôlé) |
| `value`        | `string \| string[]`      | —       | Groupes ouverts (contrôlé)                   |
| `onValueChange`| `(v) => void`             | —       | Appelé à chaque ouverture ou fermeture       |

`AccordionItem` : `value: string` (identifiant du groupe, obligatoire et unique).

`AccordionTrigger` : `titre: string`, `meta?: string` (compteur à droite du
titre), `action?: { libelle, onClick, ariaLabel? }`.

**`action` pose un raccourci au bout de la barre** — « 5 à renseigner », qui
ouvre le formulaire sur ce bloc. C'est un BOUTON À PART, pas une zone cliquable
dans celui qui déplie : il fait autre chose, et la tabulation doit l'atteindre.
Un bouton dans un bouton n'existe pas en HTML, donc la barre devient une rangée
qui porte les deux, et celui qui déplie n'occupe plus que la place qui reste.
Née le 22/09/2026 pour la fiche équipement, où le compte des champs vides d'un
bloc mène au panneau « Modifier », onglet « À renseigner ».

`AccordionTrigger` : `title: string`, `meta?: string` (compteur à droite du titre).

`AccordionContent` : le contenu du groupe.

## Exemples

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
  from '@arquos/design-system/web';

<Accordion type="multiple" defaultValue={['client']}>
  <AccordionItem value="client">
    <AccordionTrigger title="Client" meta="4 champs renseignés" />
    <AccordionContent>{/* les champs */}</AccordionContent>
  </AccordionItem>
</Accordion>
```

## États

- **Ouvert / fermé** : le chevron pivote d'un quart de tour, le contenu s'anime en hauteur.
- **Groupe vide** : afficher quand même l'en-tête, avec une méta qui le dit —
  un groupe absent laisse croire que la rubrique n'existe pas.
- **Focus clavier** : l'en-tête est atteignable au Tab, Entrée et Espace l'activent.

## Accessibilité

Radix gère `aria-expanded`, `aria-controls` et la navigation au clavier. Ne pas
remplacer l'en-tête par un `<div>` cliquable : cela supprime tout cela d'un coup.

## Mobile

**Il remplace SEPT copies du même en-tête** dans myArquos, chacune portant en
commentaire « on duplique plutôt que de factoriser ». Les sept avaient dérivé :
trois teintes de chevron, deux tailles d'icône, des compteurs tantôt en
pastille tantôt en texte.

**Une seule section par composant, et l'appelant tient l'état.** Pas de
`Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent` : le
web les sépare parce que Radix gère l'exclusivité entre groupes, alors que les
écrans de myArquos décident déjà quelle section est ouverte — la première qui
manque de champs, celle qu'une recherche a désignée. Le composant prend donc
`ouvert` et `onBasculer`.

| Prop | Rôle |
| --- | --- |
| `icone` | Un **rôle** du vocabulaire, à gauche du titre |
| `titre`, `description` | Le titre et, dessous, ce que la section contient |
| `meta`, `metaAtteinte` | Un compte ou une progression ; vert quand elle est atteinte |
| `ouvert`, `onBasculer` | L'état, tenu par l'appelant |
| `lien` | La section **ouvre une page** au lieu de se déplier |

**`lien` vient du support, pas d'un caprice** : sur un téléphone, une rubrique
de trente champs dépliée sur place enterre tout ce qui la suit. Le formulaire
rapide ouvre donc une page, là où la tablette déplie dans un volet. Le chevron
cède la place à une flèche. Le web n'a pas ce cas — il a la place.

**Ouverte, la section se signale par sa bordure `primary`**, pas par une ombre.
Les sept copies en posaient une de 12 de flou ; sur une page qui empile six
sections, cela faisait un escalier de gris.

## Ce qui manque à côté : la rubrique qui NE se replie PAS

**Mesuré le 22/09/2026, sur myArquos.** L'`Accordion` couvre la section qui se
déplie. Les FICHES, elles, emploient une rubrique qui ne se replie jamais —
une carte, un titre gris en `subhead`, un filet qui va d'un bord à l'autre,
puis le corps. Elle n'existe pas ici, et myArquos en portait donc **trois
copies** : la fiche Relevé, la fiche Équipement et le bloc des données
techniques, chacune avec sa propre paire de styles.

**Ce n'est pas le même composant avec `ouvert` figé à vrai.** Une rubrique qui
ne se replie pas n'a ni chevron, ni cible tactile sur son en-tête, ni état
d'ouverture à porter — son en-tête est un titre, pas un bouton, et l'annoncer
comme tel à un lecteur d'écran serait faux. Ce qu'elles partagent est leur
CHROME : la carte, la cote du titre, le filet pleine largeur.

**Ce que la duplication a coûté, et c'est ce qui rend la lacune chiffrable.**
Deux des trois copies annulaient le retrait de la carte par
`marginHorizontal: -15` en commentant « cancel the Card's 15 px padding ».
La carte pose `spacing.base`, qui vaut **16** : le filet s'arrêtait à un point
de chaque bord, sur toutes les rubriques de deux fiches, depuis toujours. Une
cote recopiée dans un calcul d'appelant ne vieillit pas seulement — elle peut
n'avoir jamais été juste, et aucun garde des deux dépôts ne sait voir ça.

En attendant, myArquos porte `components/SectionCard.tsx`, qui lit le retrait
du même jeton que la carte applique.
