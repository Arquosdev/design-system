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
} as const;

export type IconSizeToken = keyof typeof iconSize;
export type IconWeightToken = keyof typeof iconWeight;
/** Un rôle du vocabulaire — `'delete'`, `'discrepancy'`… */
export type IconRole = keyof typeof icons;
/** Le nom Phosphor correspondant — `'Trash'`, `'Warning'`… */
export type IconName = (typeof icons)[IconRole];
