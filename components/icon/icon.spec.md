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

**Le jeu d'icônes officiel est Phosphor.** On passe toujours par un **rôle**,
jamais par le nom du dessin : c'est ce qui permet de changer une icône partout
d'un coup.

## Quand l'utiliser

- Accompagner un libellé d'un signe qui le rend repérable en balayage.
- Dire un état d'un coup d'œil dans une liste longue.
- Remplacer un mot quand la place manque — dans un `IconButton`, un en-tête de colonne.

## Quand NE PAS l'utiliser

- **Une icône hors du vocabulaire.** Ne pas importer Phosphor dans une app pour contourner la liste : ajouter le rôle dans `src/icons.ts`, c'est trois lignes.
- **Porter seule une information de risque.** Un triangle orange sans mot n'est lisible ni par un daltonien, ni en balayage.
- **Un logo, une marque, un schéma d'ascenseur.** Ce sont des images.
- **Décorer.** La quatrième icône d'un écran est presque toujours de trop.

## Props

| Prop | Défaut | Rôle |
| --- | --- | --- |
| `role` | — | Le rôle métier, pas le nom du dessin |
| `size` | `'md'` | `xs` 14 · `sm` 16 · `md` 18 · `lg` 22 · `xl` 28 |
| `weight` | `'default'` | `default` bold · `actif` fill · `discret` regular |
| `label` | — | Ce que l'icône dit, **quand elle le dit seule** |

**La graisse est sémantique** : `actif` quand l'icône *est* la chose — pastille
d'état, onglet sélectionné ; `default` quand elle accompagne un texte.

**`label` se laisse vide la plupart du temps.** Si un texte voisin dit déjà la
chose, l'icône est décorative et se masque aux lecteurs d'écran. Dans un
`IconButton`, c'est le bouton qui porte le nom.

## Exemple

```tsx
<Icon role="rechercher" size="sm" />                          {/* décorative */}
<Icon role="ecart" weight="actif" label="Écart relevé" />      {/* elle parle seule */}
<IconButton label="Supprimer" icon={<Icon role="supprimer" size="sm" />} />
```

Ajouter un rôle : deux lignes dans `src/icons.ts`, une dans `icon.web.tsx`.

## Anatomie

- Couleur **héritée** (`currentColor`) : elle se règle sur le parent, ce qui permet à la même icône de suivre un texte muté ou un bouton primaire.

## États

Aucun état propre : elle suit celui de son parent. Une icône qui aurait besoin
d'un état à elle est un bouton déguisé → `IconButton`.

## Accessibilité

- Sans `label` : `aria-hidden` et `focusable="false"`.
- Avec `label` : `role="img"` et `aria-label`.
- La taille de cible tactile concerne le parent cliquable, pas l'icône.

## Installer

Le design system ne dépend d'aucun paquet Phosphor : chaque app installe le sien.

```bash
npm install @phosphor-icons/react   # web
npm install phosphor-react-native   # mobile
```

Côté mobile, `Icon` n'existe pas encore : lire le nom du dessin dans `icones` et
la taille dans `iconSize`.

Le vocabulaire complet est dans la vitrine : **Fondations → Icônes**.
