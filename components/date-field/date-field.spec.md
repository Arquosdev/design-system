---
name: DateField
status: beta
layer: generique
role: Saisir une date au clavier, ou la choisir dans un calendrier, et la rendre en ISO.
keywords: [date, calendrier, jour, mois, annee, saisie, champ, iso, echeance]
platforms: [web]
replaces:
  web: []
  mobile: []
---

# DateField

Un champ de date. On tape `12092026`, on lit `12/09/2026`, l'appelant reçoit
`2026-09-12`.

## Le contrat, et c'est toute la raison d'être du composant

**Ce qui s'affiche est `JJ/MM/AAAA`. Ce qui entre et ce qui sort est
`AAAA-MM-JJ`.** La frontière est le composant, et elle n'a pas de fuite :
`onValue` ne rend jamais une frappe partielle, jamais une date impossible,
jamais une chaîne à interpréter. Soit de l'ISO valide, soit `null`.

**Pourquoi cette insistance.** Jusqu'au 06/09/2026, le formulaire de `web`
rendait un `Input` nu pour un attribut de date, et il écrivait. Son PostgreSQL
est réglé sur `DateStyle = ISO, MDY` : « 12/09/2026 » y entrait comme le
**9 décembre**, sans un mot, sans erreur — tandis que « 31/12/2026 », dont le 31
ne peut pas être un mois, faisait lever une erreur brute.

**Les jours 1 à 12 d'un mois corrompaient en silence, les suivants plantaient.**
Sept champs de la création d'une affaire étaient dans ce cas. La parade a été de
rendre toutes les dates non modifiables, et c'est encore l'état du produit :
aucune date n'est corrigible nulle part. Ce composant lève cette parade.

`2026-09-12` n'a pas de seconde lecture. C'est la forme que Postgres lit pareil
sous tous les `DateStyle`, et c'est la seule que ce champ rend.

## Ce qu'il débloque, et pourquoi ce n'est pas dans `replaces`

Les attributs de date de `web` vivent dans `lib/entities.ts` : **seize
déclarations `format: 'date'`, dont treize éditables.** Les trois autres sont des
colonnes de collection — une date affichée dans une ligne de tableau lié, mise en
forme dans la requête, jamais éditée.

**Ce composant en débloque donc treize**, réparties sur relevé, affaire,
sollicitation et écart. Aucune ne s'éditait avant lui. Les deux chiffres sont
écrits ici avec leur distinction parce que chacun seul induit en erreur :
« seize » promet trois champs qui ne s'éditeront pas, « treize » laisse croire
que le compte est complet.

**`replaces` reste vide, et c'est volontaire.** Le champ `web` du catalogue
désigne le dépôt `fiche-equipement` — c'est ce que `build-catalog.mjs` vérifie
(`REPOS.web`). Le dépôt `web`, qui consomme ce composant par lien de fichier,
n'a pas de slot dans cette carte. Y écrire un chemin de `web` donnerait une
entrée que rien ne valide, et la carte fausse est pire que la carte absente.

## Quand l'utiliser

- Saisir ou corriger une date d'un formulaire ou d'une fiche — mise en service,
  échéance, date de visite.
- Borner une recherche par une date de début et une date de fin (deux champs,
  le `max` du premier suivant la valeur du second).

## Quand NE PAS l'utiliser

- **Une date déjà affichée dans une fiche, à corriger sur place** →
  `FieldRow kind="date"`, qui ouvre ce champ comme éditeur. Poser un `DateField`
  dans une fiche donnerait une ligne éditable en permanence là où les voisines
  attendent un clic.
- **Une date et une heure** → ce champ ne porte que le jour, et son `value` n'a
  pas de place pour l'heure. Un horodatage est un autre composant, et il pose
  une autre question : le fuseau.
- **Un mois ou une année seuls** (« exercice 2026 ») → un `Select`. Faire choisir
  un jour dont personne n'a besoin invite à en inventer un.
- **Une date qui ne sera jamais corrigée** → un simple libellé. Rendre éditable
  ce qui ne doit pas l'être invite à l'erreur, et une date de relevé consolidée
  serait effacée au calcul suivant.

## Props

| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | La date retenue, en **ISO `AAAA-MM-JJ`**. `null` = non renseignée |
| `onValue` | `(v: string \| null) => void` | — | **Rend de l'ISO valide, ou `null`.** Jamais autre chose |
| `min` | `string \| null` | — | Première date acceptée, en ISO. Le calendrier grise ce qui précède |
| `max` | `string \| null` | — | Dernière date acceptée, en ISO |
| `ariaLabel` | `string` | — | Nomme le champ quand aucun libellé visible ne le fait |
| `placeholder` | `string` | `'JJ/MM/AAAA'` | Ce que le champ dit quand il est vide |
| `disabled` | `boolean` | `false` | Désactive la saisie et le calendrier |
| `autoFocus` | `boolean` | `false` | Le champ prend le focus dès qu'il paraît |
| `invalid` | `boolean` | `false` | L'appelant sait la valeur fautive pour une raison que le champ ne voit pas — le service l'a refusée |
| `className` | `string` | — | — |

`onValue` reçoit `null` dans trois cas qui n'ont pas à se distinguer pour
l'appelant : champ vidé, frappe inachevée, date hors bornes. **C'est
volontaire** : dans les trois cas, le champ ne porte pas de date utilisable, et
laisser l'appelant en détenir une qu'il ne voit plus est exactement ce qui a
corrompu les données.

## Exemples

```tsx
// web — une date de mise en service, jamais dans le futur
import { DateField, todayISO } from '@arquos/design-system/web';

const [miseEnService, setMiseEnService] = React.useState<string | null>('1978-03-04');

<DateField
  value={miseEnService}
  onValue={setMiseEnService}
  ariaLabel="Date de mise en service"
  max={todayISO()}
/>
```

> **Prendre `todayISO()` et non `new Date().toISOString().slice(0, 10)`.** Le
> second décale d'un jour selon le fuseau — à Paris en été, le 12 septembre à
> minuit en sort comme le 11 — et il borne alors la veille. C'est la même faute
> que celle décrite plus bas, écrite dans l'appel plutôt que dans le composant.

```tsx
// web — dans une fiche, à corriger sur place
<FieldRow
  label="Date de mise en service"
  value="1978-03-04"
  kind="date"
  onSave={enregistrer}
/>
```

```tsx
// web — un intervalle : le début ne peut pas dépasser la fin
<DateField value={debut} onValue={setDebut} ariaLabel="À partir du" max={fin} />
<DateField value={fin} onValue={setFin} ariaLabel="Jusqu’au" min={debut} />
```

## Ce que la frappe fait

On tape huit chiffres, les barres se posent seules — `12092026` devient
`12/09/2026`. **La frappe est le geste principal, pas une concession** : un
technicien qui saisit sept dates d'affilée tape, il ne clique pas sept fois dans
une grille. Le calendrier répond à l'autre question — « c'était quel jour, le
jeudi d'après ? ».

Trois séparateurs sont acceptés à la lecture (`/`, `.`, `-`) parce qu'un pavé
numérique met un point là où la ligne de chiffres met une barre.

**L'année sur deux chiffres est refusée.** « 12/09/26 » est 1926 ou 2026 selon
qui lit, et une ambiguïté de lecture est exactement ce dont on sort. Le masque
borne d'ailleurs la frappe à huit chiffres.

## Pourquoi pas `<input type="date">`

Deux raisons, et la seconde est la dangereuse.

**Le chrome d'OS.** Un contrôle natif au milieu de contrôles dessinés se voit
immédiatement, ce que ce dépôt refuse partout ailleurs.

**Et surtout : son affichage suit la locale du POSTE.** Son `value` DOM est bien
de l'ISO, mais la même date se lit `09/12/2026` sur une machine réglée en
anglais et `12/09/2026` sur une machine réglée en français. C'est la même
ambiguïté que celle qui a corrompu les données, déplacée du serveur vers le
poste de travail. Le chrome est le motif visible ; celui-là est le motif
dangereux.

## Pourquoi pas `react-day-picker`

La règle du dépôt dit de chercher chez shadcn avant d'écrire un composant, et
c'est fait : son `calendar` est `react-day-picker`, absent d'ici. Deux raisons
de ne pas l'ajouter.

