---
name: TableFooter
status: beta
layer: generique
role: Dire sous un tableau combien il y a de lignes, et laisser changer de page et de nombre par page.
keywords: [pied, pagination, total, par page, tableau, liste]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# TableFooter

## Quand l'utiliser

Sous toute liste, et sous tout tableau de rubrique qui se pagine. C'est **le
seul endroit où vit le total d'une liste** (Louis, 12/11/2026) : « 828
équipements », le total filtré s'il y a des filtres. Le titre de page
reste seul, « Équipements ».

**La disposition, voulue par Louis (12/11/2026)** : la pagination « ‹ 1 / 13 › »
à GAUCHE, le total au CENTRE, à égale distance de la pagination et du sélecteur,
« 25 par page » à DROITE.

## Quand NE PAS l'utiliser

- **Pour dire ce qui est coché** : c'est `SelectionBar`, qui garde son propre compte.
- **Sous un tableau de rubrique qui tient en une page et ne se pagine pas** : il
  n'y a rien à dire, le pied ne paraît pas.

## Props

| Prop             | Type                        | Rôle                                                        |
| ---------------- | --------------------------- | ----------------------------------------------------------- |
| `summary`        | `ReactNode`                 | Le total, au centre : « 828 équipements », « 1 contrat ».    |
| `page` / `pages` | `number`                    | La pagination « ‹ 1 / 13 › », à gauche, dès deux pages.     |
| `onPage`         | `(page) => void`            | Aller à une page.                                           |
| `perPage`        | `number`                    | Le sélecteur « 25 par page », à droite.                     |
| `perPageOptions` | `readonly number[]`         | Les tailles offertes.                                       |
| `onPerPage`      | `(n) => void`               | Changer de taille.                                          |
| `perPageLabel`   | `string`                    | Le nom accessible du sélecteur.                             |

## Anatomie

- Bande de 40 px (`--arq-control-lg`, que l'application lit pour garder la place d'un bouton flottant), filet `colors.borderSoft` au-dessus, **sans fond**.
- Texte 12 px (`text-caption`), gris (`text-muted`), chiffres tabulaires.
- À gauche « ‹ 1 / 13 › », au centre le total (tronqué plutôt que de chevaucher), à droite « 25 par page ».
- « 25 par page » au format d'un bouton secondaire : 28 px (`--arq-control-sm`), 12 px, chevron de 14 px.
- Les flèches sont des boutons d'icône SECONDAIRES (`IconButton variant="outline" size="sm"`, 28 × 28, comme la loupe d'une barre d'outils), le compteur en 12 px entre elles.
- `data-pied-de-page` : un repère pour l'application (un bouton flottant), sans effet ici.

## Le mot qui suit le total

Il vient de la déclaration de l'objet, jamais écrit à la main, au singulier pour
un : « 1 équipement », « 828 équipements ».

## Exemple

```tsx
<TableFooter
  summary="828 équipements"
  page={1} pages={34} onPage={aller}
  perPage={25} perPageOptions={[25, 50, 100, 200]} onPerPage={changer}
  perPageLabel="Nombre d’équipements par page"
/>
```
