---
name: StatTile
status: beta
layer: metier
role: Mettre en avant une mesure d'identité, celle qu'on veut lire sans chercher.
keywords: [tuile, chiffre, mesure, statistique, identite, carte, valeur]
platforms: [web]
replaces:
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
| `value` | `string` | —      | La mesure. Vide = « — »                         |
| `unit`  | `string` | —      | Affichée après la valeur, en plus petit         |
| `detail` | `string` | —      | Précision sous la mesure (« 4 personnes »)      |

## Exemples

```tsx
import { StatTile } from '@arquos/design-system/web';

<StatTile label="Charge" value="300" unit="kg" detail="4 personnes" />
<StatTile label="Machinerie" value="Haute" detail="gaine maçonnée" />
```

## États

- **Valeur absente** : afficher « — » en `colors.textSubtle`, et masquer l'unité.
  Un « kg » sans nombre devant ne veut rien dire.
- **Valeur longue** (« Habitation collective ») : elle passe à la ligne. La
  tronquer ferait perdre l'information que la tuile existe pour montrer.

## Accessibilité

Le label et la valeur se lisent à la suite. Ne pas mettre l'unité dans un
attribut : elle fait partie de la mesure et doit être annoncée avec elle.