**Il ne franchit pas la frontière React Native**, donc la grille du mois
resterait web-seule et `date-field.logic.ts` perdrait sa raison d'être — c'est
justement le calcul qu'on veut partager.

**Il apporte son propre formatage de dates**, c'est-à-dire une deuxième source
de vérité sur le format. C'est précisément ce qu'on est en train d'éliminer.

Une grille de mois est trente lignes de calcul pur et douze tests. La
composition shadcn (un `Popover` ancré sous un champ) est gardée, elle.

## Logique partagée

Tout le calculable vit dans `date-field.logic.ts`, sans une ligne de React :
`toISO`, `toDisplay`, `mask`, `monthGrid`, `inRange`, `refusal`, les noms de
mois et de jours. Le rendu n'y garde que les classes.

**Deux fonctions de `Date` y sont interdites, et le fichier dit pourquoi.**

`new Date('12/09/2026')` ne sert jamais à analyser : le moteur JS lit cette
forme en MDY, exactement comme le Postgres qui a corrompu les données — il
répondrait « 9 décembre » avec le même aplomb.

`toISOString()` ne sert jamais à produire : il convertit vers UTC, et le
12 septembre à minuit heure de Paris en sort comme `2026-09-11`. Un décalage de
fuseau sur un composant dont le seul travail est de nommer un jour sans
ambiguïté serait la même faute une seconde fois.

`Date` ne sert qu'à savoir sur quel jour de la semaine tombe le 1er du mois, et
seulement à travers `Date.UTC`, qui ne dépend d'aucun fuseau.

## Anatomie

- Hauteur : `--arq-control-md` (36) — la référence, pour s'aligner sur un
  `Button` ou un `Select` posé à côté
- Enveloppe : `colors.border`, `radius.control`, fond `colors.bg`
- Mise au point : anneau de 2 px en `colors.primary`, **posé sur l'enveloppe** —
  le champ n'a pas de bordure à lui, et un anneau posé dessus serait avalé par
  le `overflow-hidden`
- Erreur : bordure `colors.danger`, message en `text-caption` `colors.danger`
- Bouton de calendrier : `Icon role="fieldDate"`, séparé par un filet
- Case du calendrier : `--arq-control-sm` (30) ; retenue en `colors.primary` /
  `colors.textOnDark`
- Jours hors du mois : `colors.textMuted` (5,34) et **non** `textSubtle`
  (3,14 sur blanc), qui n'est pas une couleur de texte
- Jours hors bornes : la paire `colors.inactiveBg` / `colors.onInactiveBg`
  (5,99) — **pas un fondu**, voir ci-dessous

## Les cases hors bornes ne sont pas fondues, et c'est mesuré

Une case que les bornes interdisent porte une **plaque grise nommée**
(`inactiveBg` / `onInactiveBg`), et surtout pas `opacity-50`.

C'est la leçon d'`INACTIVE_SURFACE` sur `Button`, et elle avait déjà été payée
une fois : un fondu garde la couleur d'origine, et **aucun des deux gardes du
dépôt ne sait le voir**. `check-contraste.mjs` lit des classes et ne fond pas
une opacité ; `check-contraste-rendu.mjs` s'appuie sur axe, qui exempte du
contraste tout ce qui porte `disabled`. Un chiffre pâle sur une case
indisponible est donc du texte qu'aucun contrôle ne regarde.

**Mesuré au rendu pendant l'écriture de ce composant** : la première version
posait `text-text-muted disabled:opacity-50`, ce qui donnait **2,06 pour 1** —
et `npm run check` passait en vert. La paire nommée donne 5,99, et
`check-contraste.mjs` la vérifie **à la source**, dans sa liste `PAIRES`, où
l'opacité n'a pas de prise.

**Et la plaque dit mieux ce qu'elle veut dire.** Une région fermée du calendrier
se lit d'un coup d'œil ; des chiffres pâles se lisent comme un autre mois.

