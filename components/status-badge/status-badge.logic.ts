/*
  LE STATUT D'UN OBJET : UN MOT ET UNE COULEUR, DÉCIDÉS ICI ET NULLE PART AILLEURS.

  Chaque application recopiait sa table : « Assigné » était bleu sur le web et
  orange sur le téléphone, un écart « Ouvert » orange d'un côté et « Non
  résolu » gris de l'autre, un même devis « À envoyer » dans la liste et
  « Brouillon » dans sa fiche (audit design du 11/10/2026, A5-01, A5-03,
  A3-11). Le web, myArquos et le portail lisent désormais cette table.

  La couleur suit le SENS, le même pour tous les objets (la règle posée pour
  les relevés le 26/09/2026, étendue à tous) :

    bleu   `info`        prévu, envoyé, en attente d'un tiers
    ambre  `warning`     en cours, ou à faire maintenant
    vert   `success`     abouti
    rouge  `destructive` bloqué, en retard, dangereux
    gris   `muted`       clos sans suite, archivé, simple constat

  Le rouge ne dit jamais une catégorie ni un refus : un devis refusé est clos,
  pas en danger. Une catégorie (type d'affaire, formule, nature d'un relevé)
  n'est pas un statut : elle prend `Tag`, jamais une teinte d'état.
*/

export type StatusTone = 'info' | 'warning' | 'success' | 'destructive' | 'muted';

export interface StatusEntry {
  /** Le mot, partout le même. Trois mots au plus. */
  label: string;
  tone: StatusTone;
  /** Le mot que lit le client au portail, quand il diffère de celui de l'agence. */
  clientLabel?: string;
  /** La couleur au portail, quand le statut demande au client un geste que l'agence attend. */
  clientTone?: StatusTone;
}

export const STATUSES = {
  /** Un relevé, du terrain au bureau. Bubble laisse le statut vide avant le départ : vide se lit « Assigné ». */
  survey: {
    assigned: { label: 'Assigné', tone: 'info' },
    inProgress: { label: 'En cours', tone: 'warning' },
    submitted: { label: 'Soumis', tone: 'success' },
    archived: { label: 'Archivé', tone: 'muted' },
  },
  /** Un écart ou une réserve. */
  discrepancy: {
    open: { label: 'Ouvert', tone: 'warning', clientLabel: 'En cours' },
    resolved: { label: 'Résolu', tone: 'success', clientLabel: 'Levée' },
  },
  /** La gravité d'une réserve de contrôle technique. */
  severity: {
    danger: { label: 'Danger grave', tone: 'destructive' },
    toFix: { label: 'À corriger', tone: 'warning' },
    observation: { label: 'Observation', tone: 'muted' },
  },
  /** Un devis. Envoyé, il attend la réponse du client : au portail, il est « À valider », en ambre. */
  quote: {
    draft: { label: 'Brouillon', tone: 'warning' },
    sent: { label: 'Envoyé', tone: 'info', clientLabel: 'À valider', clientTone: 'warning' },
    awaitingMeeting: { label: 'En attente d’AG', tone: 'info', clientLabel: 'À valider', clientTone: 'warning' },
    accepted: { label: 'Accepté', tone: 'success' },
    refused: { label: 'Refusé', tone: 'muted' },
    scheduled: { label: 'Planifié', tone: 'info', clientLabel: 'Travaux planifiés' },
    done: { label: 'Réalisé', tone: 'success', clientLabel: 'Travaux réalisés' },
  },
  /** Une facture. « En retard » n'est pas en base : il se déduit de l'échéance. */
  invoice: {
    draft: { label: 'Brouillon', tone: 'warning' },
    issued: { label: 'Émise', tone: 'info', clientLabel: 'À payer', clientTone: 'warning' },
    sent: { label: 'Envoyée', tone: 'info', clientLabel: 'À payer', clientTone: 'warning' },
    late: { label: 'En retard', tone: 'destructive' },
    paid: { label: 'Payée', tone: 'success' },
  },
  /** Un contrat de maintenance. */
  contract: {
    proposed: { label: 'Proposé', tone: 'info' },
    retained: { label: 'Retenu', tone: 'success' },
    discarded: { label: 'Écarté', tone: 'muted' },
    active: { label: 'En vigueur', tone: 'success' },
    terminated: { label: 'Résilié', tone: 'muted' },
  },
  /** Un appel de panne. */
  serviceCall: {
    unassigned: { label: 'Non affecté', tone: 'warning', clientLabel: 'Signalée' },
    onTheWay: { label: 'En route', tone: 'warning', clientLabel: 'Technicien en route' },
    onSite: { label: 'Sur place', tone: 'warning', clientLabel: 'Technicien sur place' },
    stopped: { label: 'À l’arrêt', tone: 'destructive' },
    resolved: { label: 'Résolu', tone: 'success' },
  },
  /** Une visite d'entretien. */
  visit: {
    scheduled: { label: 'Planifiée', tone: 'info' },
    inProgress: { label: 'En cours', tone: 'warning' },
    done: { label: 'Faite', tone: 'success' },
  },
  /** Une demande de pièce. */
  partRequest: {
    requested: { label: 'Demandée', tone: 'warning' },
    ordered: { label: 'Commandée', tone: 'info' },
    received: { label: 'Reçue', tone: 'success' },
    refused: { label: 'Refusée', tone: 'muted' },
  },
  /** L'état d'un équipement, vu par le client comme par l'agence. */
  equipmentState: {
    inService: { label: 'En service', tone: 'success' },
    broken: { label: 'En panne', tone: 'warning' },
    stopped: { label: 'À l’arrêt', tone: 'destructive' },
  },
} as const satisfies Record<string, Record<string, StatusEntry>>;

