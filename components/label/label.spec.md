---
name: Label
statut: stable
couche: generique
role: Nommer un champ, et agrandir sa cible de clic à tout l'intitulé.
mots_cles: [label, intitule, libelle, etiquette, champ, formulaire]
plateformes: [web]
remplace:
  web: []
  mobile: [components/FormField.tsx]
---

# Label

## Quand l'utiliser

- Devant tout champ de formulaire — `Input`, `Textarea`, `Select`, `Combobox`.
- Autour d'une `Checkbox`, d'un `RadioGroupItem` ou d'un `Switch` : l'envelopper
  rend toute la ligne cliquable, ce qui change tout sur une cible de 18 px.

## Quand NE PAS l'utiliser

- **Comme titre de section** → un vrai titre. Un `Label` sans champ associé est
  annoncé comme un intitulé orphelin par les lecteurs d'écran.
- **Pour une aide ou un exemple** → un texte à part, en `typography.caption` et
  `colors.textMuted`, relié par `aria-describedby`. L'intitulé dit *ce que
  c'est* ; l'aide dit *comment le remplir*.
- **Sur une valeur en lecture seule** → `FieldRow` porte déjà son intitulé.

## Props

Celles de `Label.Root` de Radix, dont `htmlFor`.

## Exemples

```tsx
import { Label, Input, Checkbox } from '@arquos/design-system/web';

// associé par htmlFor
<Label htmlFor="serie">N° de série</Label>
<Input id="serie" />

// ou en enveloppant — pas de htmlFor nécessaire
<Label className="gap-sm">
  <Checkbox /> Machinerie accessible sans clé
</Label>
```

## États

Aucun état propre. Il s'éteint avec le champ qu'il nomme, jamais seul.

## Accessibilité

C'est **le seul rôle de ce composant** : associer. Un texte posé à côté d'un
champ n'agrandit pas la cible de clic et n'est pas annoncé avec lui. Les deux
formes valent — `htmlFor` pointant l'`id`, ou l'enveloppement — et il ne faut
pas les cumuler.
