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

- Bande : `spacing.base` horizontal sur un téléphone, `spacing.xl` au-delà, trait `colors.borderSoft` en bas
- Fil : `small` en `colors.textMuted`, parent en `colors.primary`, chevron
  `colors.textSubtle`, courant en `colors.text`
- Titre : `typography.headline`, deux lignes au plus (tronqué au-delà, le titre entier en infobulle)
- Statut et chiffre (`status`, `figure`) : à la suite du titre, le statut d'une fiche (`StatusBadge`) puis le chiffre qui la résume en `typography.title` (« 13 118,60 € TTC »)
- Décompte : `typography.title` en `colors.textMuted`, chiffres à chasse fixe
- Écran étroit : les actions passent à la ligne sous le titre, et entre elles,
  calées à droite. Rien ne sort de l'écran à 375 px. Au-delà de 640 px, la
  ligne ne se replie plus : les actions restent à droite, à hauteur constante,
  quel que soit le titre (A2-10).

## Une fiche : le statut et le chiffre dans l'en-tête

Une fiche commerciale dit, sans ouvrir de rubrique, où elle en est et combien
elle vaut (Stripe : « C28AF58A-0002 pour 16,99 $ » et la pastille « Open » sur
la ligne du titre). Le seul bouton bleu vif de la page est dans `actions`.

## Une colonne centrée : `width`

Sur une page sans rail, la colonne de son `PageBody` se centre (Louis, 12/10/2026).
L'en-tête reçoit la même `width` (`page` ou `reading`) : son titre et ses actions
s'alignent sur la colonne, et son filet traverse toujours l'écran. Sans elle, le
titre reste collé à gauche au-dessus d'une colonne centrée. Une page à rail garde
`width="full"`, le défaut.

## Exemple

```tsx
<PageHeader title="Équipements" count={31500} />

<PageHeader
  title="Devis 20539"
  status={<StatusBadge object="quote" status="envoye" />}
  figure="13 118,60 € TTC"
  actions={<Button>Marquer accepté</Button>}
/>

<PageHeader
  title="Équipement"
  parent={{ label: 'Équipements', href: '/equipment' }}
  current="53 A 03758 03"
/>
```
