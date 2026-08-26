---
name: Banner
statut: stable
couche: generique
role: Informer d'une condition qui dure, en haut d'une zone, sans interrompre.
mots_cles: [bandeau, banner, hors ligne, alerte, information, permanent, statut]
plateformes: [web]
remplace:
  web:
    - src/app/fiche/sections/bandeau-releve.tsx
    - le bandeau de démonstration et celui de lecture seule
  mobile: []
---

# Banner

## Quand l'utiliser

- Une condition qui **dure** et change ce qu'on peut faire : hors ligne, jeu de démonstration, fiche en lecture seule, envoi en attente.
- En haut de la zone concernée — la page, ou seulement l'encart touché.

## Quand NE PAS l'utiliser

- **Pour annoncer un résultat** → `Toast`. « ✓ Enregistré » n'est pas une condition, c'est un événement : il passe.
- **Pour une erreur de champ** → le message sous le champ, relié par `aria-describedby`. Un bandeau en haut oblige à chercher lequel des vingt champs est en cause.
- **Quand la zone est vide** → `EmptyState`. Un bandeau au-dessus du néant explique un contenu qui n'est pas là.
- **En rafale.** Deux bandeaux empilés, personne n'en lit aucun. S'il y en a deux, c'est qu'un seul dit vraiment quelque chose.

> **Ce composant ne détecte rien.** Savoir qu'on est hors ligne, qu'une file
> d'envoi traîne depuis plus d'une seconde et demie, ou qu'un jeton a expiré
> appartient à l'app — c'est elle qui a le contexte réseau, les délais et les
> règles. Le mobile a un `OfflineBanner` entier, câblé à son routeur et à son
> contexte de synchronisation : **c'est sa coque qui est remontée ici, pas sa
> plomberie**, et c'est délibéré.

## Props

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `ton` | `'info' \| 'attention' \| 'danger'` | `'info'` | Le registre |
| `icone` | `IconRole` | — | Un rôle du vocabulaire, facultatif |
| `action` | `ReactNode` | — | Ce qu'on peut faire — un lien, un bouton |
| `children` | `ReactNode` | — | Le message |

**Choisir le ton** : `info` pour une condition neutre qu'il faut connaître
(démonstration, lecture seule), `attention` pour ce qui dégrade sans bloquer
(hors ligne, envoi en attente), `danger` pour ce qui empêche.

## Exemples

```tsx
import { Banner } from '@arquos/design-system/web';

<Banner ton="attention" icone="horsLigne">
  Hors ligne — les modifications partiront à la reconnexion.
</Banner>

<Banner icone="information" action={<a href="?equipment=…">Ouvrir un appareil</a>}>
  Jeu de démonstration — aucune donnée réelle.
</Banner>
```

## États

Aucun état propre. Il est monté ou il ne l'est pas — et c'est l'app qui décide,
pas lui.

## Accessibilité

- `role="status"` : annoncé poliment, sans couper ce que le lecteur d'écran est en train de dire.
- Le ton passe par la couleur **et par les mots**.
