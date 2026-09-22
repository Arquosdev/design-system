---
name: FieldRow
statut: beta
couche: metier
role: Afficher un champ en lecture, et le passer en saisie d'un clic sans quitter la page.
mots_cles: [champ, ligne, libelle, valeur, edition, inline, saisie, formulaire]
plateformes: [web, mobile]
remplace:
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
| `kind`       | `'text' \| 'number' \| 'choice' \| 'multi'` | `'text'`   | Détermine l'éditeur qui s'ouvre à la saisie    |
| `options`    | `{ value: string; label: string }[]`        | `[]`       | Requis pour `choice` et `multi`                |
| `onSave`     | `(v: string \| string[]) => void`           | —          | Appelé à la validation. Absent = lecture seule |
| `statut`     | `'renseigne' \| 'manquant' \| 'a_verifier'` | —          | Pastille affichée à droite de la valeur        |
| `sauvegarde` | `'encours' \| 'ok' \| 'echec'`              | —          | Retour d'enregistrement, à côté de la valeur   |
| `photos`     | `readonly { nom: string }[]`                | —          | Photos qui justifient la valeur — la plaque où elle a été lue |
| `onVoirPhotos` | `() => void`                              | —          | Ouvre ces photos. Le picto n'existe que si les deux sont fournis |
| `schemas`    | `readonly { nom: string }[]`                | —          | Schémas expliquant **comment** la mesure se prend |
| `onVoirSchemas` | `() => void`                             | —          | Ouvre ces schémas |
| `repere`     | `boolean`                                   | `false`    | Désigne la ligne : la recherche vient d'y emmener |
| `autre`      | `boolean`                                   | `false`    | Ajoute « Autre — saisir une valeur… » au menu, qui bascule en saisie libre |
| `demandeOuverture` | `number`                              | —          | Rouvre l'éditeur depuis l'extérieur. C'est le **changement** de valeur qui ouvre |
| `origine`    | `string`                                    | —          | Provenance de la valeur, en infobulle          |
| `readOnly`   | `boolean`                                   | `false`    | Force la lecture seule                         |

## Exemple

```tsx
<FieldRow label="Nom du client" value="Immobilière du Parc" onSave={enregistrer} />
<FieldRow label="Nombre de niveaux" value="7" kind="number" onSave={enregistrer} />
<FieldRow label="Accès" value={['Badge', 'Interphone']} kind="multi" options={acces} onSave={enregistrer} />
<FieldRow label="Taux de connaissance" value="82 %" readOnly />
```

## Anatomie

- Valeur éditable : **soulignement pointillé** en `colors.textSubtle` — le signal « ceci se corrige d'un clic ».

## États

- **Vide** : « Non renseigné », jamais un tiret — qui laisserait croire à une
  donnée sans objet. Reste cliquable.
- **Valeur hors catalogue** : gardée en tête du menu, suffixée « · valeur
  actuelle ». La retirer la remplacerait en silence.
- **« Autre »** : bascule le menu en saisie libre. À n'offrir que là où le
  service accepte une valeur hors liste.
- **Rouverte de l'extérieur** (`demandeOuverture`) : la valeur dont ce champ
  dépend a changé. On ne peut pas la vider — le service refuse le vide — donc on
  rouvre le menu pour que le choix se fasse maintenant.
- **Multi-sélection** : le résumé liste les libellés, pas leur nombre.
- **Reclic sur la valeur déjà retenue** : ferme sans écrire. Réenregistrer à
  l'identique daterait la fiche d'une correction qui n'en est pas une.
- **Désignée** (`repere`) : défile **une seule fois**, le fond s'allume puis
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

`multi` n'a pas d'éditeur natif : la valeur se lit, la correction se fait
ailleurs. Une prop `derniere` retire le filet du bas — React Native n'a pas de
`last:`.
