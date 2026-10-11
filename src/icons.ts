// Arquos design system — icônes.
//
// Le jeu d'icônes officiel d'Arquos est **Phosphor**. Il l'était déjà de fait :
// l'app mobile l'installe (`phosphor-react-native`, 120 fichiers), et le web
// recopiait ses tracés à la main. Ce fichier écrit enfin la règle.
//
// Phosphor se livre en deux paquets selon la plateforme. Le design system ne
// dépend d'aucun des deux : chaque app installe le sien.
//
//   web    → `@phosphor-icons/react`
//   mobile → `phosphor-react-native`
//
// Ce fichier ne contient donc aucun tracé — seulement l'échelle, les graisses,
// et le **vocabulaire** : quel dessin veut dire quoi chez Arquos.

/**
 * Tailles d'icône, en points.
 *
 * Échelle calibrée sur l'usage réel (août 2026) : 22 (×140), 18 (×115),
 * 20 (×42), 16 (×40), 24 (×34), 14 (×25), 28 (×12).
 *
 * 20 et 24 sont du bruit : ils doivent converger vers 18 et 22 au fil des
 * itérations. Ne pas introduire de nouvelle taille — prendre l'échelon voisin.
 */
export const iconSize = {
  xs: 14, // tableaux denses, texte courant
  sm: 16, // à côté d'un libellé secondaire
  md: 18, // ← défaut : boutons, entrées de liste
  lg: 22, // en-têtes, barre de navigation
  xl: 28, // écran vide, illustration légère
} as const;

/**
 * Graisses Phosphor retenues. Phosphor en propose six ; trois suffisent, et
 * s'en tenir à celles-là est ce qui donne au produit un trait reconnaissable.
 *
 * Le choix n'est pas esthétique, il est sémantique : `fill` dit que l'icône
 * *est* la chose (une pastille d'état, un onglet actif), `bold` dit qu'elle
 * accompagne un texte.
 */
export const iconWeight = {
  /** Le trait courant — l'icône accompagne un libellé ou une action. */
  default: 'bold',
  /** L'icône est elle-même l'objet : pastille d'état, onglet sélectionné. */
  active: 'fill',
  /** Trait fin — décor discret, jamais porteur d'information seule. */
  subtle: 'regular',
} as const;

/**
 * Le vocabulaire d'icônes d'Arquos : un rôle métier → le dessin Phosphor.
 *
 * C'est la partie qui compte. Sans elle, deux écrans qui font la même chose
 * finissent avec deux dessins différents — c'est arrivé pour « rechercher »
 * et pour « suivant », dessinés à la main côté web alors que le mobile
 * utilisait déjà Phosphor.
 *
 * Règle : **passer par un rôle, pas par un nom de dessin.** Écrire
 * `icones.supprimer` plutôt que `Trash` laisse la possibilité de changer le
 * dessin partout d'un coup. Si le rôle manque, l'ajouter ici plutôt que
 * d'importer l'icône directement dans l'app.
 *
 * Les valeurs sont les noms exacts des composants Phosphor, identiques dans
 * les deux paquets :
 *
 *   import { MagnifyingGlass } from '@phosphor-icons/react';   // web
 *   import { MagnifyingGlass } from 'phosphor-react-native';   // mobile
 */
