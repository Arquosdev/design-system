// Ce que `Markdown` sait du texte d'une réponse, indépendamment de la plateforme.
//
// Rien ici n'importe React : le web et le téléphone lisent le même arbre, et
// une réponse de l'assistant se présente donc pareil sur les deux. Les deux
// assistants rendaient le markdown à la main, chacun à sa façon : le web
// connaissait les listes et le gras mais pas les titres ni les tableaux, le
// téléphone retirait les astérisques et rendait un seul paragraphe (inventaire
// du 10/10/2026). Ce module remplace les deux.
//
// Le sous-ensemble est celui qu'un modèle écrit vraiment : titres, paragraphes,
// listes (à puces, numérotées, un niveau d'imbrication), tableaux, citations,
// blocs de code, filet ; en ligne, le gras, l'italique, le code et les liens.
// Ce qu'il ne reconnaît pas reste du TEXTE : une réponse ne disparaît jamais
// parce qu'une syntaxe est inconnue.

export type EnLigne =
  | { type: 'texte'; texte: string }
  | { type: 'gras'; enfants: EnLigne[] }
  | { type: 'italique'; enfants: EnLigne[] }
  | { type: 'code'; texte: string }
  | { type: 'lien'; href: string; enfants: EnLigne[] };

export type Element = { enfants: EnLigne[]; sousListe?: Bloc };

export type Bloc =
  | { type: 'titre'; niveau: 1 | 2 | 3; enfants: EnLigne[] }
  | { type: 'paragraphe'; enfants: EnLigne[] }
  | { type: 'liste'; ordonnee: boolean; debut: number; elements: Element[] }
  | { type: 'tableau'; entete: EnLigne[][]; lignes: EnLigne[][][]; alignements: ('gauche' | 'centre' | 'droite' | null)[] }
  | { type: 'citation'; blocs: Bloc[] }
  | { type: 'code'; langage: string | null; texte: string }
  | { type: 'filet' };

/* ------------------------------------------------------------------ *
 * En ligne
 * ------------------------------------------------------------------ */

/**
 * Le texte d'une ligne, en morceaux. Un analyseur à la main et non une
 * expression régulière globale : le gras peut contenir un lien, un lien du gras,
 * et un astérisque isolé (« 3 * 4 ») doit rester un astérisque.
 */
export function enLigne(source: string): EnLigne[] {
  const sortie: EnLigne[] = [];
  let tampon = '';
  const vider = () => { if (tampon) { sortie.push({ type: 'texte', texte: tampon }); tampon = ''; } };
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    // Un caractère échappé reste lui-même.
    if (c === '\\' && i + 1 < source.length && /[\\`*_[\]()#|>-]/.test(source[i + 1])) {
      tampon += source[i + 1]; i += 2; continue;
    }
    if (c === '`') {
      const fin = source.indexOf('`', i + 1);
      if (fin > i + 1) { vider(); sortie.push({ type: 'code', texte: source.slice(i + 1, fin) }); i = fin + 1; continue; }
    }
    if ((c === '*' || c === '_') && source[i + 1] === c) {
      const fin = source.indexOf(c + c, i + 2);
      if (fin > i + 2) { vider(); sortie.push({ type: 'gras', enfants: enLigne(source.slice(i + 2, fin)) }); i = fin + 2; continue; }
    }
    if (c === '*' || c === '_') {
      // L'italique s'ouvre devant un non-espace et se ferme derrière un non-espace :
      // « 3 * 4 * 5 » et « nom_de_fichier » restent du texte.
      const ouvre = source[i + 1] && source[i + 1] !== ' ' && (c === '*' || i === 0 || /[\s(]/.test(source[i - 1]));
      if (ouvre) {
        let fin = -1;
        for (let j = i + 1; j < source.length; j++) {
          if (source[j] === c && source[j - 1] !== ' ' && source[j + 1] !== c && (c === '*' || j + 1 >= source.length || /[\s.,;:!?)]/.test(source[j + 1]))) { fin = j; break; }
        }
        if (fin > i + 1) { vider(); sortie.push({ type: 'italique', enfants: enLigne(source.slice(i + 1, fin)) }); i = fin + 1; continue; }
      }
    }
    if (c === '[') {
      const finTexte = trouverFermante(source, i, '[', ']');
      if (finTexte > i && source[finTexte + 1] === '(') {
        const finLien = source.indexOf(')', finTexte + 2);
        const href = finLien > finTexte ? source.slice(finTexte + 2, finLien).trim() : '';
        if (href && hrefSur(href)) {
          vider();
          sortie.push({ type: 'lien', href, enfants: enLigne(source.slice(i + 1, finTexte)) });
          i = finLien + 1; continue;
        }
      }
    }
    // Une adresse nue devient un lien : un modèle en écrit souvent sans crochets.
    if ((c === 'h') && /^https?:\/\/[^\s<>()]+/.test(source.slice(i)) && (i === 0 || /[\s(]/.test(source[i - 1]))) {
      const m = /^https?:\/\/[^\s<>()]+/.exec(source.slice(i))!;
      const url = m[0].replace(/[.,;:!?]+$/, '');
      vider(); sortie.push({ type: 'lien', href: url, enfants: [{ type: 'texte', texte: url }] });
      i += url.length; continue;
    }
    tampon += c; i += 1;
  }
  vider();
  return sortie;
}

function trouverFermante(s: string, debut: number, ouvre: string, ferme: string): number {
  let profondeur = 0;
  for (let j = debut; j < s.length; j++) {
    if (s[j] === ouvre) profondeur += 1;
    else if (s[j] === ferme) { profondeur -= 1; if (profondeur === 0) return j; }
  }
  return -1;
}

/**
 * Un lien qu'on accepte d'ouvrir : un chemin de l'application, une adresse web,
 * un courriel, un téléphone. `javascript:` et `data:` restent du texte : une
 * réponse de modèle n'exécute rien.
 */
export function hrefSur(href: string): boolean {
  return /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(href.trim());
}

/** Le texte nu d'une ligne : pour copier une réponse, ou annoncer un lien. */
export function texteDe(morceaux: readonly EnLigne[]): string {
  return morceaux.map((m) => (m.type === 'texte' || m.type === 'code' ? m.texte : texteDe(m.enfants))).join('');
}

/* ------------------------------------------------------------------ *
 * Blocs
 * ------------------------------------------------------------------ */

const PUCE = /^(\s*)([-*+•])\s+(.*)$/;
const NUMERO = /^(\s*)(\d{1,3})[.)]\s+(.*)$/;
const TITRE = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const FILET = /^\s*([-*_])(\s*\1){2,}\s*$/;
const LIGNE_DE_TABLEAU = /^\s*\|?.*\|.*\|?\s*$/;
const SEPARATEUR_DE_TABLEAU = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

