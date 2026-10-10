---
name: Markdown
status: beta
layer: generique
role: Mettre en forme un texte écrit en markdown, comme la réponse d'un assistant IA, pareil sur le web et le téléphone.
keywords: [markdown, texte, reponse, assistant, ia, chat, titre, liste, tableau, lien, mise en forme]
platforms: [web, mobile]
replaces:
  web: []
  mobile: []
---

# Markdown

Le texte d'une réponse de l'assistant, mis en forme : titres, listes, tableaux,
citations, code et liens. Un seul analyseur (`markdown.logic.ts`) pour le web
et le téléphone, donc une réponse se lit pareil sur les deux.

## Pourquoi il existe

Les deux assistants rendaient le markdown à la main, chacun à sa façon
(inventaire du 10/10/2026) : le web connaissait les listes et le gras mais pas
les titres ni les tableaux, et laissait les adresses en texte brut ; myArquos
retirait les astérisques et rendait tout en un paragraphe.

## Quand l'utiliser

- La réponse d'un assistant IA, sur le web comme sur le téléphone.
- Un texte rédigé par un modèle (un résumé, une synthèse) qu'on affiche tel quel.

## Quand NE PAS l'utiliser

- **Pour une saisie de l'utilisateur** (une note, un commentaire) : on affiche
  ce qu'il a tapé, sans interpréter ses astérisques.
- **Pour un libellé d'interface** : un `Text`, pas un texte à analyser.

## Props

| Prop | Plateforme | Rôle |
| --- | --- | --- |
| `children` | les deux | Le texte en markdown. |
| `renderLink(href, enfants, cle)` | web | Rend un lien (le `Link` de l'application pour un chemin interne). Sans lui : une ancre, un onglet neuf pour une adresse web. |
| `onLink(href)` | mobile | Ouvre un lien (le routeur de l'application). Sans lui : `Linking`. |
| `className` / `style` | web / mobile | Ce que l'hôte impose. |

## Le contrat

- **Ce qu'il ne reconnaît pas reste du texte** : une réponse ne perd jamais un
  mot parce qu'une syntaxe est inconnue.
- **Un lien n'est un lien que s'il est sûr** : chemin de l'application,
  `http(s)`, `mailto:`, `tel:`. `javascript:` et `data:` restent du texte.
- **Un astérisque isolé reste un astérisque** (« 3 * 4 »), un nom à tirets bas
  aussi (`type_galets`).
- Un tableau large et un bloc de code défilent de côté, jamais la page.
- Sur le téléphone, le texte est sélectionnable.

## Exemples

```tsx
<Markdown renderLink={(href, enfants, cle) => href.startsWith('/')
  ? <Link key={cle} href={href}>{enfants}</Link>
  : <a key={cle} href={href} target="_blank" rel="noreferrer">{enfants}</a>}>
  {reponse}
</Markdown>
```

```tsx
<Markdown onLink={(href) => (href.startsWith('/') ? router.push(href) : Linking.openURL(href))}>
  {reponse}
</Markdown>
```

## Accessibilité

Les titres sont de vrais titres (`h3` à `h5` sur le web, `header` sur le
téléphone), un tableau a son en-tête (`th scope="col"`), un lien son rôle.
