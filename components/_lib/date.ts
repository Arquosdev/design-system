// UNE SEULE FORME DE DATE (Ergonomie du web Arquos, motif E, 15/10/2026).
//
// Une date affichée s'écrit « 15 oct. 2026 », sans l'année quand c'est l'année
// en cours (sauf demande contraire, pour un écran qui couvre deux années).
// L'heure ne s'ajoute que si elle est CONNUE : une date seule ne devient jamais
// « 00:00 ». Elle s'écrit « 16 h 04 ». Le fuseau est Europe/Paris, celui du
// produit, quel que soit le fuseau de la machine qui rend.
//
// Elle vit ici parce que le web et le mobile la lisent tous les deux : deux
// copies finiraient par écrire deux dates. Elle met en forme ; `DateField`
// saisit.

const FUSEAU = 'Europe/Paris';

/** Une date seule, « AAAA-MM-JJ » : un jour du calendrier, sans heure ni fuseau. */
const JOUR_SEUL = /^\d{4}-\d{2}-\d{2}$/;

function partiesAParis(d: Date): { annee: number; mois: number; jour: number; heure: number; minute: number } {
  const p = new Intl.DateTimeFormat('fr-FR', {
    timeZone: FUSEAU, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(d);
  const n = (t: string) => Number(p.find((x) => x.type === t)?.value ?? '0');
  return { annee: n('year'), mois: n('month'), jour: n('day'), heure: n('hour'), minute: n('minute') };
}

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export type OptionsDeDate = {
  /** L'année toujours : un écran qui couvre deux années l'écrit partout. */
  avecAnnee?: boolean;
  /** L'heure, si elle est connue (une date seule n'en a pas). */
  heure?: boolean;
  /** « Aujourd'hui », pour les tests ; par défaut l'instant présent. */
  maintenant?: Date;
};

/**
 * « 15 oct. », « 15 oct. 2026 », « 15 oct., 16 h 04 ». Rend une chaîne vide
 * pour une valeur absente ou illisible : l'écran dit lui-même ce qui manque.
 */
export function dateCourte(valeur: string | Date | null | undefined, options: OptionsDeDate = {}): string {
  if (valeur === null || valeur === undefined || valeur === '') return '';
  const seule = typeof valeur === 'string' && JOUR_SEUL.test(valeur);
  let annee: number; let mois: number; let jour: number; let heure: number | null = null; let minute = 0;
  if (seule) {
    [annee, mois, jour] = (valeur as string).split('-').map(Number);
  } else {
    const d = valeur instanceof Date ? valeur : new Date(valeur);
    if (Number.isNaN(d.getTime())) return '';
    ({ annee, mois, jour, heure, minute } = partiesAParis(d));
  }
  const cetteAnnee = partiesAParis(options.maintenant ?? new Date()).annee;
  const date = `${jour} ${MOIS[mois - 1]}${options.avecAnnee || annee !== cetteAnnee ? ` ${annee}` : ''}`;
  if (!options.heure || heure === null) return date;
  return `${date}, ${heure} h ${String(minute).padStart(2, '0')}`;
}
