---
name: Command
statut: beta
couche: generique
role: Atteindre n'importe quoi dans un écran dense, en tapant son nom.
mots_cles: [recherche, palette, commande, cmdk, raccourci, aller a, chercher]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — palette ⌘K]
  mobile: [components/SearchBar.tsx]
---

# Command

Repris de shadcn/ui (`npx shadcn@latest add command`), habillé aux tokens
Arquos. Les noms exportés et la composition sont ceux de shadcn : un extrait de
leur documentation se colle ici sans retouche. Le moteur est `cmdk` — filtrage,
navigation aux flèches, sémantique `combobox` / `listbox`.

Deux écarts assumés :

- `CommandDialog` s'appuie directement sur la primitive Radix `Dialog`, le
  design system n'ayant pas encore de composant Dialog.
- Les icônes sont en SVG posé, comme partout ailleurs ici — ajouter
  `lucide-react` pour une loupe serait une deuxième convention d'icônes.

## Quand l'utiliser

- **Un écran trop dense pour être parcouru** : la fiche équipement porte plus de quatre cents champs répartis sur neuf rubriques.
- Quand la destination est **connue de celui qui cherche** : il sait ce qu'il veut, il ne veut pas naviguer.

## Quand NE PAS l'utiliser

- **Pour choisir une valeur dans un champ** → `FieldRow` en `kind="choice"`. La palette navigue ; elle n'enregistre rien.
- **Pour filtrer une liste affichée** → `FilterChips`. Le filtre restreint ce qu'on voit, la palette emmène ailleurs.
- **Pour un menu de moins d'une dizaine d'entrées** → `NavList`. Ouvrir une boîte de recherche pour neuf rubriques est un détour.

## Props

Les composants reprennent les props de `cmdk` — voir sa documentation.

`CommandDialog` :

| Prop           | Type                   | Défaut | Rôle                                        |
| -------------- | ---------------------- | ------ | ------------------------------------------- |
| `titre`        | `string`               | —      | Nom du dialogue pour les lecteurs d'écran   |
| `open`         | `boolean`              | —      | Ouvert ou non                               |
| `onOpenChange` | `(o: boolean) => void` | —      | Échap, clic dehors                          |

## Exemples

```tsx
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from '@arquos/design-system/web';

<CommandDialog titre="Recherche de champ" open={ouverte} onOpenChange={setOuverte}>
  <CommandInput placeholder="Rechercher un champ (ex. diamètre, GSM, charge)…" />
  <CommandList>
    <CommandEmpty>Aucun champ ne correspond.</CommandEmpty>
    {groupes.map((g) => (
      <CommandGroup key={g.titre} heading={g.titre}>
        {g.items.map((it) => (
          <CommandItem key={it.id} value={it.recherche} onSelect={() => aller(it)}>
            <span className="flex-1">{it.label}</span>
            <span className="font-semibold">{it.valeur}</span>
          </CommandItem>
        ))}
      </CommandGroup>
    ))}
  </CommandList>
</CommandDialog>;
```

`cmdk` filtre sur la prop `value` de chaque `CommandItem`. Y mettre tout ce sur
quoi on veut pouvoir chercher — libellé **et** valeur — sinon taper « OTIS » ne
trouvera pas le champ « Marque ».

## États

- **Aucun résultat** : `CommandEmpty` dit « Aucun champ ne correspond ». Une
  liste vide sans phrase se lit comme un écran qui n'a pas fini de charger.
- **Ouverture** : le focus entre dans le champ de saisie, sinon la tabulation
  repartirait du haut de la page.

## Accessibilité

- `cmdk` pose la sémantique `combobox` / `listbox` : flèches, Entrée, et l'entrée courante annoncée à mesure.
- Échap ferme, et le focus revient d'où il venait.
- Le raccourci d'ouverture appartient à l'écran, pas au composant : c'est lui qui sait si ⌘K est libre chez lui.
