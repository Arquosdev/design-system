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
  aiAssist: 'Sparkle',

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
  technician: 'Wrench',
  deal: 'Handshake',
  contract: 'FileText',
  quote: 'Receipt',
  // Trois entrées de navigation qui ne sont pas des objets : une campagne de
  // relevés, un import de données, une sollicitation envoyée à un fournisseur.
  campaign: 'Crosshair',
  import: 'UploadSimple',
  request: 'PaperPlaneTilt',

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
