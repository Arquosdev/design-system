---
name: EmptyState
statut: stable
couche: generique
role: Dire pourquoi une zone est vide, et ce qu'on peut y faire.
mots_cles: [vide, empty, aucun, erreur, hors ligne, reessayer, rien]
plateformes: [web]
remplace:
  web: [src/app/fiche/sections/documents.tsx — messages de liste vide écrits sur place]
  mobile: [components/EmptyState.tsx]
---

# EmptyState

## Quand l'utiliser

- Une liste qui n'a rien à montrer : aucun document, aucun écart, aucun relevé.
- Un chargement qui a échoué — via `EmptyStateErreur`, qui lit l'erreur et
  choisit ses mots.
- Un filtre qui ne ramène rien : dire que le filtre est en cause, pas la donnée.

## Quand NE PAS l'utiliser

- **Pendant le chargement** → `Skeleton`. Afficher « Aucun document » avant que
  la réponse arrive est un mensonge d'une demi-seconde, et c'est celui qu'on
  remarque.
- **Pour un champ vide dans une fiche** → `FieldRow` dit déjà « Non renseigné ».
  Un bloc centré au milieu d'un formulaire casse la lecture.
- **Sans conseil.** « Aucun résultat » seul laisse devant un mur. Ce qui aide,
  c'est ce qu'on peut faire ensuite — élargir le filtre, ajouter, réessayer.
- **Avec un bouton qui ne marchera pas.** Hors ligne, un « Réessayer » qui
  échouera aussitôt use la patience ; c'est exactement ce que `EmptyStateErreur`
  évite en distinguant les deux cas.

## Props

| Prop | Type | Rôle |
| --- | --- | --- |
| `icone` | `IconRole` | Un rôle du vocabulaire, pas un dessin |
| `titre` | `string` | Ce qui se passe, en trois mots |
| `conseil` | `string` | Ce qu'il faut comprendre, et si possible quoi faire |
| `actionLabel` + `onAction` | `string` + `() => void` | Les deux ou aucun |

`EmptyStateErreur` prend `erreur` et `onReessayer`, et se débrouille du reste.

## Exemples

```tsx
import { EmptyState, EmptyStateErreur } from '@arquos/design-system/web';

<EmptyState
  icone="document"
  titre="Aucun document"
  conseil="Les pièces jointes au relevé apparaîtront ici."
/>

// l'erreur choisit ses propres mots
<EmptyStateErreur erreur={erreur} onReessayer={recharger} />
```

## Logique partagée

`empty-state.logic.ts` porte la **décision** et les **mots** :
`natureDeLEchec()` répond à « réessayer maintenant a-t-il une chance de
marcher ? », et `ECHECS` donne l'icône, le titre et le conseil de chaque cas.

Distinguer hors-ligne du reste n'est pas un raffinement : dans une gaine sans
réseau, un message générique enverrait le technicien appuyer en boucle. Le
mobile portait déjà cette décision, enfouie dans son composant ; le web l'avait
réécrite avec d'autres mots.

## Anatomie

- Icône en `iconSize.xl`, graisse pleine, dans un carré de 60 px `bgMuted`, arrondi `radius.md` — l'icône nue au milieu du vide se lit comme un défaut d'affichage

## États

Aucun état propre. C'est lui qui **est** un état.

## Accessibilité

- Le titre est un paragraphe, pas un titre de niveau : il ne doit pas s'insérer
  dans le plan du document, où il ferait un chapitre fantôme.
- Si l'état vide remplace une zone qui chargeait, retirer `aria-busy` de cette
  zone en même temps — sinon un lecteur d'écran continue d'annoncer une attente.
