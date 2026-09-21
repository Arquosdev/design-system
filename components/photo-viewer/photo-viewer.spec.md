---
name: PhotoViewer
statut: beta
couche: generique
role: Regarder une photo en grand, et passer aux suivantes de la même série.
mots_cles: [visionneuse, lightbox, photo, galerie, plein ecran, agrandir, schema]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — lightbox]
  mobile: [components/ZoomImageOverlay.tsx]
---

# PhotoViewer

Construite sur la primitive Radix `Dialog` — la même base que le composant
Dialog de shadcn. Elle apporte le piège à focus, la fermeture par Échap, le
retour du focus à la vignette d'origine et le masquage du reste de la page aux
lecteurs d'écran. Tout cela se réécrit mal à la main.

## Quand l'utiliser

- **Agrandir une photo de relevé** depuis une vignette : la valeur qu'on vient lire est souvent illisible en 4/3.
- **Une série** qu'on parcourt : les photos d'une zone, les photos sources d'un champ, les planches de schéma d'un composant.

## Quand NE PAS l'utiliser

- **Pour une seule image décorative** → une balise `img`. La visionneuse suppose qu'on vient examiner quelque chose.
- **Pour un document** (PDF, rapport) → un aperçu dédié. Elle ne sait afficher qu'une image.
- **Pour choisir parmi des images** → une grille de `PhotoTile`. Ici on regarde, on ne sélectionne pas.

## Props

| Prop           | Type                        | Défaut | Rôle                                    |
| -------------- | --------------------------- | ------ | --------------------------------------- |
| `photos`       | `readonly PhotoVue[]`       | —      | La série parcourue                      |
| `index`        | `number`                    | —      | Laquelle est affichée                   |
| `onIndex`      | `(i: number) => void`       | —      | L'appelant garde la main sur la position |
| `open`         | `boolean`                   | —      | Ouverte ou non                          |
| `onOpenChange` | `(o: boolean) => void`      | —      | Fermeture par Échap, clic dehors, croix |
| `action`       | `PhotoViewerAction`         | —      | Un bouton rond dans le coin de la photo, qui reçoit la photo courante |

`PhotoVue` : `{ nom: string; url?: string; zone?: string }`. `nom` est la
légende **et** le texte alternatif ; `zone` dit d'où elle vient.

L'indice est piloté par l'appelant, pas gardé à l'intérieur : c'est lui qui sait
quelle série il vient d'ouvrir et sur quelle photo.

## Exemples

```tsx
import { PhotoViewer, PhotoTile } from '@arquos/design-system/web';

const [vue, setVue] = React.useState<{ photos: PhotoVue[]; i: number } | null>(null);

<PhotoTile nom={p.nom} url={p.url} onOuvrir={() => setVue({ photos: zone.items, i: n })} />

<PhotoViewer
  photos={vue?.photos ?? []}
  index={vue?.i ?? 0}
  onIndex={(i) => setVue((v) => (v ? { ...v, i } : v))}
  open={Boolean(vue)}
  onOpenChange={(o) => !o && setVue(null)}
/>;
```

## Anatomie

- Photo : `object-contain`, 76 vw de large au plus, et **toute la hauteur que la légende lui laisse** — pas de plafond fixe. Arrondi `radius.md`. Les photos de relevé sont verticales à 77 % : un plafond à 70 vh les laissait petites entre deux bandes vides.
- Flèches : 44 px, fond blanc à 15 % — la taille minimale d'une cible tactile

## États

- **Une seule photo** : les flèches disparaissent, le compteur aussi.
- **Image cassée ou absente** : cadre gris « Photo indisponible — {nom} ». On
  nomme quand même ce qui aurait dû s'y trouver.
- **Série vide** : rien n'est rendu.

## Accessibilité

- Les flèches ← et → parcourent la série.
- Échap ferme, et le focus revient sur la vignette d'où l'on venait.
- Le titre du dialogue est le nom de la photo, jamais « visionneuse » : c'est ce qu'un lecteur d'écran doit annoncer en arrivant.

## L'action

La visionneuse ne sait que montrer. Télécharger, ouvrir ailleurs, signaler —
tout cela appartient à l'écran qui l'ouvre : il passe `action`, elle pose un
bouton rond dans le coin bas-droit de la photo et lui rend la photo courante.

```tsx
<PhotoViewer
  photos={photos}
  index={index}
  onIndex={setIndex}
  open={ouverte}
  onOpenChange={setOuverte}
  action={{ libelle: 'Agrandir', icone: 'agrandir', onAction: (photo) => ouvrirAilleurs(photo.url) }}
/>
```

**Sur la photo, pas dans l'en-tête.** C'est elle que l'action vise ; un bouton
posé à l'autre bout de l'écran oblige à faire le rapport soi-même. En bas à
droite parce qu'une photo de relevé porte son sujet au centre et ses mentions
en haut — une plaque de charge, une étiquette de machine.

**En icône, et le libellé reste obligatoire** : il nomme le bouton pour les
lecteurs d'écran et s'affiche en infobulle. Le dessin se demande par son rôle
(`icone: 'agrandir'`), jamais par son nom Phosphor.

**Posé sur la boîte mesurée, jamais sur le cadre.** L'élément image est étiré
par son cadre, et `object-contain` y inscrit ensuite la photo en centrant ce qui
reste : sur une photo debout — les trois quarts des photos de relevé — un bouton
calé sur le coin du cadre sort du cliché. `boiteDessinee()` rend la boîte
réellement dessinée ; c'est elle qu'on vise.

**Blanc sur marine, quel que soit le thème.** Comme les flèches et la croix :
la visionneuse est toujours posée sur un voile sombre, elle ne suit pas le
thème de la page. Un fond qui s'adapterait virerait au sombre la nuit, et le
bouton disparaîtrait sur une photo d'armoire de manœuvre.

**Un seul bouton, à dessein.** C'est une visionneuse, pas une barre d'outils. Le
jour où deux actions se présentent, c'est un menu qu'il faudra, pas un second
bouton posé à côté.

**Elle ne se ferme pas toute seule** après l'action : c'est à l'appelant de
décider si la sienne l'emporte sur ce qu'on était en train de regarder.

**Pas de bouton sur une photo absente** : il n'y a rien à agrandir, et le cadre
« Photo indisponible » n'est pas la photo.

Demandé par la fiche équipement le 21/09/2026 : embarquée dans une iframe
Bubble, sa visionneuse ne peut pas dépasser le cadre de la fiche. Le bouton sert
à passer la main à l'hôte, qui sait ouvrir la photo par-dessus toute la page.