function cellules(ligne: string): string[] {
  let l = ligne.trim();
  if (l.startsWith('|')) l = l.slice(1);
  if (l.endsWith('|') && !l.endsWith('\\|')) l = l.slice(0, -1);
  const out: string[] = [];
  let cour = '';
  for (let i = 0; i < l.length; i++) {
    if (l[i] === '\\' && l[i + 1] === '|') { cour += '|'; i += 1; continue; }
    if (l[i] === '|') { out.push(cour.trim()); cour = ''; continue; }
    cour += l[i];
  }
  out.push(cour.trim());
  return out;
}

/** Le texte d'une réponse, en blocs. */
export function analyser(source: string): Bloc[] {
  const lignes = source.replace(/\r\n?/g, '\n').split('\n');
  const blocs: Bloc[] = [];
  let i = 0;
  while (i < lignes.length) {
    const ligne = lignes[i];
    if (!ligne.trim()) { i += 1; continue; }

    // Bloc de code clôturé.
    const cloture = /^\s*(```|~~~)\s*([\w+-]*)\s*$/.exec(ligne);
    if (cloture) {
      const fin = lignes.findIndex((l, j) => j > i && l.trim().startsWith(cloture[1]));
      const jusque = fin === -1 ? lignes.length : fin;
      blocs.push({ type: 'code', langage: cloture[2] || null, texte: lignes.slice(i + 1, jusque).join('\n') });
      i = jusque + 1; continue;
    }

    const titre = TITRE.exec(ligne);
    if (titre) {
      // Quatre niveaux et plus se lisent comme un troisième : dans un panneau
      // étroit, au-delà, la hiérarchie ne se voit plus.
      blocs.push({ type: 'titre', niveau: Math.min(titre[1].length, 3) as 1 | 2 | 3, enfants: enLigne(titre[2]) });
      i += 1; continue;
    }

    if (FILET.test(ligne) && !PUCE.test(ligne.replace(/^(\s*[-*_])\s*$/, '$1 x'))) {
      blocs.push({ type: 'filet' }); i += 1; continue;
    }

    // Tableau : une ligne d'en-tête suivie d'un séparateur.
    if (LIGNE_DE_TABLEAU.test(ligne) && i + 1 < lignes.length && SEPARATEUR_DE_TABLEAU.test(lignes[i + 1])) {
      const entete = cellules(ligne);
      const alignements = cellules(lignes[i + 1]).map((c) => {
        const g = c.startsWith(':'), d = c.endsWith(':');
        return g && d ? 'centre' as const : d ? 'droite' as const : g ? 'gauche' as const : null;
      });
      const corps: EnLigne[][][] = [];
      let j = i + 2;
      while (j < lignes.length && lignes[j].trim() && lignes[j].includes('|')) {
        const c = cellules(lignes[j]);
        corps.push(entete.map((_, k) => enLigne(c[k] ?? '')));
        j += 1;
      }
      blocs.push({ type: 'tableau', entete: entete.map(enLigne), lignes: corps, alignements: entete.map((_, k) => alignements[k] ?? null) });
      i = j; continue;
    }

    if (/^\s*>/.test(ligne)) {
      const contenu: string[] = [];
      while (i < lignes.length && /^\s*>/.test(lignes[i])) { contenu.push(lignes[i].replace(/^\s*>\s?/, '')); i += 1; }
      blocs.push({ type: 'citation', blocs: analyser(contenu.join('\n')) });
      continue;
    }

    if (PUCE.test(ligne) || NUMERO.test(ligne)) {
      const [liste, suivante] = lireListe(lignes, i);
      blocs.push(liste); i = suivante; continue;
    }

    // Un paragraphe : jusqu'à une ligne vide ou le début d'un autre bloc.
    const para: string[] = [ligne.trim()];
    i += 1;
    while (i < lignes.length && lignes[i].trim() && !TITRE.test(lignes[i]) && !PUCE.test(lignes[i]) && !NUMERO.test(lignes[i])
      && !/^\s*(```|~~~|>)/.test(lignes[i]) && !(LIGNE_DE_TABLEAU.test(lignes[i]) && SEPARATEUR_DE_TABLEAU.test(lignes[i + 1] ?? ''))) {
      para.push(lignes[i].trim()); i += 1;
    }
    // Un retour à la ligne dans un paragraphe se garde : un modèle s'en sert pour
    // aligner une adresse ou une signature, et les fondre en ferait une ligne.
    blocs.push({ type: 'paragraphe', enfants: joindreAvecRetours(para) });
  }
  return blocs;
}

