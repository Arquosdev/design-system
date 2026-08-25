---
name: Icon
statut: stable
couche: generique
role: Poser une icône du vocabulaire Arquos, désignée par son rôle et non par son dessin.
mots_cles: [icone, icon, phosphor, pictogramme, symbole, svg, glyphe]
plateformes: [web]
remplace:
  web:
    - src/app/fiche/sections/rail.tsx — IconeLoupe, tracé Phosphor recopié à la main
    - src/app/fiche/sections/documents.tsx — IconeTelechargement, idem
    - src/app/fiche/sections/vue-ensemble.tsx — IconeInfo et IconeAlerte, redessinées en grille 24
    - src/app/fiche/sections/cotes.tsx — pictogramme de cote, grille 16
  mobile: []
---

# Icon

**Le jeu d'icônes officiel d'Arquos est Phosphor.** Il l'était déjà de fait — le
mobile l'installe et s'en sert dans 120 fichiers — mais rien ne l'écrivait, et le
web s'est mis à recopier ses tracés à la main. Cinq icônes y coexistent
aujourd'hui en trois grilles différentes (256, 24, 16) et trois épaisseurs de
trait. C'est exactement ce qu'un design system doit empêcher.

## Quand l'utiliser

- Accompagner un libellé d'un signe qui le rend repérable en balayage (une
  loupe devant « Rechercher », une corbeille dans un menu d'actions).
- Dire un état d'un coup d'œil dans une liste longue : conforme, écart, hors
  ligne.
- Remplacer un mot quand la place manque — dans un `IconButton`, dans un
  en-tête de colonne.

## Quand NE PAS l'utiliser

- **Pour une icône hors du vocabulaire.** Ne pas importer Phosphor directement
  dans une app pour contourner la liste : ajouter le rôle dans
  `src/icons.ts`, c'est trois lignes. Sans ça, deux écrans qui font la même
  chose repartent avec deux dessins — c'est ce qui vient d'arriver entre le
  mobile et le web.
- **Pour porter seule une information de risque.** Un triangle orange sans mot
  n'est lisible ni par un daltonien, ni en balayage rapide. Le mot d'abord.
- **Pour un logo, une marque, un schéma d'ascenseur.** Ce ne sont pas des
  icônes : ce sont des images. Phosphor n'a rien à y voir.
- **Pour décorer.** Une icône qui n'ajoute pas d'information ajoute du bruit.
  La quatrième icône d'un écran est presque toujours de trop.

## Props

| Prop     | Type                                    | Défaut      | Rôle                                        |
| -------- | --------------------------------------- | ----------- | ------------------------------------------- |
| `role`   | `IconRole`                              | —           | Le rôle métier, pas le nom du dessin        |
| `size`   | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`  | `'md'`      | Échelon de `iconSize` (14/16/18/22/28)      |
| `weight` | `'default' \| 'actif' \| 'discret'`     | `'default'` | Échelon de `iconWeight`                     |
| `label`  | `string`                                | —           | Ce que l'icône dit, **quand elle le dit seule** |

**Le rôle, pas le dessin.** `role="supprimer"` plutôt que `Trash` : le jour où la
corbeille devient autre chose, un seul fichier change. La liste complète est dans
`src/icons.ts` — 35 rôles, groupés par se déplacer / agir / dire un état /
photos / le métier.

**La graisse est sémantique, pas esthétique.** `default` (bold) quand l'icône
accompagne un texte. `actif` (fill) quand l'icône *est* la chose : la pastille
d'un état, l'onglet sélectionné. `discret` (regular) reste rare — le mobile ne
s'en sert que neuf fois sur 459.

**`label` se laisse vide la plupart du temps.** Si un texte voisin dit déjà
« Rechercher », l'icône est décorative : elle est alors masquée aux lecteurs
d'écran, sinon ils bégaient. Le libellé ne se met que sur une icône seule — et
dans un `IconButton`, c'est le bouton qui le porte, pas l'icône.

## Exemples

```tsx
import { Icon } from '@arquos/design-system/web';

// accompagne un libellé — décorative, pas de label
<Icon role="rechercher" size="sm" />

// dit un état, seule — donc elle se nomme
<Icon role="ecart" weight="actif" label="Écart relevé" className="text-danger" />

// dans un bouton d'icône : c'est le bouton qui porte le nom
<IconButton label="Supprimer la cote" icon={<Icon role="supprimer" size="sm" />} />
```

Ajouter un rôle qui manque, dans `src/icons.ts` puis `icon.web.tsx` :

```ts
export const icones = {
  // …
  verrouille: 'Lock',
} as const;
```

## Anatomie

- Taille : `iconSize` — `xs` 14, `sm` 16, **`md` 18 (défaut)**, `lg` 22, `xl` 28
- Graisse : `iconWeight` — `default` bold, `actif` fill, `discret` regular
- Couleur : **héritée** (`currentColor`). Elle se règle sur le parent, jamais sur
  l'icône : c'est ce qui lui permet de suivre un texte muté ou un bouton primaire
  sans variante supplémentaire.
- `shrink-0` est posé d'office : une icône ne se comprime pas dans un flex.

## États

L'icône n'a pas d'état propre. Elle suit celui de son parent — survol, focus,
désactivation passent par la couleur du texte hérité. Une icône qui aurait besoin
d'un état à elle est un bouton déguisé : prendre `IconButton`.

## Accessibilité

- Sans `label` : `aria-hidden="true"` et `focusable="false"`. C'est le cas par
  défaut, et le bon dans la grande majorité des emplois.
- Avec `label` : `role="img"` et `aria-label`. À réserver aux icônes qui portent
  seules une information.
- La taille de cible tactile ne concerne pas l'icône mais son parent cliquable :
  44 pt, ce que `IconButton` garantit.

## Installer Phosphor dans une app

Le design system ne dépend d'aucun paquet Phosphor — il les déclare en
`peerDependencies` optionnelles, pour que le mobile n'embarque pas le rendu web
et réciproquement. Chaque app installe le sien :

```bash
npm install @phosphor-icons/react   # web
npm install phosphor-react-native   # mobile
```

Côté mobile, `Icon` n'existe pas encore : importer le dessin depuis
`phosphor-react-native` en passant par le vocabulaire (`icones.supprimer`), et
prendre les tailles dans `iconSize`.
