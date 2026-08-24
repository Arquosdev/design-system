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
| `kind`       | `'text' \| 'number' \| 'choice' \| 'multi'` | `'text'`   | Détermine l'éditeur et l'icône de type         |
| `options`    | `{ value: string; label: string }[]`        | `[]`       | Requis pour `choice` et `multi`                |
| `onSave`     | `(v: string \| string[]) => void`           | —          | Appelé à la validation. Absent = lecture seule |
| `statut`     | `'renseigne' \| 'manquant' \| 'a_verifier'` | —          | Pastille affichée à droite de la valeur        |
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

- Grille deux colonnes : libellé (`typography.small`, `colors.textMuted`) puis valeur
- Icône de type devant le libellé : lignes (texte), flèches (nombre), chevron (liste)
- Valeur non renseignée : « — » en `colors.textSubtle`
- En saisie : contour `1.5px` `colors.primary`, arrondi `radius.control`

## États

- **Lecture** : la valeur est cliquable si `onSave` est fourni, et atteignable au Tab.
- **Saisie** : Entrée valide, Échap annule, la perte de focus valide.
- **Non renseignée** : afficher « — », jamais une chaîne vide — sinon la ligne
  paraît cassée.
- **Valeur longue** : passe à la ligne, la ligne grandit. Pas de troncature :
  une cote tronquée est une cote fausse.
- **Multi-sélection vide** : afficher « — », pas « [] ».

## Accessibilité

- La valeur cliquable porte `role="button"` et `tabIndex=0` ; Entrée et Espace ouvrent
  la saisie.
- Chaque éditeur reçoit un `aria-label` repris du libellé — sinon un lecteur d'écran
  annonce un champ sans nom.
- L'icône de type est décorative : `aria-hidden`, avec le type en infobulle.
