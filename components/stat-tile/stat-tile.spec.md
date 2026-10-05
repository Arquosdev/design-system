---
name: StatTile
statut: beta
couche: metier
role: Mettre en avant une mesure d'identité, celle qu'on veut lire sans chercher.
mots_cles: [tuile, chiffre, mesure, statistique, identite, carte, valeur]
plateformes: [web]
remplace:
  web: [public/fiche/index.html — grille .arq-tuiles]
  mobile: [components/KnowledgeRateCard.tsx]
---

# StatTile

## Quand l'utiliser

- Les quelques mesures qui identifient un objet et qu'on relit sans cesse : la
  charge, la vitesse, le nombre de niveaux d'un appareil.
- En rangée de trois à six, en tête d'écran.

## Quand NE PAS l'utiliser

- **Pour une liste de champs** → `FieldRow`. Une tuile par champ noierait ce qui
  compte : c'est le petit nombre qui fait leur intérêt.
- **Au-delà de six.** Passé ce point, plus rien ne ressort et la grille
  redevient un tableau — sans en avoir la lisibilité.
- **Pour une valeur qu'on modifie** → `FieldRow`. Une tuile se lit, elle ne
  s'édite pas.

## Props

| Prop     | Type     | Défaut | Rôle                                           |
| -------- | -------- | ------ | ---------------------------------------------- |
| `label`  | `string` | —      | Ce que la mesure désigne                        |
| `valeur` | `string` | —      | La mesure. Vide = « — »                         |
| `unite`  | `string` | —      | Affichée après la valeur, en plus petit         |
| `detail` | `string` | —      | Précision sous la mesure (« 4 personnes »)      |
| `onOuvrir` | `() => void` | —      | La tuile **mène** à la donnée qu'elle résume : elle devient un bouton (survol, focus, nom accessible) |
| `libelleOuvrir` | `string` | `Voir {label}` | Ce que le clic fait, pour un lecteur d'écran |
| `libelleVide` | `string` | `À compléter` | Ce que dit une tuile vide ET cliquable — une invitation, en bleu d'action et à la taille du texte courant |

## Exemples

```tsx
import { StatTile } from '@arquos/design-system/web';

<StatTile label="Charge" valeur="300" unite="kg" detail="4 personnes" />
<StatTile label="Machinerie" valeur="Haute" detail="gaine maçonnée" />
```

## États

- **Valeur absente** : afficher « — » en `colors.textSubtle`, et masquer l'unité.
  Un « kg » sans nombre devant ne veut rien dire.
- **Valeur longue** (« Habitation collective ») : elle passe à la ligne. La
  tronquer ferait perdre l'information que la tuile existe pour montrer.

- **Vide et cliquable** : « À compléter » (`libelleVide`) au lieu de « — ». Un
  manque qu'on peut combler ne se dit pas comme un manque constaté.
- **Cliquable** (`onOuvrir`) : un vrai `button`, contour `colors.primary` et fond
  `colors.bgSubtle` au survol, anneau de focus au clavier. Rien d'autre ne change
  — la tuile garde sa forme, on ne la transforme pas en bouton d'action.

## Accessibilité

Le label et la valeur se lisent à la suite. Ne pas mettre l'unité dans un
attribut : elle fait partie de la mesure et doit être annoncée avec elle.
