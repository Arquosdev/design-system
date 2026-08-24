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
| `variant`   | `'primary' \| 'soft' \| 'ghost' \| 'danger'`     | `'primary'` | Poids visuel                           |
| `size`      | `'sm' \| 'md'`                                   | `'md'`      | `sm` (30px) en ligne, `md` (36px) sinon |
| `disabled`  | `boolean`                                        | `false`     | Désactive l'interaction                 |
| `asChild`   | `boolean`                                        | `false`     | Rend l'enfant à la place du `<button>`  |
| `className` | `string`                                         | —           | Surcharge ponctuelle (fusion sûre)      |

Plus tous les attributs d'un `<button>` HTML.

**Choisir la variante :** `primary` pour l'action principale, `soft` pour une action
secondaire fréquente (c'est la plus courante dans la fiche), `ghost` pour une action
discrète en fin de ligne, `danger` pour une action destructrice.

## Exemples

```tsx
import { Button } from '@arquos/design-system/web';

<Button onClick={completer}>Compléter</Button>
<Button variant="soft" onClick={annuler}>Annuler</Button>
<Button variant="ghost" size="sm" onClick={voirVides}>Afficher les champs vides</Button>
<Button variant="danger" onClick={supprimer}>Supprimer le constat</Button>
```

## Anatomie

- Fond : `primary` → `colors.primary` · `soft` → `palette.blue[50]` · `ghost` → transparent · `danger` → `colors.danger`
- Texte : `primary`/`danger` → `colors.textOnDark` · `soft` → `palette.blue[700]` · `ghost` → `colors.textMuted`
- Hauteur : `sm` 30px, `md` 36px · Arrondi : `radius.control`
- Anneau de focus : `colors.primary`

## États

- **Survol** : opacité 0.85. **Pressé** : opacité 0.7.
- **Désactivé** : opacité 0.5, curseur par défaut, plus de survol.
- **Focus clavier** : anneau visible de 2px — jamais le retirer.
- **Libellé long** : le bouton s'élargit, le texte ne passe pas à la ligne.

## Accessibilité

- Rend un `<button type="button">` : ne soumet pas de formulaire par accident.
- Cible tactile d'au moins 36px en hauteur (`md`). Réserver `sm` au pointeur.
- Un bouton sans texte visible doit recevoir un `aria-label`.
