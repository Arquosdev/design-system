---
name: Avatar
status: stable
layer: generique
role: Représenter une personne par sa photo, ou à défaut par ses initiales.
keywords: [avatar, photo, initiales, profil, utilisateur, pastille, personne]
platforms: [web]
replaces:
  web: []
  mobile: [components/Avatar.tsx]
---

# Avatar

## Quand l'utiliser

- Le raccourci vers son propre profil, en haut d'un écran.
- Dire qui a fait quelque chose : l'auteur d'un relevé, le technicien d'un
  constat.

## Quand NE PAS l'utiliser

- **Pour une entreprise ou un équipement.** Un rond d'initiales dit « une
  personne » ; sur un ascenseur, il se lit comme un compte utilisateur.
- **Comme seule identification.** Deux techniciens aux mêmes initiales
  deviennent indiscernables. Le nom accompagne, ou l'avatar ne sert qu'à
  reconnaître au second coup d'œil ce que le texte a déjà dit.
- **En liste dense.** Quarante ronds colorés dans un tableau font du bruit sans
  aider à lire.

## Props

| Prop | Type | Rôle |
| --- | --- | --- |
| `initials` | `string` | Une ou deux lettres — au-delà elles ne se lisent plus |
| `photo` | `string` | L'URL. Facultative, et faillible |
| `label` | `string` | Le nom, pour que la pastille ne soit pas muette |
| `className` | `string` | La taille se règle ici : `size-8`, `size-[32px]` |

## Exemples

```tsx
import { Avatar } from '@arquos/design-system/web';

<Avatar initials="TL" label="Thomas Lauzanne" />
<Avatar initials="OM" photo={url} label="Ombeline M." className="size-8" />
```

## États

| État | Ce qu'il donne |
| --- | --- |
| Sans photo | Les initiales sur fond bleu clair |
| Avec photo | La photo, recadrée dans le rond |
| **Photo cassée** | **Les initiales reviennent** — lien expiré, hors ligne |

Les initiales sont toujours rendues dessous : c'est ce qui évite la bulle vide
quand la photo ne charge pas. Un lien de stockage expiré est le cas courant, pas
l'exception.

## Accessibilité

- La pastille porte `role="img"` et un `aria-label` — sans quoi un lecteur
  d'écran annonce deux lettres sorties de nulle part.
- Les initiales visibles sont `aria-hidden` : le label les dit déjà, et mieux.
- L'image décorative porte un `alt` vide : elle ne redouble pas le label.
