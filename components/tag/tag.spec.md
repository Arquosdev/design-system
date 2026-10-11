---
name: Tag
status: stable
layer: generique
role: Distinguer une valeur de référentiel par sa couleur, sans la juger.
keywords: [tag, pastille, valeur, categorie, type, nature, role, couleur]
platforms: [web, mobile]
---

# Tag

Une pastille de valeur : **un point de couleur et le mot, sur un fond neutre**.
Elle **distingue**, elle ne juge pas.

Depuis la 2.36.0-refonte.5, le fond n'est plus teinté (audit design du 11/10/2026,
A5-15 et A4-33) : « Étude sécurité » en aplat vert se lisait comme « Soumis »
en aplat vert juste à côté. Les fonds teintés sont aux états (`StatusBadge`,
`Badge`) ; le point garde ce qui faisait l'intérêt de la couleur, le balayage.

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

Dix paires (`tagPalette`) ; seule l'encre sert, au point. Le mot reste dans
la couleur du texte.

Le même libellé reçoit toujours la même teinte, dans tout le produit : la
fonction `tagTone` hache le texte. Pas de table à tenir à jour — le référentiel
des types compte des dizaines de valeurs et bouge sans nous.

## API

```tsx
<Tag>Ascenseur</Tag>                    {/* teinte déduite du libellé */}
<Tag tone="green">Au contrat</Tag>      {/* teinte imposée */}
```

`colors` est déprécié : il servait aux statuts de relevé venus de Bubble, qui
prennent désormais `StatusBadge`. Seule son encre sert encore, au point.

## À ne pas faire

- Ne pas s'en servir pour un état. `StatusBadge`, ou `Badge`.
- Ne pas la poser sur une valeur libre à forte cardinalité : une adresse ou un
  nom de client donneraient un tableau bariolé où plus rien ne ressort.
