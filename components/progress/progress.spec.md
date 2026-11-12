---
name: Progress
status: beta
layer: generique
role: Dire une proportion sobrement, d'une fine barre à la couleur de son seuil.
keywords: [progression, barre, taux, cases, photos, manquantes, proportion]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# Progress : `ProgressBar`

## Quand l'utiliser

- `ProgressBar` : un taux mis en avant dans une carte (le taux de connaissance d'un équipement),
  sous le chiffre qui le dit. 4 px, arrondie, la couleur du seuil.
- Plusieurs mesures dans une même carte : une ligne chacune (libellé à gauche, valeur à droite,
  la barre dessous, une phrase de 12 px qui dit ce qu'elle mesure), le même composant pour
  toutes. Une seule forme de jauge (Louis, 12/11/2026 : plus de cercle ni de rangée de cases).

## Quand NE PAS l'utiliser

- Une colonne de liste qui compare des taux → `Meter`.
- Pour lister les manquants : le détail vit dans leur onglet, pas dans une liste dépliée.

## Règles

- Seule la barre porte une couleur ; le texte autour reste neutre (Louis,
  12/11/2026).