export type StatusObject = keyof typeof STATUSES;
export type StatusKey<O extends StatusObject> = keyof (typeof STATUSES)[O] & string;

/** L'entrée d'un statut connu ; `undefined` pour une clé qui n'existe pas. */
export function statusEntry<O extends StatusObject>(object: O, key: string | null | undefined): StatusEntry | undefined {
  if (!key) return undefined;
  return (STATUSES[object] as Record<string, StatusEntry>)[key];
}

/** Le mot d'un statut, pour l'agence ou pour le client. */
export function statusLabel<O extends StatusObject>(object: O, key: StatusKey<O>, audience: 'agency' | 'client' = 'agency'): string {
  const e = statusEntry(object, key)!;
  return audience === 'client' ? (e.clientLabel ?? e.label) : e.label;
}

/*
  LES ÉCRITURES QUE LES APPLICATIONS REÇOIVENT, ramenées à une clé.

  La base de la refonte écrit des codes (`relev_s_en_cours`, `brouillon`),
  Bubble et myArquos des mots (« En cours »). Une seule table de
  correspondance par objet, ici, plutôt qu'un `if` par écran.
*/
const ALIASES: { [O in StatusObject]?: Record<string, StatusKey<O>> } = {
  survey: {
    relev_s_assign_s: 'assigned', assign: 'assigned', 'assigné': 'assigned',
    relev_s_en_cours: 'inProgress', 'en cours': 'inProgress',
    relev_s_termin_s: 'submitted', soumis: 'submitted',
    archiv_: 'archived', 'archivé': 'archived',
  },
  discrepancy: { ouvert: 'open', 'non résolu': 'open', resolu: 'resolved', 'résolu': 'resolved' },
  severity: { danger_grave: 'danger', a_corriger: 'toFix', observation: 'observation' },
  quote: {
    brouillon: 'draft', envoye: 'sent', attente_ag: 'awaitingMeeting', accepte: 'accepted',
    refuse: 'refused', planifie: 'scheduled', realise: 'done',
  },
  invoice: { brouillon: 'draft', emise: 'issued', envoyee: 'sent', payee: 'paid', en_retard: 'late' },
  contract: { propose: 'proposed', retenu: 'retained', ecarte: 'discarded', en_vigueur: 'active', resilie: 'terminated' },
  serviceCall: { ouverte: 'unassigned', en_route: 'onTheWay', sur_place: 'onSite', a_l_arret: 'stopped', resolue: 'resolved' },
  visit: { planifiee: 'scheduled', en_cours: 'inProgress', faite: 'done' },
  partRequest: { demandee: 'requested', commandee: 'ordered', recue: 'received', refusee: 'refused' },
  equipmentState: { en_service: 'inService', en_panne: 'broken', a_l_arret: 'stopped' },
};

/**
 * La clé d'un statut tel qu'une application le reçoit : la clé elle-même, un
 * code de la base ou un mot de Bubble. `undefined` si rien ne correspond.
 */
export function statusKey<O extends StatusObject>(object: O, raw: string | null | undefined): StatusKey<O> | undefined {
  if (raw == null) return undefined;
  if (raw in STATUSES[object]) return raw as StatusKey<O>;
  const table = ALIASES[object] as Record<string, StatusKey<O>> | undefined;
  return table?.[raw] ?? table?.[raw.trim().toLowerCase()];
}
