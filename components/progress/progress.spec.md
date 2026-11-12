---
name: Progress
status: beta
layer: generique
role: Dire une proportion sobrement, d'une fine barre ou d'une rangée de cases pleines ou vides.
keywords: [progression, barre, taux, cases, photos, manquantes, proportion]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# Progress : `ProgressBar` et `SlotRow`

## Quand l'utiliser

- `ProgressBar` : un taux mis en avant dans une carte (le taux de connaissance d'un équipement),
  sous le chiffre qui le dit. 4 px, arrondie, la couleur du seuil.
- `SlotRow` : un compte d'éléments nommés, faits ou non (les photos essentielles, « 4 / 24 ») :
  une case pleine par élément fait, un contour par élément manquant, le nom en info-bulle.

## Quand NE PAS l'utiliser

- Une colonne de liste qui compare des taux → `Meter`.
- Pour lister les manquants : le détail vit dans leur onglet, pas dans une liste dépliée.

## Règles

- Seules la barre et les cases pleines portent une couleur ; le texte autour reste neutre (Louis,
  12/11/2026).
