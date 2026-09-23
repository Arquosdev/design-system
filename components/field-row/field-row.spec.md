---
name: FieldRow
status: beta
layer: metier
role: Afficher un champ en lecture, et le passer en saisie d'un clic sans quitter la page.
keywords: [champ, ligne, libelle, valeur, edition, inline, saisie, formulaire]
platforms: [web, mobile]
replaces:
  web:
    - public/fiche/index.html — buildField(), markup recopié lignes 402/487/643/950
  mobile:
    - components/full-form/FormFieldRenderer.tsx
    - components/OptionRow.tsx
    - app/profile.tsx — le couple libellé / valeur sur plaque grise, hérité de Bubble
---

# FieldRow

Une ligne « libellé → valeur », éditable sur place. Le composant le plus employé
de la fiche : c'est lui qui la rend modifiable sans formulaire séparé.

## Quand l'utiliser

- Afficher une donnée technique dans une rubrique.
- Corriger une valeur là où elle se lit, sans changer de page.

## Quand NE PAS l'utiliser

- **Une donnée qui ne sera jamais corrigée** → un simple libellé/valeur. Rendre éditable ce qui ne doit pas l'être invite à l'erreur.
- **Saisir plusieurs champs d'un coup** → un formulaire avec un bouton unique. L'édition en place sert à corriger, pas à remplir.
- **Une valeur dérivée d'un calcul** → sans édition. Sur la fiche consolidée, une écriture serait effacée à la prochaine consolidation.

## Props

| Prop         | Type                                        | Défaut     | Rôle                                          |
| ------------ | ------------------------------------------- | ---------- | --------------------------------------------- |
| `label`      | `string`                                    | —          | Le libellé du champ                            |
| `value`      | `string \| string[] \| null`                | —          | La valeur courante ; `null` = non renseignée   |
| `kind`       | `'text' \| 'number' \| 'choice' \| 'multi' \| 'date'` | `'text'`   | Détermine l'éditeur qui s'ouvre à la saisie    |
| `options`    | `{ value: string; label: string }[]`        | `[]`       | Requis pour `choice` et `multi`                |
| `onSave`     | `(v: string \| string[]) => void`           | —          | Appelé à la validation. Absent = lecture seule |
| `status`     | `'filled' \| 'missing' \| 'to_check'` | —          | Pastille affichée à droite de la valeur        |
| `save` | `'saving' \| 'ok' \| 'error'`              | —          | Retour d'enregistrement, à côté de la valeur   |
| `photos`     | `readonly { name: string }[]`                | —          | Photos qui justifient la valeur — la plaque où elle a été lue |
| `onViewPhotos` | `() => void`                              | —          | Ouvre ces photos. Le picto n'existe que si les deux sont fournis |
| `schematics`    | `readonly { name: string }[]`                | —          | Schémas expliquant **comment** la mesure se prend |
| `onViewSchematics` | `() => void`                             | —          | Ouvre ces schémas |
| `landmark`     | `boolean`                                   | `false`    | Désigne la ligne : la recherche vient d'y emmener |
| `other`      | `boolean`                                   | `false`    | Ajoute « Autre — saisir une valeur… » au menu, qui bascule en saisie libre |
| `requestOpen` | `number`                              | —          | Rouvre l'éditeur depuis l'extérieur. C'est le **changement** de valeur qui ouvre |
| `origin`    | `string`                                    | —          | Provenance de la valeur, en infobulle          |
| `readOnly`   | `boolean`                                   | `false`    | Force la lecture seule                         |

## Exemple

```tsx
<FieldRow label="Nom du client" value="Immobilière du Parc" onSave={enregistrer} />
<FieldRow label="Nombre de niveaux" value="7" kind="number" onSave={enregistrer} />
<FieldRow label="Accès" value={['Badge', 'Interphone']} kind="multi" options={acces} onSave={enregistrer} />
<FieldRow label="Taux de connaissance" value="82 %" readOnly />
<FieldRow label="Date de mise en service" value="1978-03-04" kind="date" onSave={enregistrer} />
```

## `kind="date"` — la seule valeur dont l'affichage n'est pas le stockage

Les quatre autres genres montrent leur `value` telle quelle. Une date, non :
`value="1978-03-04"` s'affiche **« 04/03/1978 »**, et `onSave` rend
**`'1978-03-04'`**. L'éditeur est un `DateField`.

**C'est ce décalage qui rend la prop unique `value` vivable pour une date.** Le
`value` de `FieldRow` sert à la fois d'affichage et de valeur initiale de
l'éditeur, ce qui est un manque connu — pour un montant ou une unité, il
faudrait un couple `display`/`edit`. Les dates y échappent parce que les deux
écritures se distinguent sans ambiguïté : l'ISO met l'année devant, le français
la met derrière. `toISO` accepte donc les deux, et l'éditeur s'ouvre sur la
bonne date que l'appelant ait passé l'une ou l'autre.

**Passer de l'ISO reste la bonne façon**, et c'est ce que le service rend. Une
valeur qui n'est pas de l'ISO passe telle quelle à l'écran : un champ peut
porter « vers 1978 », que rien n'oblige à cacher.

