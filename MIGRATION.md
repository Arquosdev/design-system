# Monter une app vers la version courante

## Non publié — un contenant a la bordure douce, un contrôle la bordure marquée

**`Card`, `Accordion`, `StatTile` et `DataTable` passent de `border-border`
(#C8D3DA) à `border-border-soft` (#EAEEF1)**, la teinte des lignes de
`RecordTable`. Louis, le 06/10/2026 : les cadres étaient « trop foncés », il
préférait « les lignes des tableaux, plus douces ». La règle : ce qui CONTIENT
prend la bordure douce ; ce qui SE MANIPULE — champ, bouton, case, menu —
garde la bordure marquée, qui dit où cliquer.

**À vérifier chez l'appelant** : un bloc dessiné à la main avec
`border-border` à côté d'une carte se voit maintenant plus dur qu'elle. Aucune
cote ne bouge.

**Et la fiche de `Button` change de conseil** : `secondary` (le bleu pâle) ne
sert plus à une action. Un seul bouton plein par page, l'action principale ;
tout le reste en `outline`. Le bleu pâle dit déjà « sélectionné » dans une
navigation, et un bouton qui le porte se lit comme un état.

## 2.36.0-refonte.4 — un seul rayon, 4 px, hors cercles

**`radius.block` et `radius.control` valent tous deux 4 px.** Louis, le
27/09/2026, sur la page Immeubles : le bloc était à 3 px, les boutons à 5, la
recherche à 8 — « je trouve pas ça cohérent ». La règle est l'unicité ; la
valeur, 4 px, se lit comme un arrondi voulu tout en restant proche des angles
du site, et tombe sur la grille de 4 px. Un essai à 3 px (refonte.3) a
précédé.

**Ce qui bouge** : tout ce qui porte `rounded-control` ou `rounded-block` —
`Button`, `IconButton`, `Input`, `Textarea`, `PasswordInput`, `Select`,
`Combobox`, `DateField`, `Badge`, `Tag`, `Banner`, `Toast`, `FieldRow`,
`NavList`, `SegmentedTabs`, `Card`, `Accordion`, `DataTable`, `StatTile`,
`PhotoTile` — et, côté natif, les sept composants qui lisent
`radius.control`. Dix emplacements qui écrivaient leur propre rayon le
reprennent : les menus de `Select` et de `Popover`, la palette `Command`, la
`SelectionBar` et la visionneuse de photos passent sur `rounded-block` (8 et
12 px auparavant), la `Checkbox` et les squelettes sur `rounded-control`.

**Ce qui ne bouge pas** : les cercles (`rounded-full` : interrupteur, bouton
radio, avatar, compteur) et les jetons `sm` à `3xl`, que plus aucun composant
web n'emploie.

**À vérifier chez l'appelant** : un rayon écrit en dur (`rounded-md`,
`rounded-[4px]`) à côté d'un composant se voit maintenant. Aucun calcul de
cote ne dépend d'un rayon.

## 2.36.0-refonte.2 — une option de `Combobox` se trouve par ses mots-clés

**`ComboboxOption.keywords`, facultatif et additif** : d'autres mots par
lesquels l'option se trouve, en plus de son libellé. Ils servent à chercher,
jamais à afficher, et passent tels quels à `cmdk`. Rien ne change pour qui ne
les donne pas.

Né dans le panneau de filtres de l'application web le 26/09/2026 : un filtre
se cherche aussi par les valeurs qu'il offre — « hors parc » trouve « Contrat
de maintenance ». C'était une demande de Louis du 29/08/2026 (« certains
utilisateurs se plaignent de trouver difficilement des filtres basiques »),
perdue quand le panneau est passé à une palette par filtre.

```tsx
<Combobox options={[{ value: 'contract', label: 'Contrat de maintenance', keywords: ['Au contrat', 'Hors parc'] }]} … />
```

## v2.15.0 — les dates s'éditent, et elles sortent en ISO

**`DateField` est neuf, et `FieldRow` a un `kind="date"`.** C'est additif des
deux côtés : rien d'existant ne change de comportement, aucune cote ne bouge.

**Ce que ça débloque.** La déclaration d'objets de `web` porte **treize
attributs `format: 'date'` sur cinq objets** — relevé, affaire, sollicitation,
écart — et **pas un seul ne s'éditait**, parce que le design system n'offrait
aucun champ de date.

**Pourquoi ils avaient été figés, et c'est la partie à lire deux fois.**
Jusqu'au 06/09/2026, le formulaire de `web` rendait un `Input` NU pour un
attribut de date, et il écrivait. Son PostgreSQL est réglé sur
`DateStyle = ISO, MDY` : « 12/09/2026 » entrait donc comme le **9 décembre**,
sans un mot, sans erreur — tandis que « 31/12/2026 » faisait lever une erreur
brute. **Les jours 1 à 12 d'un mois corrompaient en silence, les suivants
plantaient.** Sept champs de la création d'une affaire étaient dans ce cas, et
la parade a été de rendre toutes les dates non modifiables.

**Le contrat qui lève la parade** : ce qui s'affiche est `JJ/MM/AAAA`, ce qui
entre et ce qui sort est `AAAA-MM-JJ`. `onValue` ne rend jamais une frappe
partielle, jamais une date impossible, jamais une chaîne à interpréter — de
l'ISO valide, ou `null`. `2026-09-12` n'a pas de seconde lecture.

```tsx
import { DateField, todayISO } from '@arquos/design-system/web';

<DateField value={miseEnService} onValue={setMiseEnService}
           ariaLabel="Date de mise en service" max={todayISO()} />

// Dans une fiche, à corriger sur place
<FieldRow label="Date de mise en service" value="1978-03-04"
          kind="date" onSave={enregistrer} />
```

**Sur `FieldRow kind="date"`, la seule chose à savoir** : c'est le seul genre
dont l'affichage n'est pas le stockage. `value="1978-03-04"` affiche
« 04/03/1978 », `onSave` rend `'1978-03-04'`. L'ISO est la bonne façon de le
passer, et le français est accepté aussi — les deux écritures se distinguent
sans ambiguïté, l'ISO met l'année devant.

