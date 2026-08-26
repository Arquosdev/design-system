---
name: FilterChips
statut: beta
couche: generique
role: Restreindre une liste à une de ses parties, par une barre de puces.
mots_cles: [filtre, puces, chips, section, zone, restreindre, categorie]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — photoChips]
  mobile: [components/ChoicePills.tsx]
---

# FilterChips

Bâtie sur la primitive Radix `ToggleGroup` (`type="single"`), la même base que
le ToggleGroup de shadcn.

## Quand l'utiliser

- **Restreindre une longue liste** à une de ses parties : les 57 photos d'un
  équipement, ramenées aux 18 de la cabine.
- Quand les parties sont **connues et peu nombreuses** (deux à une dizaine) et
  qu'on veut les voir toutes d'un coup d'œil.

## Quand NE PAS l'utiliser

- **Pour naviguer entre des écrans** → `SegmentedTabs` ou `NavList`. Un filtre
  restreint ce qu'on regarde ; il ne change pas de page.
- **Pour un choix qui écrit** (l'état d'un composant, l'action sur un écart) →
  `FieldRow` en `kind="choice"`. Une puce filtre, elle n'enregistre rien.
- **Au-delà d'une dizaine de valeurs** → un menu ou une recherche. Une barre qui
  passe à la ligne trois fois ne se lit plus.
- **Pour cumuler plusieurs filtres** : le groupe est à choix unique par
  construction.

## Props

| Prop            | Type                        | Défaut | Rôle                                    |
| --------------- | --------------------------- | ------ | --------------------------------------- |
| `chips`         | `readonly FilterChip[]`     | —      | Les valeurs proposées                   |
| `value`         | `string`                    | —      | Celle qui est active                    |
| `onValueChange` | `(v: string) => void`       | —      | Changement de filtre                    |
| `label`         | `string`                    | —      | Nom du groupe pour les lecteurs d'écran |

`FilterChip` : `{ value: string; label: string; compteur?: number | string }`.

C'est à l'appelant de poser la puce « Toutes » en tête : le composant ne
suppose rien sur ce que le filtre veut dire.

## Exemples

```tsx
import { FilterChips } from '@arquos/design-system/web';

<FilterChips
  label="Filtrer par section"
  value={zone}
  onValueChange={setZone}
  chips={[
    { value: 'toutes', label: 'Toutes', compteur: 57 },
    ...zones.map((z) => ({ value: z.zone, label: z.zone, compteur: z.items.length })),
  ]}
/>;
```

## Anatomie

- Puce : 32 px de haut, arrondi `radius.control`, contour `colors.border`
- Active : contour `colors.primary`, fond `palette.blue[50]`, texte
  `palette.blue[700]` — le bleu doux d'une action secondaire chez Arquos
- Compteur : même taille, graisse normale, opacité 70 %

## États

- **Reclic sur la puce active** : sans effet. Radix rendrait une valeur vide, et
  un filtre sans valeur n'a pas de sens — la liste n'aurait plus rien à montrer.
- **Une seule puce** : la barre s'affiche quand même. La masquer ferait
  disparaître l'information qu'un filtre existe.

## Accessibilité

- Radix rend la barre en `role="radiogroup"` et chaque puce en `role="radio"` :
  un seul arrêt de tabulation pour le groupe, les flèches passent d'une puce à
  l'autre. Sur huit puces, huit arrêts seraient huit obstacles avant le contenu.
- L'état actif est porté par `aria-checked`, pas par la seule couleur.
- `label` nomme le groupe : sans lui, un lecteur d'écran annonce une rangée de
  boutons sans dire ce qu'ils filtrent.
