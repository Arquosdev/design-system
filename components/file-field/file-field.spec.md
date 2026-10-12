---
name: FileField
status: beta
layer: generique
role: Joindre un ou plusieurs fichiers, en disant ce qui est permis et en refusant sur le champ ce qui ne l'est pas.
keywords: [fichier, joindre, televerser, upload, depot, glisser, deposer, pdf, photo, document, piece jointe]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# FileField

Une zone qu'on clique, ou sur laquelle on dépose un fichier. Elle dit ce
qu'elle accepte (« PDF · 20 Mo au plus »), et **refuse sur le champ, avec la
raison**, un fichier du mauvais type ou trop lourd.

## Pourquoi il existe

Le web dessinait cette zone **treize fois à la main** : un `<input type="file">`
rendu invisible dans un cadre en pointillés (manque 11 de son CLAUDE.md,
30/09/2026). Aucune copie ne refusait rien. L'attribut `accept` n'est qu'une
suggestion à la boîte de dialogue — on peut toujours y choisir « Tous les
fichiers », et un glisser-déposer l'ignore — si bien qu'un PDF de 40 Mo partait
pour être refusé par le serveur, après l'envoi, dans un bandeau loin du champ.

Le serveur garde son contrôle : celui-ci évite l'attente, il ne remplace pas la
règle.

## Quand l'utiliser

- Joindre un document à un objet : le PDF d'un devis, une trame de contrat, le
  document d'un client ou d'un équipement.
- Joindre des photos à un écart, dans sa forme `compact`, quand l'écran liste
  lui-même ce qu'il a joint avec un « Retirer » par ligne.
- Importer un fichier de données (CSV, XLSX).

## Quand NE PAS l'utiliser

- **Pour choisir une image d'identité** (logo, photo de profil) qui doit se
  voir tout de suite : l'aperçu est le contenu, et c'est à l'écran de le
  dessiner autour de ce champ.
- **Pour une pièce jointe dans une zone de saisie de conversation** : le bouton
  trombone d'un compositeur est un `IconButton` qui ouvre le sélecteur ; il n'a
  ni cadre ni ligne d'aide.

## Props

| Prop           | Type                       | Défaut | Rôle |
| -------------- | -------------------------- | ------ | ---- |
| `onFiles`      | `(fichiers: File[]) => void` | —    | Reçoit les fichiers d'un choix, **tous acceptés**. Un choix refusé n'appelle rien. |
| `accept`       | `string`                   | —      | Comme l'attribut HTML : `application/pdf,.pdf`, `image/*`. **Tenu**, pas seulement suggéré. |
| `acceptLabel`  | `string`                   | —      | Les mêmes formats pour un humain : « PDF, JPEG ou PNG ». Dit sous le champ et dans le refus. |
| `maxSize`      | `number` (octets)          | —      | Le poids maximal d'**un** fichier. Dit sous le champ, et tenu. |
| `multiple`     | `boolean`                  | `false` | Plusieurs fichiers par choix. |
| `max`          | `number`                   | —      | Le nombre de fichiers qu'un choix peut encore porter. |
| `variant`      | `'zone' \| 'compact'`      | `'zone'` | Le cadre en pointillés, ou un bouton `outline`. |
| `taille`    | `'normale' \| 'grande'` | `'normale'` | `grande` : zone haute et centrée, pour un écran dont joindre est le seul geste (l'import) |
| `placeholder`  | `string`                   | « Choisir le fichier » | Le libellé de l'action. |
| `current`      | `string \| null`           | —      | Le nom du fichier déjà enregistré, qu'un choix remplacera. |
| `hint`         | `string`                   | calculée | Remplace la ligne d'aide. |
| `name`, `id`, `required`, `disabled`, `aria-label` | | | Ceux du champ natif. `required` ne s'applique pas quand `current` existe. |

## Le contrat

- **Un choix est accepté en entier ou pas du tout.** Garder trois photos d'un
  choix de quatre en taisant la quatrième laisserait croire qu'elle est partie.
- **Un choix refusé vide le champ natif.** Un formulaire envoyé tel quel
  (`name`, `FormData`) ne part donc jamais avec ce qu'on vient de refuser.
- **Un dépôt rejoint le champ natif**, pour qu'un formulaire l'envoie comme un
  choix.
- **Un HEIC sans type** (Safari ne le connaît pas toujours) passe si son
  extension figure dans `accept` : un type vide n'est pas un refus.
- Les poids se disent en base 1 024, comme l'explorateur du technicien les dit.

## Exemples

```tsx
<Label htmlFor="devis">Votre devis</Label>
<FileField
  id="devis"
  name="fichier"
  accept="application/pdf,.pdf"
  acceptLabel="PDF"
  maxSize={20 * 1024 * 1024}
  current={devis?.fichier}
/>
```

```tsx
<FileField
  variant="compact"
  multiple
  max={PHOTOS_MAX - photos.length}
  accept="image/jpeg,image/png,image/webp,image/heic,.heic"
  acceptLabel="JPEG, PNG ou HEIC"
  placeholder={photos.length ? 'Ajouter d’autres photos' : 'Ajouter des photos'}
  onFiles={(f) => setPhotos((l) => [...l, ...f])}
/>
```

## Accessibilité

Le champ natif garde le focus clavier ; la zone porte l'anneau quand il l'a. Un
refus est un `role="alert"` relié au champ par `aria-describedby`, et le champ
passe `aria-invalid`.