> **À VÉRIFIER DANS UNE APP QUI MONTE : un `switch` EXHAUSTIF sur `FieldKind`.**
>
> `FieldKind` gagne un membre — `'date'` — et un `switch` exhaustif avec un
> `never` en défaut signalerait alors un cas manquant. **Vérifié dans `web` le
> 07/09/2026 : il n'y en a aucun.** Le seul usage y est `kind?: FieldKind` comme
> annotation de type (`app/(app)/equipment/[id]/sections/fields-section.tsx:31`),
> qui s'élargit sans rien casser. `mobile` n'a pas été vérifié.

> **Et prendre `todayISO()`, jamais `new Date().toISOString().slice(0, 10)`.**
>
> Le second convertit vers UTC : à Paris en été, le 12 septembre à minuit en
> sort comme le 11, et il borne alors la veille. C'est la même faute que celle
> que le composant existe pour fermer, écrite dans l'appel plutôt que dans le
> composant. `todayISO` est exporté par les deux points d'entrée.

**Une leçon au passage, et elle vaut pour tout le dépôt.** La première version
du calendrier fondait ses cases hors bornes (`disabled:opacity-50`) : **2,06 pour
1 au rendu, et `npm run check` en vert.** Les deux contrôles sont aveugles à ce
motif — le lecteur de classes ne fond pas une opacité, axe exempte ce qui porte
`disabled` — exactement comme pour le libellé à 2,34 du 01/09/2026. La paire
nommée `inactiveBg`/`onInactiveBg` (5,99) est vérifiée à la source, où l'opacité
n'a pas de prise. **`opacity-50` sur du texte indisponible est un motif à
proscrire, pas seulement à corriger là où on le trouve.**

Et il reste un angle mort : `check-contraste-rendu.mjs` n'ouvre pas les
surfaces flottantes. Le contenu d'un popover — ce calendrier, un menu — n'est
mesuré par personne au rendu.

**Un manque qui reste, et qui n'est pas celui-là.** Le `value` de `FieldRow`
sert à la fois d'affichage et de valeur initiale de l'éditeur : il faudrait un
couple `display`/`edit`. Les dates y échappent parce que leurs deux écritures se
distinguent ; **un montant n'y échappera pas** — `web` contourne aujourd'hui en
mettant l'unité dans le libellé, « Prix de base minimum (€) ». À traiter quand
un champ en aura besoin.

## v2.14.0 — le menu d'un `Combobox` a la densité d'un menu

**Ça se voit, et c'est ce que Louis demandait.** Les entrées d'un `Combobox`
passent de 35,6 à 24 pixels de haut, et sa liste de 240 à 248.

Louis, le 30/08/2026 : « je les trouve grossiers, avec un padding de tous les
côtés inutile ».

**La cause.** `Command` a deux tailles depuis la v2.10.0, et `sm` est la densité
d'un menu. Mais `Combobox` s'adresse directement à la primitive `cmdk` — il lui
faut son propre champ et son propre ancrage — donc il n'héritait de rien : ses
entrées, son état vide et ses intitulés rendaient à la densité de la PALETTE ⌘K.
La taille existait, il ne la déclarait pas. Le commentaire de `Command`
annonçait que ce contournement disparaîtrait « le jour où quelqu'un y
reviendra » ; `CommandSizeProvider` est ce jour.