> **Ni l'un ni l'autre des deux contrôles n'ouvre ce calendrier**, et c'est un
> angle mort qui dépasse ce composant : `check-contraste-rendu.mjs` mesure ce
> qu'une story rend AU REPOS, donc **le contenu de toute surface flottante —
> ce calendrier, un menu, une infobulle — n'est mesuré par personne au rendu.**
>
> Le 2,06 ci-dessus a été trouvé avec un script JETABLE, non versionné : il
> déplie le popover, puis lit la couleur, le fond réellement peint et l'opacité
> cumulée de chaque texte, y compris ce qui porte `disabled`. Toute modification
> des couleurs de la grille doit être mesurée ainsi. `mesure-boutons.mjs` fait
> déjà cela pour les menus ; il n'a pas encore d'équivalent ici, et quelqu'un
> devrait le versionner.

## La grille fait six semaines, toujours

Même quand cinq suffisent. Un mois de cinq lignes suivi d'un mois de six ferait
sauter la hauteur du calendrier sous le doigt qui vient d'appuyer sur la flèche —
et la flèche se déplacerait avec. Une hauteur constante coûte une ligne parfois
vide ; elle épargne de rater son clic en parcourant l'année.

Six est le maximum atteignable : trente et un jours commençant un dimanche.

**Et la semaine commence LUNDI.** Ce n'est pas un détail de goût : la grille
dimanche-en-tête est le défaut américain, et c'est le défaut de `Date` —
`getUTCDay()` rend 0 pour dimanche. S'en servir tel quel décale toute la grille
d'une colonne. Les dates restent justes une par une, seule leur position est
fausse, donc rien ne casse et personne ne le voit avant de compter les lundis.

## États

- **Vide** : la marque de réserve dit le format — `JJ/MM/AAAA`. Elle le dit aux
  deux publics : elle se lit, et un lecteur d'écran l'annonce.
- **Frappe en cours** : rien ne remonte tant que les huit chiffres n'y sont pas.
  Aucun reproche non plus — l'erreur n'apparaît qu'à la sortie du champ, sinon
  une alerte clignoterait sous les doigts de quelqu'un qui n'a rien fait de mal.
- **Frappe impossible** (`31/02/2026`, `12/09/20`) : bordure rouge et « Date
  incomplète ou impossible — attendu JJ/MM/AAAA ». `onValue(null)` est déjà
  parti : **l'appelant ne détient jamais une valeur que l'utilisateur ne voit
  pas.**
- **Hors bornes** : le message nomme la borne franchie et la date — « Date trop
  ancienne — pas avant le 01/01/2026 ». Dire « hors bornes » obligerait à
  chercher lesquelles.
- **Valeur venue de l'extérieur** : le champ se réaligne, sauf si la frappe en
  cours dit déjà la même date — sinon le rembourrage remettrait « 01 » là où on
  vient de taper « 1 », curseur compris.
- **Désactivé** : le champ et le bouton de calendrier ensemble. Un calendrier
  qui s'ouvre sur un champ figé promet une correction qui n'arrivera pas.

## Accessibilité

- Le champ porte `ariaLabel` quand aucun libellé visible ne le nomme, et
  `aria-invalid` dès qu'il refuse la frappe.
- Le refus est un `role="alert"` : il paraît après coup, à la sortie du champ.
  Sans lui, quelqu'un qui navigue au clavier quitte une date fautive sans rien
  entendre.
- **Flèche bas depuis le champ ouvre le calendrier** — le geste attendu pour
  dérouler sans lâcher le clavier.
- Le calendrier suit le motif ARIA de la grille de dates : `role="grid"`, un
  `tabindex` roulant, les flèches déplacent le focus de jour en jour, Page haut
  et Page bas d'un mois. **Le `tabindex` roulant n'est pas un raffinement** :
  quarante-deux boutons tous atteignables par Tab feraient quarante-deux arrêts
  entre le champ et le reste du formulaire.
- Chaque case annonce « samedi 12 septembre 2026 » et non « 12 » : hors de la
  grille visuelle, le numéro seul ne dit ni le mois ni le jour de la semaine —
  or c'est le jour de la semaine qu'on vient chercher dans un calendrier.
- Les deux flèches de mois portent leur nom (« Mois précédent »), l'intitulé du
  mois est en `aria-live="polite"` pour que le changement s'annonce.
- Les cases font 30 px, **sous la cible tactile de 44 pt** : c'est un contrôle
  au pointeur. Sur mobile, la frappe reste le geste, et le pavé numérique
  s'ouvre grâce à `inputMode="numeric"`.
