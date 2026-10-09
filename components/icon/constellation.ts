// Le dessin du rôle `aiAssist` : une constellation de points, gros au centre
// et fins au bord. Louis, 09/10/2026 : l'étincelle de Phosphor faisait
// « moisi », il aimait le motif de l'agent de Mintlify.
//
// Le seul dessin du jeu qui ne vient pas de Phosphor, parce que Phosphor n'en a
// aucun de ce genre. La géométrie vit ici, une fois, et les deux plateformes la
// rendent : le web en `svg`, le mobile en `react-native-svg`.
//
// **Une grille PAIRE, sans point au centre** : 6 × 6 points dont les coins sont
// retirés, ce qui arrondit le carré (2, 4, 6, 6, 4, 2 : vingt-quatre points),
// et le centre tombe entre les quatre plus gros. C'est ce qui fait l'élégance du
// motif de Mintlify, relevé par Louis le 09/10/2026 : deux versions organisées
// autour d'un point central, à 37 puis 21 points, faisaient une cible.
//
// Pas de 4,1 sur 24 points ; le rayon décroît de 1,7 pour les quatre du centre
// à 0,8 au bord. En dessous de 0,8, un point disparaît à 16 px.

export type Point = { x: number; y: number; r: number };

const PAS = 4.1;
const COUPURE = 2.6;
const R_CENTRE = 1.7;
const R_BORD = 0.8;
/** La distance des quatre points du centre, ceux qui portent le rayon maximal. */
const D_CENTRE = Math.SQRT1_2;

export const CONSTELLATION: readonly Point[] = (() => {
  const points: Point[] = [];
  for (let j = -2.5; j <= 2.5; j++) {
    for (let i = -2.5; i <= 2.5; i++) {
      const d = Math.hypot(i, j);
      if (d > COUPURE) continue;
      const r = R_BORD + (R_CENTRE - R_BORD) * ((COUPURE - d) / (COUPURE - D_CENTRE));
      points.push({ x: 12 + i * PAS, y: 12 + j * PAS, r: Math.round(r * 100) / 100 });
    }
  }
  return points;
})();