**Et la liste ne coupe plus d'entrée en deux.** Une entrée valait 23,59 px — une
ligne de `small` plus ses deux `xxs` — donc aucun multiple n'était entier et la
borne restait approchée quoi qu'on écrive. L'entrée porte maintenant
`min-h-[24px]` (`min-`, pour qu'un libellé qui passe à la ligne puisse grandir),
et le compte se pose :

| | |
| --- | --- |
| `Combobox` | 10 × 24 + 4 + 4 = **248** |
| `Command size="sm"` | 11 × 24 + 4 + 4 = **272** (valait 268) |

Mesuré au rendu sur une liste de vingt et une marques : hauteur d'entrée 24,000,
liste 248, contenu 512, **dix entières visibles, reste 0,000**.

> **À VÉRIFIER DANS UNE APP QUI MONTE : tout calcul qui recopiait 23,59.**
>
> `web` borne la liste de son sélecteur d'agence à `max-h-[401px]`, écrit comme
> 17 × 23,59. Avec l'entrée à 24, ce compte devient faux — 401 / 24 = 16,71,
> donc une entrée coupée en deux, très exactement le défaut qu'on corrige ici.
> Corrigé côté `web` le 01/09/2026 (401 → 408).
>
> **La leçon dépasse ce cas.** `web` consomme le design system par
> `file:../design-system`, en lien symbolique : un commit d'ici arrive chez lui
> sans version ni palier. Une hauteur d'ici recopiée dans un calcul là-bas se
> casse en silence, et aucun contrôle des deux dépôts ne le voit — c'est une
> arithmétique juste sur une constante périmée.
>
> Donc : **toute modification d'une hauteur, d'une largeur ou d'un espacement
> qu'un écran pourrait avoir recopié se signale ici**, sous ce titre, même quand
> la valeur d'ici est juste. Chercher `max-h-[`, `h-[` et les multiplications
> par une constante dans l'app.

**Nouvel export** : `CommandSizeProvider`, pour déclarer la taille sans passer
par `Command`. À n'employer que dans ce cas — quiconque peut poser `<Command
size="sm">` doit le poser.

**Aussi dans cette version, deux points de documentation du lot 27 :**

- **`FieldRow` dit qu'il suppose une pile.** Son filet se retire avec
  `last:border-b-0`, ce qui désigne le bas de la colonne DROITE dans une grille à
  deux colonnes — le bas de la gauche gardait son filet et se lisait comme un
  champ manquant. Le composant ne peut pas deviner le nombre de colonnes ; sa
  fiche donne maintenant la classe que la grille doit poser.
- **Une huitième règle d'écran : « le bleu vif dit ceci se clique ».** Cinq
  familles piochaient dans le bleu sans qu'aucune ne dise ce qu'elle signifie —
  `bg-primary`, `text-primary`, `border-primary`, `bg-primary-dark`,
  `bg-brand/80`. Chacune a maintenant sa phrase, et la prose posée sur `infoBg`
  prend `textOnInfoBg`, le marine, qui ne promet pas un clic.

## v2.13.0 — les contrôles d'une même barre rendent la même hauteur

**Celle-ci se voit.** `Select`, `Combobox`, `FilterChips` et `ActiveFilters`
passent de 32 à 36 pixels de haut. Une app qui monte verra tous ses sélecteurs et
toutes ses pastilles de filtre grandir de quatre pixels.

**Pourquoi.** `Select` rendait 32, `IconButton` 36 ou 30, `Button` 36, 30 ou 44.
Aucune taille de bouton ne tombait sur celle d'un sélecteur : trois contrôles
côte à côte sur une barre de filtres ne pouvaient donc PAS s'aligner sans qu'un
écran écrive une hauteur à la main. C'est ce que la pagination de `web` fait
depuis le 30/08/2026 — un `size-[32px]` posé sur deux `IconButton`, assumé et
signé, avec un renvoi au lot 27.

Le 32 n'était pas une quatrième taille, c'était l'anomalie. Il disparaît.

**TRANCHÉ PAR LOUIS LE 01/09/2026.** Le lot 27.1 disait « il arbitrera sur
pièces », parce que ces quatre pixels repeignent tous les sélecteurs du produit
et que personne ne le lui avait décrit. La pièce lui a été montrée — une barre
de cinq contrôles alignés, capture `08-barre-alignee.png` — et il a répondu :
« je suis ok aussi ». **La question est close, ne pas la rouvrir.**

**Une échelle, trois valeurs** — `src/control.ts`, ce sont les trois tailles de
`Button`, qui étaient déjà l'échelle de fait :

| | | |
| --- | --- | --- |
| `sm` | 30 | l'action discrète — fin de ligne, barre de sélection, éditeur en place |
| `md` | **36** | **la référence** — bouton, sélecteur, ligne de titre qui vaut un bouton |
| `lg` | 44 | la cible tactile confortable |

S'écrit `h-(--arq-control-md)`, comme `z-(--arq-layer-flottant)` et
`duration-(--arq-duration-normal)`. Dix-huit hauteurs écrites en dur dans les
composants ont été remplacées, dont les sept `36px` que la tâche 14.10 relevait :
`Button`, `IconButton`, le bouton de recherche de `RecordRail`, son squelette, la
ligne de titre de `PageHeader`.

**Ce qui disparaît côté `web` le jour de la bascule** : le `size-[32px]` des deux
`IconButton` de la pagination. Ils s'alignent maintenant tout seuls.

**Ce qui NE bouge pas** : les tailles de surface — l'avatar (44), les boutons de
la visionneuse de photo (36 et 44), la largeur d'une feuille. Ce ne sont pas des
contrôles posés sur une barre, et les faire suivre une échelle de hauteur de
contrôle serait leur donner une règle qui ne les concerne pas.

## v2.12.0 — un bouton non cliquable le dit, et peut dire pourquoi

**Rien à changer** : `disabled` fait ce qu'il faisait. Ce qui s'ouvre est une
autre façon d'être indisponible, `inactive`, à prendre partout où une raison
existe.

Louis, le 01/09/2026, sur le bouton « Nouvel équipement » d'une liste sans
agence choisie : « il me paraît bizarre dans le format, on dirait que c'est un
bouton qui est cliquable. Est-ce qu'il ne faudrait pas un état de bouton non
cliquable […] en grisé ».

**Deux défauts, et le second ne se voyait pas.**

`disabled` pose `pointer-events-none` : le bouton ne reçoit ni survol ni focus,
donc il ne peut PAS porter d'infobulle ni ouvrir de `Popover`. La seule façon
d'apprendre pourquoi le geste est impossible était de le tenter — et il ne se
passait rien.

Et `opacity-50` gardait la couleur de la variante. Mesuré au rendu, dans Chrome :
libellé blanc sur du bleu fondu, **2,34 pour 1** ; libellé d'un `outline` fondu
sur blanc, **2,06**. Deux fois sous le seuil de 4,5 — et invisibles des deux
contrôles du dépôt, ce qui explique que personne ne l'ait vu : le lecteur de
classes ne sait pas fondre une opacité, et **axe exempte du contraste tout ce qui
porte `disabled` ou `aria-disabled`**.

**Ce que fait `inactive`.**

```tsx
// La raison en infobulle, quand le bouton est seul.
<Button inactive inactiveReason="Choisissez une agence pour créer un équipement">
  Nouvel équipement
</Button>

// La raison déjà écrite à l'écran : pas d'`inactiveReason`, elle serait lue deux fois.
<Button inactive>Nouveau client</Button>
```

- `aria-disabled` et non `disabled` : le bouton reste dans l'ordre de tabulation,
  reçoit le survol, et peut donc déclencher un `Popover` d'explication ;
- le clic est avalé par le composant — un `onClick` posé dessus ne part pas, et
  l'appelant n'a rien à se rappeler ;
- une plaque grise pleine, **la même pour les six variantes**. C'est ce que Louis
  demande : un bouton indisponible doit cesser de ressembler à la variante qu'il
  était, sinon il continue de promettre son geste.

`IconButton` porte le même état, avec la même surface. Son infobulle devient
« nom — raison » : le nom reste devant, sans texte visible la raison seule
laisserait chercher de quel bouton il s'agit.

**Deux jetons neufs**, `inactiveBg` (gris 100) et `onInactiveBg` (gris 600) —
`bg-inactive-bg` et `text-on-inactive-bg`. Mesurés : **5,99 pour 1**.

**Et un contrôle de plus, parce que la mesure manquait.**
`scripts/check-contraste.mjs` apparie maintenant les couples de jetons À LA
SOURCE — `successBg`/`onSuccessBg`, `infoBg`/`onInfoBg`, `inactiveBg`/
`onInactiveBg`… — et non plus seulement ce qu'une chaîne de classes écrit d'un
bloc. C'est le seul endroit d'où l'état inactif est visible : le rendu ne l'est
pas, axe l'exempte.

L'exception de `onInfoBg` — l'encre de l'état sélectionné vaut `primary`, voulu
par Louis le 31/08/2026 — est mesurée par ce contrôle, pas défaite : 5,56, au-
dessus du seuil.

**À prendre côté `web`** : `components/create-without-agency.tsx` passe de
`<Button variant="outline" disabled>` à `<Button inactive>`. La phrase visible
reste, sans `inactiveReason`. La bascule se fait avec le reste des apps, pas
avant.

## v2.10.3 — un bouton se reconnaît

**Rien à changer.** `Button` porte `data-arq="button"`, ce qui permet à un test
de dire si un bouton vient d'ici ou s'il a été redessiné à la main.

Écrit après un vert trompeur : un test comparait la hauteur, le rayon et le
corps de deux boutons pour vérifier qu'ils étaient les mêmes, et un bouton
recopié à la main passait, ses valeurs étant tirées des mêmes tokens. Il
divergeait pourtant dès qu'on le survolait ou le désactivait, états qu'une
mesure statique ne prend pas.

## v2.10.2 — quand une largeur est réglée, c'est la colonne qui décide

**Rien à changer**, et une app qui monte y gagne : le texte d'une cellule suit
enfin la largeur de sa colonne.

`RecordTable` enveloppe le contenu d'une cellule dans une boîte à points de
suite dès qu'une largeur est réglée, et cette boîte suivait bien la colonne. Le
rendu de cellule, lui, gardait le plafond qu'il se donne pour l'autre état —
celui où le tableau est en mise en page automatique et où, sans plafond, une
valeur très longue étirerait la colonne. Résultat : le texte se coupait au même
endroit à toute largeur. Mesuré sur une liste d'équipements, colonne portée à
566 pixels : l'enveloppe suivait à 542, le texte restait borné à 240, avec trois
cents pixels de blanc derrière lui.

L'enveloppe ramène maintenant son contenu à sa propre largeur. Le plafond du
rendu garde donc son rôle en mise en page automatique, et cesse de commander dès
qu'une colonne a une largeur à elle.

## v2.10.1 — la case à cocher est au milieu de sa ligne

**Rien à changer** : c'est une correction d'affichage dans `RecordTable`.

La case était posée en élément EN LIGNE, donc sur la ligne de base du texte de
sa cellule et non au milieu de celle-ci. Mesuré sur une liste de trente et un
mille appareils : centre de la ligne à 241 pixels, centre de la case à 238. Trois
pixels qu'on ne voit pas sur une ligne et qu'on voit sur vingt-cinq.

Le pixel qui reste après correction est la bordure basse de la ligne, comptée
dans sa boîte mais pas dans la zone où son contenu se centre. Le supprimer
demanderait de décaler la case vers le bas, c'est-à-dire de la décentrer.

## v2.10.0 — `Command` a deux tailles

**Celle-ci ne casse rien** : `size` vaut `default` si on ne la pose pas, et
`default` est exactement ce que ces pièces faisaient jusqu'ici. Rien à changer
dans une app qui monte.

Ce qui s'ouvre : `<Command size="sm">` habille un menu au lieu d'une palette.
Entrée de trente-six pixels au lieu de cinquante-deux, texte courant au lieu du
sous-titre, retraits de douze au lieu de seize, liste bornée à deux cent
quarante au lieu de quatre cents. La taille descend aux pièces par un contexte :
on la pose sur `Command`, pas sur chacune.

**À prendre dès que ces pièces vivent dans un `PopoverContent`.** À la taille
par défaut, l'invite de recherche se coupe dans une boîte de deux cent
quatre-vingts pixels et dix lignes remplissent l'écran. `Combobox` avait déjà
rencontré ce mur et l'avait contourné en s'adressant directement à `cmdk` ; ce
contournement peut maintenant se remplacer par la taille déclarée.

## v2.0.0 — l'API passe à l'anglais

**Celle-ci casse.** C'est la première, et elle est délibérée : jusqu'à la
`v1.32.1` l'API était en français (`lignes`, `colonnes`, `entete`, `rendu`)
au-dessus d'une base de données en anglais, ce qui obligeait à traduire à chaque
frontière. Voir `web/docs/decisions/0003-anglais-pour-le-code-francais-pour-l-ecran.md`.

La règle est désormais : **anglais pour ce qu'une machine lit** (props, types,
exports, rôles d'icônes, clés de métadonnées), **français pour ce qui se lit
comme de la prose** (libellés affichés, commentaires, specs, noms de stories).

### Qui doit bouger, et quand

| App | Épingle | Effet |
| --- | --- | --- |
| `web` | `file:../design-system` | migrée en même temps que ce changement |
| `fiche-equipement` | `github:…#v1.18.0` | **rien ne bouge** tant que l'épingle ne change pas |
| `mobile` | `github:…#v0.1.0` | **rien ne bouge** |
| `back-office` | `github:…#main` | déclare la dépendance sans l'utiliser : sans effet |

Aucune app en production ne casse aujourd'hui. Le coût est reporté au jour où
`fiche-equipement` (17 fichiers) et `mobile` (1 fichier) changeront d'épingle.

### Table de correspondance

| Avant | Après |
| --- | --- |
| `lignes` · `colonnes` · `ligne` | `rows` · `columns` · `row` |
| `cleDe` · `cle` | `rowKey` · `id` |
| `identite` · `entete` · `rendu` | `identity` · `header` · `render` |
| `valeur` · `valeurs` | `value` · `values` |
| `largeur` · `numerique` · `triable` | `width` · `numeric` · `sortable` |
| `tri` · `etat` · `sens` | `sort` · `state` · `direction` |
| `'croissant'` · `'decroissant'` | `'asc'` · `'desc'` |
| `onOuvrir` · `onChanger` · `onChoisir` | `onOpen` · `onChange` · `onChoose` |
| `nom` · `pluriel` · `libelle` | `name` · `plural` · `label` |
| `ton` · `titre` · `compteur` · `taille` | `tone` · `title` · `count` · `size` |
| `vide` · `actif` · `icone` | `empty` · `active` · `icon` |
| `ColonneRecord` · `EtatTri` · `SensTri` | `RecordColumn` · `SortState` · `SortDirection` |
| `libelleSelection` · `libellePagination` | `selectionLabel` · `paginationLabel` |
| `triSuivant` · `comparer` | `nextSort` · `compare` |
| `EmptyStateErreur` | `EmptyStateError` |
| `BannerTon` · `ToastTon` · `ToastContexte` | `BannerTone` · `ToastTone` · `ToastContext` |
| `FieldStatut` · `FieldSauvegarde` | `FieldStatus` · `FieldSave` |
| `'renseigne'` · `'manquant'` · `'a_verifier'` | `'filled'` · `'missing'` · `'to_check'` |
| `icones` et ses rôles (`supprimer`, `ecart`…) | `icons` (`delete`, `discrepancy`…) |
| front-matter `statut` · `couche` · `mots_cles` | `status` · `layer` · `keywords` |

Les **libellés affichés restent en français** : `NOT_TAKEN` vaut toujours
« Non prise », et les noms de stories (« Avec son intitulé », « Dans la fiche »)
n'ont pas bougé.


Ce document existe parce que la stratégie est **la base d'abord, la bascule
ensuite** : on ne touche pas aux apps pendant que le design system se construit,
et on applique tout d'un coup quand il est solide.

Une bascule groupée se fait à l'aveugle si personne n'a noté, au fil de l'eau, ce
qu'elle coûtera. C'est ce que ce fichier note.

## 2.25.0 — les douze premières implémentations natives, et le point d'entrée `native`

**Additif, rien ne casse.** Un point d'entrée `@arquos/design-system/native`
sert `Text`, `Icon`, `Button`, `IconButton`, `Badge`, `Card` (et ses six
parties), `SegmentedTabs`, `Input`, `Label`, `EmptyState` / `EmptyStateErreur`,
`Skeleton` et `Banner` en React Native, **aux mêmes noms que le web**. Chaque
fiche dit ce qui diverge sur mobile, dans une section « Mobile ».

Deux tokens arrivent avec : `colors.inactiveBg` / `colors.onInactiveBg` (la
plaque grise d'un contrôle inactif, 5,99 pour 1) et `controlHeight` (30 / 36 /
44). Ils existaient sur la branche `liste-et-proportion` et non sur `main` ;
ils sont repris tels quels pour que la fusion soit sans conflit.

**Ce que myArquos aura à reprendre**, compté le 22/09/2026 sur `main` du dépôt
mobile, et que la branche `refonte` reprend écran par écran :

| À reprendre | Compté | Vers quoi |
| --- | --- | --- |
| Écrans qui écrivent `palette.xxx` | **40 sur 47** | `colors.*`, la règle 4 |
| `fontSize` écrits à la main | **432**, dix tailles (16, 14, 12, 13, 15, 18, 11, 20, 22, 17) | `Text variant=…`, huit préréglages |
| `StatusPill`, `Tag`, `OpportunityTypePill` | 3 composants | `Badge` |
| `Button` (`label`, `primary`), `Card` (avec ombre), `SegmentedTabs` (bleu plein) | 3 composants | leurs homonymes natifs |
| `AppText` | 39 fichiers | `Text` |

**Les fichiers `.native.tsx` ne sont pas vérifiés par le `tsc` de ce dépôt**,
qui n'a pas `react-native` : `tsconfig.json` les exclut, et c'est le `tsc` de
l'app qui les vérifie en suivant le lien de fichier (`preserveSymlinks`).
Le jour où `react-native` entre en dépendance de développement, l'exclusion
tombe.

## 2.24.0 — le site vitrine a son propre espace

`colors.night` et les quatre jetons de la 2.23.0 (`textOnNight`, `textOnNightMuted`, `textOnNightSubtle`, `deviceFrame`) quittent `colors` pour `site.color` (`src/site.ts`). En CSS, `--arq-color-night` devient `--arq-site-color-night`, et les autres `--arq-site-color-*`. Le site arquos.eu est le seul consommateur ; l'application n'a rien à changer.

## La bonne nouvelle, mesurée

## Jusqu'à la v1.32.1 : rien ne cassait

Vérifié tag par tag depuis la `v0.1.0`, et toujours vrai **entre ces versions** :

| | Depuis v0.1.0 |
| --- | --- |
| Valeurs de token modifiées | **1** — `colors.success`, voir la règle 8 |
| Tokens retirés | **1** — `colors.night` et les jetons ajoutés en 2.23.0, déplacés dans `site.color` en 2.24.0 ; le site est leur seul consommateur |
| Exports retirés du point d'entrée web | **0** |

Tout ce qui est arrivé depuis est **additif**. Une app peut monter de treize
versions d'un coup sans qu'une ligne cesse de compiler.

Le coût de la migration n'est donc pas la rupture. C'est **l'adoption des
règles** : ce qui a été écrit depuis ne s'applique pas tout seul au code
existant, qui continue de fonctionner en restant à côté.

## Ce que chaque app aura à reprendre

Compté sur `main` de chaque dépôt, le 25/08/2026.

### `fiche-equipement` — épinglée en v1.40.0

### `specFile-equipement` — épinglée en v1.18.0

Reprise le 14/09/2026. La colonne « restant » ne compte plus que ce qui n'a pas
de token pour l'accueillir.

| À reprendre | Au 25/08 | Restant | Pourquoi |
| --- | --- | --- | --- |
| `text-text-subtle` sur du texte | 33 | **0** | 3,14 pour 1 sur blanc, il en faut 4,5 → `text-text-muted`. Les 3 occurrences qui subsistent portent une icône, ce que la règle autorise |
| Couleurs écrites en dur | 14 | **0** | La règle du dépôt : toujours un token |
| Tailles de texte en dur | 3 | **0** | Un préréglage, jamais une valeur → `text-overline` |
| Largeurs de saisie et de panneau en dur | 6 | **0** | Les tokens `largeur` — et deux de plus en v1.40.0, `lecture` et `rail` |
| Palette brute | 0 | 0 | Déjà repris |
| Teintes d'état non appairées | 0 | 0 | Déjà repris |

Restent **40 valeurs en pixels**, toutes de la géométrie de contrôle : hauteurs
de puces, de pastilles, de champs dessinés à la main. Ce n'est pas un token qui
leur manque — le design system écrit les siennes pareil (`h-[36px]` sur
`Button`, `size-[30px]` sur `IconButton`). C'est un composant. Ces valeurs
tomberont quand la fiche cessera de dessiner ses contrôles, pas avant.

### `myarquos-mobile` — épinglée en v0.1.0

| À reprendre | Combien | Pourquoi |
| --- | --- | --- |
| `palette.grey[400]` | **54** | C'est `textSubtle` : à réserver aux icônes et bordures |
| Couleurs écrites en dur | **46** | La règle du dépôt |
| Imports directs de Phosphor | **60 fichiers** | Passer par le rôle (`icons.delete`), pas par le dessin |

Le mobile ne consomme que les **tokens** — aucun composant. Sa montée de version
est donc sans risque : elle lui ouvre `shadow`, `shadowNative`, `fontFamilyNative`
et le vocabulaire d'icônes, qui lui étaient invisibles.

## Les règles à adopter, par ordre d'importance

**1. Les teintes d'état vont par paire.** `bg-success-bg` avec
`text-on-success-bg`, jamais avec `text-success` (2,77 pour 1). Idem pour
`danger`, `warning`, `info`.

**2. `textSubtle` n'est pas une couleur de texte.** 3,14 sur blanc — il vaut pour
une icône, un chevron, une bordure. Pour un texte discret, `textMuted` (5,34).
Les marques de réserve comptent comme du texte.

**3. Jamais la palette brute dans un composant.** `colors.primary`, pas
`palette.blue[500]`. La CI du design system le refuse chez lui ; les apps
devront suivre.

**4. Jamais une icône dessinée à la main.** Passer par le rôle —
`<Icon role="delete" />`, `icons.delete` côté mobile — et non par le nom
du dessin.

**5. Jamais une valeur de design en dur.** Ni hex, ni pixel, ni rayon.

**6. L'empilement passe par un niveau nommé.** `z-(--arq-layer-flottant)`, pas
`z-50`. Un nombre écrit à la main ne dit pas au-dessus de quoi il doit passer, et
c'est ainsi que quatre composants se sont retrouvés au même niveau.

**7. Les durées de transition sont des tokens.**
`duration-(--arq-duration-normal)`, pas `duration-200`.

**8. `colors.success` a changé de valeur** — vert 600 → vert 700
(`#17A679` → `#0C7C59`). **C'est la première et seule valeur de token modifiée
depuis la v0.1.0.** L'ancienne échouait dans ses deux rôles à 3,1 pour 1 :
illisible en texte sur blanc, illisible sous du texte blanc. Les apps n'ont rien
à faire — le vert s'assombrit tout seul — mais il faut le savoir en regardant
l'écran après la bascule.

**9. Les épaisseurs de bordure sont des tokens.**
`border-(length:--arq-border-epais)`, pas `border-[1.5px]`. La fiche l'écrit à la
main six fois.

## Un piège connu, à traiter pendant la bascule

**Les survols perdent leur cran.** Les rampes brutes permettaient de monter d'un
échelon pour un survol — `blue-100` au-dessus de `blue-50`. Les paires
sémantiques n'ont pas ce cran. Le web s'en sort à la luminosité
(`hover:brightness-95`), qui ne dépend d'aucune teinte nommée.

Le mobile n'a pas de survol, mais il a des états pressés : la question s'y posera
autrement.

## `leading-none` rendait une hauteur nulle — corrigé en v1.35.0

Jusqu'à la v1.34.0, le thème Tailwind publiait `--spacing-none: 0px`. Tailwind
résout `leading-none` contre l'espace des **espacements** dès qu'une clé de ce
nom y figure : toute classe `leading-none` rendait donc `line-height: 0`.

Le composant le plus touché est **`Label`**, qui la porte : sa hauteur tombait à
zéro et son texte débordait sur ce qui était posé dessous. Invisible tant que le
libellé est *à côté* du champ — la ligne est centrée sur le champ, plus haut.
Se voit dès qu'on l'empile *au-dessus*, la forme normale d'un formulaire.
Constaté dans la fiche équipement le 11/09/2026.

`--spacing-none` n'est plus publié dans le thème Tailwind (il reste dans
`--arq-space-none` et dans l'API TypeScript). Un espace nul s'écrit `p-0`,
`gap-0` : Tailwind le fournit déjà, et aucun `*-none` d'espacement n'était
employé dans les deux apps.

**À faire pendant la bascule :** retirer les `leading-<n>` ajoutés à la main
pour contourner le défaut. `fiche-equipement` en porte trois, dans
`src/app/fiche/sections/modifier.tsx`.

## Les radios vont jusqu'à six — v1.38.0

La limite était à cinq. Les listes fermées du relevé en comptent très souvent
six : « Type ouverture porte cabine » a cinq entrées dans la maquette et six
dans le jeu d'options réel, l'articulée s'y déclinant en manuelle et
automatique. Un écran de saisie basculait donc en menu déroulant le champ même
que sa maquette montrait en radios.

**À faire pendant la bascule :** rien n'est cassé — c'est une règle, pas une
API. Un écran qui choisit son contrôle d'après le nombre d'options doit
seulement remonter son seuil de cinq à six.

## « Autre » marche aussi sur un choix multiple — v1.43.0

`FieldRow` porte un drapeau `autre` depuis longtemps : il dit qu'un jeu
d'options est OUVERT — le relevé coche l'option « Autre » et écrit le texte dans
une colonne jumelle. L'éditeur à UN choix l'honorait ; l'éditeur à CASES
l'ignorait.

Conséquence mesurée sur la fiche équipement : trois champs — type d'alimentation
générale, contrôle d'accès de la boîte à boutons cabine, contrôle d'accès de la
gâche — n'offraient aucune saisie libre, et une valeur déjà saisie par le terrain
était **invisible** dans l'éditeur, donc perdue au premier enregistrement.

L'éditeur à cases montre maintenant une pastille « Autre » qui ouvre une saisie,
et il rend la valeur libre qu'il a reçue. `partagerLeChoixMultiple` fait le
partage entre ce que le catalogue reconnaît et ce qu'il ne reconnaît pas ; une
seule valeur libre est retenue, parce que la colonne jumelle n'en porte qu'une.

Depuis la **v1.45.0**, `partagerLeChoixMultiple` distingue en plus le MOT
« Autre » — que le relevé écrit dans la colonne pour dire « il y a un texte à
côté » — de la valeur saisie elle-même. Sans cette distinction, la saisie libre
s'ouvrait préremplie avec le mot « Autre » au lieu du texte réel, qui vit dans
sa propre colonne.

`partagerLeChoixMultiple` est exportée du point d'entrée web depuis la v1.44.0 :
un écran qui écrit son propre éditeur à cases applique ainsi la MÊME règle que la
ligne de champ, au lieu d'en écrire une seconde qui finira par en diverger.

**À faire pendant la bascule :** rien n'est cassé, c'est additif. Un écran qui
sert un champ à choix multiple ouvert doit seulement penser à passer `autre`.

## Ce que le design system ne verra pas pour vous

Le contrôle de contraste n'apparie que ce qui vit dans **la même chaîne de
classes**. Un fond posé sur le parent et une couleur sur l'enfant lui échappent —
trois défauts sont passés par là en une seule journée. Pendant la bascule,
**mesurer le rendu**, pas seulement lancer le contrôle.

## Où en est chaque app

| App | Épinglée | Écart |
| --- | --- | --- |
| `fiche-equipement` | `v1.35.0` | à jour |
| `myarquos-mobile` | `v0.1.0` | 32 versions, purement additives |

| `specFile-equipement` | `v1.18.0` | 3 versions, purement additives |
| `myarquos-mobile` | `v0.1.0` | 20 versions, purement additives |

Mettre à jour se fait en une ligne dans `package.json`, puis `npm install` :

```json
"@arquos/design-system": "github:Arquosdev/design-system#v1.21.0"
```

> Ne pas épingler `v1.15.0` ni `v1.18.0` : ces deux tags pointent à côté de
> `main` — voir l'historique de `check-version.mjs`. `v1.19.0` et au-delà sont
> sains.

## v2.16.0 — le site vitrine entre dans le design system (20/09/2026)

Additif, rien à reprendre dans les apps. Deux tokens et une page de vitrine :

- `colors.night` (`#04122A`), la surface de nuit du site arquos.eu. L'application ne s'en sert pas. *(Déplacé en 2.24.0 vers `site.color.night`.)*
- `fontFamilyMono` (DM Mono), pour les valeurs de données. `--arq-font-mono` en CSS, `--font-mono` sous Tailwind. L'application reste en DM Sans partout tant qu'elle n'en a pas l'usage.
- La page **Fondations → Marque et site vitrine** dit ce que le site ajoute à la charte sans la contredire : angles droits, plaques, lignes, mockups, jumeau 3D. Le code du site vit dans `Arquosdev/site`.

## v2.22.0 — l'action de la visionneuse passe sur la photo (21/09/2026)

**Rupture, un seul appelant.** `PhotoViewerAction` gagne un champ **requis** :

```diff
 action={{
   libelle: 'Agrandir',
+  icone: 'agrandir',
   onAction: (photo) => ouvrirAilleurs(photo.url),
 }}
```

Le bouton n'affiche plus son libellé : il est en icône, rond, posé dans le coin
bas-droit de la photo au lieu de l'en-tête. `libelle` reste requis — il nomme le
bouton pour les lecteurs d'écran et s'affiche en infobulle.

Le vocabulaire d'icônes gagne le rôle **`agrandir`** (`MagnifyingGlassPlus`) :
voir plus grand ce qu'on regarde déjà. La loupe et non un `+` nu, parce que le
`+` seul veut dire « ajouter » chez Arquos et qu'un dessin ne peut pas porter
les deux sens.

## v2.25.0 — la visionneuse porte plusieurs actions (22/09/2026)

**Rupture, un seul appelant.** `action` devient `actions`, au pluriel :

```diff
-action={{ libelle: 'Agrandir', icone: 'agrandir', onAction: agrandir }}
+actions={[
+  { libelle: 'Télécharger', icone: 'telecharger', onAction: telecharger },
+  { libelle: 'Ouvrir dans un nouvel onglet', icone: 'ouvrirAilleurs', onAction: ouvrir },
+]}
```

Les boutons se posent en rangée dans le coin bas-droit de la photo, ancrés à
droite : ajouter une action ne déplace pas les précédentes. Trois au plus — la
fiche du composant dit pourquoi le menu ne gagne qu'au-delà.

**Le vocabulaire d'icônes échange un rôle.** `agrandir` (`MagnifyingGlassPlus`)
disparaît — il n'avait qu'un usage, la fenêtre Bubble abandonnée le 22/09 — et
`ouvrirAilleurs` (`ArrowSquareOut`) le remplace : sortir de l'écran courant pour
voir la chose ailleurs, jamais grossir ce qu'on a déjà sous les yeux. Ajouté et
retiré en un jour, donc sans autre consommateur que la fiche équipement.

## v2.27.0 — le chevron d'une entrée dépliante va du bas vers le haut (22/09/2026)

Additif, rien à reprendre. `NavList` : le chevron d'une entrée à `enfants`
pointait vers la DROITE fermé et vers le BAS ouvert — la convention d'un chevron
de gauche, celui qui ouvre une branche d'arborescence. Posé à droite d'une ligne
il se lit comme un menu déroulant : **bas fermé, haut ouvert**. Thomas, le
22/09/2026 : « pointe vers le bas quand fermé et pointe vers le haut quand
ouvert ».

Le chevron d'un `titre` + `repliable`, lui, ne bouge pas : c'est un titre de
section, à gauche, et la convention d'arborescence y est la bonne.

La vitrine gagne la vue `EntreeDepliante` : `enfants` existait depuis la v2.18.0
sans qu'aucune story ne le montre, et c'est pour cela que ce chevron n'avait
jamais été regardé.

## v2.28.0 — toute la ligne d'une entrée dépliante referme (22/09/2026)

Additif, rien à reprendre. `NavList` : la ligne d'une entrée à `enfants` ne
basculait que si elle portait la PASTILLE. Depuis la v2.26.0, un enfant qui
porte la clé de sa mère éteint celle-ci tant que le groupe est ouvert — la ligne
ne refermait donc plus jamais. Thomas, le 22/09/2026 : « je dois pouvoir fermer
la rubrique photo en cliquant sur toute la zone de photos ».

La bascule se décide désormais sur « est-on DANS le groupe ? » — la rubrique
mère ou l'une de ses sections — et non sur la pastille. Dehors, la ligne mène,
même si le groupe était resté ouvert derrière soi.

## v2.30.0 — les choix multiples se reconnaissent, quelle que soit la forme reçue (22/09/2026)

Additif, rien à reprendre. `partagerLeChoixMultiple` reconnaissait une valeur
donnée par son LIBELLÉ mais la rendait telle quelle. L'appelant comparait
ensuite à `o.value` : sur un jeu où valeur et libellé diffèrent, aucune pastille
ne s'allumait dans l'éditeur en ligne, alors que la fiche montre le champ
renseigné. Les **neuf** champs à choix multiples de la fiche équipement étaient
dans ce cas, « type de came » compris.

`connues` sort désormais en **valeur de menu**. Reconnaître une valeur et la
rendre sous le nom du menu sont la même opération ; les séparer laissait à
chaque appelant le soin de la refaire.

Le choix UNIQUE en ligne ne bougeait pas : il passe par `menuDeChoix`, qui
traduisait déjà.

## v2.31.0 — la carte et l'accordéon posent la même barre (22/09/2026)

Additif. `CardHeader` passait `bg-muted` (#F6F7F9) là où le déclencheur
d'`Accordion` pose `bg-bg-subtle` (#FCFDFE). Les deux encadrent les mêmes blocs
dans un même écran, et deux gris à quelques pixels l'un de l'autre se lisent
comme un défaut. La carte prend la teinte de l'accordéon — c'est elle que la
fiche équipement emploie partout ailleurs, en-têtes de tableau compris.

## v2.32.0 — l'arc moyen de la jauge redevient visible (22/09/2026)

Correctif. `Gauge` peignait son palier `warning` avec `var(--color-accent)`.
Or `accent` est **réécrit** par la couche de compatibilité shadcn : elle définit
`--accent` comme une surface de survol (#E1ECFA, bleu très pâle) puis
`--color-accent: var(--accent)`, APRÈS la déclaration Arquos. La seconde
l'emporte, et l'arc se dessinait en bleu pâle sur une piste grise — invisible.
Mesuré dans la vitrine : à 54 %, aucun arc.

Le palier prend `var(--color-warning)`, qui porte exactement le même orange sous
un nom que rien ne dispute.

⚠️ **Le jeton `colors.accent` reste piégé.** Il vaut `core.orange` dans
`src/colors.ts` mais toute classe `bg-accent` / `text-accent` / `border-accent`
rend le bleu pâle de shadcn. Il fait par ailleurs doublon avec `warning`, qui
porte la même valeur. À retirer ou à renommer — décision en attente.

## v2.33.0 — le jeton `accent` est retiré (22/09/2026)

**Rupture, aucun appelant restant.** `colors.accent` valait `core.orange` et
mentait : la couche de compatibilité shadcn définit son propre `--accent` (une
surface de survol, #E1ECFA) puis `--color-accent: var(--accent)`, APRÈS la
déclaration Arquos. Toute classe `bg-accent` / `text-accent` / `border-accent`
rendait donc un bleu très pâle au lieu de l'orange annoncé.

Il faisait par ailleurs doublon : **`warning` porte exactement le même orange**,
sous un nom que shadcn ne dispute pas.

```diff
-className="border-accent"
+className="border-warning"
```

`--accent` et `--color-accent: var(--accent)` restent dans la feuille : ils
appartiennent à shadcn et servent aux états de survol de ses composants. C'est
le doublon Arquos qui disparaît, pas le mécanisme.

Les trois appelants connus ont été corrigés la veille de ce retrait : la jauge
(v2.32.0), l'encart des photos à reprendre et la case retenue du schéma de
synthèse de la fiche équipement.

## v2.34.0 — `--warning` n'est plus `undefined` (22/09/2026)

**Correctif urgent d'une régression de la v2.33.0.** Retirer `colors.accent` a
laissé une ligne le désigner encore, dans le bloc de compatibilité shadcn :
`['--warning', colors.accent]`. La feuille livrée portait donc
`--warning: undefined`, et comme `--color-warning: var(--warning)` la réécrit,
**toute classe `bg-warning` / `text-warning` / `border-warning` est devenue
invalide** — l'arc moyen de la jauge avec.

La ligne désigne `colors.warning`, qui portait déjà le même orange.

**Et le générateur refuse désormais d'écrire une valeur indéfinie.** Ni `check`,
ni la vitrine, ni le contrôle de contraste n'avaient vu passer `undefined` : une
variable invalide ne casse rien, elle rend l'élément invisible, ce qu'aucun
d'eux ne mesure. Le générateur, lui, le sait au moment où il écrit.
