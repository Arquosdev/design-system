---
name: PageHeader
status: beta
layer: generique
role: Dire en haut d'un écran d'où l'on vient, ce qu'on regarde et ce qu'on peut en faire.
keywords: [en-tête, titre, fil d'Ariane, navigation, retour, écran]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# PageHeader

## Quand l'utiliser

En haut de tout écran nommé : une liste, une fiche. Sur une fiche, **toujours
avec son `parent`** : c'est le seul chemin de retour que l'écran offre.

## Quand NE PAS l'utiliser

- **Dans un tiroir ou une modale** : ils ont leur propre en-tête, et un fil
  d'Ariane n'y veut rien dire.
- **Pour un titre de section** : c'est un `h2` dans le contenu.

## Trois règles

**Le fil d'Ariane n'est pas un ornement.** On arrive sur une fiche par un lien
collé dans un message autant que par la liste : le bouton « précédent » du
navigateur ne ramène alors nulle part. Le parent, lui, ramène toujours.

**Pluriel pour une liste, singulier pour une fiche.** « Équipements » puis
« Équipement » : c'est la convention du produit, et le fil la rend visible.

**Il ne défile pas.** Ce qui dit où l'on est ne doit pas disparaître au premier
coup de molette.

## Anatomie

- Bande : `spacing.xl` horizontal, trait `colors.borderSoft` en bas
- Fil : `small` en `colors.textMuted`, parent en `colors.primary`, chevron
  `colors.textSubtle`, courant en `colors.text`
- Titre : `typography.titleLarge`
- Décompte : `typography.title` en `colors.textMuted`, chiffres à chasse fixe

## Exemple

```tsx
<PageHeader title="Équipements" count={31500} />

<PageHeader
  title="Équipement"
  parent={{ label: 'Équipements', href: '/equipment' }}
  current="53 A 03758 03"
/>
```
