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
| [Command](command/command.spec.md) | Atteindre n'importe quoi dans un écran dense, en tapant son nom. | 🖥️ | beta |
| [DataTable](data-table/data-table.spec.md) | Présenter des mesures en lignes et colonnes, quand la comparaison colonne par colonne est le sujet. | 🖥️ | beta |
| [FieldRow](field-row/field-row.spec.md) | Afficher un champ en lecture, et le passer en saisie d'un clic sans quitter la page. | 🖥️ | beta |
| [FilterChips](filter-chips/filter-chips.spec.md) | Restreindre une liste à une de ses parties, par une barre de puces. | 🖥️ | beta |
| [Gauge](gauge/gauge.spec.md) | Montrer une proportion d'un coup d'œil, avec son chiffre écrit à côté. | 🖥️ | beta |
| [IconButton](icon-button/icon-button.spec.md) | Déclencher une action représentée par une icône seule, sans perdre son nom accessible. | 🖥️ | stable |
| [NavList](nav-list/nav-list.spec.md) | Lister les rubriques d'un écran, avec ce que chacune contient, et dire laquelle est ouverte. | 🖥️ | beta |
| [PhotoTile](photo-tile/photo-tile.spec.md) | Montrer une photo attendue — prise ou non — avec ce qu'elle est censée montrer. | 🖥️ | beta |
| [PhotoViewer](photo-viewer/photo-viewer.spec.md) | Regarder une photo en grand, et passer aux suivantes de la même série. | 🖥️ | beta |
| [SegmentedTabs](segmented-tabs/segmented-tabs.spec.md) | Basculer entre deux ou trois vues d'un même écran, toutes également importantes. | 🖥️ | beta |
| [Sheet](sheet/sheet.spec.md) | Un panneau qui entre par le bord pour une tâche annexe, sans quitter l'écran. | 🖥️ | beta |
| [StatTile](stat-tile/stat-tile.spec.md) | Mettre en avant une mesure d'identité, celle qu'on veut lire sans chercher. | 🖥️ | beta |
| [Toast](toast/toast.spec.md) | Annoncer sans quitter la page ce qui vient de réussir ou d'échouer. | 🖥️ | beta |

## Ajouter un composant

1. Copier `_TEMPLATE.spec.md` dans `components/<nom>/<nom>.spec.md` et le remplir.
2. Écrire `<nom>.web.tsx` et/ou `<nom>.native.tsx` — uniquement les plateformes déclarées.
3. `npm run catalog` pour régénérer cet index et `dist/catalog.json`.
