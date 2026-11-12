# Design system Arquos — pour les agents

> **La connaissance d'Arquos est dans ClickUp, pas ici.** Avant de coder, lire par le connecteur ClickUp : [Commencer ici](https://app.clickup.com/90151390837/docs/2kyq23kn-715/2kyq23kn-3435), la ligne de ce dépôt dans l'[Inventaire des systèmes](https://app.clickup.com/90151390837/docs/2kyq23kn-715/2kyq23kn-3395), et les [Décisions d'architecture](https://app.clickup.com/90151390837/docs/2kyq23kn-715/2kyq23kn-3015). Une décision nouvelle s'écrit là, jamais dans un fichier. Aucun fichier `.md` de documentation ne se crée dans ce dépôt : ce fichier ne contient que ce que l'outil exige pour y travailler.

Source de vérité unique du design : tokens et composants partagés. Consommé par
`Arquosdev/mobile` et `Arquosdev/specFile-equipement`.

## Les cinq règles

1. **Chercher dans `dist/catalog.json` avant d'écrire un composant.** Le rôle
   cherché y figure peut-être.
2. **Chercher chez shadcn/ui avant d'en créer un.** Voir « Partir de shadcn ».
3. **Jamais une valeur de design en dur.** Ni `#0D5AB7`, ni `16px`, ni `z-50`,
   ni `duration-200`. Toujours un token.
4. **Jamais la palette brute dans un composant.** `colors.primary`, pas
   `palette.blue[500]`. La CI le refuse.
5. **Ne pas mettre les apps à jour.** Elles restent sur leur version le temps
   que la base se construise ; la bascule se fera d'un coup. Toute PR qui change
   une règle ou une API s'inscrit dans `MIGRATION.md`.

Si le token ou le composant manque : ne pas l'inventer dans l'app, l'ajouter ici.

## Choisir un token

| | |
| --- | --- |
| Couleur | `colors.*` — jamais `palette.*` |
| Espacement | base 4 ; `base` (16) par défaut, `sm` (8) entre proches |
| Arrondi | `md` (8) ; `full` seulement sur un carré |
| Typographie | les préréglages (`typography.body`), jamais recombiner. Un titre de section DANS un formulaire : `overline`, en capitales |
| Icône | un **rôle** (`<Icon role="supprimer" />`), jamais un dessin |

| Typographie | les préréglages (`typography.body`), jamais recombiner |
| Icône | un **rôle** (`<Icon role="delete" />`), jamais un dessin |
| Hauteur de contrôle | `h-(--arq-control-md)` (36, la référence), jamais `h-[36px]` |
| Empilement | `z-(--arq-layer-flottant)`, jamais `z-50` |
| Durée | `duration-(--arq-duration-normal)`, jamais `duration-200` |
| Bordure | `border-(length:--arq-border-epais)`, jamais `border-[1.5px]` |

Chaque token porte une description dans `dist/tokens.json` : la lire plutôt que
deviner d'après le nom. La page **Fondations → Tous les tokens** de la vitrine
donne les 95 entrées avec leurs trois écritures — TypeScript, classe Tailwind,
variable CSS.

**Trois pièges de couleur.**

- `textSubtle` **n'est pas une couleur de texte** (3,14 sur blanc). Icônes,
  chevrons, bordures. Pour un texte discret : `textMuted` (5,34).
- **Les teintes d'état vont par paire** : `bg-success-bg` avec
  `text-on-success-bg`. Jamais `text-success` dessus (2,77). Idem `danger`,
  `warning`, `info`.
- **Ne jamais ajouter de taille de police.** L'échelle est calibrée sur l'usage.

**Empilement — la règle qui tient l'échelle** : un élément flottant passe
au-dessus de la surface qui l'a ouvert. Toute surface pouvant contenir un menu se
place donc sous `flottant`.

| | | |
| --- | --- | --- |
| `panneau` | 50 | panneau latéral, tiroir |
| `flottant` | 60 | menu, sélecteur, infobulle |
| `plein-ecran` | 70 | visionneuse, palette |
| `notification` | 80 | ce qui reste visible quoi qu'il arrive |

## Modifier un token

1. Éditer `src/<fichier>.ts`
2. `npm run build` — régénère `dist/`
3. Prendre un **numéro de version libre** (la CI refuse un numéro déjà taggé)
4. Committer `src/` et `dist/` ensemble

## Publier

Le paquet est privé, sur GitHub Packages : `@arquosdev/design-system` (GitHub
impose la portée du propriétaire du dépôt). Les apps l'installent sous l'alias
`"@arquos/design-system": "npm:@arquosdev/design-system@<version exacte>"`,
donc leurs imports ne changent pas.

Un tag `v<version>` poussé publie (`.github/workflows/publier.yml`). Deux lignes,
jamais mêlées : `main` publie sous l'étiquette `production` (`2.x.y`), `refonte`
sous l'étiquette `refonte` (`2.x.y-refonte.n`). Le workflow refuse une version
qui ne porte pas la marque de sa ligne. Une app ne voit un changement qu'après
la publication ET la montée de son numéro épinglé.

## Saisir une valeur : quel composant

| La valeur… | Prendre |
| --- | --- |
| se tape, courte | `Input` |
| se rédige, longue | `Textarea` |
| se choisit parmi 2 à 6 visibles | `RadioGroup` |
| parmi 7 à 20 | `Select` |
| au-delà de 20 | `Combobox` |
| vraie/fausse, validée plus tard | `Checkbox` |
| vraie/fausse, **appliquée aussitôt** | `Switch` |
| **déjà affichée dans une fiche** | `FieldRow` |

`Checkbox` et `Switch` ne sont pas interchangeables : la case attend un
« Enregistrer », l'interrupteur s'applique en basculant.

## Montrer des lignes : quel tableau

| Les lignes… | Prendre |
| --- | --- |
| font l'écran d'une liste (filtres, tri, sélection, pages) | `RecordTable` |
| font une **rubrique de fiche** (Contrats d'un client, États d'un équipement) | `SectionTable` |
| comparent des mesures d'un même objet | `DataTable` |

`SectionTable` est le tableau des fiches, sur le modèle des Contrats d'un client
(Thomas, 09/11/2026) : titre et compte, tableau d'un bord à l'autre, filet
au-dessus, densité des listes, icône obligatoire dans chaque en-tête. Une app le
vérifie avec `scripts/check-tableaux.mjs <dossiers>`.

## Composer une page : les règles de la recette

Tirées des écrans revus avec Thomas (novembre 2026). Elles valent pour toute page
d'Arquos V2 : fiche, liste, Facturation, Pièces et stock. Deux principes les
tiennent ensemble : **cohérence** (une même chose se dessine toujours de la même
façon) et **minimalisme** (rien qui ne serve à lire ou à agir).

**Validé par Louis le 12/11/2026 sur la fiche Équipement** (essai « fiche en cartes »,
d'après Supabase) ; ces règles remplacent les blocs « à plat » de novembre.

**Page blanche, à plat ou en cartes.** Le fond de la zone est blanc ; le gris est réservé
à la barre latérale (`navBg`). Une rubrique qui n'est QU'UN tableau ou une liste en fait le
sujet de la page : à plat, d'un bord à l'autre, sans carte ni largeur maximale. Une rubrique
qui EMPILE des blocs (groupes de champs, un résumé suivi d'un tableau) les sépare par des
cartes (`Surface`, `FieldSurface`) : une carte sépare des blocs, elle n'encadre jamais un
élément seul. Son contour est son ombre (`shadow-surface`), sans bordure.

| Règle | Comment |
| --- | --- |
| **Une liste d'objets est toujours un tableau** | Plusieurs lignes qui partagent les mêmes colonnes : `RecordTable`, `SectionTable`, ou `DataTable` pour des mesures. Jamais une liste de cartes. Une carte ne sert qu'à un bloc de champs d'un même objet, ou à un petit résumé de liens vers d'autres objets (l'identité d'une fiche) |
| **Largeurs** | Une rubrique de champs s'étend jusqu'à 1 440 px ; ses cartes prennent toutes la largeur de la rubrique (jamais deux cartes côte à côte, sauf les petites cartes de liens et les cotes par zone) ; ce sont les CHAMPS qui passent sur deux colonnes au-delà de 900 px de carte, jamais trois. Une rubrique à plat prend toute la largeur. Marge de page 24 px (sur la verticale du nom de la fiche et des onglets) |
| **Trois niveaux de titre** | Nom de la fiche 20 px (`title-large`, `brand`) ; titre de rubrique (18 px, `title`) masqué à l'écran quand il répète l'onglet, gardé pour le lecteur d'écran ; titre de groupe 13 px, graisse 600, gris (`GroupTitle`), 8 px au-dessus de sa carte, 24 px entre deux groupes |
| **Le bleu vif d'une fiche est « Actions »** | Le menu « Actions » en haut à droite d'une fiche est toujours `default` (bleu vif) ; tout autre bouton de l'en-tête, étape suivante comprise, est en `outline` ou entre dans le menu ; une fiche sans menu « Actions » n'a pas de bleu vif (Louis, 12/11/2026) |
| **La colonne d'informations** | À droite de chaque fiche, 340 px, sous le filet de la barre d'onglets principale (qui couvre toute la largeur) jusqu'en bas ; la seconde rangée d'onglets ne couvre que la zone de gauche ; l'en-tête de la fiche n'a pas de filet, il se fond dans la barre d'onglets ; filet vertical doux, défilement propre (`RecordZone aside`) : les Rattachements en lignes (icône de l'objet, rôle, nom en lien), puis l'essentiel en lignes de champs compactes (`DetailGroup`, `DetailRow`, `DETAIL_FIELD_ROWS`) : une sélection courte (8 lignes au plus) et un `GroupLink` « Voir tout » vers l'onglet du détail. Rien en carte dans la colonne. **Affichée sur un écran assez large (1 280 px et plus)** ; une croix discrète en haut à droite de la colonne la ferme, le bouton fantôme « Informations » au bout de la barre d'onglets principale (`RecordRail fin`, jamais un onglet) la rouvre ; le choix se retient pour le visiteur (navigateur), sur toutes les fiches, sans préférence de compte ; aucune icône devant les libellés de la colonne ; plus étroit, son contenu devient automatiquement l'onglet « Informations », en cartes, les rattachements en petites cartes en grille. Colonne affichée, l'onglet Général disparaît s'il ne lui reste rien (Louis, 12/11/2026) |
| **Exception : un Général qui est un tableau de bord** | Une fiche qui a un vrai contenu de suivi (l'Équipement) garde son onglet Général, et c'est sur lui qu'on arrive : « à gauche ce qui bouge, à droite ce qui identifie ». Général montre l'état, ce qui est à traiter, la connaissance, les photos et les écarts ouverts ; la colonne porte les Rattachements, l'identité et le contrat, et rien de ce qui y est ne se répète dans Général. En mode onglet, ce contenu de colonne devient l'onglet « Informations », juste après Général, ses rattachements en cartes (Louis, 12/11/2026) |
| **L'identifiant en DM Mono** | L'identifiant d'un objet (numéro d'équipement, nom d'immeuble ou de client, numéro de contrat, de relevé, de devis, de facture…) s'écrit en DM Mono, graisse 500 (la plus grasse dessinée), approche resserrée : `IDENTIFIER`. Partout où il paraît comme identifiant : la colonne d'identité de tout `RecordTable` (donc de toute liste et de tout `SectionTable`, automatiquement), le nom d'une fiche sous le fil d'Ariane, une carte d'identité. Le texte courant ne change pas (Louis, 12/11/2026) |
| **Rien sous le nom de la fiche** | Plus de ligne d'informations sous le nom (« Adresse … · Téléphone … ») : les liens vers les objets parents sont les Rattachements de la colonne d'informations (en lignes), ou, en mode onglet, des cartes d'identité en tête de l'onglet « Informations » (icône de l'objet, libellé, nom, une ligne de précision) ; les rappels de champs ne se recopient pas. La ligne du nom garde ses pastilles (statut, rôles, alertes) (Louis, 12/11/2026) |
| **Actions de rubrique dans l'en-tête de fiche** | Les boutons d'une rubrique ou d'une sous-rubrique (« Nouvelle affaire », « Modifier ») se posent dans l'en-tête de la fiche, à gauche d'« Actions », et suivent l'onglet actif ; la loupe de recherche de champ les précède. Un bouton qui ne concerne qu'un groupe reste à droite du titre de son groupe ; le geste d'un titre de groupe est un `GroupLink` (13 px, 500, `primary`) |
| **Densité** | Texte courant 14, cellules de tableau 13 (lignes d'environ 36 px), libellés de champ 13, lignes de champ 10 × 16 px, barre d'onglets 36 px, légendes 12 |
| **Boutons uniques** | 28 px, 12 px graisse 500, icônes 14, rembourrage 10 ; secondaire blanc contouré d'une ombre ; un seul bleu vif par page ; tout ce qui se clique sur une même ligne a cette taille (segments, recherche, menus, puces, boutons d'icône 28 × 28) |
| **Pastilles uniques** | `Badge`/`Tag`/`StatusBadge` : 22 px, arrondi 6, fine bordure de la teinte, 12 px ; jamais de pilule ronde dessinée à la main |
| **Onglets** | Onglets principaux et secondaires d'un seul dessin (`RecordRail`, `SubTabs`) : texte, onglet actif en graisse 600 (place du gras réservée) et trait de 2 px au ras du filet, jamais rogné ; **aucun compte dans un onglet** ; le focus au clavier seulement (`focus-visible`), en anneau fin dans l'onglet ; chevrons quand la rangée déborde (Louis, 12/11/2026) |
| **Un tableau seul colle à la barre d'onglets** | Une rubrique qui n'est qu'un tableau commence directement sous la barre : son filet du bas, puis la ligne d'en-tête du tableau, sans bande blanche ; une rubrique en cartes garde ses 24 px sous la barre (Louis, 12/11/2026) |
| **Arrondis** | Commande (bouton, champ, pastille) 6 ; carte, menu, popover, info-bulle 8 ; boîte de dialogue, palette 12 ; un panneau collé au bord : 0 |
| **État vide unique** | `EmptyState` : centré, l'icône dans un carré blanc contouré, un titre court, une ligne qui dit ce qui viendra, le geste en secondaire. Jamais une phrase grise posée seule. **Jamais dans une carte ni un cadre** : une rubrique entièrement vide pose son état vide sur la page, sans cadre ni ombre ; un groupe vide d'une rubrique en cartes est CACHÉ, titre compris : pas de « 0 » dans un titre de groupe, pas de carte qui ne contient qu'une phrase d'absence (Louis, 12/11/2026) |
| **Modifier en ligne quand c'est pertinent** | Une valeur simple se corrige là où on la lit (pointillé de `FieldRow`). Un panneau reste pour plusieurs champs à la fois, une confirmation ou une création |
| **De l'air sous l'en-tête** | 16 px entre la ligne du nom (et ses pastilles, ses boutons) et la barre d'onglets principale, partout (Louis, 12/11/2026) |
| **Une seule marge de page, un seul squelette** | Tout ce qui commence à gauche (en-tête de fiche, barres d'onglets, contenu à plat ou en cartes, listes) tombe sur la même verticale : 24 px (16 sur un téléphone). Un état de chargement reproduit la page chargée, mêmes marges, mêmes largeurs, colonne comprise ; un seul gris de squelette, celui de `Skeleton` (Louis, 12/11/2026) |
| **Multiples de 4 seulement** | Toujours un token de `spacing` ; une cote qui n'en est pas un se compose de tokens (`calc(var(--spacing-sm)+var(--spacing-xxs))`) |
| **Filtrer : un seul chemin** | Une liste qui a des Filtres n'ajoute ni bouton ni pastille pour le même critère |
| **Choisir une vue, c'est un onglet** | Une rangée qui fait choisir UNE vue d'un contenu parmi plusieurs (sélection exclusive) est une barre d'onglets secondaire (`SubTabs`, le dessin des sous-rubriques de Maintenance), posée sous la barre principale ; jamais des pastilles ni des boutons. Les pastilles à sélection MULTIPLE restent des `FilterChips` ; une liste qui a déjà le panneau « Filtres » n'en ajoute pas (Louis, 12/11/2026) |
| **Les champs vides se replient** | Derrière un seul « Afficher N champs vides » au pied de la carte (`SurfaceFooter`) |

## Anatomie d'un composant

| Fichier | Contenu |
| --- | --- |
| `<name>.spec.md` | La fiche : rôle, **quand NE PAS l'utiliser**, props, états, accessibilité |
| `<name>.logic.ts` | Le métier sans React : vocabulaire, seuils, règles |
| `<name>.web.tsx` | Implémentation web |
| `<name>.native.tsx` | Implémentation React Native |

**Lire la fiche avant l'implémentation** : elle seule dit quand le composant est
le mauvais choix.

**Le métier ne s'écrit pas dans une implémentation.** Un mot, un seuil, une règle
vont dans `<name>.logic.ts` — testable sans navigateur. Les classes et styles
restent côté plateforme. Voir `CONVERGENCE.md`.

### Ajouter un composant

1. Chercher dans `dist/catalog.json`
2. Chercher chez shadcn/ui
3. Copier `components/_TEMPLATE.spec.md`, le remplir, déclarer sa `layer`
4. Écrire les implémentations des plateformes déclarées
5. Écrire sa story : `stories/<layer>/<name>.stories.tsx`, titrée
   `Composants/<Couche>/<Nom>`
6. Tester la logique si elle existe : `<name>.logic.test.ts`
7. `npm run catalog`

### Statut

| | |
| --- | --- |
| `stable` | API arrêtée. La changer passe par `MIGRATION.md`. |
| `beta` | L'API peut bouger. **État par défaut d'un composant neuf.** |
| `déprécié` | La fiche dit par quoi le remplacer. |

**Passer à `stable` demande les deux** : consommé en production, ET API stable
depuis deux versions. Ne pas promouvoir par confort.

### Les deux couches

- **`generique`** — une mécanique que n'importe quelle application aurait. Vient
  de shadcn/Radix, ou pourrait.
- **`metier`** — porte l'ascenseur : son vocabulaire, ses états, ses règles.

Le doute se tranche ainsi : **une application de comptabilité en voudrait-elle
telle quelle ?** Oui → `generique`.

Ce n'est pas de l'atomic design, et c'est délibéré : classer par taille répond à
une question que personne ne se pose en travaillant.

## Partir de shadcn

```bash
npx shadcn@latest add <composant>
```

Écrit dans `components/ui/`. Déplacer vers `components/<name>/<name>.web.tsx`,
habiller aux tokens, écrire la fiche.

**Garder** : les noms de variantes et de tailles (`default`, `secondary`,
`outline`, `ghost`, `destructive`, `link` ; `default`, `sm`, `lg`, `icon`), la
composition plutôt que les props de configuration, les primitives Radix.

**Changer** : les couleurs, qui viennent des tokens. `tokens.tailwind.css`
traduit leur vocabulaire une seule fois — ne jamais le redéfinir dans une app.

**Ajouter** : les variantes que le métier réclame. Étendre la `cva`, pas forker.

**Remplacer les icônes Lucide par le vocabulaire Phosphor.**

## Ce que la CI refuse

`npm run check` : types, numéro de version, dérivés non régénérés, catalogue
périmé, chemins de `replaces` cassés, paire de couleurs illisible, palette brute,
**libellé anglais dans ce qui s'affiche**, tests. Puis `npm run vitrine` et
`npm run contraste-render`, qui mesure le contraste dans un vrai navigateur.

**Deux contrôles de contraste, et il faut savoir lequel voit quoi.**
`contraste` lit les classes — rapide, mais n'apparie que ce qui vit dans la même
chaîne. `contraste-render` mesure le rendu et voit ce que l'autre ne peut pas :
fond sur le parent, opacité, couleur posée par une animation.

## La vitrine

<https://arquosdev.github.io/design-system/> · en local `npm run storybook`

| Section | Contenu |
| --- | --- |
| **Prise en main** | Introduction, Installer, Par où commencer |
| **Fondations** | Les règles de décision d'abord, les styles ensuite |
| **Composants** | Générique, puis Métier |
| **Patterns** | Le système assemblé dans un écran réel |

Elle ne duplique rien : les pages lisent `components/<name>/<name>.spec.md` et
`dist/tokens.json`.

Un agent cherche dans `dist/catalog.json` ; la page « Par où commencer » offre la
même recherche aux humains.

## Un piège : les classes `text-*`

Tailwind emploie `text-` pour la taille **et** la couleur. `tailwind-merge` ne
connaît pas nos noms : sans configuration il range `text-small` et
`text-text-on-dark` dans le même groupe et ne garde que le dernier — la couleur
disparaît en silence.

`components/_lib/cn.ts` lui déclare nos tailles. **Ne jamais remplacer `cn()` par
`clsx`** dans un composant.

## À ne pas faire

- Éditer `dist/` ou `components/README.md` à la main
- Ajouter une valeur intermédiaire à une échelle « parce qu'il manque 2 px »
- Écrire de la documentation dans une story : elle vit dans la fiche
- Mettre les apps à jour

## Nommage : anglais pour l'API, français pour la prose

Depuis la `v2.0.0`, la frontière n'est pas « technique / métier », c'est **qui
lit** :

| Lu par une machine ou un développeur | Lu comme de la prose |
| --- | --- |
| props, types, exports, rôles d'icônes | libellés affichés |
| clés de front-matter des specs | commentaires du code |
| valeurs d'API (`'asc'`, `'filled'`) | corps des specs, noms de stories |
| **anglais** | **français** |

Donc `<Meter value={62} label="Taux de connaissance" />` : `value` et `label`
sont des props, « Taux de connaissance » est ce que l'utilisateur lit. Et
`NOT_FILLED` vaut « Non renseigné ».

**La règle est tenue par `check-francais.mjs`, et elle ne l'était pas.** Un
renommage automatique a traduit vingt-deux libellés dans le sens interdit :
« Enregistrer » est devenu « Save » et « Annuler » « Cancel » dans l'éditeur de
`FieldRow`, « Aucune mesure relevée. » est devenu « NoneB measure relevée. »
dans `DataTable`. Quatre d'entre eux étaient dans du code livré, et personne ne
l'a vu pendant six mois : un libellé ne casse rien, il se lit.

Le contrôle porte sur le TEXTE QUE LE RENDU AFFICHE — ce qui vit entre deux
balises — et jamais sur un nom de prop ni une valeur d'attribut, qui s'écrivent
en anglais à bon droit. Sa liste de mots est fermée, et c'est ce qui la rend
utilisable : reconnaître « de l'anglais » se tromperait sur « Machine »,
« Type », « Options », qui s'écrivent pareil dans les deux langues.

Les noms de stories restent français parce que Storybook les affiche tels quels
dans sa barre latérale : « Avec son intitulé », « Dans la fiche » sont des
libellés de documentation, pas des identifiants.

Voir `MIGRATION.md` pour la table de correspondance, et
`web/docs/decisions/0003-anglais-pour-le-code-francais-pour-l-ecran.md` pour le
raisonnement.
