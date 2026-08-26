---
# Métadonnées lues par le catalogue (`npm run catalog`). Garder les clés telles
# quelles : c'est ce qu'un agent parcourt pour trouver le bon composant.
name: NomDuComposant
statut: stable # stable | beta | déprécié
# generique = une mécanique que n'importe quelle application aurait (bouton,
# modale, onglets) — elle vient de shadcn/Radix, ou elle le pourrait.
# metier = elle porte l'ascenseur : son vocabulaire, ses états, ses règles.
# Le doute se tranche ainsi : « une application de comptabilité en voudrait-elle
# telle quelle ? » Oui → generique.
couche: generique # generique | metier
role: Une phrase — ce que le composant fait, à la voix active.
mots_cles: [bouton, action, cta] # termes qu'un agent chercherait pour tomber ici
plateformes: [web, mobile] # où l'implémentation existe réellement
remplace:
  mobile: [components/Button.tsx] # fichiers d'app que ce composant remplace
  web: []
---

# NomDuComposant

## Quand l'utiliser

Deux ou trois cas concrets, formulés côté usage et non côté technique.
Exemple : « Déclencher l'action principale d'un écran (Soumettre le relevé). »

## Quand NE PAS l'utiliser

Le contre-exemple explicite, avec le composant à prendre à la place.
C'est la section qui évite qu'un agent détourne le composant : la renseigner
sérieusement, elle vaut plus que la liste des props.

Exemple : « Pour naviguer vers un autre écran → utiliser `Link`, pas un bouton. »

## Props

| Prop       | Type                              | Défaut      | Rôle                    |
| ---------- | --------------------------------- | ----------- | ----------------------- |
| `variant`  | `'primary' \| 'secondary'`        | `'primary'` | Poids visuel de l'action |
| `disabled` | `boolean`                         | `false`     | Désactive l'interaction  |

Les props identiques sur web et mobile portent le **même nom et les mêmes
valeurs**. Toute divergence est signalée ici explicitement, avec sa raison.

## Exemples

Des exemples **copiables tels quels**, pas des fragments à compléter.

```tsx
// mobile
<Button variant="primary" onPress={submit}>Soumettre le relevé</Button>
```

```tsx
// web
<Button variant="primary" onClick={submit}>Soumettre le relevé</Button>
```

## Logique partagée

Si le composant porte du **métier** — un vocabulaire, un seuil, une règle de
décision — cela vit dans `<nom>.logic.ts`, qui n'importe pas React. Le fichier
de plateforme n'y garde que le rendu.

Ce qui va dans la logique : les mots (« Non renseigné »), les seuils, les règles.
Ce qui n'y va pas : les classes et les styles — ce sont des tokens.

C'est ce partage qui empêche « Non renseigné » de devenir « — » sur l'autre
plateforme. Voir `CONVERGENCE.md`.

## Anatomie

Les tokens que le composant consomme, pour que sa modification reste prévisible :

- Fond : `colors.primary`
- Texte : `colors.textOnDark`
- Padding : `spacing.md` vertical, `spacing.base` horizontal
- Arrondi : `radius.md`

## États

Ce que le composant fait dans les situations qu'on oublie : chargement, contenu
vide, texte très long, désactivé, erreur. Un composant dont les états ne sont pas
décrits sera mal utilisé.

## Accessibilité

Le minimum vital : rôle, libellé accessible, taille de cible tactile (44 pt),
contraste. Préciser ce que l'appelant doit fournir (ex. un `aria-label` quand le
bouton n'a qu'une icône).
