---
name: AlertDialog
status: beta
layer: generique
role: Demande de confirmer un geste qui ne se défait pas, en disant ce qu'il emporte, avant de l'accomplir.
keywords: [confirmation, confirmer, supprimer, suppression, dialogue, modale, alerte, irréversible]
platforms: [web]
replaces:
  web: [components/record/suppression.tsx — panneau latéral de suppression]
---

# AlertDialog

Repris de shadcn/ui (`npx shadcn@latest add alert-dialog`), habillé aux tokens
Arquos. La primitive est Radix `AlertDialog` : la boîte ne se ferme pas d'un
clic à côté, il faut répondre.

## Quand l'utiliser

- **Confirmer une suppression** : « Supprimer le contact Jean Dupont ? », avec ce qui part avec lui, et « Supprimer définitivement » en ton danger.
- Tout geste **irréversible et court à décider** : une question, deux réponses.

## Quand NE PAS l'utiliser

- **Pour un formulaire**, ou une décision qui demande de saisir quelque chose de plus qu'un oui → `Sheet`. Une boîte de confirmation qui grossit devient un panneau mal placé.
- Pour annoncer qu'un geste a réussi → `Toast`. Rien n'est à confirmer.
- Pour un geste qui se défait (archiver, masquer) → aucune confirmation : on agit, et on offre de revenir en arrière.

## Composition

| Pièce | Rôle |
| --- | --- |
| `AlertDialog` | La racine, contrôlée par `open` et `onOpenChange` |
| `AlertDialogContent` | La boîte, centrée, au-dessus d'un voile |
| `AlertDialogHeader` | Le titre et sa description |
| `AlertDialogTitle` | La question, qui nomme l'objet |
| `AlertDialogDescription` | Ce que le geste emporte, en une phrase |
| `AlertDialogFooter` | « Annuler » puis l'action, à droite |
| `AlertDialogCancel` | Ferme sans rien faire |
| `AlertDialogAction` | Accomplit le geste ; `tone="danger"` pour une suppression |

`AlertDialogAction` ferme la boîte à son clic. Pour un geste asynchrone qui peut
être refusé, appeler `event.preventDefault()` dans `onClick` et fermer soi-même
une fois la réponse reçue : un refus doit se lire dans la boîte.

## Exemples

```tsx
<AlertDialog open={ouvert} onOpenChange={setOuvert}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Supprimer le contact Jean Dupont ?</AlertDialogTitle>
      <AlertDialogDescription>Ses 3 notes partent avec lui. Ce geste ne se défait pas.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction tone="danger">Supprimer définitivement</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Accessibilité

Radix pose `role="alertdialog"`, le titre et la description comme nom et
description accessibles, piège le focus dans la boîte et le place sur
« Annuler » : la réponse par défaut d'une question destructive est de ne rien
faire. Échap ferme comme « Annuler ».
