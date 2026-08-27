---
name: Switch
status: stable
layer: generique
role: Basculer un réglage qui s'applique immédiatement.
keywords: [interrupteur, switch, bascule, activer, desactiver, reglage, toggle]
platforms: [web]
replaces:
  web: []
  mobile: [components/ResolvedToggle.tsx]
---

# Switch

## Quand l'utiliser

- Un réglage qui prend effet **en basculant**, sans validation : afficher les
  champs vides, passer en mode expert, activer une synchronisation.

## Quand NE PAS l'utiliser

- **Dans un formulaire qui se valide** → `Checkbox`. C'est la distinction qui compte, et elle n'est pas cosmétique : un interrupteur promet un effet immédiat.
- **Pour une action** → `Button`. « Lancer la synchronisation » est une action,
  pas un état ; un interrupteur qui déclenche puis revient tout seul est un
  bouton mal déguisé.
- **Quand la bascule peut échouer.** Un interrupteur affirme le nouvel état aussitôt. Si l'écriture peut être refusée, il faut soit attendre la réponse, soit revenir en arrière visiblement — sinon l'écran ment.
- **Sans intitulé.** Un interrupteur seul ne dit ni ce qu'il commande, ni ce que
  veut dire « activé ».

## Props

Celles de `Switch.Root` de Radix.

| Prop | Type | Rôle |
| --- | --- | --- |
| `checked` | `boolean` | État, contrôlé |
| `defaultChecked` | `boolean` | État initial |
| `onCheckedChange` | `(v) => void` | À la bascule |
| `disabled` | `boolean` | Grise et retire le pointeur |

## Exemples

```tsx
import { Switch, Label } from '@arquos/design-system/web';

<Label className="justify-between">
  Afficher les champs empties
  <Switch checked={empties} onCheckedChange={setVides} />
</Label>
```

## Anatomie

- Le bouton porte `shadow.card`, ce qui le détache de la piste dans les deux états

## États

| État | Ce qu'il donne |
| --- | --- |
| Éteint | Piste grise, bouton à gauche |
| Allumé | Piste bleue, bouton à droite |
| Focus | Anneau de 2 px, décalé d'un pixel pour ne pas mordre la piste |
| Désactivé | 50 % d'opacité |

Il n'y a **pas d'état de chargement**, et c'est délibéré : un interrupteur qui
tourne pendant deux secondes est un bouton. Si l'écriture est lente, dire le
résultat par un `Toast`.

## Accessibilité

- Radix rend un `role="switch"` avec `aria-checked` — annoncé « activé » ou
  « désactivé », pas « coché ».
- L'intitulé doit être associé ; l'envelopper dans `Label` agrandit la cible à
  toute la ligne, ce qui compte pour une piste de 20 px de haut.
