---
name: Button
status: stable
layer: generique
role: Déclencher une action. Le poids visuel dit l'importance de l'action, pas sa nature.
keywords: [bouton, action, cta, valider, enregistrer, annuler, inactif, grisé, non cliquable, désactivé]
platforms: [web]
replaces:
  web: [public/fiche/index.html — boutons inline recopiés 13 fois]
  mobile:
    - components/Button.tsx
    - components/AddNewButton.tsx
---

# Button

Chaque bouton porte `data-arq="button"`. C'est de quoi reconnaître, depuis un
test, un bouton d'ici d'un bouton redessiné à la main : comparer des pixels ne
suffit pas, une copie tirée des mêmes tokens mesure pareil et diverge au premier
état, survol ou désactivé.

## Quand l'utiliser

- Déclencher une action sur la page : « Compléter », « Enregistrer », « Annuler ».
- Une seule action `primary` par zone de l'écran.

## Quand NE PAS l'utiliser

- **Pour naviguer vers une autre page** → utiliser un lien. Un bouton agit, un lien déplace.
- **Pour une action portée par une icône seule** → `IconButton` (à venir), qui impose un libellé accessible.
- **Pour basculer un état visible** (afficher/masquer, plié/déplié) → utiliser le composant qui porte cet état (`Accordion`), pas un bouton nu.

## `inactive` ou `disabled`

Deux façons d'être indisponible, et elles ne se choisissent pas au hasard.

| | `inactive` | `disabled` |
| --- | --- | --- |
| Le bouton prend le focus | oui | non |
| Il reçoit le survol | oui | non |
| Il peut dire pourquoi | **oui** | non |
| Attribut posé | `aria-disabled` | `disabled` |

**Prendre `inactive` dès qu'une raison existe.** `disabled` pose
`pointer-events-none` : le bouton ne reçoit ni survol ni focus, donc il ne peut
porter ni infobulle ni `Popover`. La seule façon d'apprendre pourquoi le geste
est impossible devient alors de le tenter — et il ne se passe rien.

C'est ce que Louis a décrit le 01/09/2026, sur le bouton « Nouvel équipement »
d'une liste sans agence choisie : « on dirait que c'est un bouton qui est
cliquable ».

`disabled` garde son emploi : le contrôle qui n'est pas là pour cet
utilisateur, et dont il n'y a rien à dire.

**Un bouton `inactive` muet est le défaut, pas une variante.** La raison va soit
dans `inactiveReason`, soit dans une phrase visible juste à côté — pas dans les
deux, un lecteur d'écran la lirait deux fois.

Et si le geste n'existe pas du tout dans ce contexte — pas « impossible ici »
mais « pas encore écrit » — ne rendre aucun bouton. Un bouton inactif fait
chercher le droit qui manque.

## Props

| Prop        | Type                                            | Défaut      | Rôle                                   |
| ----------- | ----------------------------------------------- | ----------- | -------------------------------------- |
| `variant`   | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'default'` | Poids visuel |
| `size`      | `'default' \| 'sm' \| 'lg' \| 'icon'`            | `'default'` | 36px, 30px, 44px, ou carré 36px |
| `inactive`  | `boolean`                                        | `false`     | Le geste est impossible ici, et on peut dire pourquoi |
| `inactiveReason` | `string`                                    | —           | La raison, en infobulle et en description accessible |
| `disabled`  | `boolean`                                        | `false`     | Retire le contrôle — aucune raison à donner |
| `asChild`   | `boolean`                                        | `false`     | Rend l'enfant à la place du `<button>`  |
| `className` | `string`                                         | —           | Surcharge ponctuelle (fusion sûre)      |

Plus tous les attributs d'un `<button>` HTML.

**Choisir la variante :** `default` pour l'action principale, `secondary` pour une
action secondaire fréquente (c'est la plus courante dans la fiche), `outline` pour une
action de second plan posée sur fond blanc, `ghost` pour une action discrète en fin de
ligne, `destructive` pour une action irréversible, `link` pour ce qui se comporte comme
un lien sans en être un.

> **Base shadcn/ui.** Les noms de variantes et de tailles sont ceux de shadcn : un extrait de leur documentation se colle sans retouche. Seules les couleurs changent, et elles viennent des tokens.

## Exemples

```tsx
import { Button } from '@arquos/design-system/web';

<Button onClick={completer}>Compléter</Button>
<Button variant="secondary" onClick={annuler}>Annuler</Button>
<Button variant="ghost" size="sm" onClick={voirVides}>Afficher les champs vides</Button>
<Button variant="outline" onClick={add}>Ajouter un document</Button>
<Button variant="destructive" onClick={delete}>Supprimer le constat</Button>
```

```tsx
// La raison en infobulle : le bouton est seul dans sa barre.
<Button inactive inactiveReason="Choisissez une agence pour créer un équipement">
  Nouvel équipement
</Button>

// La raison à l'écran : pas d'`inactiveReason`, elle serait lue deux fois.
<div className="flex items-center gap-sm">
  <p className="text-caption text-text-muted">Choisissez une agence pour créer un client.</p>
  <Button inactive>Nouveau client</Button>
</div>
```

## États

- **Survol** : la couleur de fond s'assombrit (`/90`, `/80`), comme chez shadcn.
- **Inactif** (`inactive`) : une plaque grise pleine — `colors.inactiveBg`, encre
  `colors.onInactiveBg`, bordure `colors.border` — **la même pour toutes les
  variantes**. C'est voulu : un bouton indisponible doit cesser de ressembler à
  la variante qu'il était, sinon il continue de promettre son geste. Le survol ne
  peint plus rien, le curseur devient `not-allowed`, le clic est avalé par le
  composant.
- **Désactivé** (`disabled`) : opacité 0.5, curseur par défaut, plus de survol.
- **Focus clavier** : anneau visible de 2px — jamais le retirer.
- **Libellé long** : le bouton s'élargit, le texte ne passe pas à la ligne.

## Logique partagée

`button.logic.ts` porte la règle des trois disponibilités — `active`,
`inactive`, `disabled` — l'arbitrage quand les deux drapeaux sont posés
(`disabled` gagne), et les attributs qui en découlent. Sans React : la règle
vaut aussi pour le natif, seules les classes changent.

## Accessibilité

- Rend un `<button type="button">` : ne soumet pas de formulaire par accident.
- Cible tactile d'au moins 36px en hauteur (`default`).
- Un bouton sans texte visible doit recevoir un `aria-label`.
- Un bouton `inactive` porte `aria-disabled` et **reste dans l'ordre de
  tabulation** : c'est ce qui permet de lire sa raison au clavier comme à la
  souris.
- **Le contraste de l'état inactif est mesuré, pas jugé à l'œil** : 5,99 pour 1,
  vérifié à la source par `scripts/check-contraste.mjs` (paire `inactiveBg` /
  `onInactiveBg`). Il fallait le mesurer là : `opacity-50` échappe au lecteur de
  classes, et **axe exempte du contraste tout ce qui porte `aria-disabled`** —
  les deux contrôles du dépôt étaient aveugles à ce texte. L'ancien rendu était
  à **2,33** pour un bouton plein et **2,06** pour un `outline`.
