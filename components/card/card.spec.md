---
name: Card
statut: stable
couche: generique
role: Poser un groupe d'éléments dans une surface délimitée, avec un en-tête facultatif.
mots_cles: [carte, surface, encart, groupe, bloc, panneau]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — sections bordées recopiées inline]
  mobile: [components/Card.tsx]
---

# Card

## Quand l'utiliser

- Regrouper des éléments qui se lisent ensemble : une catégorie de documents,
  un bloc de champs qui ne se replie pas.
- Séparer visuellement deux listes sur une même page.

## Quand NE PAS l'utiliser

- **Quand le groupe doit pouvoir se replier** → `Accordion`, qui gère l'état et
  le clavier. Une carte à laquelle on ajoute un bouton de repli refait mal ce
  travail.
- **Pour une carte cliquable dans une liste** (un équipement, un relevé) → ces
  cartes portent leur propre mise en page et leur état de sélection ; les écrire
  comme composants dédiés plutôt que d'empiler des props ici.
- **Pour encadrer un élément isolé.** Une bordure autour d'une seule valeur
  n'organise rien, elle ajoute du bruit.

## Composition

Une carte s'assemble, elle ne se configure pas par props — comme chez shadcn.

| Partie            | Rôle                                                         |
| ----------------- | ------------------------------------------------------------ |
| `Card`            | Le contour. Toujours présent                                   |
| `CardHeader`      | La barre teintée. Absent = carte sans en-tête                  |
| `CardTitle`       | Le titre, dans l'en-tête                                       |
| `CardDescription` | La précision à droite du titre (« 4 documents »)               |
| `CardContent`     | Le contenu, avec son padding                                   |
| `CardList`        | Le contenu **sans** padding, pour une liste qui touche les bords |
| `CardFooter`      | Un pied séparé par un filet                                     |

> **Base shadcn/ui.** Un extrait de leur documentation fonctionne tel quel. `CardHeader` s'écarte du leur sur un point : il pose la barre teintée de la fiche Arquos au lieu d'un simple bloc espacé.

## Exemples

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardList }
  from '@arquos/design-system/web';

<Card>
  <CardHeader>
    <CardTitle>Réglementaire</CardTitle>
    <CardDescription>4 documents</CardDescription>
  </CardHeader>
  <CardList>
    {documents.map((d) => <LigneDocument key={d.id} {...d} />)}
  </CardList>
</Card>

<Card>
  <CardContent>Un bloc sans en-tête.</CardContent>
</Card>
```

## Anatomie

- Contour : `1px` `colors.borderSoft`, arrondi `radius.md`, fond `colors.bg`
- En-tête : fond `colors.bgMuted`, titre `typography.small` en gras, méta `typography.caption` en `colors.textSubtle`
- Contenu : padding `spacing.base` avec `CardContent`, aucun avec `CardList`

## États

- **Sans en-tête** : la carte n'affiche que son contour.
- **Contenu vide** : afficher malgré tout l'en-tête avec une méta qui le dit —
  une carte absente laisse croire que la catégorie n'existe pas.

## Accessibilité

La carte est un conteneur, pas un contrôle : elle ne reçoit ni `role` ni focus.
Si son contenu est cliquable, c'est le contenu qui porte le bouton ou le lien.
