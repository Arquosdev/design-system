---
name: PageBody
status: beta
layer: generique
role: Poser le corps d'une page sous son en-tête, à la largeur et à la gouttière communes.
keywords: [page, corps, largeur, gouttiere, conteneur, mise en page, reglages, configuration]
platforms: [web]
---

# PageBody

## Quand l'utiliser

- Le contenu d'une page de réglages, de configuration, de compte ou d'aide, sous son `PageHeader`.
- Partout où l'on écrivait `max-w-[960px] px-xl pt-lg pb-xl` à la main : trente-deux largeurs différentes vivaient dans le web (audit du 11/10/2026, A5-11).

## Quand NE PAS l'utiliser

- **Pour une liste** : elle prend toute la largeur, par `ListScreen`.
- **Pour une fiche** : `RecordLayout` porte sa propre mise en page.
- **Pour une carte ou un panneau** : leur largeur est un jeton à eux (`panel`, `input-long`).

## Props

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `width` | `'page' \| 'reading' \| 'full'` | `'page'` | 960 px, la mesure de lecture (720 px), ou toute la largeur |
| `className` | `string` | — | L'espace entre les blocs (`gap-lg`), rien d'autre |

La gouttière vaut 16 px sur un téléphone et 24 px au-delà de 640 px : elle ne se règle pas page par page.

## Exemple

```tsx
<PageHeader title="Paramètres" />
<PageBody className="gap-lg">
  <Card>…</Card>
</PageBody>
```
