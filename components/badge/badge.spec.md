---
name: Badge
statut: stable
role: Poser une étiquette courte qui qualifie l'élément à côté duquel elle se trouve.
mots_cles: [badge, pastille, etiquette, statut, tag, echeance, compteur]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — badge(sev, size), pastilles recopiées inline]
  mobile: [components/Tag.tsx, components/StatusPill.tsx, components/OpportunityTypePill.tsx]
---

# Badge

## Quand l'utiliser

- Qualifier un élément d'un mot : un état (« Soumis »), une échéance
  (« Échéance 18/09/2030 »), une nature (« EDL »).
- Signaler ce qui demande attention dans une liste longue.

## Quand NE PAS l'utiliser

- **Pour une action** → `Button`. Un badge cliquable est une source de confusion :
  rien ne le distingue d'un badge décoratif.
- **Pour un texte de plus de trois mots.** Au-delà, ce n'est plus une étiquette,
  c'est une phrase : la mettre dans le corps du texte.
- **Pour porter la seule information de couleur.** Un badge rouge sans mot n'est
  lisible ni par un daltonien, ni par un lecteur d'écran. Le mot d'abord, la
  couleur ensuite.
- **En rafale.** Trois badges sur une même ligne ne hiérarchisent plus rien.

## Props

| Prop       | Type                                                          | Défaut      | Rôle              |
| ---------- | ------------------------------------------------------------- | ----------- | ----------------- |
| `tone`     | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'`    | `'neutral'` | Registre de sens  |
| `variant`  | `'plein' \| 'contour'`                                         | `'plein'`   | Fond teinté, ou bordé sur fond blanc |
| `children` | `ReactNode`                                                    | —           | Le mot            |

**Choisir le ton :** `success` pour ce qui est conforme, `danger` pour ce qui
bloque, `warning` pour ce qui approche d'une limite, `info` pour un état neutre
du parcours, `neutral` pour une simple catégorie.

## Exemples

```tsx
import { Badge } from '@arquos/design-system/web';

<Badge tone="success">Conforme</Badge>
<Badge tone="danger">Non conforme</Badge>
<Badge variant="contour">Échéance 18/09/2030</Badge>
```

## Anatomie

- Padding `spacing.xs` horizontal, `spacing.xxs` vertical · Arrondi `radius.control`
- Texte `typography.caption` en demi-gras
- `plein` : fond `…Bg`, texte de la couleur pleine · `contour` : fond `colors.bg`, bordure `colors.border`

## États

Le badge n'a pas d'état : il ne survole pas, ne se presse pas, ne prend pas le
focus. S'il en faut un, c'est que ce devait être un bouton.

## Accessibilité

- Le badge est du texte : il est lu tel quel, sans `role`.
- Le contraste des tons `plein` est vérifié sur leur propre fond. Ne pas les
  poser sur une surface teintée, le rapport n'y tient plus.
