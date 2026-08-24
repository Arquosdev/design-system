---
name: Gauge
statut: beta
role: Montrer une proportion d'un coup d'œil, avec son chiffre écrit à côté.
mots_cles: [jauge, anneau, donut, pourcentage, progression, taux, completude]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — anneau du taux de connaissance]
  mobile: [components/KnowledgeRateBadge.tsx]
---

# Gauge

## Quand l'utiliser

- Une proportion qu'on veut saisir sans lire : un taux de complétude, une
  couverture, un avancement.
- Quand la valeur exacte compte aussi — elle est toujours écrite.

## Quand NE PAS l'utiliser

- **Pour un nombre qui n'est pas une proportion** (57 photos) → `StatTile`. Un
  anneau suppose un tout, et 57 ne se rapporte à rien.
- **En série.** Cinq anneaux côte à côte se comparent moins bien que cinq
  barres — l'œil compare mal des angles.
- **Pour une progression en cours** (un envoi, un calcul) → une barre de
  progression, qui dit qu'on attend.

## Props

| Prop      | Type                                  | Défaut      | Rôle                          |
| --------- | ------------------------------------- | ----------- | ----------------------------- |
| `valeur`  | `number`                              | —           | De 0 à 100. Borné             |
| `label`   | `string`                              | —           | Ce que la proportion mesure    |
| `taille`  | `number`                              | `64`        | Diamètre en pixels             |
| `tone`    | `'success' \| 'warning' \| 'danger'`  | automatique | Force la couleur               |

Sans `tone`, la couleur suit la valeur : rouge en dessous de 34, orange en
dessous de 67, vert au-delà. **Elle ne porte jamais l'information seule** — le
pourcentage est toujours écrit.

## Exemples

```tsx
import { Gauge } from '@arquos/design-system/web';

<Gauge valeur={100} label="Taux de connaissance" />
<Gauge valeur={42} label="Couverture EDS" taille={48} />
```

## Anatomie

- Anneau : `7px` d'épaisseur, piste `colors.border`, arc coloré, extrémité arrondie
- Départ à midi, sens horaire
- Pourcentage : `typography.title` en gras · label : `typography.caption`, `colors.textMuted`

## États

- **0 %** : l'anneau reste visible (la piste seule). Un cercle disparu se lit
  comme une panne d'affichage.
- **100 %** : l'anneau se referme.
- **Valeur hors bornes** : ramenée entre 0 et 100 plutôt que de dessiner un arc
  aberrant.

## Accessibilité

- `role="img"` avec un `aria-label` qui dit la valeur et ce qu'elle mesure :
  « Taux de connaissance : 100 % ». Le dessin seul n'est pas lisible.
- Le pourcentage est du texte, pas une image — il reste lu et sélectionnable.
