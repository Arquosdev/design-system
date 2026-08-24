---
name: Button
statut: stable
role: Déclencher une action. Le poids visuel dit l'importance de l'action, pas sa nature.
mots_cles: [bouton, action, cta, valider, enregistrer, annuler]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — boutons inline recopiés 13 fois]
  mobile: [components/Button.tsx, components/AddNewButton.tsx]
---

# Button

## Quand l'utiliser

- Déclencher une action sur la page : « Compléter », « Enregistrer », « Annuler ».
- Une seule action `primary` par zone de l'écran. Au-delà, l'œil ne sait plus où aller.

## Quand NE PAS l'utiliser

- **Pour naviguer vers une autre page** → utiliser un lien. Un bouton agit, un lien
  déplace. Un agent qui se trompe ici casse le clic-droit, le Cmd+clic et le lecteur d'écran.
- **Pour une action portée par une icône seule** → `IconButton` (à venir), qui impose
  un libellé accessible.
- **Pour basculer un état visible** (afficher/masquer, plié/déplié) → utiliser le
  composant qui porte cet état (`Accordion`), pas un bouton nu.

## Props

| Prop        | Type                                            | Défaut      | Rôle                                   |
| ----------- | ----------------------------------------------- | ----------- | -------------------------------------- |
| `variant`   | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'default'` | Poids visuel |
| `size`      | `'default' \| 'sm' \| 'lg' \| 'icon'`            | `'default'` | 36px, 30px, 44px, ou carré 36px |
| `disabled`  | `boolean`                                        | `false`     | Désactive l'interaction                 |
| `asChild`   | `boolean`                                        | `false`     | Rend l'enfant à la place du `<button>`  |
| `className` | `string`                                         | —           | Surcharge ponctuelle (fusion sûre)      |

Plus tous les attributs d'un `<button>` HTML.

**Choisir la variante :** `default` pour l'action principale, `secondary` pour une
action secondaire fréquente (c'est la plus courante dans la fiche), `outline` pour une
action de second plan posée sur fond blanc, `ghost` pour une action discrète en fin de
ligne, `destructive` pour une action irréversible, `link` pour ce qui se comporte comme
un lien sans en être un.

> **Base shadcn/ui.** Les noms de variantes et de tailles sont ceux de shadcn : un
> extrait de leur documentation se colle sans retouche. Seules les couleurs changent,
> et elles viennent des tokens.

## Exemples

```tsx
import { Button } from '@arquos/design-system/web';

<Button onClick={completer}>Compléter</Button>
<Button variant="secondary" onClick={annuler}>Annuler</Button>
<Button variant="ghost" size="sm" onClick={voirVides}>Afficher les champs vides</Button>
<Button variant="outline" onClick={ajouter}>Ajouter un document</Button>
<Button variant="destructive" onClick={supprimer}>Supprimer le constat</Button>
```

## Anatomie

- Fond : `default` → `colors.primary` · `secondary` → `palette.blue[50]` · `outline` → `colors.bg` bordé · `ghost` et `link` → transparent · `destructive` → `colors.danger`
- Texte : `default`/`destructive` → `colors.textOnDark` · `secondary` → `palette.blue[700]` · `outline`/`ghost` → `colors.textMuted`
- Hauteur : `sm` 30px, `default` 36px, `lg` 44px · Arrondi : `radius.control`
- Anneau de focus : `colors.primary`

## États

- **Survol** : la couleur de fond s'assombrit (`/90`, `/80`), comme chez shadcn.
- **Désactivé** : opacité 0.5, curseur par défaut, plus de survol.
- **Focus clavier** : anneau visible de 2px — jamais le retirer.
- **Libellé long** : le bouton s'élargit, le texte ne passe pas à la ligne.

## Accessibilité

- Rend un `<button type="button">` : ne soumet pas de formulaire par accident.
- Cible tactile d'au moins 36px en hauteur (`default`). Réserver `sm` au pointeur.
- Un bouton sans texte visible doit recevoir un `aria-label`.
