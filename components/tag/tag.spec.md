---
name: Tag
status: stable
layer: generique
role: Distinguer une valeur de référentiel par sa couleur, sans la juger.
keywords: [tag, pastille, valeur, categorie, type, nature, role, couleur]
platforms: [web]
---

# Tag

Une pastille de valeur. Elle **distingue**, elle ne juge pas.

## Pourquoi elle existe

Un tableau de trente colonnes en texte gris se lit ligne par ligne. Les mêmes
colonnes avec une couleur par valeur se lisent en balayant : on repère les
monte-charge sans lire le mot. C'est le seul intérêt de la couleur ici.

## Ce qui la sépare de `Badge`

`Badge` porte un **état** : conforme, en retard, désactivé. Ses variantes sont
sémantiques, et le vert y veut dire quelque chose.

`Tag` porte une **valeur** d'un référentiel : un type d'appareil, une nature de
relevé, un rôle. Sa teinte est tirée du libellé et ne veut rien dire. Si
« Ascenseur » pouvait tomber en vert, une pastille verte cesserait de signifier
« conforme » — c'est pourquoi les deux palettes sont séparées.

## Teintes

Dix paires (`tagPalette`), chacune un fond très clair et son encre. Toutes
au-dessus de 4,6 pour 1 sur leur fond et de 4,5 sur blanc.

Le même libellé reçoit toujours la même teinte, dans tout le produit : la
fonction `tagTone` hache le texte. Pas de table à tenir à jour — le référentiel
des types compte des dizaines de valeurs et bouge sans nous.

## API

```tsx
<Tag>Ascenseur</Tag>                    {/* teinte déduite du libellé */}
<Tag tone="green">Au contrat</Tag>      {/* teinte imposée */}
<Tag colors={{ background: '#DFF7F3', foreground: '#2EB89A' }}>Soumis</Tag>
```

La troisième forme sert aux valeurs qui arrivent avec leurs couleurs : les
statuts de relevé viennent de Bubble avec les leurs, et la pastille doit être la
même ici et là-bas.

## À ne pas faire

- Ne pas s'en servir pour un état. `Badge`.
- Ne pas la poser sur une valeur libre à forte cardinalité : une adresse ou un
  nom de client donneraient un tableau bariolé où plus rien ne ressort.
