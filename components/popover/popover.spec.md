---
name: Popover
status: beta
layer: generique
role: Poser un petit panneau au-dessus de la page, ancré à ce qui l'a ouvert.
keywords: [popover, bulle, panneau, ancre, flottant]
platforms: [web]
replaces:
  web: []
---

# Popover

Repris de shadcn/ui (`npx shadcn@latest add popover`), habillé aux tokens Arquos.
Les noms exportés et la composition sont ceux de shadcn ; la primitive est Radix
`Popover`.

## Quand l'utiliser

- Un contenu court et **ancré** à son déclencheur : un filtre, un choix, une
  précision qu'on ouvre et qu'on referme sans quitter la ligne.
- Sous `Combobox`, qui n'est rien d'autre que ce panneau plus une `Command`.

## Quand NE PAS l'utiliser

- **Pour une tâche à plusieurs champs** → `Sheet`. Un panneau ancré qui déborde
  de l'écran a perdu ce qui le justifiait.
- **Pour une information au survol** → une infobulle (`title`). Un popover
  demande un clic ; l'exiger pour lire une provenance est un geste de trop.
- **Pour une décision qu'on ne peut pas défaire** → une boîte de dialogue, qui
  prend le focus et ne se referme pas d'un clic à côté.

## Exemples

```tsx
import { Popover, PopoverContent, PopoverTrigger } from '@arquos/design-system/web';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Filtrer</Button>
  </PopoverTrigger>
  <PopoverContent className="w-[280px]">…</PopoverContent>
</Popover>
```

## Anatomie

- Aligné au bord de son déclencheur, 4 px en dessous — Radix le retourne au-dessus quand la place manque

## Accessibilité

Radix pose le focus dans le panneau à l'ouverture, le rend au déclencheur à la
fermeture, ferme à Échap et au clic extérieur. Un déclencheur sans texte visible
doit porter un `aria-label`.
