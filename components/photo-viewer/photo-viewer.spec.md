---
name: PhotoViewer
statut: beta
couche: generique
role: Regarder une photo en grand, et passer aux suivantes de la même série.
mots_cles: [visionneuse, lightbox, photo, galerie, plein ecran, agrandir, schema]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — lightbox]
---

# PhotoViewer

Construite sur la primitive Radix `Dialog` — la même base que le composant
Dialog de shadcn. Elle apporte le piège à focus, la fermeture par Échap, le
retour du focus à la vignette d'origine et le masquage du reste de la page aux
lecteurs d'écran. Tout cela se réécrit mal à la main.

## Quand l'utiliser

- **Agrandir une photo de relevé** depuis une vignette : la valeur qu'on vient
  lire est souvent illisible en 4/3.
- **Une série** qu'on parcourt : les photos d'une zone, les photos sources d'un
  champ, les planches de schéma d'un composant.

## Quand NE PAS l'utiliser

- **Pour une seule image décorative** → une balise `img`. La visionneuse suppose
  qu'on vient examiner quelque chose.
- **Pour un document** (PDF, rapport) → un aperçu dédié. Elle ne sait afficher
  qu'une image.
- **Pour choisir parmi des images** → une grille de `PhotoTile`. Ici on regarde,
  on ne sélectionne pas.

## Props

| Prop           | Type                        | Défaut | Rôle                                    |
| -------------- | --------------------------- | ------ | --------------------------------------- |
| `photos`       | `readonly PhotoVue[]`       | —      | La série parcourue                      |
| `index`        | `number`                    | —      | Laquelle est affichée                   |
| `onIndex`      | `(i: number) => void`       | —      | L'appelant garde la main sur la position |
| `open`         | `boolean`                   | —      | Ouverte ou non                          |
| `onOpenChange` | `(o: boolean) => void`      | —      | Fermeture par Échap, clic dehors, croix |

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

- Voile : `colors.brand` à 80 %
- Photo : `object-contain`, 76 vw de large au plus, et **toute la hauteur que
  la légende lui laisse** — pas de plafond fixe. Arrondi `radius.md`. Les
  photos de relevé sont verticales à 77 % : un plafond à 70 vh les laissait
  petites entre deux bandes vides.
- Flèches : 44 px, fond blanc à 15 % — la taille minimale d'une cible tactile
- Légende : nom en `typography.subhead`, puis « 3/12 · Machinerie » en `small`
- Croix : 36 px, en haut à droite

## États

- **Une seule photo** : les flèches disparaissent, le compteur aussi.
- **Image cassée ou absente** : cadre gris « Photo indisponible — {nom} ». On
  nomme quand même ce qui aurait dû s'y trouver.
- **Série vide** : rien n'est rendu.

## Accessibilité

- Les flèches ← et → parcourent la série.
- Échap ferme, et le focus revient sur la vignette d'où l'on venait.
- Le titre du dialogue est le nom de la photo, jamais « visionneuse » : c'est ce
  qu'un lecteur d'écran doit annoncer en arrivant.
- `object-contain` plutôt qu'un fond en `cover` : rien n'est rogné, et l'image
  reste une vraie `img` avec son texte alternatif.
