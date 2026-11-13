---
name: Trail
status: beta
layer: generique
role: Dire d'où l'on vient et ce qu'on regarde, en haut d'un écran ou d'une fiche.
keywords: [fil d'Ariane, chemin, navigation, retour, parent, breadcrumb]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# Trail

## Quand l'utiliser

- En tête d'une page qui a un PARENT : « Équipements › Paramètres des
  équipements ».
- En tête d'une fiche, pour dire le chemin parcouru : « Clients › RÉSIDENCE DU
  PARC › 53 A 00145 02 ».

Il est déjà posé par `PageHeader` (prop `parent`) : une page qui prend cet
en-tête n'a rien à faire de plus.

## Quand NE PAS l'utiliser

- **Pour un retour simple** vers l'écran précédent sans notion de structure :
  un `Button variant="ghost"` avec l'icône `previous`.
- **Dans un panneau, un tiroir ou une boîte de dialogue** : ils ont leur propre
  en-tête, et un chemin n'y veut rien dire.
- **Pour des étapes d'un assistant** (« Fichier › Correspondance › Import ») :
  ce n'est pas un chemin, c'est un avancement ; une liste d'étapes numérotées
  le dit mieux.
- **Pour un chemin de plus de cinq crans** : au-delà ce n'est plus un fil,
  c'est une liste. L'appelant tronque avant d'appeler.

## Props

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `steps` | `{ label: string; href: string }[]` | — | Ce qui précède, dans l'ordre. Chaque cran est un lien |
| `current` | `string` | — | Ce qu'on regarde, au bout du fil. Jamais un lien |
| `label` | `string` | `'Fil d’Ariane'` | Ce que le fil dit à un lecteur d'écran |
| `link` | `React.ElementType` | `'a'` | Comment un cran se rend ; une app à routeur passe le sien |
| `className` | `string` | — | Les marges, qui appartiennent à l'en-tête qui l'accueille |

## Exemples

```tsx
// web — une page qui a un parent
<Trail steps={[{ label: 'Équipements', href: '/equipment' }]} current="Paramètres des équipements" />
```

```tsx
// web — une fiche, avec le routeur de l'application et le chemin parcouru
import Link from 'next/link';

<Trail
  link={Link}
  label="Chemin parcouru"
  steps={[{ label: 'Clients', href: '/clients' }, { label: 'RÉSIDENCE DU PARC', href: '/clients/42' }]}
  current="53 A 00145 02"
/>
```

## Anatomie

- Rang : `typography.caption` (12 px), hauteur plancher 20 px, `spacing.xs` entre les crans
- Cran : `colors.text`, graisse 500, souligné au survol, anneau de focus au clavier
- Séparateur : icône `next`, échelon `sm` (16 px), `colors.textSubtle`
- Courant : `colors.text`, graisse 500, tronqué, `aria-current="page"`
- **Aucune marge propre** : c'est l'en-tête qui l'accueille qui les porte

**Pas de bleu.** Le parent était en `colors.primary` dans `PageHeader` jusqu'au
13/11/2026 : deux fils d'un dessin différent coexistaient dans le produit, et
le bleu tirait l'oeil vers un lien de retour qu'on suit rarement. Louis a
tranché pour le gris des fiches. Ne pas le « corriger » en remettant la couleur
d'un lien : un fil d'Ariane se lit quand on le cherche, il ne s'annonce pas.

## États

- **Aucun cran** (`steps` vide) : seul le courant paraît. L'appelant qui n'a
  rien à montrer ne rend pas le fil du tout.
- **Nom long** : le courant se tronque ; les crans, eux, passent à la ligne.
- **Second rang** : la hauteur est un plancher, donc rien n'est rogné.

## Accessibilité

- `nav` nommé par `label` : un lecteur d'écran annonce « Fil d'Ariane,
  navigation ».
- Le dernier cran porte `aria-current="page"` et n'est pas un lien — il mène
  à la page où l'on est.
- Le chevron est `aria-hidden` : il ne se lit pas, il sépare.
