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
| `actions`      | `readonly PhotoViewerAction[]` | —   | Des boutons ronds dans le coin de la photo, qui reçoivent la photo courante |

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

## Les actions

La visionneuse ne sait que montrer. Télécharger, ouvrir ailleurs, signaler —
tout cela appartient à l'écran qui l'ouvre : il passe `actions`, elle pose des
boutons ronds dans le coin bas-droit de la photo et leur rend la photo courante.

```tsx
<PhotoViewer
  photos={photos}
  index={index}
  onIndex={setIndex}
  open={ouverte}
  onOpenChange={setOuverte}
  actions={[
    { libelle: 'Télécharger', icone: 'telecharger', onAction: telecharger },
    { libelle: 'Ouvrir dans un nouvel onglet', icone: 'ouvrirAilleurs', onAction: ouvrirAilleurs },
  ]}
/>
```

**Trois au plus, en rangée.** Cette fiche disait d'abord « une seule, et le jour
où il en faudra deux, ce sera un menu ». La fiche équipement en a demandé deux
le 22/09/2026, et le menu s'est révélé pire : il cache derrière un clic deux
gestes qui n'en demandent qu'un, sur un écran qu'on a ouvert pour REGARDER.
Deux picots parlent d'eux-mêmes. Au-delà de trois, la rangée couvrirait la
photo, et c'est alors que le menu gagne.

**La rangée pousse vers la gauche**, ancrée par son coin bas-droit : ajouter une
action ne déplace pas celles qui étaient déjà là, et l'œil qui a appris où
cliquer ne le réapprend pas.

**Sur la photo, pas dans l'en-tête.** C'est elle que les actions visent ; un
bouton posé à l'autre bout de l'écran oblige à faire le rapport soi-même. En bas
à droite parce qu'une photo de relevé porte son sujet au centre et ses mentions
en haut — une plaque de charge, une étiquette de machine.

**Posés sur la boîte mesurée, jamais sur le cadre.** L'élément image est étiré
par son cadre, et `object-contain` y inscrit ensuite la photo en centrant ce qui
reste : sur une photo debout — les trois quarts des photos de relevé — un bouton
calé sur le coin du cadre sort du cliché. `boiteDessinee()` rend la boîte
réellement dessinée ; c'est elle qu'on vise.

**En icônes, et le libellé reste obligatoire** : il nomme le bouton pour les
lecteurs d'écran et s'affiche en infobulle. Le dessin se demande par son rôle
(`icone: 'telecharger'`), jamais par son nom Phosphor.

**Blanc sur marine, quel que soit le thème.** Comme les flèches et la croix :
la visionneuse est toujours posée sur un voile sombre, elle ne suit pas le
thème de la page. Un fond qui s'adapterait virerait au sombre la nuit, et les
boutons disparaîtraient sur une photo d'armoire de manœuvre.

**Elles ne ferment pas la visionneuse** : c'est à l'appelant de décider si son
action l'emporte sur ce qu'on était en train de regarder.

**Pas de boutons sur une photo absente** : il n'y a rien à télécharger, et le
cadre « Photo indisponible » n'est pas la photo.