Entrée enregistre, comme sur l'éditeur texte. Mais l'éditeur de date
**n'enregistre pas à la perte de focus**, contrairement à lui : « ailleurs » y est souvent le bouton de calendrier du champ
lui-même, et la sortie de focus enregistrerait la date d'avant au moment précis
où l'on ouvre la grille pour la changer. Deux boutons explicites, comme la
multi-sélection.

Voir `date-field.spec.md` : c'est là que vit la raison d'être du format, et elle
est une corruption de données réelle.

## Anatomie

- Valeur éditable : **soulignement pointillé** en `colors.textSubtle` — le signal « ceci se corrige d'un clic ».

## `FieldRow` suppose une pile, et l'écran doit le savoir

Chaque ligne porte son filet, et le retire avec `last:border-b-0` : le bas de la
pile ne se souligne pas.

**Dans une grille à deux colonnes, ce `last:` désigne le bas de la colonne
DROITE.** Le bas de la gauche garde son filet, et la ligne orpheline donne
l'impression qu'un champ manque dessous. Louis l'a signalé le 30/08/2026.

Le composant ne peut pas le deviner : le nombre de colonnes est une décision de
l'écran, prise dans une classe qu'il ne lit pas. C'est donc à la grille de le
dire — deux colonnes, deux derniers enfants :

```tsx
<div className="grid gap-x-lg lg:grid-cols-2 lg:[&>*:nth-last-child(-n+2)]:border-b-0">
  {champs.map((c) => <FieldRow key={c.cle} {...c} />)}
</div>
```

À trois colonnes, `-n+3`. La règle vaut pour tout empilement où le dernier
enfant du DOM n'est pas le dernier de chaque colonne.

## États

- **Vide** : « Non renseigné », jamais un tiret — qui laisserait croire à une
  donnée sans objet. Reste cliquable.
- **Valeur hors catalogue** : gardée en tête du menu, suffixée « · valeur
  actuelle ». La retirer la remplacerait en silence.
- **« Autre »** : bascule le menu en saisie libre. À n'offrir que là où le
  service accepte une valeur hors liste.
- **Rouverte de l'extérieur** (`requestOpen`) : la valeur dont ce champ
  dépend a changé. On ne peut pas la vider — le service refuse le vide — donc on
  rouvre le menu pour que le choix se fasse maintenant.
- **Multi-sélection** : le résumé liste les libellés, pas leur nombre.
- **Date** : la ligne affiche `JJ/MM/AAAA`, l'éditeur rend de l'ISO.
  « Enregistrer » reste inerte tant que la frappe ne fait pas une date — le
  champ dit déjà pourquoi juste en dessous, le bouton n'a pas à le répéter.
- **Reclic sur la valeur déjà retenue** : ferme sans écrire. Réenregistrer à
  l'identique daterait la fiche d'une correction qui n'en est pas une.
- **Désignée** (`landmark`) : défile **une seule fois**, le fond s'allume puis
  s'efface, le libellé se souligne. Redéfiler à chaque rendu empêcherait de
  bouger la page à la main.
- **Enregistrement** : « Enregistrement… », puis « ✓ Enregistré » ou
  « ⚠ Non enregistré ». Le retour reste sur la ligne — un bandeau en bas d'écran
  ne dirait pas quel champ a échoué. **Ne l'afficher que si la correction part
  vraiment.**

## Accessibilité

- La valeur cliquable porte `role="button"` et `tabIndex=0` ; Entrée et Espace ouvrent la saisie.
- Chaque éditeur reçoit un `aria-label` repris du libellé.
- Les deux pictos portent en `aria-label` ce qu'ils ouvrent, jamais « voir » : la photo dit **où** la valeur a été lue, le schéma **comment** la mesure se prend.

## Mobile

**C'est lui qui remplace la plaque grise de myArquos**, où chaque valeur d'une
fiche s'affichait sur un aplat `bgMuted` sous son libellé — le motif de Bubble.
Louis, le 22/09/2026, en le voyant sur le profil : « ce format de présentation
des données avec label et valeur en dessous en fond gris, on n'a pas ça dans le
nouveau design, c'était l'ancien. »

Deux divergences, et la première est structurelle :

- **la colonne du libellé prend 40 % de la largeur, bornée à 150**, là où le web
  la fixe à 190 px. Sur un écran de 393 points, 190 ne laisserait pas de quoi
  lire une adresse. La valeur passe à la ligne dans sa colonne plutôt que de
  pousser le libellé ;
- **l'édition s'ouvre au TOUCHER, sans survol pour l'annoncer.** Le
  soulignement pointillé porte donc seul le signal « ceci se corrige », ce qui
  lui donne plus de poids qu'en web.

**Une prop de plus, `onPress`** : la valeur MÈNE quelque part — une adresse
ouvre Plans, un téléphone compose. Sur le web ce serait un lien ; React Native
n'en a pas, donc le composant doit savoir que la valeur agit pour la peindre en
`primary`. `onSave` et `onPress` s'excluent : une valeur qui mène ailleurs ne
s'édite pas sur place.

`multi` n'a pas d'éditeur natif : la valeur se lit, la correction se fait
ailleurs. Une prop `derniere` retire le filet du bas — React Native n'a pas de
`last:`.
