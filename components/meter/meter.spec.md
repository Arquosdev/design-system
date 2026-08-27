---
name: Meter
statut: beta
couche: generique
role: Montrer une proportion dans une série, quand plusieurs valeurs se comparent ligne à ligne.
mots_cles: [barre, proportion, pourcentage, taux, jauge, série, colonne, progression]
plateformes: [web]
remplace:
  web:
    - web/components/liste/barre-taux.tsx
  mobile: []
---

# Meter

## Quand l'utiliser

- Une colonne de liste qui porte un taux : le taux de connaissance des
  équipements d'un parc, ligne après ligne.
- Plusieurs proportions empilées qu'on veut comparer d'un regard.

## Quand NE PAS l'utiliser

- **Pour une proportion seule, mise en avant** → `Gauge`. Un anneau attire l'œil
  là où une barre se fond dans la ligne, et c'est ce qu'on veut d'une valeur
  d'identité.
- **Pour un nombre qui n'est pas une proportion** (57 photos) → `StatTile`.
  Une barre suppose un tout, et 57 ne se rapporte à rien.
- **Pour une progression en cours** (un envoi, un calcul) → une barre de
  progression, qui dit qu'on attend. Celle-ci décrit un état, pas une attente.

## Props

| Prop      | Type                                     | Défaut | Rôle                                                        |
| --------- | ---------------------------------------- | ------ | ----------------------------------------------------------- |
| `valeur`  | `number`                                 | —      | De 0 à 100, borné                                            |
| `label`   | `string`                                 | —      | Ce que la proportion mesure ; lu avec la valeur              |
| `ton`     | `'success' \| 'warning' \| 'danger'`     | auto   | Sans lui, la couleur suit la valeur                          |
| `largeur` | `number`                                 | `64`   | Largeur de la barre, en pixels                               |
| `chiffre` | `boolean`                                | `true` | Le pourcentage écrit à côté                                  |

## Exemples

```tsx
import { Meter } from '@arquos/design-system/web';

<Meter valeur={41} label="Taux de connaissance" />
```

Dans une colonne, garder la même `largeur` sur toutes les lignes : c'est ce qui
rend la série comparable.

```tsx
<Meter valeur={equipement.taux} label="Taux de connaissance" largeur={64} />
```

## Logique partagée

Les seuils et la règle de couleur vivent dans `_lib/proportion.ts`, avec
`Gauge`. Deux composants qui montrent la même chose ne doivent pas la colorer
différemment : un taux de 40 % est « à compléter » dans un anneau comme dans une
barre.

Sous 34 % `danger`, sous 67 % `warning`, au-dessus `success`.

## Anatomie

- Piste : `colors.borderSoft`, hauteur 4 px, `radius.full`
- Remplissage : `colors.success`, `colors.accent` ou `colors.danger` selon le ton
- Écart barre-chiffre : `spacing.sm`
- Chiffre : `typography.caption`, `colors.textMuted`, chiffres à chasse fixe —
  sans quoi les pourcentages dansent d'une ligne à l'autre

## États

- **0 %** : la piste seule, et le chiffre qui dit zéro. Une barre vide sans
  chiffre laisse croire à une donnée absente, alors qu'elle est mesurée.
- **Valeur hors bornes** : bornée à 0 ou 100 plutôt que de déborder de la piste.
- **Colonne étroite** : réduire `largeur`, jamais la hauteur — une barre plus
  fine que 4 px disparaît à l'impression et sur un écran mat.

## Accessibilité

La barre porte `role="img"` et un `aria-label` qui reprend le label et la
valeur : « Taux de connaissance : 41 % ». Le chiffre visible est `aria-hidden`,
sans quoi un lecteur d'écran l'annoncerait deux fois.

La couleur ne dit jamais l'état à elle seule : le chiffre est écrit à côté. Le
masquer avec `chiffre={false}` ne se justifie que dans une cellule où la valeur
est déjà écrite ailleurs sur la même ligne.
