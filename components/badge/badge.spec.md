---
name: Badge
status: stable
layer: generique
role: Poser une étiquette courte qui qualifie l'élément à côté duquel elle se trouve.
keywords: [badge, pastille, etiquette, statut, tag, echeance, compteur]
platforms: [web]
replaces:
  web:
    - public/fiche/index.html — badge(sev, size), pastilles recopiées inline
  mobile:
    - components/Tag.tsx
    - components/StatusPill.tsx
    - components/OpportunityTypePill.tsx
---

# Badge

## Quand l'utiliser

- Qualifier un élément d'un mot : un état (« Soumis »), une échéance (« Échéance 18/09/2030 »), une nature (« EDL »).
- Signaler ce qui demande attention dans une liste longue.

## Quand NE PAS l'utiliser

- **Pour une action** → `Button`. Un badge cliquable est une source de confusion : rien ne le distingue d'un badge décoratif.
- **Pour un texte de plus de trois mots.** Au-delà, ce n'est plus une étiquette, c'est une phrase : la mettre dans le corps du texte.
- **Pour porter la seule information de couleur.** Un badge rouge sans mot n'est lisible ni par un daltonien, ni par un lecteur d'écran. Le mot d'abord, la couleur ensuite.
- **En rafale.** Trois badges sur une même ligne ne hiérarchisent plus rien.

## Props

| Prop       | Type                                                                                    | Défaut    | Rôle     |
| ---------- | --------------------------------------------------------------------------------------- | --------- | -------- |
| `variant`  | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning' \| 'info' \| 'muted'` | `'muted'` | Registre |
| `children` | `ReactNode`                                                                               | —         | Le mot   |

**Choisir la variante :** `success` pour ce qui est conforme, `destructive` pour ce
qui bloque, `warning` pour ce qui approche d'une limite, `info` pour une décision
prise ou un renseignement neutre, `secondary` pour un état neutre du parcours,
`muted` pour une simple catégorie, `outline` pour une précision posée sur fond blanc.

**Fond clair ou fond plein ?** `success`, `destructive`, `warning`, `info` et
`muted` posent un fond très clair et un texte de la même teinte en foncé : c'est
ce qui les fait lire comme un **état**, quelque chose qui *est*. `default` et
`secondary` sont pleins, et lisent comme un **bouton**, quelque chose sur quoi on
*appuie*.> **Base shadcn/ui.** Ses quatre variantes (`default`, `secondary`, `destructive`,
> `outline`) sont conservées telles quelles. `success`, `warning`, `info` et `muted`
> s'y ajoutent : une fiche d'équipement parle sans cesse de conformité, de vigilance
> et de décisions prises, et shadcn n'a rien pour ça. C'est l'extension que leur
> documentation invite à faire, pas un fork.

## Exemples

```tsx
import { Badge } from '@arquos/design-system/web';

<Badge variant="success">Conforme</Badge>
<Badge variant="destructive">Non compliant</Badge>
<Badge variant="info">Réglages technicien</Badge>
<Badge variant="outline">Échéance 18/09/2030</Badge>
```

## Anatomie

- Fond teinté et **l'encre appairée** — `bg-success-bg` va avec `text-on-success-bg`, jamais avec `text-success` (2,77 pour 1, sous le seuil). Sauf `outline` : bordure `colors.border` sur fond blanc.

## États

Le badge n'a pas d'état : il ne survole pas, ne se presse pas, ne prend pas le
focus. S'il en faut un, c'est que ce devait être un bouton.

## Accessibilité

- Le badge est du texte dans un `<span>` : il est lu tel quel, sans `role`.
- Le contraste est vérifié sur le fond blanc de la fiche.
