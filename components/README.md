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
| [ActiveFilters](active-filters/active-filters.spec.md) | Montrer ce qui restreint la liste, et permettre de le défaire d'un clic. | 🖥️ | beta |
| [Avatar](avatar/avatar.spec.md) | Représenter une personne par sa photo, ou à défaut par ses initiales. | 🖥️ | stable |
| [Badge](badge/badge.spec.md) | Poser une étiquette courte qui qualifie l'élément à côté duquel elle se trouve. | 🖥️ | stable |
| [Banner](banner/banner.spec.md) | Informer d'une condition qui dure, en haut d'une zone, sans interrompre. | 🖥️ | stable |
| [Button](button/button.spec.md) | Déclencher une action. Le poids visuel dit l'importance de l'action, pas sa nature. | 🖥️ | stable |
| [Card](card/card.spec.md) | Poser un groupe d'éléments dans une surface délimitée, avec un en-tête facultatif. | 🖥️ | stable |
| [Checkbox](checkbox/checkbox.spec.md) | Cocher une option indépendante, ou plusieurs, dans un formulaire qui se valide. | 🖥️ | stable |
| [Combobox](combobox/combobox.spec.md) | Choisir dans une liste trop longue pour être parcourue, en la filtrant. | 🖥️ | beta |
| [Command](command/command.spec.md) | Atteindre n'importe quoi dans un écran dense, en tapant son nom. | 🖥️ | beta |
| [Drawer](drawer/drawer.spec.md) | Ouvrir un panneau latéral pour régler ce qu'on regarde, sans quitter l'écran. | 🖥️ | beta |
| [EmptyState](empty-state/empty-state.spec.md) | Dire pourquoi une zone est vide, et ce qu'on peut y faire. | 🖥️ | stable |
| [FilterChips](filter-chips/filter-chips.spec.md) | Restreindre une liste à une de ses parties, par une barre de puces. | 🖥️ | beta |
| [Icon](icon/icon.spec.md) | Poser une icône du vocabulaire Arquos, désignée par son rôle et non par son dessin. | 🖥️ | stable |
| [IconButton](icon-button/icon-button.spec.md) | Déclencher une action représentée par une icône seule, sans perdre son nom accessible. | 🖥️ | stable |
| [Input](input/input.spec.md) | Recueillir une valeur courte tapée au clavier, dans un formulaire. | 🖥️ | stable |
| [Label](label/label.spec.md) | Nommer un champ, et agrandir sa cible de clic à tout l'intitulé. | 🖥️ | stable |
| [Meter](meter/meter.spec.md) | Montrer une proportion dans une série, quand plusieurs valeurs se comparent ligne à ligne. | 🖥️ | beta |
| [PageHeader](page-header/page-header.spec.md) | Dire en haut d'un écran d'où l'on vient, ce qu'on regarde et ce qu'on peut en faire. | 🖥️ | beta |
| [PasswordInput](password-input/password-input.spec.md) | Recueillir un mot de passe, avec une bascule masqué / en clair. | 🖥️ | beta |
| [PhotoViewer](photo-viewer/photo-viewer.spec.md) | Regarder une photo en grand, et passer aux suivantes de la même série. | 🖥️ | beta |
| [Popover](popover/popover.spec.md) | Poser un petit panneau au-dessus de la page, ancré à ce qui l'a ouvert. | 🖥️ | beta |
| [RadioGroup](radio-group/radio-group.spec.md) | Choisir une seule option parmi quelques-unes, toutes visibles à la fois. | 🖥️ | stable |
| [RecordTable](record-table/record-table.spec.md) | Parcourir une collection d'enregistrements, en comparer quelques attributs, en sélectionner plusieurs et en ouvrir un. | 🖥️ | beta |
| [SegmentedTabs](segmented-tabs/segmented-tabs.spec.md) | Basculer entre deux ou trois vues d'un même écran, toutes également importantes. | 🖥️ | beta |
| [Select](select/select.spec.md) | Choisir une valeur dans une liste fermée, sans quitter la ligne où on est. | 🖥️ | beta |
| [SelectionBar](selection-bar/selection-bar.spec.md) | Offrir en bas de liste ce qu'on peut faire des enregistrements cochés. | 🖥️ | beta |
| [Sheet](sheet/sheet.spec.md) | Un panneau qui entre par le bord pour une tâche annexe, sans quitter l'écran. | 🖥️ | beta |
| [Skeleton](skeleton/skeleton.spec.md) | Occuper la place de ce qui charge, pour que l'écran ne mente pas en paraissant vide. | 🖥️ | stable |
| [Switch](switch/switch.spec.md) | Basculer un réglage qui s'applique immédiatement. | 🖥️ | stable |
| [Tag](tag/tag.spec.md) | Distinguer une valeur de référentiel par sa couleur, sans la juger. | 🖥️ | stable |
| [Textarea](textarea/textarea.spec.md) | Recueillir un texte de plusieurs lignes — une observation, un commentaire. | 🖥️ | stable |
| [Toast](toast/toast.spec.md) | Annoncer sans quitter la page ce qui vient de réussir ou d'échouer. | 🖥️ | beta |
| [Toolbar](toolbar/toolbar.spec.md) | Réunir au-dessus d'une liste ce qu'on peut lui faire — filtrer, composer, exporter, changer de vue. | 🖥️ | beta |

## Métier

Elle porte l'ascenseur : son vocabulaire, ses états, ses règles. shadcn n'a rien d'équivalent, et c'est normal.

| Composant | Rôle | Plateformes | Statut |
| --- | --- | --- | --- |
| [DataTable](data-table/data-table.spec.md) | Présenter des mesures en lignes et colonnes, quand la comparaison colonne par colonne est le sujet. | 🖥️ | beta |
| [FieldRow](field-row/field-row.spec.md) | Afficher un champ en lecture, et le passer en saisie d'un clic sans quitter la page. | 🖥️ | beta |
| [Gauge](gauge/gauge.spec.md) | Montrer une proportion d'un coup d'œil, avec son chiffre écrit à côté. | 🖥️ | beta |
| [NavList](nav-list/nav-list.spec.md) | Lister les rubriques d'un écran, avec ce que chacune contient, et dire laquelle est ouverte. | 🖥️ | beta |
| [PhotoTile](photo-tile/photo-tile.spec.md) | Montrer une photo attendue — prise ou non — avec ce qu'elle est censée montrer. | 🖥️ | beta |
| [RecordLayout](record-layout/record-layout.spec.md) | Poser la fiche d'un objet — deux colonnes, chacune avec son propre défilement. | 🖥️ | beta |
| [StatTile](stat-tile/stat-tile.spec.md) | Mettre en avant une mesure d'identité, celle qu'on veut lire sans chercher. | 🖥️ | beta |

## Ajouter un composant

1. Copier `_TEMPLATE.spec.md` dans `components/<nom>/<nom>.spec.md` et le remplir.
2. Écrire `<nom>.web.tsx` et/ou `<nom>.native.tsx` — uniquement les plateformes déclarées.
3. `npm run catalog` pour régénérer cet index et `dist/catalog.json`.
