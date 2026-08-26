---
name: Accordion
statut: stable
couche: generique
role: Grouper des champs sous un titre pliable, pour qu'une page longue reste parcourable.
mots_cles: [accordeon, groupe, section, plier, deplier, replier]
plateformes: [web]
remplace:
  web:
    - public/fiche/index.html — motif recopié aux lignes 411, 496, 991
  mobile: [components/full-form/RubriqueBlock.tsx]
---

# Accordion

## Quand l'utiliser

- Grouper les champs d'une rubrique de la fiche (« Client », « Immeuble », « Accès »).
- Quand la page contient assez de groupes pour qu'on ne puisse pas tout voir d'un coup.

## Quand NE PAS l'utiliser

- **Pour masquer une information essentielle.** Ce qui est replié est, en pratique,
  rarement lu. Une donnée dont dépend une décision reste visible.
- **Pour un seul groupe.** Un accordéon unique ajoute un clic sans rien organiser :
  utiliser `Card` directement.
- **Pour naviguer entre des vues exclusives** → des onglets, pas un accordéon.

## Props

`Accordion` (racine)

| Prop           | Type                      | Défaut  | Rôle                                        |
| -------------- | ------------------------- | ------- | ------------------------------------------- |
| `type`         | `'single' \| 'multiple'`  | —       | Un seul groupe ouvert à la fois, ou plusieurs |
| `defaultValue` | `string \| string[]`      | —       | Groupes ouverts au premier rendu (non contrôlé) |
| `value`        | `string \| string[]`      | —       | Groupes ouverts (contrôlé)                   |
| `onValueChange`| `(v) => void`             | —       | Appelé à chaque ouverture ou fermeture       |

`AccordionItem` : `value: string` (identifiant du groupe, obligatoire et unique).

`AccordionTrigger` : `titre: string`, `meta?: string` (compteur à droite du titre).

`AccordionContent` : le contenu du groupe.

## Exemples

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
  from '@arquos/design-system/web';

<Accordion type="multiple" defaultValue={['client']}>
  <AccordionItem value="client">
    <AccordionTrigger titre="Client" meta="4 champs renseignés" />
    <AccordionContent>{/* les champs */}</AccordionContent>
  </AccordionItem>
</Accordion>
```

## États

- **Ouvert / fermé** : le chevron pivote d'un quart de tour, le contenu s'anime en hauteur.
- **Groupe vide** : afficher quand même l'en-tête, avec une méta qui le dit —
  un groupe absent laisse croire que la rubrique n'existe pas.
- **Focus clavier** : l'en-tête est atteignable au Tab, Entrée et Espace l'activent.

## Accessibilité

Radix gère `aria-expanded`, `aria-controls` et la navigation au clavier. Ne pas
remplacer l'en-tête par un `<div>` cliquable : cela supprime tout cela d'un coup.
