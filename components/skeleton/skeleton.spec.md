---
name: Skeleton
statut: stable
couche: generique
role: Occuper la place de ce qui charge, pour que l'écran ne mente pas en paraissant vide.
mots_cles: [squelette, skeleton, chargement, attente, pulse, placeholder]
plateformes: [web]
remplace:
  web:
    - src/app/fiche/sections/rail.tsx — SqueletteRail, et huit autres blocs écrits sur place
  mobile: [components/Skeleton.tsx]
---

# Skeleton

## Quand l'utiliser

- Pendant qu'une zone charge, quand on **sait déjà la forme** de ce qui va arriver : une liste de lignes, une carte, un rail de rubriques.
- Sur un premier affichage, jamais sur un rafraîchissement : recharger une liste déjà lue en la remplaçant par des blocs gris fait clignoter l'écran et perdre le fil.

## Quand NE PAS l'utiliser

- **Quand on ne sait pas ce qui arrive** → un simple texte d'attente. Un squelette promet une forme ; s'il en arrive une autre, l'écran a menti.
- **Pour un chargement de moins de 300 ms.** Le squelette apparaît et disparaît : on voit un clignotement, pas une attente.
- **Pour une zone vide après chargement** → `EmptyState`. Un squelette qui ne se remplit jamais laisse croire à une panne.
- **Pour une action en cours** (envoi, enregistrement) → l'état du bouton, ou un `Toast`. Le squelette dit qu'on attend une **donnée**, pas un effet.

## Props

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `rond` | `boolean` | `false` | Bloc circulaire — pastille, avatar |
| `className` | `string` | — | La **taille se donne ici** : `h-4 w-32` |

Le composant n'a ni `width` ni `height` : la taille est une affaire de mise en
page, et la donner en classes permet de la rendre responsive sans nouvelle prop.

## Exemples

```tsx
import { Skeleton } from '@arquos/design-system/web';

// une ligne de rail en attente
<div className="flex items-center gap-sm">
  <Skeleton rond className="size-4" />
  <Skeleton className="h-4 w-40" />
</div>
```

**Les assemblages restent dans l'app.** Le mobile a huit squelettes d'écran —
liste de relevés, fiche d'équipement, formulaire. Ils épousent une mise en page
qui n'appartient pas au design system : ils se composent sur place, à partir de
cette brique.

## États

Aucun. Le squelette pulse tant qu'il est monté, et disparaît quand la donnée
arrive. Il n'a pas d'état d'échec : c'est `EmptyState` qui le dit.

## Accessibilité

- Le bloc porte `aria-hidden` : un lecteur d'écran n'a rien à annoncer d'une forme qui attend.
- **C'est la zone qui charge qui doit porter `aria-busy="true"`**, pas le squelette.
- La pulsation suit `prefers-reduced-motion` via l'utilitaire `animate-pulse`.
