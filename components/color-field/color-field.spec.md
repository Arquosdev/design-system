---
name: ColorField
status: beta
layer: generique
role: Choisir une couleur de marque dans une zone de couleur, par son code, ou parmi des couleurs proposées.
keywords: [couleur, palette, marque, teinte, hexadecimal, hex, nuancier, portail]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# ColorField

Un champ qui montre la couleur et son code ; il s'ouvre sur une zone de couleur
(saturation et luminosité), une barre de teinte, le code hexadécimal, et dix
couleurs proposées. Le motif vient de Telegram, de Playbook et de Mailchimp
(Refero, 10/10/2026).

## Quand l'utiliser

- Choisir la couleur principale d'un portail, d'un document, d'une marque.
- Partout où l'on tapait un code `#RRGGBB` à la main.

## Quand NE PAS l'utiliser

- **Pour choisir parmi quelques teintes du produit** (la couleur d'une
  étiquette, d'un statut) → un `Select` ou des boutons sur `tagPalette`. Une
  zone de couleur libre ferait sortir l'écran de la palette.
- **Comme `<input type="color">`** : jamais. C'est du chrome d'OS au milieu de
  contrôles dessinés, et ce composant existe pour le remplacer.

## Props

| Prop          | Type                              | Défaut            | Rôle |
| ------------- | --------------------------------- | ----------------- | ---- |
| `value`       | `string \| null`                  | —                 | La couleur, en `#RRGGBB` |
| `onValue`     | `(hex: string \| null) => void`   | —                 | Rend toujours un `#RRGGBB` valide, ou `null` |
| `allowClear`  | `boolean`                         | `false`           | Montre « Retirer la couleur » |
| `suggestions` | `readonly string[]`               | dix teintes       | Les couleurs proposées |
| `ariaLabel`   | `string`                          | —                 | Quand aucun `Label` ne nomme le champ |
| `disabled`    | `boolean`                         | `false`           | |

## Le contrat

**Ce qui sort est toujours un `#RRGGBB` en majuscules, ou `null`.** Une frappe
partielle dans le champ du code ne sort pas ; elle reprend la valeur retenue
quand on quitte le champ.

**La lisibilité se dit.** Sous la palette, une ligne dit si un texte blanc se
lit sur la couleur (contraste WCAG de 4,5 au moins). Les dix couleurs proposées
passent toutes ce seuil, et le test le vérifie.

**Au clavier** : la zone et la barre sont des curseurs (`role="slider"`), les
flèches les déplacent.

## Exemple

```tsx
<Label htmlFor="couleur">Couleur principale</Label>
<ColorField id="couleur" value={couleur} onValue={setCouleur} allowClear />
```
