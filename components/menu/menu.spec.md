---
name: MenuItem
status: beta
layer: generique
role: Poser les entrées d'un menu déroulant à la densité d'un menu, alignées, la destructive isolée en bas.
keywords: [menu, actions, déroulant, entrée, contextuel, séparateur]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# MenuItem, MenuSeparator, MENU_CONTENT

## Quand l'utiliser

Dans tout menu déroulant : le menu « Actions » d'une fiche, le menu « … » d'une ligne, le
menu de compte, un menu contextuel. Le contenant est un `PopoverContent` qui reçoit
`MENU_CONTENT`.

## Quand NE PAS l'utiliser

- **Pour choisir une valeur dans une liste qu'on filtre** : `Combobox` ou `Command`, qui ont
  déjà la même densité.
- **Pour un choix exclusif de vue** : une barre d'onglets secondaire (`SubTabs`).

## Anatomie

- Contenant : arrondi 8, ombre de fenêtre (`shadow-pop`), un seul contour, rembourrage 4 px.
- Entrée : 28 px (`--arq-control-sm`), texte 13 px (`text-description`), icône 14 px en
  `text-muted` ; sans icône, la gouttière est gardée (« Fusionner l'équipement » reste aligné).
- `MenuSeparator` : un filet de 1 px `borderSoft`, de bord à bord.
- `destructive` : rouge, texte et icône ; toujours en bas, après un séparateur (Louis, 12/11/2026).

## Exemple

```tsx
<PopoverContent align="end" className={MENU_CONTENT}>
  <MenuItem icon="edit" onClick={modifier}>Modifier l’équipement</MenuItem>
  <MenuItem onClick={fusionner}>Fusionner l’équipement</MenuItem>
  <MenuSeparator />
  <MenuItem icon="delete" destructive onClick={supprimer}>Supprimer l’équipement</MenuItem>
</PopoverContent>
```
