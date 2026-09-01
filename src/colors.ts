// Arquos design system — colour palette.
// Each ramp goes from 50 (lightest) to 800 (darkest) in 9 steps.
// Core brand tokens are exposed via the `core` map and via semantic aliases
// (primary, danger, success…) so screens reference meaning rather than hex.

export const palette = {
  blue: {
    50: '#E1ECFA',
    100: '#B4D2F5',
    200: '#87B7F0',
    300: '#5A9CEC',
    400: '#2F7BCE',
    500: '#0D5AB7', // core Blue
    600: '#0A4B93',
    700: '#073B6F',
    800: '#052B4B',
  },
  marine: {
    50: '#F5F9FD',
    100: '#DFEAF8',
    200: '#BFD4ED',
    300: '#99B8DE',
    400: '#6E97C8',
    500: '#3B6DA7',
    600: '#13437D',
    700: '#00295B', // core Marine
    800: '#001C40',
  },
  orange: {
    50: '#FFF3DD',
    100: '#FFE0B0',
    200: '#FFCD84',
    300: '#FFBA58',
    400: '#FFA836',
    500: '#FFA522', // core Orange
    600: '#CC841B',
    700: '#996315',
    800: '#66420E',
  },
  green: {
    50: '#F3FCFB',
    100: '#DFF7F3',
    200: '#B6ECE3',
    300: '#85E0D1',
    400: '#59D4C0',
    500: '#2EB89A',
    600: '#17A679',
    700: '#0C7C59',
    800: '#032B1F',
  },
  red: {
    50: '#FDF7F7',
    100: '#F1C0C1',
    200: '#EB9E9F',
    300: '#E26F71',
    400: '#DA494B',
    500: '#BE3A37',
    600: '#943124',
    700: '#5E1F17',
    800: '#2D0F0B',
  },
  grey: {
    50: '#F6F7F9',
    100: '#EAEEF1',
    200: '#C8D3DA',
    300: '#A4B5C1',
    400: '#8094A3',
    500: '#5D6D79',
    600: '#4D5B66',
    700: '#3F4950',
    800: '#232B2F',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

// Brand core — the 4 named colours from the spec.
export const core = {
  marine: palette.marine[700],
  blue: palette.blue[500],
  orange: palette.orange[500],
  white: palette.white,
} as const;

// Semantic aliases — prefer these in screen code so meaning stays decoupled
// from raw values (e.g. `colors.danger` rather than `palette.red[500]`).
export const colors = {
  // Brand
  primary: core.blue, // main interactive accent (CTAs, links, active state)
  primaryDark: palette.blue[700],
  brand: core.marine, // dominant brand surface (headers, hero blocks)
  /**
   * L'orange d'attention — **`highlight` et non `accent`.**
   *
   * Il s'appelait `accent`, et ce nom entrait en collision avec celui de
   * shadcn, dont l'`accent` est la surface d'un état actif discret (bleu 50).
   * Les deux se retrouvaient sur `--color-accent` dans le même fichier généré,
   * le bleu gagnait, et l'orange devenait inatteignable par son nom.
   *
   * Ce n'était pas cosmétique : `Gauge` et `Meter` demandaient
   * `var(--color-accent)` pour leur état d'alerte et recevaient du bleu pâle.
   * Ils demandent maintenant `warning`, qui est ce qu'ils veulent dire.
   *
   * La valeur est celle de `warning` aujourd'hui. Les deux noms restent
   * distincts parce que les intentions le sont — alerter n'est pas mettre en
   * avant — et c'est à Louis de décider où `highlight` sert.
   */
  highlight: core.orange,

  // Status
  //
  // Chaque teinte de fond va par paire avec l'encre qui se pose dessus. Les
  // deux se lisent ensemble et se changent ensemble : `successBg` seul ne dit
  // pas quelle couleur de texte reste lisible, et c'est ainsi que le badge
  // « Conforme » a vécu à 2,77 pour 1 — sous le seuil — sans que personne le
  // voie. `scripts/check-contraste.mjs` vérifie désormais chaque paire.
  /**
   * Le vert de la réussite — **vert 700, pas 600.**
   *
   * Le 600 (#17A679) échouait dans ses deux rôles à 3,1 pour 1 : illisible en
   * texte sur blanc, et illisible sous du texte blanc. Un token qui ne tient
   * dans aucun de ses emplois n'est pas un token.
   *
   * Le 700 donne 5,19 dans les deux sens, ce qui le met au niveau de `danger`
   * (5,45) — les deux états ont enfin le même poids.
   */
  success: palette.green[700],
  successBg: palette.green[100],
  onSuccessBg: palette.green[700], // 4,63 sur successBg
  danger: palette.red[500],
  dangerBg: palette.red[100],
  onDangerBg: palette.red[600], // 4,79 sur dangerBg
  warning: palette.orange[500],
  warningBg: palette.orange[50],
  onWarningBg: palette.orange[700], // 4,61 sur warningBg
  infoBg: palette.blue[50],
  /*
     **L'encre d'un état sélectionné est celle de la marque.**

     Louis, le 31/08/2026 : « je veux que le bouton secondaire ait un bleu pâle
     en fond et un bleu vif, la couleur principale, celle utilisée pour le fond
     des boutons principaux, pour le texte. » L'état actif doit se lire comme
     la marque, pas comme un bleu neutre plus sombre.

     `blue[700]` donnait 9,43 de contraste sur `infoBg`, `primary` en donne
     **5,56** : au-dessus du seuil AA de 4,5, en dessous de AAA. Le renoncement
     est mesuré et assumé, pas subi.

     **Ce que ce jeton emporte, parce qu'il sert à dix composants.** Sept
     portent bien un état sélectionné — la liste de navigation, la barre
     d'outils, les filtres actifs, le combobox, le select, le bouton d'icône
     doux, les pastilles de filtre. **Deux ne le portent pas** : le bandeau et
     la pastille d'information, qui changent donc d'encre eux aussi. C'est le
     prix d'une paire de teinte unique, et il vaut mieux le dire que de
     découvrir un bandeau repeint.
  */
  onInfoBg: core.blue, // 5,56 sur infoBg — la couleur de la marque

  // Neutrals
  bg: palette.white,
  /**
   * La surface d'un en-tête — de section, de tableau, du rail.
   *
   * Presque blanche, à peine tirée vers le bleu : elle détache l'en-tête de son
   * contenu sans peser. `bgMuted` (le gris 50) le faisait, et l'écran entier
   * paraissait grisé — c'est ce que la fiche actuelle emploie depuis toujours,
   * on l'écrit enfin.
   *
   * Hors des rampes : cette teinte n'est pas un échelon de gris, c'est une
   * nuance de blanc. La poser sur `grey[50]` la rendrait terne.
   */
  bgSubtle: '#FCFDFE',
  bgMuted: palette.grey[50],
  border: palette.grey[200],
  borderSoft: palette.grey[100], // séparateurs internes, bordures de carte
  text: palette.grey[800],
  textMuted: palette.grey[500],
  /**
   * Gris le plus clair — **jamais pour du texte.**
   *
   * 3,14 pour 1 sur blanc : au-dessus du seuil des éléments non textuels (3),
   * en dessous de celui du texte (4,5). Il vaut pour une icône, un chevron, une
   * bordure. Pour un texte discret — un compteur, une légende, une marque de
   * réserve — prendre `textMuted`, qui est à 5,34.
   *
   * Vingt et un usages textuels ont été repris le 25/08/2026, dont toutes les
   * marques de réserve : WCAG les traite comme du texte, et c'est justement
   * celles qu'on croit décoratives.
   */
  textSubtle: palette.grey[400],
  textOnDark: palette.white,

  /**
   * L'encre d'un TEXTE posé sur `infoBg` — un bandeau, une pastille
   * d'information, toute prose sur le bleu pâle.
   *
   * **Pourquoi elle ne peut pas être `onInfoBg`.** Ce jeton-là vaut `primary`
   * depuis l'exception du 30-31/08/2026, voulue par Louis pour que l'état actif
   * porte la couleur de la marque. L'exception est juste pour ce qu'elle vise —
   * une entrée de navigation sélectionnée, un bouton secondaire — et le
   * commentaire de `onInfoBg` prévoyait déjà son débordement : « deux [des dix
   * composants] ne le portent pas : le bandeau et la pastille d'information ».
   *
   * **Le débordement a été constaté par l'usage.** Louis, le 01/09/2026, sur le
   * bandeau « Votre session a expiré » de la page de connexion : « bizarre je
   * pensais que dans le design system le bleu indiquait le cliquable ». Un texte
   * peint dans l'encre de l'action se lit comme cliquable, et il ne l'est pas.
   *
   * **La valeur rend à la prose ce que l'exception lui avait pris** : c'est le
   * marine que la règle des paires appelait à l'origine. Mesuré sur `infoBg` :
   * **9,43**, contre 5,56 pour `primary`. AAA au lieu d'AA de justesse, et
   * franchement distinct du bleu cliquable.
   *
   * Le nom suit `textOnDark` : une encre nommée par le fond qu'elle habite.
   */
  textOnInfoBg: palette.blue[700],
  black: palette.black,
} as const;

/**
 * Les teintes catégorielles.
 *
 * Elles ne veulent RIEN dire. Un « Monte-charge » n'est ni bon ni mauvais : la
 * couleur sert à distinguer une valeur d'une autre d'un coup d'œil, pas à la
 * juger. C'est pour ça qu'elles vivent à part des teintes de statut : si
 * « Ascenseur » pouvait tomber en vert, une pastille verte cesserait de vouloir
 * dire « conforme ».
 *
 * Dix paires, chacune un fond très clair et son encre. Toutes au-dessus de 4,6
 * pour 1 sur leur fond ET de 4,5 sur blanc — vérifiées par
 * `scripts/check-contraste.mjs`, comme les paires de statut.
 */
export const tagPalette = {
  blue:   { bg: '#E5EEFA', ink: '#2962AE' },
  teal:   { bg: '#E5F9FA', ink: '#1E7A80' },
  green:  { bg: '#E5FAF3', ink: '#1D7C59' },
  lime:   { bg: '#EEFAE5', ink: '#437C1D' },
  amber:  { bg: '#FAF3E5', ink: '#8C6521' },
  orange: { bg: '#FAEEE5', ink: '#A15726' },
  red:    { bg: '#FAE6E5', ink: '#AE2D29' },
  pink:   { bg: '#FAE5EE', ink: '#AE295E' },
  purple: { bg: '#F0E5FA', ink: '#7029AE' },
  indigo: { bg: '#E6E5FA', ink: '#3229AE' },
  /**
   * La teinte neutre. Elle n'entre pas dans le tirage automatique : on la
   * choisit, pour la valeur qui domine une colonne. Sur un parc où huit
   * appareils sur dix sont des ascenseurs, une couleur vive sur la valeur la
   * plus fréquente ne distingue rien — elle sature la colonne.
   */
  slate:  { bg: '#EFF1F4', ink: '#4D5B66' },
} as const;

export type TagTone = keyof typeof tagPalette;

// `slate` est hors tirage : elle se choisit, elle ne se tombe pas dessus.
export const TAG_TONES = (Object.keys(tagPalette) as TagTone[]).filter((t) => t !== 'slate');

/**
 * La teinte d'une valeur.
 *
 * Le même libellé reçoit toujours la même couleur, dans toute l'application :
 * « Ascenseur » est du même bleu dans la liste, dans la fiche et dans un
 * export d'écran. Un hachage plutôt qu'une table à tenir à jour — le
 * référentiel des types compte des dizaines de valeurs et bouge sans nous.
 */
export function tagTone(valeur: string): TagTone {
  let h = 0;
  for (let i = 0; i < valeur.length; i++) h = (h * 31 + valeur.charCodeAt(i)) | 0;
  return TAG_TONES[Math.abs(h) % TAG_TONES.length];
}

export type ColorToken = keyof typeof colors;
