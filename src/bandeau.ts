// Arquos design system — la hauteur d'un bandeau de tête.
//
// **Ce que ça répare** (Louis, 13/11/2026). Deux bandeaux se touchent en haut
// de l'écran : le nom de l'agence, dans la barre latérale, et l'en-tête d'une
// page (`PageHeader`). Chacun portait son filet du bas, et chacun le posait où
// SON contenu et SES marges le menaient — mesuré sur `/buildings` à 1 280 px :
// 55,5 px pour la barre (8 + 39,5 + 8), 61 px pour l'en-tête (16 + 33 + 12).
// Cinq pixels et demi d'écart, que l'œil attrape parce que les deux traits se
// rejoignent à la verticale de la barre.
//
// **Et égaliser les marges n'y suffisait pas** : les deux contenus n'ont pas la
// même hauteur, donc le même rembourrage rend deux bandeaux différents. C'est
// la HAUTEUR qui se déclare, une seule fois, ici ; les deux bandeaux la portent
// et centrent leur contenu dedans. Ils s'alignent alors par construction, et un
// contenu qui change ne les désaligne plus.
//
// Ne jamais recopier 60 ailleurs : c'est exactement la cote vieillie que le
// CLAUDE.md du consommateur interdit. S'écrit `h-(--arq-bandeau-tete)`.

export const bandeau = {
  /**
   * 60 px — le bandeau de tête : le nom de l'agence dans la barre latérale,
   * l'en-tête d'une page à `PageHeader` (listes, Facturation, Pièces et stock,
   * Paramètres, À faire, Tableau de bord, Notifications).
   *
   * Sur l'échelle de 4, et assez haut pour la ligne de titre (la référence de
   * `controlHeight`, 32 px) avec de l'air des deux côtés. Une FICHE n'en a pas :
   * son en-tête n'a plus de filet, il se fond dans la barre d'onglets.
   */
  tete: 60,
} as const;

export type BandeauToken = keyof typeof bandeau;
