---
name: FieldRow
statut: beta
role: Afficher un champ en lecture, et le passer en saisie d'un clic sans quitter la page.
mots_cles: [champ, ligne, libelle, valeur, edition, inline, saisie, formulaire]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — buildField(), markup recopié lignes 402/487/643/950]
  mobile: [components/full-form/FormFieldRenderer.tsx]
---

# FieldRow

Le composant le plus employé de la fiche : une ligne « libellé → valeur », éditable
sur place. C'est lui qui rend la fiche modifiable sans formulaire séparé.

## Quand l'utiliser

- Afficher une donnée technique de l'équipement dans une rubrique.
- Permettre la correction d'une valeur là où elle se lit, sans changer de page.

## Quand NE PAS l'utiliser

- **Pour une donnée en lecture seule qui ne sera jamais corrigée** (un identifiant
  système, une date de création) → un simple libellé/valeur. Rendre éditable ce qui
  ne doit pas l'être invite à l'erreur.
- **Pour saisir plusieurs champs d'un coup** (création d'un équipement) → un vrai
  formulaire avec un bouton d'enregistrement unique. L'édition en place sert à
  corriger, pas à remplir.
- **Pour une valeur dérivée d'un calcul** → l'afficher sans édition possible. Sur la
  fiche consolidée, une écriture serait effacée à la prochaine consolidation.

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
| `origine`    | `string`                                    | —          | Provenance de la valeur, en infobulle          |
| `readOnly`   | `boolean`                                   | `false`    | Force la lecture seule                         |

## Exemples

```tsx
import { FieldRow } from '@arquos/design-system/web';

<FieldRow label="Nom du client" value="Immobilière du Parc" onSave={enregistrer} />

<FieldRow label="Nombre de niveaux" value="7" kind="number" onSave={enregistrer} />

<FieldRow
  label="Accès à l'immeuble"
  value={['Badge', 'Interphone']}
  kind="multi"
  options={acces}
  onSave={enregistrer}
/>

<FieldRow label="Taux de connaissance" value="82 %" readOnly />
```

## Anatomie

- Grille deux colonnes : libellé sur `190px` (`typography.small`, `colors.textMuted`), gouttière `spacing.md`, puis la valeur
- Valeur éditable : **soulignement pointillé** `1px` en `colors.textSubtle` — c'est le signal « ceci se corrige d'un clic »
- Valeur non renseignée : le texte « Non renseigné » en `colors.textSubtle`, soulignement pâli en `colors.border`
- En saisie : contour `1.5px` `colors.primary`, arrondi `radius.control`

## États

- **Lecture** : la valeur est cliquable si `onSave` est fourni, et atteignable au Tab.
- **Saisie** : Entrée valide, Échap annule, la perte de focus valide.
- **Non renseignée** : afficher « Non renseigné », jamais une chaîne vide ni un
  tiret. Un tiret laisse croire à une donnée sans objet ; le libellé complet dit
  qu'il manque quelque chose. La ligne reste cliquable pour le combler.
- **Valeur longue** : passe à la ligne, la ligne grandit. Pas de troncature :
  une cote tronquée est une cote fausse.
- **Multi-sélection vide** : afficher « Non renseigné », pas « [] ».
- **Enregistrement** : « Enregistrement… », puis « ✓ Enregistré » ou
  « ⚠ Non enregistré », via `sauvegarde`. Le retour reste sur la ligne : un
  bandeau en bas d'écran ne dirait pas quel champ a échoué. Ne l'afficher que
  si la correction part vraiment — « ✓ Enregistré » sur une valeur qui ne
  quitte pas l'écran est un mensonge.

## Accessibilité

- La valeur cliquable porte `role="button"` et `tabIndex=0` ; Entrée et Espace ouvrent
  la saisie.
- Chaque éditeur reçoit un `aria-label` repris du libellé — sinon un lecteur d'écran
  annonce un champ sans nom.
- Le retour d'enregistrement est un `role="status"`, pas une alerte : en cas
  d'échec la valeur d'avant est déjà revenue sous les yeux de l'utilisateur.
- Le type du champ ne s'annonce pas : il se déduit de l'éditeur qui s'ouvre.
  Une icône de type devant chaque libellé a été retirée le 24/08/2026 — sur une
  rubrique de cent champs, cent pictogrammes identiques ne distinguent rien et
  éloignent le libellé de sa valeur.
