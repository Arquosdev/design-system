---
name: RecordLayout
status: beta
layer: metier
role: Poser la fiche d'un objet — ses rubriques en rangée sous l'en-tête, la zone dessous avec son propre défilement.
keywords: [fiche, gabarit, rail, onglets, rubriques, sous-rubriques, defilement, sommaire]
platforms: [web]
replaces:
  web:
    - stories — « Un écran entier / Fiche d'équipement », markup recopié dans l'app
---

# RecordLayout

La mise en page d'une fiche : les rubriques en une rangée d'onglets sous
l'en-tête, la zone lue dessous, sur toute la largeur, avec son propre
défilement. **Depuis le 04/11/2026** (Thomas : tous les menus de page à
l'horizontale, comme une fiche Intercom ou Linear) ; avant, les rubriques
vivaient dans un rail de 284 px à gauche. Le composant garde le nom `RecordRail`
et ses props : les écrans n'ont rien eu à changer.

Elle vivait dans une story, donc en markup d'histoire. La première fiche l'a
recopiée, les neuf suivantes ont recopié la copie, et les dimensions en dur — la
largeur du rail, la hauteur du bouton de recherche — se retrouvaient à deux
endroits sans qu'on sache lequel faisait foi.

## Quand l'utiliser

- La page d'UN enregistrement, quand il porte assez de rubriques pour qu'un
  sommaire vaille mieux qu'un défilement.
- Jusqu'à neuf ou dix rubriques sur une ligne ; au-delà, la rangée défile de
  côté et ramène l'onglet courant en vue. Les sous-rubriques ne comptent pas :
  elles vivent dans la seconde rangée.

## Quand NE PAS l'utiliser

- **Pour une liste d'enregistrements** → `RecordTable`. Le gabarit pose UN
  objet ; la liste en pose mille.
- **Pour un objet à une seule rubrique** → la rangée se retire d'elle-même ;
  le contenu prend la place.
- **Pour un formulaire** → `Drawer` ou `Sheet`. On remplit un formulaire d'un
  bout à l'autre ; on ne le parcourt pas.

## Ce que le composant tient, et que l'hôte n'a pas à savoir

- **Le mono-zone.** La page ne défile pas ; seule la zone défile, et la rangée
  reste en vue. Sans cela les rubriques disparaissent dès qu'on descend, et on
  ne sait plus où l'on est.
- **La hauteur de la rangée**, partagée avec son squelette. Sans lui, la fiche
  s'ouvre sans onglets, puis ils surgissent et la zone saute.
- **Les sous-rubriques.** Une entrée à `children` ne se déplie pas : quand on
  est chez elle ou chez l'un des siens, son onglet s'allume et ses enfants se
  lisent en pastilles dans une seconde rangée, sur le gris de la surface. Un
  enfant qui porte la clé de sa mère (« Toutes » sous Photos, « Synthèse » sous
  Maintenance) est la rubrique de la mère, listée en clair pour y revenir.
- **La zone est un `div`, pas un `main`.** Le shell porte déjà ce repère, et
  deux `main` imbriqués sont une faute que les lecteurs d'écran signalent.

## Les pièces

| Composant | Rôle |
| --- | --- |
| `RecordLayout` | Le cadre des deux colonnes |
| `RecordRail` | La rangée sous l'en-tête : rubriques, bascule, loupe de recherche ; et la seconde rangée des sous-rubriques |
| `RecordRailSkeleton` | La rangée pendant le chargement |
| `RecordZone` | La zone lue, avec son défilement. C'est un conteneur (`@container`) : son contenu se règle sur sa largeur (`@min-[52rem]:grid-cols-2`), qu'un panneau ouvert à côté rétrécit sans changer la fenêtre |

## Props

`RecordRail` :

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | Ce que ce menu parcourt |
| `recherche` | `{ label, onOuvrir }` | — | Une loupe au bout de la rangée ; absente = pas de bouton |
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

## Anatomie

- Rangée : `spacing.3xl` (40) de haut, filet `colors.borderSoft` dessous, même
  retrait que le contenu (`spacing.base`, `spacing.xl` sur une fiche large).
  Elle rentre sa marge de gauche d'un `spacing.sm` pour que le premier libellé
  tombe sur la verticale du titre.
- Onglet : `small` medium, encre `textMuted` ; le courant en `primary` avec un
  trait de 2 px (`spacing.xxs`) posé sur le filet. Compteur en pastille ronde
  sur `bgMuted`. Les flèches du clavier passent d'un onglet à l'autre.
- Seconde rangée : fond `bgMuted`, pastilles de `controlHeight.sm` (28) ;
  la courante sur `infoBg`, comme une entrée courante de `NavList`.
- Sur une fiche étroite (un téléphone, ou un panneau ouvert à côté), rien ne
  change : la rangée défile de côté, l'onglet courant ramené dans le champ.

## Le chargement d'une rubrique

Le cadre partage avec sa zone un état « en chargement ». `useRecordZone()`
(web) le donne au rail de l'application : `setBusy(true)` au clic remonte la
zone en haut et y pose un squelette, `setBusy(false)` à la réponse rend le
contenu (A1-03, A1-B-02 : un clic ne changeait rien à l'écran pendant une
demi-seconde, et la rubrique suivante s'ouvrait au défilement de la
précédente). La rubrique choisie s'allume dans le rail au clic, sans attendre.

## `SubTabs`, la barre d'onglets secondaire

Une rangée qui fait choisir UNE vue d'un contenu parmi plusieurs (le fil d'un
client : Tout, Échanges, Affaires…) est une barre d'onglets, pas des pastilles
(Louis, 12/11/2026). `SubTabs` a le dessin exact des sous-rubriques de
`RecordRail` : texte, l'onglet choisi en graisse 600 avec son trait de 2 px collé
au filet, même hauteur, chevrons quand elle déborde. Elle se pose sous la barre
principale, d'un bord à l'autre de la zone. Ce sont des onglets (`tablist`) : les
flèches passent de l'un à l'autre.

Ne pas s'en servir pour des pastilles à sélection MULTIPLE (plusieurs actives à
la fois) : `FilterChips`. Ni sur une liste qui a déjà le panneau « Filtres ».

