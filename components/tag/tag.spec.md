---
name: Tag
status: stable
layer: generique
role: Distinguer une valeur de référentiel par sa couleur, sans la juger.
keywords: [tag, pastille, valeur, categorie, type, nature, role, couleur]
platforms: [web, mobile]
---

# Tag

Une pastille de valeur : **le mot dans l'encre de sa teinte, sur le fond de la
même teinte**. Elle **distingue**, elle ne juge pas.

Le 04/11/2026, Thomas a remplacé le point sur fond neutre par un fond teinté, et
refait la palette dans l'esprit d'Attio et de shadcn. Cela revient sur l'audit
design du 11/10/2026 (A5-15, A4-33), qui craignait qu'une catégorie en aplat vert
se lise comme un état vert : les teintes de `tagPalette` restent distinctes de
celles des états, plus franches et sans bordure.

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

Dix paires et une neutre (`tagPalette`), sur les rampes 100 et 800 de
Tailwind : le fond et l'encre servent ensemble. `slate` se choisit, elle n'est
jamais tirée.

Le même libellé reçoit toujours la même teinte, dans tout le produit : la
fonction `tagTone` hache le texte. Pas de table à tenir à jour — le référentiel
des types compte des dizaines de valeurs et bouge sans nous.

## API

```tsx
<Tag>Ascenseur</Tag>                    {/* teinte déduite du libellé */}
<Tag tone="green">Au contrat</Tag>      {/* teinte imposée */}
```

`colors` est déprécié : il servait aux statuts de relevé venus de Bubble, qui
prennent désormais `StatusBadge`. Ses deux couleurs remplacent celles de la teinte.

## À ne pas faire

- Ne pas s'en servir pour un état. `StatusBadge`, ou `Badge`.
- Ne pas la poser sur une valeur libre à forte cardinalité : une adresse ou un
  nom de client donneraient un tableau bariolé où plus rien ne ressort.
