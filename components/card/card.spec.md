---
name: Card
statut: stable
role: Poser un groupe d'éléments dans une surface délimitée, avec un en-tête facultatif.
mots_cles: [carte, surface, encart, groupe, bloc, panneau]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — sections bordées recopiées inline]
  mobile: [components/Card.tsx]
---

# Card

## Quand l'utiliser

- Regrouper des éléments qui se lisent ensemble : une catégorie de documents,
  un bloc de champs qui ne se replie pas.
- Séparer visuellement deux listes sur une même page.

## Quand NE PAS l'utiliser

- **Quand le groupe doit pouvoir se replier** → `Accordion`, qui gère l'état et
  le clavier. Une carte à laquelle on ajoute un bouton de repli refait mal ce
  travail.
- **Pour une carte cliquable dans une liste** (un équipement, un relevé) → ces
  cartes portent leur propre mise en page et leur état de sélection ; les écrire
  comme composants dédiés plutôt que d'empiler des props ici.
- **Pour encadrer un élément isolé.** Une bordure autour d'une seule valeur
  n'organise rien, elle ajoute du bruit.

## Props

| Prop       | Type              | Défaut  | Rôle                                            |
| ---------- | ----------------- | ------- | ----------------------------------------------- |
| `titre`    | `string`          | —       | En-tête de la carte. Absent = pas d'en-tête      |
| `meta`     | `string`          | —       | Précision affichée à droite du titre             |
| `children` | `ReactNode`       | —       | Le contenu                                       |
| `plat`     | `boolean`         | `false` | Retire le padding du contenu (listes pleine largeur) |

## Exemples

```tsx
import { Card } from '@arquos/design-system/web';

<Card titre="Réglementaire" meta="4 documents" plat>
  {documents.map((d) => <LigneDocument key={d.id} {...d} />)}
</Card>

<Card>Un bloc sans en-tête.</Card>
```

## Anatomie

- Contour : `1px` `colors.borderSoft`, arrondi `radius.md`, fond `colors.bg`
- En-tête : fond `colors.bgMuted`, titre `typography.small` en gras, méta `typography.caption` en `colors.textSubtle`
- Contenu : padding `spacing.base`, sauf en mode `plat`

## États

- **Sans en-tête** : la carte n'affiche que son contour.
- **Contenu vide** : afficher malgré tout l'en-tête avec une méta qui le dit —
  une carte absente laisse croire que la catégorie n'existe pas.

## Accessibilité

La carte est un conteneur, pas un contrôle : elle ne reçoit ni `role` ni focus.
Si son contenu est cliquable, c'est le contenu qui porte le bouton ou le lien.
