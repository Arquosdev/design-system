// Ce que `DateField` sait des dates, indépendamment de la plateforme.
//
// Rien ici n'importe React : tout se lit et se teste sans navigateur ni
// simulateur. C'est ce qui permettra au rendu natif de n'écrire que son
// habillage, la grille du mois et l'analyse d'une frappe étant déjà faites.
//
// ─────────────────────────────────────────────────────────────────────────
// CE FICHIER EXISTE À CAUSE D'UNE CORRUPTION DE DONNÉES, ET IL FAUT LA SAVOIR
// ─────────────────────────────────────────────────────────────────────────
//
// Jusqu'au 06/09/2026, le formulaire de `web` rendait un `Input` NU pour un
// attribut de date, et il écrivait. PostgreSQL y est réglé sur
// `DateStyle = ISO, MDY` : « 12/09/2026 » entrait donc comme le 9 DÉCEMBRE,
// sans un mot, sans erreur — tandis que « 31/12/2026 », dont le 31 ne peut pas
// être un mois, faisait lever une erreur brute.
//
// **Les jours 1 à 12 d'un mois corrompaient en silence, les suivants
// plantaient.** Sept champs de la création d'une affaire étaient dans ce cas.
// La parade a été de rendre toutes les dates non modifiables : c'est l'état du
// produit, et c'est ce composant qui le lève.
//
// D'où LE CONTRAT, qui est toute la raison d'être du module : ce qui s'affiche
// est français (`JJ/MM/AAAA`), ce qui entre et ce qui sort est ISO
// (`AAAA-MM-JJ`). La frontière est le composant, et elle n'a pas de fuite.
// `2026-09-12` n'a pas de seconde lecture — c'est la forme que Postgres lit
// pareil sous tous les `DateStyle`.
//
// ─────────────────────────────────────────────────────────────────────────
// DEUX FONCTIONS DE `Date` SONT INTERDITES ICI, POUR LA MÊME RAISON QUE CI-DESSUS
// ─────────────────────────────────────────────────────────────────────────
//
// **`new Date('12/09/2026')` ne sert jamais à analyser.** Le moteur JS lit cette
// forme en MDY, exactement comme le Postgres qui a corrompu les données : il
// répondrait « 9 décembre » avec le même aplomb. L'analyse se fait donc par
// expression régulière et arithmétique d'entiers, jamais en déléguant à `Date`.
//
// **`toISOString()` ne sert jamais à produire.** Il convertit vers UTC : le
// 12 septembre 2026 à minuit heure de Paris en sort comme `2026-09-11`, un jour
// de moins. Un décalage de fuseau sur un composant dont le seul travail est de
// nommer un jour sans ambiguïté serait la même faute une deuxième fois. L'ISO se
// fabrique par assemblage de chaînes.
//
// `Date` ne sert qu'à UNE chose ici : savoir sur quel jour de la semaine tombe
// le 1er du mois, et seulement à travers `Date.UTC`, qui ne dépend d'aucun
// fuseau.

/** Le format que l'utilisateur lit et tape. Sert de marque de réserve. */
export const DISPLAY_FORMAT = 'JJ/MM/AAAA';

/**
 * Les mois, dans l'ordre, tels que l'en-tête du calendrier les nomme.
 *
 * En minuscules : le français ne capitalise pas les noms de mois, et
 * « Septembre 2026 » au-dessus d'une grille se lit comme un titre de section
 * plutôt que comme le repère qu'il est.
 */
export const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
] as const;

/**
 * Les jours de la semaine, **LUNDI EN TÊTE**.
 *
 * Ce n'est pas un détail de goût. La grille dimanche-en-tête est le défaut
 * américain, et c'est le défaut de `Date` : `getUTCDay()` rend 0 pour dimanche.
 * S'en servir tel quel décale toute la grille d'une colonne — les dates restent
 * justes une par une, seule leur position est fausse, donc rien ne casse et
 * personne ne le voit avant de compter les lundis.
 */
export const WEEKDAYS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'] as const;

/** Le nom entier de chaque jour, pour ce qu'un lecteur d'écran annonce. */
export const WEEKDAYS_LONG = [
  'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche',
] as const;

/** Ce que dit le raccourci qui ramène la grille sur le jour courant. */
export const TODAY_LABEL = "Aujourd’hui";

