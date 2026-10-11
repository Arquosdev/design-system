---
name: StatusBadge
status: beta
layer: metier
role: Dire où en est un objet (relevé, écart, devis, facture, contrat, appel, visite, demande de pièce, équipement), du même mot et de la même couleur dans toutes les applications.
keywords: [statut, etat, pastille, badge, releve, ecart, devis, facture, contrat, appel, visite, cycle]
platforms: [web, mobile]
replaces:
  web:
    - lib/survey-status.ts — couleursDeStatut
    - lib/gmao/statuts-devis.ts — STATUTS_DEVIS.ton
    - components/pastilles.tsx — tons recopiés par objet
  mobile:
    - components/StatusPill.tsx
---

# StatusBadge

## Quand l'utiliser

- Le statut d'un objet, dans une liste, une fiche, un tableau de bord, au portail ou sur le téléphone.
- Partout où le même objet paraît : c'est ce qui garantit qu'« Assigné » a la même couleur au bureau et sur le terrain.

## Quand NE PAS l'utiliser

- **Pour une catégorie** (type d'affaire, formule, nature d'un relevé) → `Tag`. Une catégorie n'a pas d'état ; lui donner une teinte d'état fait lire « Étude sécurité » comme « Soumis ».
- **Pour un état qui n'est pas dans la table** → l'ajouter à `status-badge.logic.ts`, jamais un `Badge` coloré à la main dans l'écran.
- **Pour une échéance ou un compteur** → `Badge`.

## La couleur suit le sens, le même pour tous les objets

| Teinte | Sens | Exemples |
| --- | --- | --- |
| bleu `info` | prévu, envoyé, en attente d'un tiers | Assigné, Envoyé, Planifiée |
| ambre `warning` | en cours, ou à faire maintenant | En cours, Brouillon, Ouvert |
| vert `success` | abouti | Soumis, Payée, Résolu |
| rouge `destructive` | bloqué, en retard, dangereux | À l'arrêt, En retard, Danger grave |
| gris `muted` | clos sans suite, archivé, simple constat | Archivé, Refusé, Résilié |

Le rouge ne dit jamais un refus : un devis refusé est clos, pas en danger. Un test le tient.

## Props

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `object` | `StatusObject` | — | L'objet, donc sa table |
| `status` | `string \| null` | — | Clé, code de la base ou mot de Bubble : `statusKey` le ramène à une clé |
| `audience` | `'agency' \| 'client'` | `'agency'` | Web seulement : le portail lit les mots du client (« À valider ») |
| `fallback` | `string` | — | Le mot d'un statut inconnu, rendu en gris |

Un statut inconnu garde son mot, en gris : on ne colore pas ce qu'on ne connaît pas.

## La logique

`status-badge.logic.ts` exporte `STATUSES` (la table), `statusKey` (une écriture reçue vers une clé), `statusEntry` et `statusLabel`. Un serveur ou un PDF qui écrit un statut le prend là aussi.

## Accessibilité

Le mot porte l'information, la couleur la redouble : un daltonien ou un lecteur d'écran lit « En retard », pas « rouge ».

## Exemples

```tsx
<StatusBadge object="survey" status={row.statusCode} />
<StatusBadge object="quote" status="envoye" audience="client" />   {/* « À valider » */}
<StatusBadge object="quote" status={code} fallback={libelleDeLaBase} />
```
