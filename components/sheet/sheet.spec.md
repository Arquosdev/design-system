---
name: Sheet
statut: beta
couche: generique
role: Un panneau qui entre par le bord pour une tâche annexe, sans quitter l'écran.
mots_cles: [tiroir, panneau, drawer, sheet, lateral, completer, formulaire]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — panneau « Compléter »]
  mobile: [components/PhotoActionSheet.tsx, components/ResumeSurveySheet.tsx, components/ProductIdentificationSheet.tsx]
---

# Sheet

Repris de shadcn/ui (`npx shadcn@latest add sheet`), habillé aux tokens Arquos.
Les noms exportés et la composition sont ceux de shadcn ; la primitive est
Radix `Dialog`.

Deux écarts : les icônes sont en SVG posé, comme partout ici plutôt que via
`lucide-react` ; et l'animation vient de nos tokens — celle de shadcn s'appuie
sur `tw-animate-css`, une dépendance de plus pour quatre keyframes.

## Quand l'utiliser

- **Une tâche annexe qui a besoin de place** : remplir les dix champs vides
  d'une rubrique sans perdre de vue celle qu'on quitte.
- Quand **le contexte derrière compte** : le panneau laisse voir l'écran, une
  page entière le remplacerait.

## Quand NE PAS l'utiliser

- **Pour une décision courte** (confirmer, choisir parmi trois) → une boîte de
  dialogue centrée. Un panneau de 460 px pour une phrase est disproportionné.
- **Pour une information passagère** → `Toast`.
- **Pour regarder une image** → `PhotoViewer`.
- **Pour du contenu principal** : ce qu'on consulte souvent mérite une rubrique,
  pas un tiroir qu'il faut rouvrir à chaque fois.

## Props

Composition shadcn : `Sheet` (racine, `open` / `onOpenChange`), `SheetContent`,
`SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetBody`, `SheetFooter`,
`SheetClose`, `SheetCloseButton`.

| Prop   | Type      | Défaut    | Rôle                          |
| ------ | --------- | --------- | ----------------------------- |
| `side` | `'right'` | `'right'` | Le bord d'où le panneau entre |

`SheetBody` est le seul à défiler : l'en-tête et le pied restent en place, pour
que le bouton « Enregistrer » ne parte pas hors de l'écran sur une longue liste.

## Exemples

```tsx
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter, SheetCloseButton, Button,
} from '@arquos/design-system/web';

<Sheet open={ouvert} onOpenChange={setOuvert}>
  <SheetContent>
    <SheetHeader>
      <div className="flex items-start justify-between gap-md">
        <SheetTitle>Compléter — Machine</SheetTitle>
        <SheetCloseButton />
      </div>
      <SheetDescription>4 à renseigner sur cette section uniquement.</SheetDescription>
    </SheetHeader>
    <SheetBody>{/* les champs */}</SheetBody>
    <SheetFooter>
      <span className="text-small text-text-muted">2 sur 4 remplis</span>
      <Button onClick={enregistrer}>Enregistrer</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>;
```

## Anatomie

- Panneau : 460 px, pleine hauteur, entrant par la droite, ombre `shadow.pop`
- Voile : `colors.brand` à 35 %
- En-tête et pied : séparés par un filet `colors.borderSoft`, fixes
- Entrée 260 ms, sortie 200 ms

## États

- **Fermeture** : Échap, clic sur le voile, ou la croix. L'animation de sortie
  joue avant le démontage — Radix l'attend, c'est pourquoi les keyframes sont de
  vraies animations et non des transitions.
- **Écran étroit** : le panneau garde 16 px de marge (`max-w-[calc(100vw-32px)]`)
  pour qu'on voie qu'il y a quelque chose derrière.

## Accessibilité

- Radix pose le rôle `dialog`, le piège à focus, Échap, et masque le reste de la
  page aux lecteurs d'écran.
- `SheetTitle` est **obligatoire** : sans lui, Radix avertit en console et le
  panneau s'annonce sans nom. Le masquer visuellement reste possible (`sr-only`).
- Le focus revient d'où il venait à la fermeture — un `SheetTrigger` le garantit ;
  sans trigger, c'est à l'appelant de le rendre.
