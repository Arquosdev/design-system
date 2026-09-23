---
name: SelectionBar
status: beta
layer: generique
role: Offrir en bas de liste ce qu'on peut faire des enregistrements cochés.
keywords: [sélection, actions, masse, cochés, barre, liste]
platforms: [web]
replaces:
  web: []
  mobile: []

---

# SelectionBar

## Quand l'utiliser

Dès qu'une liste permet de cocher plusieurs enregistrements. Elle paraît quand
la sélection commence et porte ce qu'on peut en faire.

## Quand NE PAS l'utiliser

- **Pour ce qui agit sur l'ensemble affiché** : c'est la `Toolbar`, en haut.
- **Pour une action sur une seule ligne** : elle appartient à la ligne.

## Anatomie

- Barre : fond `colors.brand`, `spacing.xl` horizontal, dans le flux
- Décompte : `small` en `semibold` sur `colors.textOnDark`, suivi d'un filet
- Actions : 30 px de haut ; la première en `colors.primary`, les suivantes en
  `colors.primaryDark`
- Fermeture : à droite, elle vide la sélection

## Deux règles

**Elle est dans le flux, jamais flottante.** Une barre flottante masque la
dernière ligne du tableau, souvent celle qu'on vient de cocher.

**Une seule action principale.** Deux boutons qui se détachent ne se détachent
plus.

## Exemple

```tsx
{n > 0 && (
  <SelectionBar text={selectionLabel(n, 'équipement')} onClear={vider}>
    <SelectionAction primary>Modifier une caractéristique</SelectionAction>
    <SelectionAction>Exporter</SelectionAction>
  </SelectionBar>
)}
```
