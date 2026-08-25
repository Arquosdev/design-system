# Composants

> Index généré par `npm run catalog` — ne pas éditer à la main.
> La source de chaque ligne est l'en-tête de la fiche du composant.

Chaque composant vit dans son dossier, avec sa fiche (`*.spec.md`) et une
implémentation par plateforme (`*.web.tsx`, `*.native.tsx`).

🖥️ web · 📱 mobile

## Générique

Une mécanique que n'importe quelle application aurait — bouton, modale, onglets. Elle vient de shadcn/Radix, ou elle le pourrait.

| Composant | Rôle | Plateformes | Statut |
| --- | --- | --- | --- |
| [Accordion](accordion/accordion.spec.md) | Grouper des champs sous un titre pliable, pour qu'une page longue reste parcourable. | 🖥️ | stable |
| [Badge](badge/badge.spec.md) | Poser une étiquette courte qui qualifie l'élément à côté duquel elle se trouve. | 🖥️ | stable |
| [Button](button/button.spec.md) | Déclencher une action. Le poids visuel dit l'importance de l'action, pas sa nature. | 🖥️ | stable |
| [Card](card/card.spec.md) | Poser un groupe d'éléments dans une surface délimitée, avec un en-tête facultatif. | 🖥️ | stable |
| [Checkbox](checkbox/checkbox.spec.md) | Cocher une option indépendante, ou plusieurs, dans un formulaire qui se valide. | 🖥️ | stable |
| [Combobox](combobox/combobox.spec.md) | Choisir dans une liste trop longue pour être parcourue, en la filtrant. | 🖥️ | beta |
| [Command](command/command.spec.md) | Atteindre n'importe quoi dans un écran dense, en tapant son nom. | 🖥️ | beta |
| [FilterChips](filter-chips/filter-chips.spec.md) | Restreindre une liste à une de ses parties, par une barre de puces. | 🖥️ | beta |
| [Icon](icon/icon.spec.md) | Poser une icône du vocabulaire Arquos, désignée par son rôle et non par son dessin. | 🖥️ | stable |
| [IconButton](icon-button/icon-button.spec.md) | Déclencher une action représentée par une icône seule, sans perdre son nom accessible. | 🖥️ | stable |
| [Input](input/input.spec.md) | Recueillir une valeur courte tapée au clavier, dans un formulaire. | 🖥️ | stable |
| [Label](label/label.spec.md) | Nommer un champ, et agrandir sa cible de clic à tout l'intitulé. | 🖥️ | stable |
| [PhotoViewer](photo-viewer/photo-viewer.spec.md) | Regarder une photo en grand, et passer aux suivantes de la même série. | 🖥️ | beta |
| [Popover](popover/popover.spec.md) | Poser un petit panneau au-dessus de la page, ancré à ce qui l'a ouvert. | 🖥️ | beta |
| [RadioGroup](radio-group/radio-group.spec.md) | Choisir une seule option parmi quelques-unes, toutes visibles à la fois. | 🖥️ | stable |
| [SegmentedTabs](segmented-tabs/segmented-tabs.spec.md) | Basculer entre deux ou trois vues d'un même écran, toutes également importantes. | 🖥️ | beta |
| [Select](select/select.spec.md) | Choisir une valeur dans une liste fermée, sans quitter la ligne où on est. | 🖥️ | beta |
| [Sheet](sheet/sheet.spec.md) | Un panneau qui entre par le bord pour une tâche annexe, sans quitter l'écran. | 🖥️ | beta |
| [Switch](switch/switch.spec.md) | Basculer un réglage qui s'applique immédiatement. | 🖥️ | stable |
| [Textarea](textarea/textarea.spec.md) | Recueillir un texte de plusieurs lignes — une observation, un commentaire. | 🖥️ | stable |
| [Toast](toast/toast.spec.md) | Annoncer sans quitter la page ce qui vient de réussir ou d'échouer. | 🖥️ | beta |

## Métier

Elle porte l'ascenseur : son vocabulaire, ses états, ses règles. shadcn n'a rien d'équivalent, et c'est normal.

| Composant | Rôle | Plateformes | Statut |
| --- | --- | --- | --- |
| [DataTable](data-table/data-table.spec.md) | Présenter des mesures en lignes et colonnes, quand la comparaison colonne par colonne est le sujet. | 🖥️ | beta |
| [FieldRow](field-row/field-row.spec.md) | Afficher un champ en lecture, et le passer en saisie d'un clic sans quitter la page. | 🖥️ | beta |
| [Gauge](gauge/gauge.spec.md) | Montrer une proportion d'un coup d'œil, avec son chiffre écrit à côté. | 🖥️ | beta |
| [NavList](nav-list/nav-list.spec.md) | Lister les rubriques d'un écran, avec ce que chacune contient, et dire laquelle est ouverte. | 🖥️ | beta |
| [PhotoTile](photo-tile/photo-tile.spec.md) | Montrer une photo attendue — prise ou non — avec ce qu'elle est censée montrer. | 🖥️ | beta |
| [StatTile](stat-tile/stat-tile.spec.md) | Mettre en avant une mesure d'identité, celle qu'on veut lire sans chercher. | 🖥️ | beta |

## Ajouter un composant

1. Copier `_TEMPLATE.spec.md` dans `components/<nom>/<nom>.spec.md` et le remplir.
2. Écrire `<nom>.web.tsx` et/ou `<nom>.native.tsx` — uniquement les plateformes déclarées.
3. `npm run catalog` pour régénérer cet index et `dist/catalog.json`.
