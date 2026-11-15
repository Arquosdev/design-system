/*
  LE TITRE D'UN ÉCRAN, déclaré une seule fois (Louis, 14/11/2026 : « que toutes les pages aient
  le même format de titre », et le nom d'une fiche dans « la même police que les noms des
  pages », celle de « Tableau de bord » ou d'« Équipements »).

  `headline` (20 px, graisse 700, interligne 24, approche -0,5) en `brand` : le titre d'une
  liste, le nom d'une fiche, Paramètres et ses rubriques, une page de configuration, la
  connexion, le portail. Le `h1` de `PageHeader` le lit, l'en-tête d'une fiche aussi, et un
  écran qui pose son `h1` lui-même le prend ici plutôt que de recomposer ses classes.

  LA POLICE N'Y EST PAS, exprès : elle vient du corps de page, DM Sans dans l'application,
  celle de la marque dans le portail client (« rien qui laisse à penser que l'utilisateur est
  sur Arquos »). `brand` y prend aussi la couleur de la marque.

  Un module sans `'use client'`, comme `IDENTIFIER` : une page SERVEUR peut le lire. Exportée
  d'un module client, la chaîne arriverait chez elle en référence et non en texte.
*/
export const PAGE_TITLE = 'text-headline text-brand';
