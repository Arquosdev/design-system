---
name: Badge
statut: stable
couche: generique
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

| Prop       | Type                                                                                    | Défaut    | Rôle     |
| ---------- | --------------------------------------------------------------------------------------- | --------- | -------- |
| `variant`  | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning' \| 'muted'` | `'muted'` | Registre |
| `children` | `ReactNode`                                                                               | —         | Le mot   |

**Choisir la variante :** `success` pour ce qui est conforme, `destructive` pour ce
qui bloque, `warning` pour ce qui approche d'une limite, `secondary` pour un état
neutre du parcours, `muted` pour une simple catégorie, `outline` pour une précision
posée sur fond blanc.

> **Base shadcn/ui.** Ses quatre variantes (`default`, `secondary`, `destructive`,
> `outline`) sont conservées telles quelles. `success`, `warning` et `muted` s'y
> ajoutent : une fiche d'équipement parle sans cesse de conformité et de vigilance,
> et shadcn n'a rien pour ça. C'est l'extension que leur documentation invite à
> faire, pas un fork.

## Exemples

```tsx
import { Badge } from '@arquos/design-system/web';

<Badge variant="success">Conforme</Badge>
<Badge variant="destructive">Non conforme</Badge>
<Badge variant="outline">Échéance 18/09/2030</Badge>
```

## Anatomie

- Padding `spacing.xs` horizontal, `spacing.xxs` vertical · Arrondi `radius.control`
- Texte `typography.caption` en demi-gras
- Fond teinté et texte de la couleur pleine, sauf `outline` : bordure `colors.border` sur fond blanc

## États

Le badge n'a pas d'état : il ne survole pas, ne se presse pas, ne prend pas le
focus. S'il en faut un, c'est que ce devait être un bouton.

## Accessibilité

- Le badge est du texte dans un `<span>` : il est lu tel quel, sans `role`. shadcn
  rend un `<div>` ; un bloc casserait l'alignement à côté d'un libellé.
- Le contraste est vérifié sur le fond blanc de la fiche. Ne pas poser un badge
  sur une surface teintée, le rapport n'y tient plus.
