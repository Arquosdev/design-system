---
name: Checkbox
statut: stable
couche: generique
role: Cocher une option indépendante, ou plusieurs, dans un formulaire qui se valide.
mots_cles: [case, cocher, checkbox, coche, option, multiple, selection]
plateformes: [web]
remplace:
  web: []
  mobile: []
---

# Checkbox

## Quand l'utiliser

- Une option qu'on active ou non : « Machinerie accessible sans clé ».
- Plusieurs options indépendantes dans une même liste, où zéro, une ou toutes
  peuvent être vraies.
- Un état partiel (`indeterminate`) sur une case qui commande un groupe.

## Quand NE PAS l'utiliser

- **Pour un effet immédiat** → `Switch`. Une case attend un « Enregistrer » ; l'interrupteur s'applique en basculant.
- **Pour un choix unique** → `RadioGroup`. Deux cases dont une seule peut être
  vraie laissent l'utilisateur les cocher toutes les deux.
- **Pour filtrer une liste** → `FilterChips`. Les puces montrent le filtre actif
  sans ouvrir de panneau.
- **Seule, sans intitulé cliquable.** Une case de 18 px est une cible minuscule ;
  l'intitulé doit l'agrandir.

## Props

Celles de `Checkbox.Root` de Radix.

| Prop | Type | Rôle |
| --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | État, contrôlé |
| `defaultChecked` | `boolean` | État initial, non contrôlé |
| `onCheckedChange` | `(v) => void` | Au changement |
| `disabled` | `boolean` | Grise et retire le pointeur |

## Exemples

```tsx
import { Checkbox, Label } from '@arquos/design-system/web';

// L'intitulé enveloppe la case : toute la ligne devient cliquable.
<Label className="gap-sm">
  <Checkbox defaultChecked />
  Machinerie accessible sans clé
</Label>
```

## Anatomie

- La coche vient du vocabulaire d'icônes (`role="coche"`), **pas de Lucide** — shadcn livre ses composants avec Lucide, le jeu officiel d'Arquos est Phosphor

## États

| État | Ce qu'il donne |
| --- | --- |
| Décochée | Carré vide bordé |
| Cochée | Fond bleu, coche blanche |
| Partielle | Fond bleu, trait horizontal — « certaines, pas toutes » |
| Focus | Anneau de 2 px |
| Désactivée | 50 % d'opacité |

## Accessibilité

- Radix rend un `role="checkbox"` avec `aria-checked`, y compris `mixed` pour
  l'état partiel.
- L'intitulé doit être associé — l'envelopper dans `Label` suffit et agrandit la
  cible de clic à toute la ligne.
