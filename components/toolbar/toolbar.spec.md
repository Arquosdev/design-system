---
name: Toolbar
status: beta
layer: generique
role: Réunir au-dessus d'une liste ce qu'on peut lui faire — filtrer, composer, exporter, changer de vue.
keywords: [barre, outils, actions, liste, filtres, colonnes, export]
platforms: [web]
replaces:
  web: []
  mobile: []

---

# Toolbar

## Quand l'utiliser

Au-dessus d'une liste ou d'un tableau, pour porter ce qui agit sur **l'ensemble
affiché** : ouvrir les filtres, choisir les colonnes, exporter, basculer de vue.

## Quand NE PAS l'utiliser

- **Pour agir sur une sélection** : c'est la `SelectionBar`, en bas, et elle
  n'apparaît que quand quelque chose est coché.
- **Pour naviguer** : une barre d'outils règle un écran, elle n'en change pas.
- **Pour montrer un état** : un compteur de résultats appartient au pied de
  liste, où il accompagne le rang affiché.

## Anatomie

- Barre : `spacing.base` horizontal sur un téléphone, `spacing.xl` au-delà, `spacing.md` vertical, `spacing.sm` entre
  boutons, repliable sur plusieurs lignes quand l'écran est étroit
- Bouton : 36 px de haut, bord `colors.border`, texte `small` en `semibold`
  `colors.textMuted`, icône de 16 px
- Bouton actif : bord `colors.primary`, fond `colors.infoBg` — il dit que le
  réglage qu'il ouvre est en cours
- Compteur : pastille `colors.primary`, pour ce qui est actif et se compte
- Précision : en graisse normale, pour ce qui se lit sans compter (« 9 / 24 »)

## La recherche

`ToolbarSearch` se pose **avec les outils, à droite de la barre** (après
`ToolbarSpacer`), **repliée en loupe** : elle s'ouvre au clic d'un glissement
de largeur et se replie quand on la quitte vide, comme chez ClickUp (Louis,
12/10/2026 : sous la recherche globale de l'en-tête, un second champ ouvert
« noie un peu l'utilisateur »). Une recherche en cours la garde ouverte. Le
champ est contrôlé — la liste décide quand interroger et garde la recherche
dans l'adresse. « / » l'ouvre et y place le curseur ; Échap la vide, puis la
referme. Le champ n'affiche plus de repère « / » (Louis, 13/10/2026) : il ne
paraissait qu'une fois le champ ouvert, quand on n'en avait plus besoin ; le
raccourci se lit dans l'aide du clavier. Pleine largeur sur un téléphone, 256 px au-delà. `repliable={false}`
la garde toujours ouverte, pour une page dont chercher est le sujet.

## Sur un téléphone

Sous 640 px, un `ToolButton` ne garde que son icône (son libellé reste, masqué,
pour un lecteur d'écran) et sa précision `extra` disparaît ; son compte reste.
La barre tient ainsi sur une ligne au lieu de quatre.

## Ce qu'il faut savoir

**Le bouton transmet sa ref.** Un menu ancré dessus par `PopoverTrigger asChild`
n'a rien à quoi s'accrocher sans elle, et ne s'ouvre jamais — sans erreur, ce qui
coûte du temps à comprendre.

**Un seul bouton par action, pas un par format.** « Exporter » puis le choix du
format vaut mieux que « CSV » et « PDF » côte à côte : deux boutons pour la même
action pèsent dans une barre déjà chargée.

## Exemple

```tsx
<Toolbar>
  <ToolbarSearch value={q} onChange={setQ} placeholder="Numéro, adresse, client" />
  <ToolButton icon="filter" count={3} active onClick={ouvrirFiltres}>Filtres</ToolButton>
  <ToolButton icon="columns" extra="9 / 24" onClick={ouvrirColonnes}>Colonnes</ToolButton>
  <ToolbarSpacer />
  <ToolButton icon="download">Exporter</ToolButton>
</Toolbar>
```
