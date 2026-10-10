---
name: AiMark
status: beta
layer: generique
role: Dire « c'est l'assistant » : sa constellation en blanc sur le dégradé de la marque, immobile ou animée quand il travaille.
keywords: [assistant, ia, marque, avatar, chat, constellation]
platforms: [web, mobile]
replaces:
  web: []
  mobile: []
---

# AiMark

## Quand l'utiliser

- Là où **l'assistant parle ou se présente** : l'en-tête de son panneau, son
  accueil, le début de chacune de ses réponses.
- Avec `thinking`, **à la place où sa réponse va s'écrire**, tant qu'il
  travaille : la marque s'anime au lieu d'un indicateur posé à côté.

## Quand NE PAS l'utiliser

- **Pour un bouton qui ouvre l'assistant** → le bouton porte l'icône
  `aiAssist` ; la marque est une signature, pas une commande.
- **Pour une attente hors de l'assistant** → `ThinkingDots` seul, ou
  `Skeleton`. La tuile dit « l'IA », partout où elle paraît.
- **Plusieurs fois sur une même ligne** : une marque par prise de parole.

## Props

| Prop       | Type                   | Défaut  | Rôle                                                  |
| ---------- | ---------------------- | ------- | ----------------------------------------------------- |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`  | 20, 28 ou 40 : ligne de texte, réponse, accueil       |
| `thinking` | `boolean`              | `false` | La constellation s'anime (immobile si moins de mouvement) |

La marque est **décorative** (`aria-hidden`) : un texte voisin dit toujours
qui parle ou ce qui se passe.

Le web peint le dégradé `primary-dark` → `primary` (celui du bouton de
l'assistant au pied du rail) ; le mobile peint l'aplat `primary`, faute de
dégradé natif.

## Exemples

```tsx
// web : le début d'une réponse
<div className="flex gap-sm">
  <AiMark />
  <Markdown>{texte}</Markdown>
</div>

// pendant que l'assistant travaille
<AiMark thinking />
```
