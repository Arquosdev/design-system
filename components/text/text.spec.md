---
name: Text
status: beta
layer: generique
role: Écrire du texte avec un préréglage typographique et un ton de couleur, sans jamais recomposer une taille à la main.
keywords: [texte, text, typographie, police, dm sans, libellé, paragraphe, titre]
platforms: [mobile]
replaces:
  web: []
  mobile: [components/AppText.tsx]
---

# Text

**Mobile seulement, et c'est voulu.** Sur le web, un texte se stylise par les
classes Tailwind que `tokens.tailwind.css` traduit depuis les tokens
(`text-body`, `text-text-muted`) : il n'y a rien à envelopper. React Native n'a
pas de cascade ni de classes — chaque `<Text>` doit porter sa taille, son
interligne, sa couleur et **sa famille de police**, DM Sans venant en six
fichiers distincts qu'il faut choisir selon la graisse.

Ce composant est ce qui empêche l'app d'écrire `fontSize: 13` : mesuré le
22/09/2026, myArquos en écrivait **dix tailles différentes à la main** (16, 14,
12, 13, 15, 18, 11, 20, 22, 17), là où l'échelle en compte huit et où quatre
suffisent à un écran.

## Quand l'utiliser

- Tout texte d'un écran mobile : un libellé, un titre, une méta, un paragraphe.
- À la place de `Text` de React Native, toujours.

## Quand NE PAS l'utiliser

- **Pour un texte dans un bouton, un badge, une bannière** → ces composants
  écrivent le leur ; passer une chaîne en `children` suffit.
- **Pour une taille qui n'est pas dans l'échelle.** Ne pas la forcer par
  `style` : demander le préréglage qui manque dans `src/typography.ts`. La
  règle du dépôt est « ne jamais ajouter de taille de police » — c'est ici
  qu'elle se tient.

## Props

| Prop      | Type                                                                                  | Défaut   | Rôle                                   |
| --------- | ------------------------------------------------------------------------------------- | -------- | -------------------------------------- |
| `variant` | `TypographyToken` — `caption`, `small`, `body`, `bodyMedium`, `bodyBold`, `subhead`, `title`, `titleLarge`, `headline`, `display` | `'body'` | Le préréglage : taille, graisse, interligne |
| `tone`    | `'text' \| 'muted' \| 'onDark' \| 'primary' \| 'danger' \| 'success' \| 'warning'`      | `'text'` | La couleur, par son rôle                |

Plus toutes les props de `Text` de React Native (`numberOfLines`,
`onPress`, `style`, `accessibilityRole`…).

**`tone` n'offre pas `subtle`**, et ce n'est pas un oubli : `textSubtle` fait
3,14 pour 1 sur blanc, sous le seuil d'un texte. C'est une couleur d'icône et
de chevron. Pour un texte discret, `muted` (5,34).

**Une graisse passée en `style`** (`fontWeight: '600'`) est honorée et choisit
le fichier DM Sans qui va avec : c'est ce qui permet de graisser un mot dans
une phrase par un `Text` imbriqué.

## Exemples

```tsx
import { Text } from '@arquos/design-system/native';

<Text variant="title">53 A 00037 02</Text>
<Text variant="small" tone="muted">Bât. C, entrée principale</Text>
<Text>
  Relevé par <Text style={{ fontWeight: '600' }}>Sophie Renaud</Text>
</Text>
```

## Anatomie

- Taille, graisse, interligne : `typography[variant]`
- Famille : `fontFamilyNative[graisse]` — le fichier DM Sans correspondant,
  puis `fontWeight: 'normal'` pour que l'OS ne synthétise pas un second gras
  par-dessus un fichier déjà gras
- Couleur : `colors.text`, `colors.textMuted`, `colors.textOnDark`,
  `colors.primary`, `colors.danger`, `colors.success`, `colors.onWarningBg`

## Une taille imposée emporte son interligne

Un appelant qui écrit `fontSize` dans son `style` sans donner de `lineHeight`
reçoit un interligne recalculé **au rapport de son préréglage**. Sans cette
règle, un titre de 32 px gardait l'interligne de `body` — 22,4 — et se faisait
rogner par le haut : mesuré le 22/09/2026 sur les titres « Carte » et
« Dépannage » de myArquos, dont la moitié supérieure des lettres manquait.

C'est un filet pour la reprise, pas une invitation : la bonne façon d'écrire un
titre reste `variant="display"`.

## États

- **Texte long** : passe à la ligne, comme `Text` de React Native. Borner par
  `numberOfLines` quand la mise en page l'exige.
- **Graisse inconnue** (`'450'`) : retombe sur le régulier plutôt que de
  laisser l'OS choisir.

## Accessibilité

- Suit la taille de police du système (`allowFontScaling`, le défaut de React
  Native) : ne pas la couper sans raison écrite.
- `warning` et `danger` sont des tons de **texte** : leur contraste est
  celui des paires d'état, mesuré à la source par `check-contraste.mjs`.
