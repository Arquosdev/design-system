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
- Un bloc de champs SEUL dans sa rubrique prend `FieldSurface flat` : les mêmes
  lignes, sans ombre ni retrait de côté, entre deux filets ; le libellé tombe sur
  la verticale du nom de la fiche. Une carte sépare des blocs, elle n'en encadre
  pas un seul.

## La colonne d'informations : `DetailGroup`, `DetailRow`, `DETAIL_FIELD_ROWS`

Dans la colonne de droite d'une fiche (voir `RecordLayout`), tout est en lignes : 32 px, 13 px,
libellé de 120 px précédé d'une petite icône grise, valeur à droite ; une relation se lit en lien
sur une seule ligne, tronquée avec info-bulle. Aucune carte, bordure ni ombre ; les groupes se
séparent par leur titre de niveau 3 et un espace. `DETAIL_FIELD_ROWS` met des `FieldRow` à ce
format, toujours corrigibles en place.

