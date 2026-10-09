---
name: ThinkingDots
status: beta
layer: generique
role: Dire que l'assistant réfléchit, par la constellation de son icône animée en vague.
keywords: [assistant, ia, attente, réflexion, chargement, chat, points, animation]
platforms: [web, mobile]
replaces:
  web: []
  mobile: []
---

# ThinkingDots

## Quand l'utiliser

- Pendant que l'assistant d'Arquos prépare sa réponse, à la place de sa
  réponse, dans le fil de la conversation.
- Partout où une attente est celle de l'IA : le dessin est celui du rôle
  d'icône `aiAssist`, et il dit donc « c'est l'assistant qui travaille ».

## Quand NE PAS l'utiliser

- **Pour une attente qui n'est pas celle de l'IA** (un envoi, une liste qui se
  charge) → `Skeleton` pour un contenu qui arrive, un indicateur d'activité pour
  un geste. Une constellation partout ferait croire que l'IA est partout.
- **Comme icône immobile** → `Icon role="aiAssist"`. Ce composant bouge, et un
  mouvement permanent sans attente en cours se lit comme une panne.

## Props

| Prop    | Type                       | Défaut               | Rôle                                         |
| ------- | -------------------------- | -------------------- | -------------------------------------------- |
| `size`  | `keyof iconSize`           | `'md'`               | La taille, sur l'échelle des icônes          |
| `label` | `string`                   | —                    | Annoncé au lecteur d'écran ; vide, décoratif |
| `color` | `string` (mobile seulement) | `colors.primary`     | Le mobile n'hérite pas de la couleur du texte |

Sur le web, la couleur est héritée (`currentColor`), comme pour `Icon`.

Quand le système demande moins de mouvement, les points restent immobiles,
sur les deux plateformes.

## Exemples

```tsx
// web
<div className="flex items-center gap-sm">
  <ThinkingDots size="lg" className="text-primary" />
  <span className="text-small text-text-muted">Je réfléchis…</span>
</div>
```

```tsx
// mobile
<ThinkingDots size="lg" label="Une réponse arrive" />
```
