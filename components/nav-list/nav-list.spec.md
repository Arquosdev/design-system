---
name: NavList
statut: beta
role: Lister les rubriques d'un écran, avec ce que chacune contient, et dire laquelle est ouverte.
mots_cles: [navigation, menu, rail, rubriques, sections, sommaire, compteur]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — navFiche / navComp, boutons recopiés inline]
  mobile: [components/full-form/RubriqueNav.tsx]
---

# NavList

## Quand l'utiliser

- Naviguer entre les rubriques d'un même objet — les sections d'une fiche
  équipement, les rubriques d'un formulaire long.
- Quand le compteur de chaque rubrique aide à décider où aller.

## Quand NE PAS l'utiliser

- **Pour naviguer entre des pages** → des liens. Ce composant rend des boutons :
  il change ce qu'on regarde, pas l'adresse.
- **Pour deux ou trois entrées** → des onglets. Un rail vertical pour trois
  rubriques prend de la largeur sans rien organiser.
- **Pour une liste de données** (des relevés, des équipements) → une liste ou des
  cartes. Ici, chaque entrée est une destination, pas un enregistrement.

## Props

| Prop        | Type                        | Défaut | Rôle                                       |
| ----------- | --------------------------- | ------ | ------------------------------------------ |
| `titre`     | `string`                    | —      | Intitulé du groupe, en petites capitales    |
| `items`     | `NavItem[]`                  | —      | Les rubriques                               |
| `courant`   | `string`                    | —      | La clé de la rubrique ouverte               |
| `onChoisir` | `(cle: string) => void`      | —      | Appelé au clic sur une rubrique             |

`NavItem` : `{ cle, label, compteur?, desactive? }`.

**`compteur` accepte une chaîne, pas seulement un nombre.** Tant que les données
ne sont pas toutes arrivées, passer `'…'` dit qu'on ne sait pas encore ; `0`
affirmerait qu'il n'y a rien, ce qui serait faux.

## Exemples

```tsx
import { NavList } from '@arquos/design-system/web';

<NavList
  titre="Fiche"
  courant={rubrique}
  onChoisir={setRubrique}
  items={[
    { cle: 'overview', label: "Vue d'ensemble" },
    { cle: 'tech', label: 'Données techniques', compteur: 88 },
    { cle: 'docs', label: 'Documents', compteur: '…' },
  ]}
/>
```

## Anatomie

- Intitulé : `typography.caption` en gras, majuscules, `colors.textSubtle`
- Entrée : hauteur libre, arrondi `radius.control`, texte `typography.small`
- Entrée courante : fond `palette.blue[50]`, texte `palette.blue[700]` en gras
- Compteur : `typography.small`, `colors.textSubtle`, chiffres à chasse fixe —
  sans quoi les nombres dansent d'une ligne à l'autre

## États

- **Courante** : fond teinté **et** `aria-current`. La couleur seule ne suffit pas.
- **Désactivée** : opacité réduite, plus de clic. Réservé à une rubrique qui n'a
  rien à montrer sur cet objet — pas à une rubrique qui charge encore.
- **Compteur inconnu** : passer `'…'`. Ne jamais afficher `0` par défaut.
- **Libellé long** : passe à la ligne. Le tronquer cacherait la rubrique cherchée.

## Accessibilité

- Un `<nav>` avec `aria-label`, et `aria-current="page"` sur l'entrée ouverte :
  c'est ce qui permet à un lecteur d'écran d'annoncer où l'on se trouve.
- Le compteur est lu à la suite du libellé. Lui donner un libellé accessible
  quand le chiffre seul serait ambigu.
