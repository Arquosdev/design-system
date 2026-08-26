---
name: Select
statut: beta
couche: generique
role: Choisir une valeur dans une liste fermée, sans quitter la ligne où on est.
mots_cles: [select, menu, liste, choix, deroulant, dropdown, action]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — les menus natifs des écarts et des champs à choix]
  mobile:
    - components/CategoryPickerModal.tsx
    - components/BrandModelPicker.tsx
---

# Select

Repris de shadcn/ui (`npx shadcn@latest add select`), habillé aux tokens Arquos.
Les noms exportés et la composition sont ceux de shadcn ; la primitive est Radix
`Select`.

## Quand l'utiliser

- Une **liste fermée** de deux à une douzaine de valeurs : l'action d'un écart,
  l'état d'un composant, une décision de remplacement.
- Quand la valeur retenue doit rester lisible sans ouvrir le menu.

## Quand NE PAS l'utiliser

- **Au-delà d'une douzaine de choix** → `Command` (⌘K). Un menu qu'on fait
  défiler n'est plus un choix, c'est une recherche mal outillée.
- **Pour deux valeurs qui s'opposent** (oui/non, actif/inactif) → un bouton
  bascule ou une case. Ouvrir un menu pour dire « oui » est un geste de trop.
- **Pour déclencher une action** → un bouton ou un menu d'actions. Ce composant
  choisit une valeur ; il ne fait rien d'autre.

## Trois écarts avec shadcn, tous assumés

**La gâchette s'ajuste à son contenu.** Celle de shadcn prend toute la largeur.
Dans une fiche, un menu de trois choix étiré sur un tiers d'écran promet une
saisie longue là où il n'y a qu'un mot à choisir — c'est ce qui a fait reprendre
la carte d'écart le 25/08/2026. `className="w-full"` rend la pleine largeur à qui
la veut.

**L'entrée retenue se teinte au lieu de porter une coche.** shadcn met un `Check`
à droite ; notre vocabulaire d'icônes n'a pas de coche nue — il a `conforme`, qui
veut dire « conforme » et non « celui-ci ». Le fond bleuté et le demi-gras sont
ce que `NavList` emploie déjà pour dire « vous êtes ici ». Le jour où une coche
nue entrera au vocabulaire, elle pourra reprendre sa place.

**Le caret vient de `Icon`** (`role="deplier"`), et pivote à l'ouverture : c'est
lui qui dit que ce champ en cache d'autres.

## Exemples

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@arquos/design-system/web';

<Select value={valeur} onValueChange={setValeur}>
  <SelectTrigger aria-label="Action à mener">
    <SelectValue placeholder="Aucune action" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="">Aucune action</SelectItem>
    <SelectItem value="r_glages_technicien">Réglages technicien</SelectItem>
    <SelectItem value="r_parations">Réparations</SelectItem>
    <SelectItem value="travaux">Travaux</SelectItem>
  </SelectContent>
</Select>
```

## Anatomie

- Gâchette : hauteur 32 px, largeur au contenu, arrondi `radius.control`, contour
  `colors.border`, ombre `shadow.card`, retrait `spacing.md` de chaque côté —
  le `px-3` de shadcn ; à quatre pixels le mot touchait son contour et le champ
  se lisait comme une étiquette serrée. Texte `typography.small` en
  `fontWeight.medium`
- Caret : `Icon` `deplier` en `sm`, `colors.textSubtle`, pivoté de 180° à l'ouverture
- Menu : arrondi `radius.md`, contour `colors.borderSoft`, ombre `shadow.pop`,
  jamais plus étroit que sa gâchette
- Entrée survolée : fond `colors.bgMuted`
- Entrée retenue : fond `palette.blue[50]`, texte `palette.blue[700]` en demi-gras

## États

- **Ouvert** : le caret pivote, le menu se pose sous la gâchette — au-dessus si
  la place manque, Radix s'en charge.
- **Désactivé** : opacité réduite, plus de pointeur. Une entrée peut l'être seule.
- **Sans valeur** : `SelectValue` affiche son `placeholder`. Un menu vide sans
  texte se lit comme un champ cassé.

## Accessibilité

Radix pose les rôles, le parcours au clavier (flèches, début/fin, saisie au vol)
et la fermeture à Échap. La gâchette doit porter un `aria-label` quand aucun
libellé visible ne la nomme — dans une rangée à trois colonnes, l'intitulé
au-dessus ne lui est pas rattaché.
