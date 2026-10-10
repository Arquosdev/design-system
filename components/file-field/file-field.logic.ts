// Ce que `FileField` sait d'un fichier, indépendamment de la plateforme.
//
// Rien ici n'importe React : tout se lit et se teste sans navigateur.
//
// Le composant existe parce que le web dessinait TREIZE fois la même zone à la
// main (manque 11 de son CLAUDE.md) — un champ natif rendu invisible dans un
// cadre en pointillés — et qu'aucune ne disait pourquoi un fichier était
// refusé. L'attribut `accept` du navigateur n'est qu'une SUGGESTION à la boîte
// de dialogue : on peut toujours choisir « Tous les fichiers », et un dépôt par
// glisser-déposer l'ignore. Un PDF de 40 Mo partait donc, et c'est le serveur
// qui le refusait, après l'envoi, dans un bandeau loin du champ.
//
// Ce module tranche AVANT l'envoi, avec la raison, sur le champ. Le serveur
// garde son contrôle : celui-ci évite l'attente, il ne remplace pas la règle.

/** Ce dont la logique a besoin d'un fichier : `File` du navigateur le fournit. */
export interface FichierLu {
  name: string;
  type: string;
  size: number;
}

/**
 * Un poids, comme on le dit : « 20 Mo », « 1,5 Mo », « 300 Ko ».
 * Base 1 024, comme le comptent les systèmes qui affichent la taille d'un
 * fichier au technicien : « 20 Mo » doit vouloir dire la même chose ici et
 * dans son explorateur.
 */
export function tailleLisible(octets: number): string {
  if (!Number.isFinite(octets) || octets < 0) return '';
  if (octets < 1024) return `${octets} o`;
  const ko = octets / 1024;
  if (ko < 1024) return `${arrondi(ko)} Ko`;
  const mo = ko / 1024;
  if (mo < 1024) return `${arrondi(mo)} Mo`;
  return `${arrondi(mo / 1024)} Go`;
}

function arrondi(n: number): string {
  // Une décimale sous dix, aucune au-delà : « 1,5 Mo », « 32 Mo ».
  const v = n < 10 ? Math.round(n * 10) / 10 : Math.round(n);
  return String(v).replace('.', ',');
}

/**
 * Le fichier correspond-il à `accept`, lu comme le navigateur le lit : une
 * liste séparée par des virgules d'extensions (`.pdf`), de types exacts
 * (`application/pdf`) et de familles (`image/*`) ?
 *
 * Un type vide n'est pas un refus : Safari ne connaît pas toujours celui d'un
 * HEIC, et seule l'extension parle alors.
 */
export function correspond(f: Pick<FichierLu, 'name' | 'type'>, accept: string | undefined): boolean {
  const motifs = (accept ?? '').split(',').map((m) => m.trim().toLowerCase()).filter(Boolean);
  if (!motifs.length) return true;
  const nom = f.name.toLowerCase();
  const type = (f.type ?? '').toLowerCase();
  return motifs.some((m) => {
    if (m.startsWith('.')) return nom.endsWith(m);
    if (!type) return false;
    if (m.endsWith('/*')) return type.startsWith(m.slice(0, -1));
    return type === m;
  });
}

export interface Regles {
  accept?: string;
  /** Ce que `accept` veut dire pour un humain : « PDF, JPEG ou PNG ». */
  acceptLabel?: string;
  /** Le poids maximal d'UN fichier, en octets. */
  maxSize?: number;
}

/** La raison de refuser ce fichier, en français, ou `null` s'il passe. */
export function refus(f: FichierLu, r: Regles): string | null {
  if (!correspond(f, r.accept)) {
    return r.acceptLabel
      ? `« ${f.name} » n’est pas accepté. Formats acceptés : ${r.acceptLabel}.`
      : `« ${f.name} » n’est pas d’un type accepté.`;
  }
  if (r.maxSize !== undefined && f.size > r.maxSize) {
    return `« ${f.name} » pèse ${tailleLisible(f.size)}, au-delà des ${tailleLisible(r.maxSize)} permis.`;
  }
  if (f.size === 0) return `« ${f.name} » est vide.`;
  return null;
}

/**
 * Le tri d'un choix : ce qui passe, et la PREMIÈRE raison de refus.
 *
 * **Un choix est accepté en entier ou pas du tout.** Garder les trois photos
 * valides d'un choix de quatre en taisant la quatrième laisserait croire
 * qu'elle est partie ; la refuser seule obligerait à relire la liste pour
 * savoir laquelle manque. On dit pourquoi, on ne garde rien, on rechoisit.
 * `max` borne le NOMBRE de fichiers d'un choix (`restants` : la place qui
 * reste chez l'appelant, quand il accumule).
 */
export function trier<T extends FichierLu>(
  fichiers: readonly T[],
  r: Regles & { max?: number },
): { retenus: T[]; raison: string | null } {
  if (r.max !== undefined && fichiers.length > r.max) {
    return {
      retenus: [],
      raison: r.max <= 0
        ? 'Aucun fichier de plus ne peut être joint.'
        : `${r.max} fichier${r.max > 1 ? 's' : ''} au plus.`,
    };
  }
  for (const f of fichiers) {
    const raison = refus(f, r);
    if (raison) return { retenus: [], raison };
  }
  return { retenus: [...fichiers], raison: null };
}

/** La ligne d'aide sous le champ : « PDF · 20 Mo au plus ». */
export function aide(r: Regles): string {
  const poids = r.maxSize !== undefined ? `${tailleLisible(r.maxSize)} au plus` : '';
  return [r.acceptLabel, poids].filter(Boolean).join(' · ');
}
