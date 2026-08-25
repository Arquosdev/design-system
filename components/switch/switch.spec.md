---
name: Switch
statut: stable
couche: generique
role: Basculer un réglage qui s'applique immédiatement.
mots_cles: [interrupteur, switch, bascule, activer, desactiver, reglage, toggle]
plateformes: [web]
remplace:
  web: []
  mobile: []
---

# Switch

## Quand l'utiliser

- Un réglage qui prend effet **en basculant**, sans validation : afficher les
  champs vides, passer en mode expert, activer une synchronisation.

## Quand NE PAS l'utiliser

- **Dans un formulaire qui se valide** → `Checkbox`. C'est la distinction qui
  compte, et elle n'est pas cosmétique : un interrupteur promet un effet
  immédiat. Posé au milieu de champs qui attendent « Enregistrer », il fait
  croire que le réglage est déjà pris.
- **Pour une action** → `Button`. « Lancer la synchronisation » est une action,
  pas un état ; un interrupteur qui déclenche puis revient tout seul est un
  bouton mal déguisé.
- **Quand la bascule peut échouer.** Un interrupteur affirme le nouvel état
  aussitôt. Si l'écriture peut être refusée, il faut soit attendre la réponse,
  soit revenir en arrière visiblement — sinon l'écran ment. C'est la première
  règle d'écran du dépôt : **ne jamais montrer ce qui n'est pas**.
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
  Afficher les champs vides
  <Switch checked={vides} onCheckedChange={setVides} />
</Label>
```

## Anatomie

- Piste de 36 × 20 px, arrondi `radius.full` · Bouton de 16 px
- Éteint : piste `colors.border` · Allumé : piste `colors.primary`
- Le bouton porte `shadow.card`, ce qui le détache de la piste dans les deux
  états

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
