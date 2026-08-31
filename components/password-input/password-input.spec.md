---
name: PasswordInput
status: beta
layer: generique
role: Recueillir un mot de passe, avec une bascule masqué / en clair.
keywords: [mot de passe, password, connexion, login, oeil, masquer, afficher]
platforms: [web]
replaces:
  web:
    - app/login/form.tsx — un lien « Afficher » posé dans le rang du libellé
  mobile: []
---

# PasswordInput

## Quand l'utiliser

- Le champ de mot de passe d'un écran de connexion.
- La saisie d'un nouveau mot de passe, et sa confirmation.

## Quand NE PAS l'utiliser

- **Pour un code à usage unique** (SMS, application d'authentification) →
  `Input` avec `inputMode="numeric"`. Un code de six chiffres n'a pas besoin
  d'être masqué : il est déjà à l'écran d'où on le recopie, et le masquer fait
  ressaisir sans pouvoir relire.
- **Pour un secret qu'on colle plus qu'on ne tape** — une clé d'API, un jeton →
  `Textarea`. Ces valeurs font des dizaines de caractères, ne tiennent pas sur
  une ligne, et se vérifient en entier.

## Props

Celles de `<input>`, sauf `type` qui est piloté par la bascule.

| Prop        | Type      | Défaut  | Rôle                                        |
| ----------- | --------- | ------- | ------------------------------------------- |
| `className` | `string`  | —       | Classes de l'**enveloppe**, pas du champ    |
| `disabled`  | `boolean` | `false` | Grise le champ **et** le bouton de l'œil    |

`className` porte sur l'enveloppe parce que c'est elle qui a la bordure, la
largeur et l'anneau de mise au point. Le champ, dedans, est un détail
d'implémentation.

## Exemples

```tsx
// web
<Label htmlFor="motDePasse">Votre mot de passe</Label>
<PasswordInput
  id="motDePasse"
  name="motDePasse"
  autoComplete="current-password"
  required
/>
```

## Logique partagée

`password-input.logic.ts` porte les deux libellés de la bascule et la règle qui
choisit entre eux.

**Ils nomment l'ACTION, jamais l'état** : « Masquer le mot de passe » quand il
est en clair. Un libellé d'état laisse deviner ce que le clic produira, et l'œil
dessiné est déjà ambigu de ce côté-là — personne ne sait si une icône d'œil
montre l'état courant ou l'action à venir. C'est aussi pourquoi le vocabulaire
d'icônes porte DEUX rôles, `revealPassword` et `hidePassword`, et non un seul.

## Anatomie

L'enveloppe :

- Bordure : `border.color` (`focus` → `colors.primary`, `aria-invalid` →
  `colors.danger`)
- Arrondi : `radius.control`
- Fond : `colors.bg`
- Hauteur : 36 px, la même que `Input` et que `Button`

Le bouton, carré de 36 px, séparé par un filet `border.color` :

- Encre : `colors.textMuted`, `colors.text` au survol
- Fond au survol : `colors.bgMuted`
- Icône : rôle `revealPassword` / `hidePassword`, échelon `sm`

**La bordure est sur l'enveloppe et le champ n'en a aucune.** C'est ce qui donne
un bouton qui PARTAGE la bordure du champ au lieu de flotter par-dessus lui.
C'est aussi la construction de la page de connexion de l'app Bubble, où un
groupe bordé contient un champ `border_style: none` et le bouton.

## États

| | |
| --- | --- |
| masqué | L'état de départ, à chaque montage. `type="password"`, icône `revealPassword`. |
| en clair | `type="text"`, icône `hidePassword`, `aria-pressed="true"`. |
| mise au point | Anneau de 2 px sur l'enveloppe, jamais sur le champ seul. |
| erreur | `aria-invalid="true"` sur le champ : l'enveloppe passe en `danger`. |
| désactivé | Le champ **et** le bouton. Un œil actionnable sur un champ grisé promet de révéler une saisie qu'on ne peut pas faire. |
| valeur très longue | Le champ défile, l'enveloppe ne s'élargit pas. |

**L'état « en clair » repart FAUX à chaque montage, et rien ne le mémorise** — ni
stockage local, ni cookie. S'en souvenir afficherait le mot de passe de
quelqu'un sur un poste partagé, la fois suivante, sans qu'il l'ait demandé.

## Accessibilité

- Le bouton porte son `aria-label` (il n'a qu'une icône) et son `aria-pressed`.
  Sans `aria-pressed`, un lecteur d'écran annonce l'action sans dire si elle est
  déjà faite.
- **Le bouton reste dans l'ordre de tabulation.** `tabIndex={-1}` serait tentant
  pour que la tabulation aille droit au bouton suivant du formulaire ; la
  bascule est le seul moyen de relire ce qu'on a tapé, et la retirer du clavier
  la réserverait à la souris.
- Cible de 36 × 36 px : en dessous des 44 pt d'une cible tactile. Le composant
  est déclaré `web` seulement, et une implémentation mobile devra l'agrandir.
- L'anneau de mise au point du bouton est tourné vers l'intérieur : posé dehors,
  il serait coupé par l'enveloppe et deviendrait invisible au clavier.
