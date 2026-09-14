---
name: RadioGroup
statut: stable
couche: generique
role: Choisir une seule option parmi quelques-unes, toutes visibles à la fois.
mots_cles: [radio, choix, unique, option, exclusif, bouton radio]
plateformes: [web]
remplace:
  web: []
  mobile: []
---

# RadioGroup

## Quand l'utiliser

- Un choix unique parmi **deux à six** options, quand les voir toutes aide à
  décider : le type d'entraînement, la nature d'un accès.
- Quand la comparaison des options fait partie du choix.

> **Pourquoi six et non cinq.** La limite était à cinq jusqu'en v1.38.0. Les
> listes fermées du relevé en comptent très souvent six — « Type ouverture porte
> cabine » en est l'exemple : cinq dans la maquette, six dans le jeu d'options
> réel, parce que l'articulée s'y décline en manuelle et automatique. La limite
> à cinq faisait donc basculer en menu déroulant, sur un écran de saisie, le
> champ même que la maquette montrait en radios. Un jeu de six tient encore
> sous les yeux ; c'est au-delà que la colonne pousse le champ suivant hors de
> l'écran.

## Quand NE PAS l'utiliser

- **Au-delà de six options** → `Select`. Une liste de dix boutons radio occupe
  un écran entier pour une seule valeur.
- **Au-delà de vingt** → `Combobox`. Il faut pouvoir taper.
- **Pour un choix qui peut être vide.** Un groupe radio ne se dévalide pas au
  clic : une fois une option prise, l'utilisateur ne peut plus revenir à
  « aucune ». Si « aucune » est une réponse valable, l'ajouter comme option
  explicite — « Sans objet » — plutôt que de compter sur la désélection.
- **Pour plusieurs réponses** → `Checkbox`.

## Props

`RadioGroup` porte celles de `RadioGroup.Root`, `RadioGroupItem` celles de
`RadioGroup.Item`.

| Prop | Sur | Rôle |
| --- | --- | --- |
| `value` / `defaultValue` | `RadioGroup` | L'option retenue |
| `onValueChange` | `RadioGroup` | Au changement |
| `value` | `RadioGroupItem` | La valeur de cette option — **obligatoire** |
| `disabled` | les deux | Grise le groupe ou une option |

## Exemples

```tsx
import { RadioGroup, RadioGroupItem, Label } from '@arquos/design-system/web';

<RadioGroup defaultValue="traction">
  <Label className="gap-sm">
    <RadioGroupItem value="traction" /> Traction à câbles
  </Label>
  <Label className="gap-sm">
    <RadioGroupItem value="hydraulique" /> Hydraulique
  </Label>
  <Label className="gap-sm">
    <RadioGroupItem value="inconnu" /> Non déterminé
  </Label>
</RadioGroup>
```

## États

| État | Ce qu'il donne |
| --- | --- |
| Aucune prise | Tous les cercles vides — c'est l'état de départ légitime |
| Prise | Bordure bleue et point plein |
| Focus | Anneau de 2 px sur l'option focalisée |
| Désactivé | 50 % d'opacité, sur le groupe ou une seule option |

## Accessibilité

Radix apporte ce qui se réécrit toujours mal : **les flèches naviguent entre les
options**, le groupe ne prend qu'**une seule tabulation**, et l'option cochée est
annoncée. Envelopper chaque option dans `Label` agrandit la cible à toute la
ligne.