/**
 * Ce que le champ dit quand la frappe ne fait pas une date.
 *
 * Une seule phrase pour les deux cas — inachevée (`12/09/20`) et impossible
 * (`31/02/2026`) — parce que le geste de réparation est le même : relire ce
 * qu'on a tapé. Distinguer les deux demanderait à l'utilisateur de savoir
 * laquelle des deux fautes il a faite, ce qu'il voit déjà.
 */
export const INVALID_TEXT = `Date incomplète ou impossible — attendu ${DISPLAY_FORMAT}`;

/** Ce que le champ dit d'une date juste mais hors des bornes autorisées. */
export const beforeMinText = (min: string) => `Date trop ancienne — pas avant le ${toDisplay(min)}`;
export const afterMaxText = (max: string) => `Date trop lointaine — pas après le ${toDisplay(max)}`;

/** Une case de la grille d'un mois. */
export interface DateCell {
  /** Le jour, en ISO — ce qui sera rendu à l'appelant s'il est choisi. */
  iso: string;
  /** Son numéro, ce que la case affiche. */
  day: number;
  /**
   * Appartient-il au mois affiché ? Les cases de débordement complètent la
   * première et la dernière semaine ; elles restent choisissables — cliquer le
   * 1er octobre depuis la grille de septembre est un geste légitime.
   */
  inMonth: boolean;
}

/** Un mois désigné, sans jour. L'état de navigation du calendrier. */
export interface MonthCursor {
  year: number;
  /** De 1 à 12, comme en ISO — et non de 0 à 11 comme `Date`. */
  month: number;
}

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
/*
  La frappe française. Les trois séparateurs sont acceptés parce qu'un pavé
  numérique met un point là où la ligne de chiffres met une barre, et refuser le
  point ferait taper la date deux fois.

  `-` y figure aussi, et l'ISO est testé AVANT : « 12-09-2026 » se lit donc en
  français, « 2026-09-12 » en ISO. Les deux formes se distinguent par la place
  de l'année, jamais par le séparateur.
*/
const FRENCH = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/;

const pad = (n: number) => String(n).padStart(2, '0');

/** Le nombre de jours d'un mois, années bissextiles comprises. */
export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0;
  const longueurs = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month !== 2) return longueurs[month - 1];
  // La règle entière, et non « divisible par 4 » : 1900 n'était pas bissextile,
  // 2000 l'était. Le raccourci se trompe une fois par siècle, et un relevé
  // d'ascenseur porte des dates de mise en service des années 1900.
  const bissextile = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return bissextile ? 29 : 28;
}

/** Vrai quand la chaîne est une date ISO qui existe au calendrier. */
export function isISO(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const m = ISO.exec(value);
  if (!m) return false;
  const [, a, mo, j] = m;
  const mois = Number(mo);
  const jour = Number(j);
  return mois >= 1 && mois <= 12 && jour >= 1 && jour <= daysInMonth(Number(a), mois);
}

/**
 * La seule porte d'entrée : une frappe → une date ISO, ou `null`.
 *
 * `null` couvre les trois refus, qui n'ont pas à se distinguer pour l'appelant :
 * vide, inachevé, impossible. **Ce qui n'est pas une date ne devient jamais une
 * date approchée** — c'est précisément en devinant que le Postgres de `web` a
 * transformé douze jours sur trente et un en mois.
 *
 * Les deux écritures sont acceptées, et c'est voulu : le composant reçoit son
 * `value` en ISO, l'utilisateur tape en français, et `FieldRow` sème son éditeur
 * avec ce qu'il affichait. Une seule fonction pour les trois provenances vaut
 * mieux que trois qui divergeront.
 */
export function toISO(input: string | null | undefined): string | null {
  const brut = (input ?? '').trim();
  if (brut === '') return null;

  const iso = ISO.exec(brut);
  if (iso) return isISO(brut) ? brut : null;

  const fr = FRENCH.exec(brut);
  if (!fr) return null;
  const [, j, mo, a] = fr;
  const candidat = `${a}-${pad(Number(mo))}-${pad(Number(j))}`;
  return isISO(candidat) ? candidat : null;
}

/**
 * Une date ISO → ce que l'utilisateur lit. Chaîne vide si rien de lisible.
 *
 * **L'année sur deux chiffres n'existe nulle part dans ce module**, ni en
 * affichage ni en saisie : « 12/09/26 » est 1926 ou 2026 selon qui lit, et une
 * ambiguïté de lecture est exactement ce dont on sort. `mask` borne d'ailleurs
 * la frappe à huit chiffres, ce qui rend la question sans objet à la saisie.
 */
