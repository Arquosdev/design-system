---
name: IconButton
statut: stable
couche: generique
role: Déclencher une action représentée par une icône seule, sans perdre son nom accessible.
mots_cles: [bouton, icone, action, telecharger, editer, fermer, supprimer]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — boutons carrés recopiés inline]
  mobile:
    - components/IconButton.tsx
    - components/RowEditButton.tsx
---

# IconButton

## Quand l'utiliser

- Une action répétée en fin de ligne, où un libellé alourdirait la liste :
  télécharger un document, corriger une ligne.
- Une action dont l'icône est universellement lue : fermer, agrandir.

## Quand NE PAS l'utiliser

- **Pour une action importante ou rare.** Une icône seule se devine ; l'action
  principale d'un écran mérite un mot. Utiliser `Button`.
- **Pour une icône dont le sens n'est pas évident** sans son libellé — au moindre
  doute, écrire le mot.
- **Comme simple décoration** : un pictogramme non cliquable n'est pas un bouton,
  c'est un `<svg aria-hidden>`.

## Props

| Prop        | Type                                    | Défaut       | Rôle                                    |
| ----------- | --------------------------------------- | ------------ | --------------------------------------- |
| `label`     | `string`                                | —            | **Obligatoire.** Nom accessible et infobulle |
| `icon`      | `ReactNode`                             | —            | L'icône, en `currentColor`               |
| `variant`   | `'outline' \| 'soft' \| 'ghost'`        | `'outline'`  | Poids visuel                             |
| `size`      | `'sm' \| 'md'`                          | `'md'`       | 30px ou 36px de côté                     |

`label` est obligatoire par construction : un bouton sans texte visible qui n'a
pas de nom accessible est muet pour un lecteur d'écran.

## Exemples

```tsx
import { IconButton } from '@arquos/design-system/web';

<IconButton label={`Télécharger ${doc.nom}`} icon={<IconeTelechargement />} onClick={telecharger} />
<IconButton label="Corriger cette ligne" icon={<IconeCrayon />} variant="ghost" size="sm" />
```

Le libellé nomme **la cible**, pas seulement le geste : « Télécharger le carnet
d'entretien » vaut mieux que « Télécharger », répété quinze fois dans une liste.

## Anatomie

- Carré : `sm` 30px, `md` 36px · Arrondi : `radius.control`
- `outline` : fond `colors.bg`, bordure `colors.border`, icône `colors.textMuted`
- `soft` : fond `palette.blue[50]`, icône `palette.blue[700]`
- `ghost` : transparent, icône `colors.textMuted`

## États

- **Survol** : fond `colors.bgMuted` (`outline`, `ghost`) ou opacité 0.8 (`soft`).
- **Désactivé** : opacité 0.5, plus d'interaction.
- **Focus clavier** : anneau visible de 2px.

## Accessibilité

- `label` alimente `aria-label` **et** `title` : le premier pour les lecteurs
  d'écran, le second pour l'infobulle au survol.
- La cible fait au moins 30px ; sur une interface tactile, préférer `md`.
- L'icône est `aria-hidden` : c'est le bouton qui porte le nom, pas le dessin.
