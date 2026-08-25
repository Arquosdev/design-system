---
name: PhotoTile
statut: beta
couche: metier
role: Montrer une photo attendue — prise ou non — avec ce qu'elle est censée montrer.
mots_cles: [photo, vignette, image, miniature, cliche, apercu]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — vignettes de la vue d'ensemble et de la rubrique Photos]
  mobile: [components/full-form/PhotoGrid.tsx]
---

# PhotoTile

## Quand l'utiliser

- Une photo dans une liste d'emplacements **attendus** : le relevé prévoit une
  façade, une plaque de charge, une machinerie.
- Quand l'absence de photo est une information — elle dit ce qui reste à prendre.

## Quand NE PAS l'utiliser

- **Pour une image décorative ou un logo** → une balise `img`. Ce composant
  suppose qu'un emplacement existe et qu'on se demande s'il est rempli.
- **Pour une galerie libre** sans emplacements prévus : la tuile « non prise »
  n'aurait aucun sens.
- **Pour afficher une photo en grand** → une visionneuse. Ici c'est une vignette,
  et la tronquer en plein écran la déformerait.

## Props

| Prop         | Type         | Défaut  | Rôle                                        |
| ------------ | ------------ | ------- | ------------------------------------------- |
| `nom`        | `string`     | —       | Ce que la photo montre. Sert aussi de texte alternatif |
| `url`        | `string`     | —       | Absent = emplacement non pris                |
| `essentielle`| `boolean`    | `false` | Marque un emplacement obligatoire            |
| `onOuvrir`   | `() => void` | —       | Rend la vignette cliquable                   |

## Exemples

```tsx
import { PhotoTile } from '@arquos/design-system/web';

<PhotoTile nom="Façade de l'immeuble" url={photo.url} onOuvrir={ouvrirVisionneuse} />
<PhotoTile nom="Plaque de charge" essentielle />
```

## Anatomie

- Vignette : rapport 4/3, arrondi `radius.md`, contour `colors.borderSoft`
- Non prise : fond `colors.bgMuted`, mention « Non prise » en `colors.textSubtle`
- Essentielle non prise : contour `colors.danger`, mention en `colors.danger`
- Légende : `typography.caption`, `colors.textMuted`, sur deux lignes au plus

## États

- **Non prise** : la tuile reste, avec sa légende. La masquer ferait disparaître
  l'information qu'une photo est attendue à cet endroit.
- **Essentielle et non prise** : signalée en rouge — c'est un manque, pas un vide.
- **Image cassée** : la tuile retombe sur l'état « non prise » plutôt que
  d'afficher l'icône brisée du navigateur.

## Accessibilité

- Le texte alternatif est le nom de l'emplacement, jamais « photo » — un lecteur
  d'écran doit savoir ce qui est montré.
- Sans `onOuvrir`, la tuile n'est ni un bouton ni atteignable au clavier.