function joindreAvecRetours(lignes: string[]): EnLigne[] {
  return lignes.flatMap((l, k) => (k === 0 ? enLigne(l) : [{ type: 'texte' as const, texte: '\n' }, ...enLigne(l)]));
}

function lireListe(lignes: string[], debut: number): [Bloc & { type: 'liste' }, number] {
  const premiere = NUMERO.exec(lignes[debut]) ?? PUCE.exec(lignes[debut])!;
  const ordonnee = NUMERO.test(lignes[debut]);
  const retrait = premiere[1].length;
  const elements: Element[] = [];
  let i = debut;
  while (i < lignes.length) {
    const l = lignes[i];
    if (!l.trim()) {
      // Une ligne vide entre deux éléments ne coupe pas la liste.
      const suite = lignes[i + 1];
      if (suite && (PUCE.test(suite) || NUMERO.test(suite)) && retraitDe(suite) >= retrait) { i += 1; continue; }
      break;
    }
    const m = (ordonnee ? NUMERO : PUCE).exec(l) ?? (ordonnee ? PUCE : NUMERO).exec(l);
    if (m && m[1].length === retrait) { elements.push({ enfants: enLigne(m[3]) }); i += 1; continue; }
    if (m && m[1].length > retrait && elements.length) {
      const [sous, suivante] = lireListe(lignes, i);
      elements[elements.length - 1].sousListe = sous; i = suivante; continue;
    }
    if (!m && retraitDe(l) > retrait && elements.length) {
      // Une ligne de continuation d'un élément.
      const dernier = elements[elements.length - 1];
      dernier.enfants = [...dernier.enfants, { type: 'texte', texte: ' ' }, ...enLigne(l.trim())];
      i += 1; continue;
    }
    break;
  }
  const debutNumero = ordonnee ? Number(NUMERO.exec(lignes[debut])![2]) : 1;
  return [{ type: 'liste', ordonnee, debut: debutNumero, elements }, i];
}

const retraitDe = (l: string) => /^\s*/.exec(l)![0].length;

/** Le texte nu d'une réponse entière, pour la copier. */
export function texteBrut(source: string): string {
  const blocs = analyser(source);
  const ligne = (b: Bloc): string => {
    switch (b.type) {
      case 'titre': case 'paragraphe': return texteDe(b.enfants);
      case 'liste': return b.elements.map((e, k) => `${b.ordonnee ? `${b.debut + k}.` : '•'} ${texteDe(e.enfants)}${e.sousListe ? `\n${ligne(e.sousListe).replace(/^/gm, '  ')}` : ''}`).join('\n');
      case 'tableau': return [b.entete, ...b.lignes].map((r) => r.map(texteDe).join('\t')).join('\n');
      case 'citation': return b.blocs.map(ligne).join('\n');
      case 'code': return b.texte;
      case 'filet': return '';
    }
  };
  return blocs.map(ligne).filter(Boolean).join('\n\n');
}