export function toDisplay(iso: string | null | undefined): string {
  if (!isISO(iso)) return '';
  const [a, mo, j] = iso.split('-');
  return `${j}/${mo}/${a}`;
}

/**
 * La frappe, barres obliques posées au fil des chiffres.
 *
 * On tape `12092026`, on lit `12/09/2026` — et on n'a jamais à taper de barre.
 * Le masque se recalcule à partir des CHIFFRES SEULS plutôt qu'en insérant dans
 * le texte existant : c'est ce qui rend l'effacement naturel. Reculer sur
 * « 12/0 » retire le `0`, il reste `12` — et non `12/`, un séparateur orphelin
 * qu'il faudrait effacer une deuxième fois.
 */
export function mask(raw: string): string {
  const chiffres = raw.replace(/\D/g, '').slice(0, 8);
  if (chiffres.length <= 2) return chiffres;
  if (chiffres.length <= 4) return `${chiffres.slice(0, 2)}/${chiffres.slice(2)}`;
  return `${chiffres.slice(0, 2)}/${chiffres.slice(2, 4)}/${chiffres.slice(4)}`;
}

/**
 * La date tient-elle dans les bornes ?
 *
 * Comparaison de CHAÎNES, et c'est exact : l'ISO est fait pour ça — ses champs
 * vont du plus significatif au plus petit et sont tous rembourrés de zéros,
 * donc l'ordre alphabétique EST l'ordre chronologique. Passer par des `Date`
 * pour comparer rouvrirait la porte du fuseau horaire pour rien.
 */
export function inRange(iso: string, min?: string | null, max?: string | null): boolean {
  if (isISO(min) && iso < min) return false;
  if (isISO(max) && iso > max) return false;
  return true;
}

/**
 * Pourquoi cette frappe ne peut pas être retenue — ou `null` si elle peut.
 *
 * Le vocabulaire de l'erreur vit ici et non dans le rendu, pour que le web et
 * le natif refusent une date dans les mêmes mots. Une chaîne vide n'est pas une
 * faute : un champ facultatif qu'on vide dit « je ne sais pas », ce qui est une
 * réponse.
 */
export function refusal(
  frappe: string,
  min?: string | null,
  max?: string | null,
): string | null {
  if (frappe.trim() === '') return null;
  const iso = toISO(frappe);
  if (!iso) return INVALID_TEXT;
  if (isISO(min) && iso < min) return beforeMinText(min);
  if (isISO(max) && iso > max) return afterMaxText(max);
  return null;
}

/** Les trois nombres d'une date ISO. */
export function splitISO(iso: string): MonthCursor & { day: number } {
  const [a, mo, j] = iso.split('-');
  return { year: Number(a), month: Number(mo), day: Number(j) };
}

/** Le mois d'une date ISO, ou celui d'aujourd'hui à défaut — où la grille ouvre. */
export function cursorFor(iso: string | null | undefined, todayIso: string): MonthCursor {
  const repere = isISO(iso) ? iso : todayIso;
  const { year, month } = splitISO(repere);
  return { year, month };
}

/** Le mois voisin, à `delta` mois de celui-ci. Passe l'année toute seule. */
export function shiftMonth({ year, month }: MonthCursor, delta: number): MonthCursor {
  // Base zéro le temps du calcul : c'est en base 1 que le passage d'année se
  // trompe d'un mois, et il s'y trompe silencieusement.
  const total = year * 12 + (month - 1) + delta;
  return { year: Math.floor(total / 12), month: (total % 12) + 1 };
}

/** « septembre 2026 » — le repère au-dessus de la grille. */
export function monthLabel({ year, month }: MonthCursor): string {
  return `${MONTHS[month - 1]} ${year}`;
}

/**
 * Aujourd'hui, en ISO, lu sur l'horloge LOCALE.
 *
 * `getFullYear`/`getMonth`/`getDate` et non `toISOString()` : le second
 * convertit vers UTC, et un utilisateur parisien qui ouvre le calendrier à
 * 1 h du matin en été verrait « aujourd'hui » sur la veille. La date que
 * quelqu'un appelle « aujourd'hui » est celle de son calendrier mural.
 *
 * L'horloge se passe en argument pour que les tests soient reproductibles.
 */
