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

- Une valeur qu'on tape : un libellé, un numéro d'appareil, une cote.
- Dans un formulaire qui se valide d'un bouton.

## Quand NE PAS l'utiliser

- **Modifier une valeur déjà affichée dans une fiche** → `FieldRow`, qui bascule
  la ligne en saisie et rend la valeur d'avant sur Échap.
- **Choisir dans une liste connue** → `Select` sous dix options, `Combobox`
  au-delà. Un champ libre produit des valeurs que personne n'a prévues.
- **Un texte de plus d'une ligne** → `Textarea`.
- **Une date** → un sélecteur de date. Le format tapé varie d'un technicien à
  l'autre.
- **Sans intitulé.** Un `placeholder` disparaît dès qu'on tape.

## Props

Toutes celles de `<input>`, rien n'est intercepté.

| Prop | Rôle |
| --- | --- |
| `type` | `text` par défaut ; `number` pour une mesure |
| `aria-invalid` | Passe la bordure en `danger` — et prévient le lecteur d'écran |
| `disabled` | Grise et retire le pointeur |

## Exemple

```tsx
<div className="flex flex-col gap-xs">
  <Label htmlFor="linteau">Hauteur libre sous linteau</Label>
  <Input id="linteau" type="number" placeholder="en mm" />
</div>
```

## Anatomie

- Hauteur **36 px**, la même que `Button` : les deux s'alignent côte à côte.
- Arrondi `radius.control` · bordure `colors.border` · texte `typography.small`
- Focus : bordure `primary` + anneau de 2 px, la convention du dépôt — et non
  l'anneau translucide de shadcn.

## États

| État | |
| --- | --- |
| Focus | Bordure `primary`, anneau de 2 px |
| Erreur | Bordure `danger` — **avec un message** ; la couleur seule ne dit rien |
| Désactivé | 50 % d'opacité, pointeur retiré |
| Texte long | Défile horizontalement — si c'est fréquent, prendre `Textarea` |

## Accessibilité

- **Intitulé associé obligatoire** : `Label htmlFor`, ou `aria-label`.
- `aria-invalid` va avec `aria-describedby` pointant le message.
