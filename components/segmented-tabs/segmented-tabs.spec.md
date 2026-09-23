---
name: SegmentedTabs
status: beta
layer: generique
role: Basculer entre deux ou trois vues d'un même écran, toutes également importantes.
keywords: [onglets, segments, bascule, tabs, vues, selecteur]
platforms: [web, mobile]
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
- **Libellé long** : il ne se coupe jamais en deux lignes. La largeur d'un
  segment est celle de son libellé **en gras**, réservée d'avance par un
  fantôme superposé : sans ça, le segment qui devient actif — donc plus gras —
  ne rentrait plus dans la place qu'il occupait et passait à la ligne. Vu sur
  « Face 1 » et « Tous les champs » dans la fiche équipement le 11/09/2026.
- **Compteur à trois chiffres** : l'onglet s'élargit. Il ne descend jamais sous
  la largeur de son contenu — sans ce plancher, `flex-1` partageait la place en
  parts égales même quand elle manquait, et le libellé débordait sur le
  compteur (« Tous les champs239 », collés).
- **Piste trop large pour son emplacement** : elle dépasse plutôt que de
  comprimer ses onglets. C'est à l'appelant de la faire passer à la ligne
  (`flex-wrap` sur la rangée, `shrink-0` sur la piste).

## Accessibilité

- `role="tablist"` sur la piste, `role="tab"` et `aria-selected` sur chaque
  segment : c'est ce qui fait annoncer « onglet 1 sur 2, sélectionné ».
- Les flèches gauche et droite déplacent la sélection, comme l'attend un lecteur
  d'écran sur un groupe d'onglets.

## Pas d'icône dans un segment, et c'est une décision

Une prop `icone` a existé quelques heures le 22/09/2026, pour la carte de
myArquos, qui portait deux segments à ICÔNE SEULE — un ascenseur, un carnet —
dont rien ne disait lequel montrait quoi. Le libellé les a remplacés, et Louis
a tranché sur l'icône qui les accompagnait : « enlève les icônes, sinon ce
n'est pas cohérent avec le switch d'en dessous. »

Il a raison au-delà de ce cas. **Deux sélecteurs l'un sous l'autre, l'un
iconographié et l'autre non, se lisent comme deux mécaniques différentes** alors
qu'ils font la même chose. Et un segment n'a pas la place d'un repère : le
libellé y est déjà court par construction.

La prop est donc retirée plutôt que laissée sans consommateur — c'est la règle
du dépôt : on ne déclare que ce qui a un écran.

## Mobile

Mêmes props (`segments`, `valeur`, `onChanger`, `ariaLabel` → `accessibilityLabel`)
et même dessin : piste `bgMuted`, actif en blanc détaché par `shadowNative.card`.
Remplace le sélecteur bleu plein de myArquos.

**Le libellé ne rétrécit pas, il se coupe.** `adjustsFontSizeToFit` a été retiré
le 22/09/2026 : il réduisait bien en deçà des 85 % annoncés quand la piste était
étroite — « Équipements » devenait illisible à côté de « Relevés ». Un libellé
qui ne tient pas doit se voir, pour que la mise en page se corrige.
