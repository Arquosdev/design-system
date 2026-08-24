---
# Métadonnées lues par le catalogue (`npm run catalog`). Garder les clés telles
# quelles : c'est ce qu'un agent parcourt pour trouver le bon composant.
name: NomDuComposant
statut: stable # stable | beta | déprécié
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
