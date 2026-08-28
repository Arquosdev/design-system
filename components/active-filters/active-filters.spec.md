---
name: ActiveFilters
status: beta
layer: generique
role: Montrer ce qui restreint la liste, et permettre de le défaire d'un clic.
keywords: [filtres, actifs, pastilles, retirer, liste]
platforms: [web]
replaces:
  web: []
  mobile: []

---

# ActiveFilters

## Quand l'utiliser

Sous la barre d'outils d'une liste filtrée. Chaque pastille dit un filtre actif
et le retire quand on la clique.

## Quand NE PAS l'utiliser

- **Pour choisir parmi des options** : c'est `FilterChips`, qui sélectionne. Les
  deux se ressemblent et font l'inverse l'un de l'autre — l'un pose un filtre,
  l'autre le défait.
- **Quand aucun filtre n'est actif** : le composant ne rend rien, et c'est
  voulu. Une rangée vide occupe la place sans rien dire.

## Deux règles

**Le libellé se lit, il ne se décode pas.** « Technicien : M. Grangier », pas
`technician=8f3a…`. Un identifiant qui traîne dans une pastille oblige à
deviner ce qu'on a filtré.

**Une pastille peut défaire plusieurs paramètres.** Une plage — « Taux : 0 à
60 % » — s'affiche en une pastille et se retire en une fois : la couper en deux
demanderait deux clics pour défaire un seul geste.

## Anatomie

- Rangée à part, sous la barre d'outils : `spacing.xl` horizontal, `spacing.md`
  en bas
- Pastille : 32 px, bord `colors.primary`, fond `colors.infoBg`, texte
  `colors.onInfoBg` en `semibold`, croix à droite
- « Tout retirer » : bouton texte en `colors.primary`, sans bord

## Exemple

```tsx
<ActiveFilters
  filters={[{ id: 'technician', label: 'Technicien : M. Grangier' }]}
  onRemove={(id) => retirer(id)}
  onRemoveAll={() => tout()}
/>
```
