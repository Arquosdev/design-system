---
name: Drawer
status: beta
layer: generique
role: Ouvrir un panneau latéral pour régler ce qu'on regarde, sans quitter l'écran.
keywords: [tiroir, panneau, filtres, colonnes, réglages, latéral, drawer]
platforms: [web]
replaces:
  web: []
  mobile: []

---

# Drawer

## Quand l'utiliser

Pour régler ce qu'un écran montre : les filtres d'une liste, les colonnes d'un
tableau, les options d'un export. Le réglage est long, il ne tient pas dans une
barre d'outils, et on veut garder l'écran sous les yeux pendant qu'on le change.

## Quand NE PAS l'utiliser

- **Pour créer ou modifier un enregistrement** : c'est un formulaire, il mérite
  sa page ou son `Sheet`. Un tiroir dit « je règle l'affichage », pas « j'écris
  dans la base ».
- **Pour une confirmation** : deux lignes et deux boutons n'ont pas besoin de
  460 px de large.
- **Pour un contenu qu'on lit** : un tiroir se referme, ce qu'on lit reste.

## Anatomie

- Voile : `colors.brand` à 35 %, posé sur la zone de contenu et non sur la page
- Panneau : 460 px, toute la hauteur, `colors.bg`, `shadow.pop`, trait à gauche
- En-tête : titre en `typography.bodyLarge` gras, détail en `small` discret,
  bouton de fermeture de 30 px
- Corps : défile seul, `spacing.lg` de marge, `spacing.lg` entre les sections
- Pied : fixe, action discrète à gauche, action attendue à droite

## Trois règles qu'il porte

**Il se pose sur la zone de contenu, pas sur la page.** La navigation reste
visible : on règle un écran, on ne le quitte pas. Le parent doit être `relative`.

**Le voile ferme, il ne valide pas.** Dans un panneau de filtres on clique
beaucoup ; enregistrer au clic extérieur ferait écrire par accident.

**Le pied ne défile pas.** Ce qui applique le réglage ne doit jamais se
chercher, même après vingt contrôles.

## Exemple

```tsx
<Drawer
  title="Filtres"
  detail="3 actifs · 29 disponibles"
  onClose={fermer}
  secondary={<button onClick={vider}>Tout réinitialiser</button>}
  primary={<button onClick={appliquer}>Appliquer</button>}
>
  <DrawerSection title="Équipement">…</DrawerSection>
  <DrawerSection title="Immeuble" separated>…</DrawerSection>
</Drawer>
```

## Accessibilité

`role="dialog"` et `aria-label` portent le titre. Le voile est un `button` nommé,
donc atteignable au clavier — fermer ne demande pas la souris.
