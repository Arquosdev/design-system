---
name: Metric
status: beta
layer: generique
role: Dire un chiffre de tableau de bord en tête de la carte qu'il résume, en rangée avec ses voisins.
keywords: [indicateur, chiffre, kpi, statistique, tableau de bord, metric, mesure]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# Metric : `Metric`, `MetricRow`

## Quand l'utiliser

- En tête d'une carte de tableau de bord, une rangée de chiffres qui résument ce que la
  carte montre dessous : les dépannages du mois au-dessus du tableau par type, les mesures
  d'une période au-dessus de leur graphique.
- Quand les chiffres CHOISISSENT ce que la carte montre (le graphique du pilotage
  commercial) : `as={Link}` et `selected` sur celui qui est affiché.

## Quand NE PAS l'utiliser

- Une bande de grands chiffres seuls, sans rien dessous (Louis, 12/11/2026) : les chiffres
  d'état vont dans la colonne de droite, en lignes (`DetailGroup`, `DetailRow`).
- Un chiffre dans une fiche → `FieldRow` ; une proportion mise en avant → `ProgressBar`.
- `StatTile` est l'ancienne tuile isolée, à bordure et arête marine : ne plus l'employer
  sur une page en cartes.

## Props

| Prop       | Type                                | Défaut      | Rôle |
| ---------- | ----------------------------------- | ----------- | ---- |
| `label`    | `ReactNode`                         | —           | Ce que le chiffre mesure, 12 px gris |
| `value`    | `ReactNode`                         | —           | Le chiffre mis en forme, 20 px |
| `caption`  | `ReactNode`                         | —           | Une précision, 12 px gris |
| `tone`     | `'default' \| 'danger' \| 'success'` | `'default'` | La couleur, réservée à l'alerte |
| `selected` | `boolean`                           | —           | Souligné comme un onglet actif |
| `as`       | `ElementType`                       | `'div'`     | `Link` ou `button` pour un indicateur qui s'ouvre ou se choisit |

`MetricRow` (ou la classe `METRIC_ROW`) pose les indicateurs en rangée : un filet entre
eux, un retour à la ligne quand la carte rétrécit, sans filet orphelin au bord.

## Exemples

```tsx
<Surface className="overflow-clip">
  <MetricRow>
    <Metric label="Dépannages" value="47" caption="dont 29 pannes" as={Link} href="/calls" />
    <Metric label="Délai d’intervention" value="1 j 6 h" caption="moyen" />
    <Metric label="Délais garantis tenus" value="65,4 %" caption="17 sur 26" tone="danger" />
  </MetricRow>
  {/* le tableau ou le graphique, sous un filet */}
</Surface>
```

## Anatomie

- Retrait : `spacing.base` de côté, `spacing.md` en hauteur
- Libellé : `caption` en graisse 500, `text-muted` ; valeur : `title-large`, chiffres tabulaires
- Filets : `border-soft`

## États

- Rien à mesurer : la valeur est « — », la précision dit pourquoi.
- Libellé long, précision longue : ils passent à la ligne, jamais tronqués.

## Accessibilité

`selected` pose `aria-current`. Un indicateur cliquable est un vrai lien ou bouton
(`as`), au focus visible.
