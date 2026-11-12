---
name: Surface
status: beta
layer: generique
role: Pose les blocs qui s'empilent sur une page blanche, chacun dans une carte contourée par son ombre, son titre au-dessus.
keywords: [carte, bloc, groupe, champs, page blanche, titre de groupe, à plat]
platforms: [web]
replaces:
  mobile: []
  web: [components/record/cartes.tsx]
---

# Surface

## Quand l'utiliser

- Une rubrique de fiche qui EMPILE plusieurs blocs : des groupes de champs
  (`FieldSurface`), un résumé suivi d'un tableau (`SURFACE_TABLE`).
- Le titre d'un bloc se pose au-dessus de sa carte (`Group`, `GroupTitle`), ses
  gestes à droite en `GroupLink`.

## Quand NE PAS l'utiliser

- Une rubrique qui n'est QU'UN tableau ou une liste : à plat, sans carte.
- Pour encadrer un élément seul : une carte sépare des blocs, elle n'encadre pas.

## Règles

- Contour par l'ombre (`shadow-surface`), aucune bordure, rayon 8.
- Lignes de champs : 10 × 16 px, filet en haut de chaque ligne, deux colonnes de
  champs au-delà de 900 px de carte, jamais trois.
- Les vides se replient derrière « Afficher N champs vides » (`SurfaceFooter`).