export function todayISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * La grille d'un mois : six semaines de sept jours, lundi en tête.
 *
 * **SIX semaines toujours, même quand cinq suffisent.** Un mois de cinq lignes
 * suivi d'un mois de six ferait sauter la hauteur du calendrier sous le doigt
 * qui vient d'appuyer sur la flèche — et la flèche se déplacerait avec. Une
 * hauteur constante coûte une ligne parfois vide ; elle épargne de rater son
 * clic en parcourant l'année. Six est le maximum atteignable : trente et un
 * jours commençant un dimanche.
 */
export function monthGrid({ year, month }: MonthCursor): DateCell[][] {
  /*
    Sur quel jour de la semaine tombe le 1er. `Date.UTC` et non `new Date(a, m, j)` :
    le second construit en heure locale, et dans les fuseaux à l'ouest de
    Greenwich le 1er à minuit local est encore le dernier du mois précédent en
    UTC — la grille glisserait d'une colonne selon le fuseau du poste.

    `(jour + 6) % 7` fait de LUNDI le zéro. `getUTCDay()` rend 0 pour dimanche,
    et c'est cette conversion, oubliée, qui décale une grille française.
  */
  const premier = new Date(Date.UTC(year, month - 1, 1));
  const decalage = (premier.getUTCDay() + 6) % 7;

  const cases: DateCell[] = [];
  for (let i = 0; i < 42; i++) {
    // On avance en JOURS depuis le 1er, décalage compris, et on laisse `Date.UTC`
    // franchir les bords de mois : le 0e jour de mars est le 28 ou le 29 février
    // selon l'année, ce qu'aucune arithmétique écrite à la main ne rend juste.
    const jour = new Date(Date.UTC(year, month - 1, 1 - decalage + i));
    const a = jour.getUTCFullYear();
    const mo = jour.getUTCMonth() + 1;
    const j = jour.getUTCDate();
    cases.push({
      iso: `${a}-${pad(mo)}-${pad(j)}`,
      day: j,
      inMonth: a === year && mo === month,
    });
  }

  const semaines: DateCell[][] = [];
  for (let s = 0; s < 6; s++) semaines.push(cases.slice(s * 7, s * 7 + 7));
  return semaines;
}

/**
 * Ce qu'un lecteur d'écran annonce sur une case — « mardi 12 septembre 2026 ».
 *
 * Le numéro seul ne suffit pas : hors de la grille visuelle, « 12 » ne dit ni
 * le mois ni le jour de la semaine, et c'est justement le jour de la semaine
 * qu'on vient chercher dans un calendrier.
 */
export function cellLabel(iso: string): string {
  if (!isISO(iso)) return '';
  const { year, month, day } = splitISO(iso);
  const semaine = new Date(Date.UTC(year, month - 1, day));
  const nom = WEEKDAYS_LONG[(semaine.getUTCDay() + 6) % 7];
  return `${nom} ${day} ${MONTHS[month - 1]} ${year}`;
}

/**
 * Le jour à `delta` jours de celui-ci, en ISO.
 *
 * Sert au déplacement au clavier dans la grille : une flèche horizontale vaut
 * un jour, une verticale sept. On laisse `Date.UTC` franchir les bords de mois
 * et d'année plutôt que de les traiter à la main — c'est là que
 * l'arithmétique écrite en propre se trompe, et elle s'y trompe une fois par an.
 */
export function shiftDay(iso: string, delta: number): string {
  if (!isISO(iso)) return iso;
  const { year, month, day } = splitISO(iso);
  const cible = new Date(Date.UTC(year, month - 1, day + delta));
  return `${cible.getUTCFullYear()}-${pad(cible.getUTCMonth() + 1)}-${pad(cible.getUTCDate())}`;
}

/**
 * Le même jour, `delta` mois plus loin — **en RABATTANT sur la fin du mois**.
 *
 * Le 31 janvier plus un mois donne le 28 février, et non le 3 mars. C'est le
 * défaut classique de l'arithmétique de mois : `Date` déborde volontiers sur le
 * mois suivant, et la touche « page suivante » d'un calendrier renverrait alors
 * l'utilisateur deux mois plus loin que la case qu'il regardait — un mois sur
 * douze, sans motif visible.
 */
export function shiftMonthKeepingDay(iso: string, delta: number): string {
  if (!isISO(iso)) return iso;
  const { day } = splitISO(iso);
  const { year, month } = shiftMonth(splitISO(iso), delta);
  return `${year}-${pad(month)}-${pad(Math.min(day, daysInMonth(year, month)))}`;
}
