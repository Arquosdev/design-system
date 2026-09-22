---
name: NavList
statut: beta
couche: metier
role: Lister les rubriques d'un écran, avec ce que chacune contient, et dire laquelle est ouverte.
mots_cles: [navigation, menu, rail, rubriques, sections, sommaire, compteur]
plateformes: [web]
remplace:
  web:
    - public/fiche/index.html — navFiche / navComp, boutons recopiés inline
  mobile: [components/full-form/RubriqueNav.tsx]
---

# NavList

## Quand l'utiliser

- Naviguer entre les rubriques d'un même objet — les sections d'une fiche équipement, les rubriques d'un formulaire long.
- Quand le compteur de chaque rubrique aide à décider où aller.

## Quand NE PAS l'utiliser

- **Pour naviguer entre des pages** → des liens. Ce composant rend des boutons : il change ce qu'on regarde, pas l'adresse.
- **Pour deux ou trois entrées** → des onglets. Un rail vertical pour trois rubriques prend de la largeur sans rien organiser.
- **Pour une liste de données** (des relevés, des équipements) → une liste ou des cartes. Ici, chaque entrée est une destination, pas un enregistrement.

## Props

| Prop        | Type                        | Défaut | Rôle                                       |
| ----------- | --------------------------- | ------ | ------------------------------------------ |
| `titre`     | `string`                    | —      | Intitulé du groupe. À omettre quand ce qui précède le dit déjà |
| `items`     | `NavItem[]`                  | —      | Les rubriques                               |
| `courant`   | `string`                    | —      | La clé de la rubrique ouverte               |
| `onChoisir` | `(cle: string) => void`      | —      | Appelé au clic sur une rubrique             |
| `repliable` | `boolean`                    | `false`| Rend l'intitulé cliquable, pour replier le groupe |
| `ouvertParDefaut` | `boolean`              | `true` | Ouvert au premier rendu                     |

`NavItem` : `{ cle, label, compteur?, desactive?, vide?, enfants? }`.

**`enfants` fait de l'entrée une rubrique dépliante.** Elle garde l'aspect des
autres — même casse, même hauteur, même pastille quand elle est courante — et
porte un chevron à droite ; ses sous-rubriques s'alignent en retrait, rattachées
par un filet. Un clic ouvre la rubrique ET déplie : une seule ligne, un seul
geste à apprendre. Le chevron seul replie, sans rouvrir la rubrique.

**Fermé il pointe vers le bas, ouvert vers le haut.** Un chevron posé à DROITE
d'une ligne se lit comme celui d'un menu déroulant : bas pour « ça se déplie »,
haut pour « ça se replie ». À ne pas confondre avec le chevron de GAUCHE d'un
titre de section, qui ouvre une branche d'arborescence et va donc de la droite
vers le bas.

À ne pas confondre avec `titre` + `repliable`, qui coiffe une LISTE entière d'un
intitulé en capitales. Celui-là est un titre de section : au milieu d'entrées
écrites en minuscules, il se lit comme une rupture — c'est ce qu'a montré le
rail de la fiche équipement le 21/09/2026, où « PHOTOS » tombait entre « Vue
d'ensemble » et « Données techniques ».

Arriver sur une sous-rubrique OUVRE l'entrée. Ensuite le repli appartient à
celui qui clique : le chevron referme, même depuis une sous-rubrique. C'est
alors l'entrée MÈRE qui porte la pastille — sinon le rail ne dirait plus où
l'on est, et refermer reviendrait à se perdre.

**Toute la ligne bascule dès qu'on est DANS le groupe** — sur la rubrique mère
comme sur l'une de ses sections. Dehors, elle mène. Ce n'est pas la pastille qui
en décide : elle dit où l'on est, pas ce que le clic doit faire. Les confondre
avait supprimé le repli le jour où un enfant s'est mis à porter la clé de sa
mère.

