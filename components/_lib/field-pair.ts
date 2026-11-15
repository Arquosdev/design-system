/*
  UNE PAIRE LIBELLÉ / VALEUR, UNE SEULE ÉCHELLE (Louis, 14/11/2026, sur l'onglet Données
  techniques d'un équipement : « les libellés, genre "Type de gaine" au centre, semblent plus
  gros que "Client gestionnaire" à droite. Pareil pour la valeur […] Uniformise. Je préfère le
  format de la partie droite, en taille »).

  Celle de la colonne d'informations : 13 px (`description`), graisse 400, le libellé en gris,
  et une ligne de 32 px quand la valeur tient sur une ligne. `FieldRow`, les lignes d'une carte
  de champs (`FieldSurface`), `DetailRow` et les lignes que l'appelant dessine lui-même la
  lisent ici. Une identité (un numéro, un lien vers une fiche) garde `IDENTIFIER` par-dessus.

  Un module sans `'use client'` : une page serveur peut le lire.
*/
export const FIELD_PAIR = {
  /** Le libellé : 13 px, gris. */
  label: 'text-description text-text-muted',
  /** La valeur : 13 px, graisse 400. */
  value: 'text-description text-text',
  /** Le retrait vertical d'une ligne : 32 px à une ligne seule (xl + sm, moins une hauteur de ligne, partagés). */
  row: 'py-[calc((var(--spacing-xl)+var(--spacing-sm)-1lh)/2)]',
} as const;
