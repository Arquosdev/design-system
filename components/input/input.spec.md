---
name: Input
statut: stable
couche: generique
role: Recueillir une valeur courte tapée au clavier, dans un formulaire.
mots_cles: [champ, saisie, input, texte, nombre, formulaire, taper]
plateformes: [web]
remplace:
  web:
    - src/app/fiche/sections/completer.tsx — trois <input> écrits sur place
  mobile:
    - components/Input.tsx
    - components/TextInputField.tsx
    - components/BufferedTextInputField.tsx
    - components/PhoneInputField.tsx
---

# Input

## Quand l'utiliser

- Recueillir une valeur qu'on tape : un libellé, un numéro d'appareil, une cote.
- Dans un formulaire qui se valide d'un bouton — ajouter une donnée, créer un
  relevé.

## Quand NE PAS l'utiliser

- **Pour modifier une valeur déjà affichée dans une fiche** → `FieldRow`. Il
  bascule la ligne en saisie d'un clic, valide à la perte de focus et rend la
  valeur d'avant sur Échap. Un `Input` posé là oblige à dessiner tout ça
  à la main, et c'est ainsi que trois écrans de la fiche ont chacun leur
  version du même comportement.
- **Pour choisir dans une liste connue** → `Select` en dessous de dix options,
  `Combobox` au-delà. Un champ libre sur une liste fermée produit des valeurs
  que personne n'a prévues.
- **Pour un texte de plus d'une ligne** → `Textarea`. Un `Input` fait défiler
  horizontalement, et on ne relit pas ce qu'on vient d'écrire.
- **Pour une date** → le sélecteur de date. Le format tapé à la main varie d'un
  technicien à l'autre.
- **Sans intitulé.** Un `placeholder` n'est pas un intitulé : il disparaît dès
  qu'on tape, et le champ rempli ne dit plus ce qu'il contient.

## Props

Toutes celles de `<input>`. Rien n'est intercepté.

| Prop | Type | Rôle |
| --- | --- | --- |
| `type` | `string` | `text` par défaut ; `number` pour une mesure |
| `aria-invalid` | `boolean` | Passe la bordure en `danger` |
| `disabled` | `boolean` | Grise et retire le pointeur |
| `className` | `string` | Fusionné, pas remplacé |

**L'erreur passe par `aria-invalid`**, jamais par une classe de couleur posée à
la main : c'est le même attribut qui colore la bordure et qui prévient le
lecteur d'écran. Les deux ne peuvent pas diverger.

## Exemples

```tsx
import { Input, Label } from '@arquos/design-system/web';

<div className="flex flex-col gap-xs">
  <Label htmlFor="linteau">Hauteur libre sous linteau</Label>
  <Input id="linteau" type="number" placeholder="en mm" />
</div>
```

```tsx
// en erreur — le message est à côté, la bordure ne suffit pas
<Input aria-invalid={trop} aria-describedby="err" />
{trop ? <p id="err" className="text-caption text-danger">Au-delà de 3 000 mm, vérifier la mesure.</p> : null}
```

## Anatomie

- Hauteur **36 px** (`h-9`) — la même que `Button`, pour qu'un champ et un
  bouton posés côte à côte s'alignent
- Arrondi `radius.control` · Bordure `colors.border` · Fond `colors.bg`
- Texte `typography.small` · Marque de réserve `colors.textSubtle`
- Focus : bordure `primary` + anneau de 2 px, la convention du dépôt

> **Base shadcn/ui.** Deux écarts assumés : la hauteur passe de 36 px shadcn à
> 36 px Arquos (identique, mais fixée sur `Button` et non sur leur échelle), et
> le focus prend l'anneau plein du dépôt plutôt que leur anneau translucide. Un
> seul motif de focus dans tout le produit vaut mieux que deux corrects.

## États

| État | Ce qu'il donne |
| --- | --- |
| Vide | La marque de réserve en `textSubtle`, jamais un intitulé déguisé |
| Focus | Bordure `primary`, anneau de 2 px |
| Erreur | Bordure `danger` — **avec un message**, la couleur seule ne dit rien |
| Désactivé | 50 % d'opacité, pointeur retiré |
| Texte très long | Défile horizontalement — si c'est fréquent, prendre `Textarea` |

## Accessibilité

- **Un intitulé associé est obligatoire** : `Label htmlFor`, ou `aria-label` si
  la mise en page ne permet pas d'intitulé visible.
- `aria-invalid` va avec `aria-describedby` pointant le message d'erreur.
- La cible fait 36 px de haut ; sur mobile, l'entourer d'une zone de 44 pt.
