'use client';

import * as React from 'react';

/*
  LES SURFACES À PLAT, À LA ATTIO (Thomas et Louis, 04/11/2026).

  Dans une zone qui les pose, les blocs (`Card`, `AccordionItem`, `DataTable`)
  perdent leur cadre, leur fond et leur ombre : un filet en tête de chaque bloc
  les sépare, comme la fiche d'une société chez Attio. Le filet déborde de
  `spacing.base` de part et d'autre et le contenu garde son retrait : le titre
  d'un bloc tombe sur la verticale du titre de la page, et deux blocs côte à
  côte dans une grille dont l'écart est sous 32 px voient leurs filets se
  rejoindre en une ligne continue, sans trait coupé.

  Hors d'une zone à plat, rien ne change.
*/
const Contexte = React.createContext(false);

/** Pose les blocs qu'il contient à plat. */
export function FlatSurfaces({ children }: { children: React.ReactNode }) {
  return <Contexte.Provider value>{children}</Contexte.Provider>;
}

/** Vrai dans une zone à plat. */
export function useFlatSurfaces(): boolean {
  return React.useContext(Contexte);
}

/**
 * Le bloc à plat : plus de cadre, un filet en tête qui déborde du retrait.
 *
 * Le bloc déborde de `spacing.base` ; le FILET, lui, est un trait posé par-dessus
 * qui déborde encore de `spacing.sm` au-delà de `sm` : une rubrique y a un retrait
 * de `spacing.xl`, et le filet s'arrêtait à 8 px du bord (Thomas, 04/11/2026). Le
 * contenu, lui, ne bouge pas. Un bloc qui déborde déjà jusqu'au bord remet le
 * trait à sa largeur (`sm:before:inset-x-0`).
 */
export const SURFACE_A_PLAT =
  '-mx-base rounded-none border-0 bg-transparent shadow-none relative overflow-visible ' +
  'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border-soft sm:before:-inset-x-sm';