Le chevron est un BOUTON à part, pas une zone cliquable dans le premier : il
fait autre chose que la ligne, et la tabulation doit l'atteindre.

**Un enfant qui porte la clé de sa mère en fait un conteneur.** Lister la
rubrique de la mère parmi ses enfants — « Toutes » sous « Photos » — donne un
moyen d'y revenir depuis une sous-rubrique. C'est alors l'ENFANT qui porte la
pastille, pas la mère : deux pastilles empilées se lisent comme un défaut. La
mère la reprend une fois repliée, quand l'enfant ne se voit plus.

**La ligne entière replie dès qu'on y est déjà.** Elle mène à sa rubrique tant
qu'on n'y est pas ; pastille allumée, le clic replie ou rouvre. Viser le chevron
seul demandait seize pixels pour un geste qu'on fait souvent, et une ligne
courante n'a de toute façon plus rien de neuf à ouvrir.

**`compteur` accepte une chaîne, pas seulement un nombre.** Tant que les données
ne sont pas toutes arrivées, passer `'…'` dit qu'on ne sait pas encore ; `0`
affirmerait qu'il n'y a rien, ce qui serait faux.

## Exemples

```tsx
import { NavList } from '@arquos/design-system/web';

<NavList
  titre="Fiche"
  courant={rubrique}
  onChoisir={setRubrique}
  items={[
    { cle: 'overview', label: "Vue d'ensemble" },
    { cle: 'tech', label: 'Données techniques', compteur: 88 },
    { cle: 'docs', label: 'Documents', compteur: '…' },
  ]}
/>
```

## Anatomie

- Entrée : hauteur libre, arrondi `radius.control`, retrait `spacing.md` de chaque côté — le fond teinté est une pastille, et une pastille qui touche ses mots se lit comme un défaut d'alignement. Texte `typography.small` en **`fontWeight.medium`** — c'est un menu, ses mots se balaient du regard, ils ne se lisent pas en phrase ; le normal les laissait maigres face aux titres
- Entrée courante : fond `palette.blue[50]`, texte `palette.blue[700]` en `fontWeight.semibold` — un échelon au-dessus des autres, et c'est ce contraste qui dit où l'on est
- Compteur : `typography.small`, `colors.textSubtle`, chiffres à chasse fixe — sans quoi les nombres dansent d'une ligne à l'autre

## États

- **Courante** : fond teinté **et** `aria-current`. La couleur seule ne suffit pas.
- **Désactivée** (`desactive`) : opacité réduite, plus de clic. Réservé à une
  rubrique hors sujet sur cet objet — un relevé qui ne l'alimente pas. Jamais
  pour une rubrique qui charge encore, ni pour une rubrique simplement vide.
- **Vide** (`vide`) : libellé en `colors.textMuted`, le clic reste. La rubrique
  existe, rien n'y est encore renseigné, et c'est en y allant qu'on la remplit.
  Le survol la rend à l'encre pleine : elle se prend, elle ne refuse pas. Née
  le 21/09/2026 pour la fiche équipement, qui cache ses champs vides en lecture
  — le menu doit alors dire où il n'y a rien, sans le fermer.
- **Compteur inconnu** : passer `'…'`. Ne jamais afficher `0` par défaut.
- **Libellé long** : passe à la ligne. Le tronquer cacherait la rubrique cherchée.
- **Groupe replié contenant la rubrique ouverte** : il reste déplié. Le replier
  cacherait l'endroit où l'on se trouve.
- **Sans intitulé** : la liste seule. Utile sous un `SegmentedTabs`, qui nomme
  déjà le groupe — le répéter n'ajoute rien et prend une ligne.

## Accessibilité

- Un `<nav>` avec `aria-label`, et `aria-current="page"` sur l'entrée ouverte : c'est ce qui permet à un lecteur d'écran d'annoncer où l'on se trouve.
- Le compteur est lu à la suite du libellé.
