---
name: ScreenHeader
status: beta
layer: generique
role: Poser l'en-tête d'un écran mobile, le même partout : la flèche de retour, des boutons d'icône, puis le titre dans le corps.
keywords: [en-tête, entête, titre, retour, header, écran, navigation]
platforms: [mobile]
replaces:
  mobile: [les en-têtes dessinés à la main de app/survey/[id].tsx, app/equipment/[id].tsx et des formulaires]
  web: []
---

# ScreenHeader

## Quand l'utiliser

- En tête de tout écran poussé dans une pile de myArquos : une fiche (relevé,
  équipement, panne, visite), un formulaire, un sélecteur.
- Avec `backLabel="Fermer"` en tête d'une feuille qui se ferme au lieu de
  revenir.

## Quand NE PAS l'utiliser

- **Pour l'action principale de l'écran** (Démarrer, Soumettre, Enregistrer) :
  elle va dans le pied fixe, à portée de pouce. Le coin haut-droit est le point
  le plus difficile à atteindre à une main (audit A4-11).
- Pour un onglet de la barre du bas : il garde son grand titre qui se replie au
  défilement.
- Sur le web : `PageHeader`.

## Props

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `title` | `string` | | **Obligatoire.** Ce qu'est l'écran, deux lignes au plus |
| `subtitle` | `string` | | Une précision discrète (les numéros) ; jamais une redite du titre, qui est alors omise |
| `onBack` | `() => void` | | Le retour ; absent, pas de flèche |
| `backLabel` | `string` | `'Retour'` | `'Fermer'` dessine une croix |
| `actions` | `ReactNode` | | Des `IconButton` en `ghost`, à droite |
| `onTitlePress` | `() => void` | | Un appui sur le titre |

## Exemples

```tsx
<ScreenHeader
  title={releve.adresse}
  subtitle={`Équipement ${releve.equipement} · Relevé ${releve.numero}`}
  onBack={() => router.back()}
  actions={<IconButton label="Modifier le relevé" icon="edit" variant="ghost" onPress={modifier} />}
/>
```

## Anatomie

- Rangée : hauteur `controlHeight.lg` (44), la flèche décalée de `spacing.sm`
  vers la gauche pour s'aligner sur la gouttière du corps.
- Titre : `typography.titleLarge`, aligné à gauche, deux lignes au plus.
- Sous-titre : `typography.caption`, `textMuted`, une ligne.
- Fond : `colors.bgMuted`, celui de la page ; retrait `spacing.base` sur les côtés.

## Accessibilité

Le titre porte `accessibilityRole="header"`. La flèche est un `IconButton`, donc
nommée par `backLabel`.
