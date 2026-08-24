# Composants

> Index généré par `npm run catalog` — ne pas éditer à la main.
> La source de chaque ligne est l'en-tête de la fiche du composant.

Chaque composant vit dans son dossier, avec sa fiche (`*.spec.md`) et une
implémentation par plateforme (`*.web.tsx`, `*.native.tsx`).

🖥️ web · 📱 mobile

| Composant | Rôle | Plateformes | Statut |
| --- | --- | --- | --- |
| [Accordion](accordion/accordion.spec.md) | Grouper des champs sous un titre pliable, pour qu'une page longue reste parcourable. | 🖥️ | stable |
| [Badge](badge/badge.spec.md) | Poser une étiquette courte qui qualifie l'élément à côté duquel elle se trouve. | 🖥️ | stable |
| [Button](button/button.spec.md) | Déclencher une action. Le poids visuel dit l'importance de l'action, pas sa nature. | 🖥️ | stable |
| [Card](card/card.spec.md) | Poser un groupe d'éléments dans une surface délimitée, avec un en-tête facultatif. | 🖥️ | stable |
| [DataTable](data-table/data-table.spec.md) | Présenter des mesures en lignes et colonnes, quand la comparaison colonne par colonne est le sujet. | 🖥️ | beta |
| [FieldRow](field-row/field-row.spec.md) | Afficher un champ en lecture, et le passer en saisie d'un clic sans quitter la page. | 🖥️ | beta |
| [IconButton](icon-button/icon-button.spec.md) | Déclencher une action représentée par une icône seule, sans perdre son nom accessible. | 🖥️ | stable |
| [NavList](nav-list/nav-list.spec.md) | Lister les rubriques d'un écran, avec ce que chacune contient, et dire laquelle est ouverte. | 🖥️ | beta |

## Ajouter un composant

1. Copier `_TEMPLATE.spec.md` dans `components/<nom>/<nom>.spec.md` et le remplir.
2. Écrire `<nom>.web.tsx` et/ou `<nom>.native.tsx` — uniquement les plateformes déclarées.
3. `npm run catalog` pour régénérer cet index et `dist/catalog.json`.
