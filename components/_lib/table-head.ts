/*
  LE TEXTE D'UN EN-TÊTE DE COLONNE, déclaré une seule fois (balayage d'uniformité, 15/11/2026 :
  « il faut vérifier partout », Louis). 12 px, graisse 500, gris : celui de `RecordTable`, de
  `SectionTable` et de `DataTable`. Un tableau que l'appelant dessine lui-même (une grille de
  planning, un tableau de cotes) le prend ici plutôt que de recomposer un préréglage : le
  Planning était en 12 px graisse 600, les cotes d'un équipement en capitales.

  Un module sans `'use client'` : une page serveur peut le lire.
*/
export const TABLE_HEAD = 'text-caption font-medium text-text-muted';
