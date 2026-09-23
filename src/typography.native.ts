// Arquos design system — l'échelle de TAILLES du téléphone.
//
// Metro prend ce fichier à la place de `typography.ts` sur iOS et Android
// (résolution par plateforme : les imports du système s'écrivent sans
// extension). Le web, Vite et Next ne le voient jamais. Tout le reste —
// familles, graisses, interlignes, approches — vient du fichier commun.
//
// POURQUOI UNE ÉCHELLE À PART. Louis, le 23/09/2026 : « tout est très petit
// dans la nouvelle application. N'oublie pas qu'on est sur une application
// mobile […] utilisée sur le terrain. » L'échelle commune est celle d'un écran
// de bureau lu à 60 cm, à la souris : 12 de légende, 16 de corps. Un téléphone
// se lit à bout de bras, en gaine ou en machinerie, parfois en plein soleil et
// avec des gants — et la sous-ligne d'une rubrique (« Signalez les
// non-conformités ») y tombait à 12.
//
// LES VALEURS SONT CELLES D'iOS, pas une invention : Footnote 13, Subheadline
// 15, Body 17, Title 3 20, Title 2 22, Title 1 28, Large Title 34. Material
// place son corps entre 14 et 16 et sa plus petite étiquette à 11 ; on prend
// l'échelle d'Apple, la plus généreuse des deux, parce que le terrain est le
// cas le plus dur. Deux règles en sortent :
//   - le corps à 17, pas 16 : c'est la taille que l'œil lit sans effort sur un
//     téléphone, et celle à laquelle iOS règle tout son texte par défaut ;
//   - rien sous 13. Une légende qu'il faut approcher de son visage pour la lire
//     n'est pas lue sur un chantier.

// L'extension est écrite exprès : sans elle, Metro résoudrait ce fichier-ci à
// nouveau, et l'import tournerait sur lui-même.
import { scaleFrom } from './typography.ts';

export * from './typography.ts';

export const fontSize = {
  caption: 13,
  small: 15,
  body: 17,       // ← défaut
  subhead: 20,
  title: 22,
  titleLarge: 24,
  headline: 28,
  display: 34,
} as const;

export const typography = scaleFrom(fontSize);
