---
name: SegmentedTabs
status: beta
layer: generique
role: Basculer entre deux ou trois vues d'un même écran, toutes également importantes.
keywords: [onglets, segments, bascule, tabs, vues, selecteur]
platforms: [web]
replaces:
  web: [public/fiche/index.html — bascule Fiche / Composants du rail]
  mobile: [components/SegmentedTabs.tsx]
---

# SegmentedTabs

## Quand l'utiliser

- Séparer deux ou trois vues d'un même écran qui se valent : « Fiche » et
  « Composants » dans le rail, « En cours » et « Terminés » dans une liste.
- Quand on veut que les deux vues restent visibles à l'esprit, l'une comme
  l'autre atteignable d'un clic.

## Quand NE PAS l'utiliser

- **Au-delà de trois segments.** Ils rétrécissent jusqu'à l'illisible ; passer à
  `NavList` ou à de vrais onglets.
- **Pour une hiérarchie.** Les segments se valent. Si l'un est le cas courant et
  l'autre l'exception, un filtre ou un bouton dit mieux les choses.
- **Pour naviguer entre des pages** → des liens.
- **Pour un choix qui se soumet** (un formulaire) → `ChoicePills` ou un groupe de
  boutons radio. Ici le changement est immédiat, rien ne se valide.

## Props

| Prop        | Type                      | Défaut | Rôle                                    |
| ----------- | ------------------------- | ------ | --------------------------------------- |
| `segments`  | `Segment[]`               | —      | Deux ou trois entrées                    |
| `value`    | `string`                  | —      | La clé du segment actif                  |
| `onChange` | `(id: string) => void`   | —      | Appelé au changement                     |
| `ariaLabel` | `string`                  | —      | Ce que le groupe sépare, pour l'annoncer |

`Segment` : `{ id, label, count? }`. Le compteur suit le libellé, en retrait.

## Exemples

```tsx
import { SegmentedTabs } from '@arquos/design-system/web';

<SegmentedTabs
  ariaLabel="Contenu du rail"
  value={onglet}
  onChange={setOnglet}
  segments={[
    { id: 'specFile', label: 'Fiche', count: 9 },
    { id: 'composants', label: 'Composants', count: 18 },
  ]}
/>
```

## Anatomie

- Segment inactif : transparent, texte `colors.textMuted` en `fontWeight.medium` — même règle que `NavList`, les deux se touchent en haut du rail et un écart de graisse entre eux se verrait
- Compteur : même taille, `colors.primary` sur l'actif, `colors.textSubtle` sinon

## États

- **Actif** : fond blanc détaché **et** `aria-selected`. La couleur seule ne suffit pas.
- **Libellés de longueurs inégales** : chaque segment prend la moitié, pas sa
  largeur de texte — sinon la piste tressaute d'un onglet à l'autre.
- **Compteur inconnu** : l'omettre. Un `0` affirmerait qu'il n'y a rien.

## Accessibilité

- `role="tablist"` sur la piste, `role="tab"` et `aria-selected` sur chaque
  segment : c'est ce qui fait annoncer « onglet 1 sur 2, sélectionné ».
- Les flèches gauche et droite déplacent la sélection, comme l'attend un lecteur
  d'écran sur un groupe d'onglets.
