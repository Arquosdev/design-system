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

- Barre : FLOTTANTE, centrée en bas de la liste, `rounded-block`, ombre `pop`.
  Fond `colors.text` et encre `colors.bg` : l'inverse de la page, comme
  l'infobulle du rail (Louis, 09/10/2026). Blanche, elle se confondait avec le
  tableau qu'elle survole.
- Décompte : `small` en `semibold`, suivi d'un filet clair (`bg/20`)
- Actions : `control-sm` de haut ; l'action principale en `colors.primary`, les
  autres sans fond, en encre claire, éclaircies au survol (`bg/10`)
- Fermeture : à droite, elle vide la sélection

## Sur un téléphone

Sous 640 px, les actions passent derrière un bouton **« Actions »**, qui les
ouvre en colonne au-dessus de la barre (Échap ou un second appui les referme).
En ligne, elles sortaient de l'écran sans que rien ne dise qu'on pouvait les
faire glisser. Rien à faire chez l'appelant.

## Deux règles

**Elle flotte, et elle est sombre.** Elle flotte pour ne pas déplacer le
tableau quand on coche ; elle est sombre pour ressortir de lui. Ce qui flotte
au-dessus de la page (infobulle, barre de sélection) parle d'une seule voix.

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
