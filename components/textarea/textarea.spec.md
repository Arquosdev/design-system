---
name: Textarea
status: stable
layer: generique
role: Recueillir un texte de plusieurs lignes — une observation, un commentaire.
keywords: [textarea, commentaire, observation, texte, long, multiligne, note]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# Textarea

## Quand l'utiliser

- Une observation de relevé, un commentaire libre sur un écart, une note de
  contexte : tout ce qui se rédige plutôt que se renseigne.

## Quand NE PAS l'utiliser

- **Pour une valeur d'une ligne** → `Input`. Un champ haut promet un texte long
  et invite à en écrire un là où trois mots suffisaient.
- **Pour un choix parmi des motifs connus.** Si les observations reviennent
  toujours les mêmes, ce sont des options : `Select` d'abord, et le champ libre
  en complément.
- **Pour du texte mis en forme.** Ce champ ne fait ni gras, ni liste, ni saut de
  paragraphe stylé. Si la mise en forme compte, ce n'est pas ce composant.

## Props

Toutes celles de `<textarea>`. `rows` fonctionne, mais le champ grandit déjà
seul avec son contenu.

## Exemples

```tsx
import { Textarea, Label } from '@arquos/design-system/web';

<div className="flex flex-col gap-xs">
  <Label htmlFor="obs">Observation</Label>
  <Textarea id="obs" placeholder="Ce que le technicien a constaté sur place" />
</div>
```

## Anatomie

- Focus et erreur identiques à `Input` — les deux champs ne divergent pas

## États

Les mêmes qu'`Input`, avec une différence qui compte : **le champ s'agrandit au
lieu de faire défiler**. Sur un commentaire de trois lignes, une barre de
défilement interne cache ce qu'on vient d'écrire — et on ne se relit pas.

## Accessibilité

Comme `Input` : intitulé associé obligatoire, `aria-invalid` avec
`aria-describedby`. Ne jamais retirer la poignée de redimensionnement sans
laisser le champ grandir seul.