export const icons = {
  // -- Se déplacer ---------------------------------------------------------
  next: 'CaretRight',
  previous: 'CaretLeft',
  expand: 'CaretDown',
  collapse: 'CaretUp',
  go: 'ArrowRight',
  close: 'X',

  // -- Agir ----------------------------------------------------------------
  search: 'MagnifyingGlass',
  add: 'Plus',
  edit: 'PencilSimple',
  delete: 'Trash',
  download: 'DownloadSimple',
  /** Sortir de l'écran courant pour voir la chose ailleurs — un onglet neuf,
   *  une autre application. La flèche qui quitte son cadre, jamais une loupe :
   *  on ne grossit pas ce qu'on a sous les yeux, on l'ouvre autre part. */
  openExternal: 'ArrowSquareOut',
  filter: 'Sliders',
  moreActions: 'DotsThreeVertical',
  dictate: 'Microphone',
  stop: 'Stop',
  /*
    Afficher ou masquer un mot de passe. **DEUX rôles pour une seule bascule**,
    et c'est délibéré : une icône d'œil unique est ambiguë dans les deux sens —
    personne ne sait si elle décrit l'état courant ou l'action à venir. Deux
    rôles obligent l'appelant à choisir lequel il montre, et le nom dit
    l'ACTION, comme partout ailleurs dans ce vocabulaire (`delete`, `download`).

    Ajoutés le 31/08/2026 : la page de connexion de l'app Bubble porte cette
    icône depuis toujours, et l'app web la contournait par un lien « Afficher »
    faute de rôle.
  */
  revealPassword: 'Eye',
  hidePassword: 'EyeSlash',
  /*
    **RÉGLER quelque chose, et c'est différent de le FILTRER.**

    `filter` porte déjà `Sliders`, qui est le glyphe des réglages chez Phosphor
    autant que celui des filtres — mais un filtre agit sur ce qu'on REGARDE, un
    réglage sur ce qui le COMMANDE. Les deux se croisent sur le même écran :
    l'en-tête de la liste des contrats porte « Configuration » pendant que sa
    barre d'outils porte le filtre, et deux boutons au même dessin auraient
    annoncé la même chose.

    Ajouté le 01/09/2026 à la demande de Louis, qui voulait « un bouton actif
    avec une icône, un truc qui symbolise la configuration » et n'en trouvait
    aucun : les soixante-dix rôles couvraient les objets, les états et les gestes
    de liste, jamais le réglage d'un écran.
  */
  settings: 'GearSix',
  // Ce qui est arrivé et demande l'attention (Louis, 07/10/2026 : la page
  // Notifications du rail).
  notification: 'Bell',
  // Un rapport : des chiffres mis en graphique (Louis, 07/10/2026 : l'entrée
  // Rapports portait la même icône que le Tableau de bord).
  report: 'ChartLineUp',

  // -- Dire un état --------------------------------------------------------
  compliant: 'CheckCircle',
  check: 'Check', // la coche nue d'une case, sans son cercle
  discrepancy: 'Warning',
  blocking: 'WarningOctagon',
  warning: 'WarningCircle',
  info: 'Info',
  notApplicable: 'MinusCircle',
  offline: 'WifiSlash',
  sync: 'Lightning',
  syncPaused: 'LightningSlash',

  // -- Photos --------------------------------------------------------------
  photo: 'ImageSquare',
  photos: 'Images',
  takePhoto: 'Camera',
  photoUnavailable: 'CameraSlash',
  switchCamera: 'CameraRotate',

  // -- Composer un tableau -------------------------------------------------
  columns: 'Columns',
  reorder: 'DotsSixVertical',
  sortNeutral: 'ArrowsDownUp',
  lock: 'LockSimple',
  bookmark: 'BookmarkSimple',
  list: 'Rows',
  map: 'MapTrifold',
  pdf: 'FilePdf',
  csv: 'FileCsv',

  // -- Le métier -----------------------------------------------------------
  document: 'FileText',
  tag: 'Tag',
  safety: 'ShieldCheck',
  maintenance: 'Wrench',
  measure: 'Ruler',
  /** Une constellation de points, dessinée par le design system : Phosphor n'a
   *  rien de ce genre, et son étincelle faisait daté (Louis, 09/10/2026). */
  aiAssist: 'Constellation',
  /** Une valeur que l'écran SAIT calculer — la course d'une gaine, tirée de
   *  trois hauteurs ou de la somme des entre-niveaux. Le rôle dit « je peux la
   *  calculer pour toi », jamais « voici une calculatrice ». */
  calculate: 'Calculator',
  /*
    REFAIRE un calcul à la demande (Louis : « Recalculer le chiffrage » sur la
    fiche Contrat). Deux flèches qui tournent, et pas `sync` : l'éclair promet
    l'automatique là où ce geste est justement explicite. Ajouté le 10/10/2026
    (manque 5 du web).
  */
  recalculate: 'ArrowsClockwise',
  /*
    Couper un objet en deux (« Scinder l'affaire »). Une flèche qui se sépare,
    et pas `columns` : un rectangle coupé en deux est une mise en page, pas un
    geste. Ajouté le 10/10/2026 (manque 4 du web).
  */
  split: 'ArrowsSplit',
  /*
    Ressortir ce qu'on avait retiré : un fournisseur remis dans la base, une
    conversation sortie des archives. L'inverse exact d'`archive` — la même
    boîte, une flèche qui en sort — là où l'entrée de menu empruntait
    `archive`, qui disait le geste contraire. Ajouté le 10/10/2026 (manque 10).
  */
  restore: 'BoxArrowUp',

  // -- Les objets du produit -----------------------------------------------
  //
  // La navigation d'un produit qui porte douze objets a besoin d'une icône par
  // objet : c'est elle qu'on vise du coin de l'œil, et c'est la seule chose qui
  // reste quand le rail est réduit. Le vocabulaire n'en avait aucune, et l'app
  // web posait des classes Phosphor à la main — exactement la dérive que ce
  // fichier existe pour empêcher.
  //
  // Un rôle par objet, même quand deux partagent un dessin : « secteur » et
  // « carte » sont la même carte dépliée aujourd'hui, et rien n'oblige à ce
  // qu'ils le restent. Passer par le rôle laisse la possibilité de les séparer
  // sans toucher aux écrans.
  survey: 'ClipboardText',
  equipment: 'Elevator',
  building: 'Buildings',
  client: 'Briefcase',
  contact: 'User',
  supplier: 'Truck',
  sector: 'MapTrifold',
  // Un casque : la clé est déjà la maintenance (06/10/2026).
  technician: 'HardHat',
  deal: 'Handshake',
  contract: 'FileText',
  quote: 'Receipt',
  // La facture (0155 du POC GMAO) : un document chiffré, distinct du devis.
  invoice: 'Invoice',
  // Trois entrées de navigation qui ne sont pas des objets : une campagne de
  // relevés, un import de données, une sollicitation envoyée à un fournisseur.
  campaign: 'Crosshair',
  import: 'UploadSimple',
  request: 'PaperPlaneTilt',

  /*
    Ajoutés le 22/09/2026 pour myArquos : ses onglets, son profil et ses états
    vides importaient Phosphor directement dans l'écran. Les objets qu'ils
    dessinaient existaient déjà ici (`equipment`, `survey`, `building`…) ; ne
    manquaient que ces six-là.
  */
  user: 'UserCircle',
  // Ajoutés le 25/09/2026 (design-eu) : les actions rapides d'une fiche contact
  // appelaient et écrivaient derrière une silhouette et un maillon.
  phone: 'Phone',
  /*
    La TÉLÉALARME, l'appareil de la cabine qui appelle le centre d'écoute.
    Elle empruntait `phone`, comme les Appels, et les deux entrées se suivaient
    dans le rail de la Maintenance avec le même combiné : le combiné dit l'appel
    REÇU, la sirène dit l'appareil d'alerte. Ajouté le 10/10/2026 (manque 13).
  */
  emergencyPhone: 'Siren',
  // Les fiches récentes de la palette ⌘K (design-eu).
  recent: 'ClockCounterClockwise',
  email: 'EnvelopeSimple',
  conversation: 'ChatCircleDots',
  copy: 'Copy',
  folder: 'Folder',
  archive: 'Archive',
  /*
    Sortir de son compte. Le profil de myArquos importait `SignOut` de Phosphor
    directement, et la refonte l'avait replié sur `close` — une croix. Or une
    croix FERME ce qu'on regarde ; elle ne sort pas d'un compte. C'est la faute
    que le rôle `settings` a corrigée en son temps : un glyphe qui va n'est pas
    un rôle qui dit.
  */
  signOut: 'SignOut',
  /*
    L'assistant d'Arquos (09/10/2026, à la demande de Louis : « il faut que cet
    assistant soit la fonctionnalité wahou ») : envoyer un message, agrandir ou
    réduire le panneau, et repartir d'une conversation neuve. Envoyer est un
    avion en papier, comme dans myArquos depuis ses débuts : la flèche vers le
    haut de ChatGPT et de Claude ne plaisait pas à Louis (09/10/2026), et les
    deux applications disent le même geste avec le même dessin.
  */
  send: 'PaperPlaneRight',
  maximize: 'ArrowsOutSimple',
  minimize: 'ArrowsInSimple',
  newConversation: 'NotePencil',
  /** L'avis sur une réponse de l'assistant (Louis, 10/10/2026), comme chez Claude,
   *  ChatGPT et Gemini : utile, pas utile. */
  thumbsUp: 'ThumbsUp',
  thumbsDown: 'ThumbsDown',
  /** Revenir au bas d'un fil qu'on a remonté : une flèche, pas un chevron, parce
   *  qu'on DESCEND d'un coup, on ne déplie rien. */
  scrollDown: 'ArrowDown',
  /** L'aide d'Arquos (Louis, 11/10/2026) : « Aide et support » dans le rail,
   *  l'aide de myArquos dans le Profil. Le point d'interrogation, que tout le
   *  monde lit comme « comment faire ? ». */
  help: 'Question',
  /** La documentation technique (manuels) : le livre ouvert, le même dans le
   *  rail du web et la barre d'onglets de myArquos (Louis, 11/10/2026). */
  documentation: 'BookOpenText',
  /** La journée du technicien (onglet « Journée » de myArquos) : le calendrier coché,
   *  ce qui est à faire aujourd'hui. Pas `fieldDate`, qui dit la NATURE d'une colonne. */
  today: 'CalendarCheck',
  /** Imprimer ou produire le document papier d'un objet (le rapport d'un relevé). */
  print: 'Printer',
  /** Revenir au début d'un parcours (le sommaire d'un formulaire de relevé). */
  home: 'House',
  /** La note donnée à un relevé ou à une intervention (satisfaction). */
  rating: 'Star',

  // Ajoutés le 11/10/2026 pour myArquos (audit A5-09) : ses écrans importaient
  // encore ces dessins de Phosphor directement.
  /** REGARDER une chose en grand (« Voir la photo »). Le même œil que
   *  `revealPassword`, pour un autre sens : on ouvre, on ne dévoile pas. */
  view: 'Eye',
  /** Agrandir ce qu'on a sous les yeux (une page de manuel, une photo). */
  zoomIn: 'MagnifyingGlassPlus',
  /** Écouter un texte lu à voix haute (la réponse de l'assistant). */
  listen: 'SpeakerHigh',
  /** Lire un enregistrement (une note vocale). */
  play: 'Play',
  /** Mettre en pause un enregistrement qu'on écoute. */
  pause: 'Pause',
  /** Le flash de l'appareil photo, allumé ou automatique. Le même éclair que
   *  `sync`, pour un autre sens : l'appareil, pas la synchronisation. */
  flash: 'Lightning',
  /** Le flash de l'appareil photo, éteint. */
  flashOff: 'LightningSlash',
  /** Défaire un marquage qu'on vient de poser (« Annuler le marquage non prenable »). */
  undo: 'ArrowCounterClockwise',
  /** Une attente en cours. Immobile : c'est l'appelant qui le fait tourner. */
  loading: 'Spinner',
  /** Pas encore commencé : le cercle vide d'un point ou d'une zone sans réponse. */
  pending: 'Circle',
  /** Commencé, pas fini : une zone dont une partie des points a sa réponse. */
  partial: 'CircleHalf',
  /** Une zone basse de l'équipement, dans le formulaire de relevé : la cuvette, la gaine. */
  zoneBottom: 'ArrowLineDown',
  /** Une zone haute de l'équipement, dans le formulaire de relevé : le toit de cabine. */
  zoneTop: 'ArrowLineUp',
  /** Une porte et ce qui la tient, dans le formulaire de relevé : le palier, la gâche. */
  door: 'DoorOpen',
  /** La seconde face d'un équipement à deux accès (« Face 2 »). Le dessin de
   *  `copy`, pour un autre sens : le double d'une face, pas le geste de copier. */
  secondEntrance: 'Copy',
  /** L'intérieur de la cabine, dans le formulaire de relevé (« En cabine »). */
  cabin: 'Elevator',
  /** Un ensemble mécanique, dans le formulaire de relevé : le moteur, le local poulie.
   *  Pas `settings`, qui dit RÉGLER un écran. */
  mechanism: 'Gear',
  /** Les commandes d'un composant (« Platine de commande »). Le dessin de
   *  `filter`, pour un autre sens : ce qui commande l'équipement, pas la liste. */
  controls: 'Sliders',

  // -- La nature d'une colonne ---------------------------------------------
  //
  // Un tableau du produit peut proposer près de cinq cents colonnes, presque
  // toutes techniques. L'icône de l'en-tête dit ce qu'on va lire avant même
  // d'avoir lu : « Course » avec une règle est une mesure, « Marque machine »
  // avec un A est du texte. C'est ce que fait Attio, et c'est ce qui manque
  // quand une liste n'est qu'une grille de gris.
  fieldText: 'TextAa',
  fieldNumber: 'Hash',
  fieldDate: 'Calendar',
  fieldChoice: 'CaretCircleDown',
  fieldLink: 'LinkSimple',
  fieldPerson: 'User',
  fieldGauge: 'ChartBar',
  fieldPlace: 'MapPin',
  fieldYesNo: 'ToggleLeft',
} as const;

export type IconSizeToken = keyof typeof iconSize;
export type IconWeightToken = keyof typeof iconWeight;
/** Un rôle du vocabulaire — `'delete'`, `'discrepancy'`… */
export type IconRole = keyof typeof icons;
/** Le nom Phosphor correspondant — `'Trash'`, `'Warning'`… */
export type IconName = (typeof icons)[IconRole];
