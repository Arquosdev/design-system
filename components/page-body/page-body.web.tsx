'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';

export interface PageBodyProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * `page` (défaut) borne le contenu à la largeur des pages de réglages ;
   * `reading` à la mesure d'un texte qu'on lit ; `full` prend toute la largeur.
   */
  width?: 'page' | 'reading' | 'full';
  /**
   * `center` (défaut) centre la colonne bornée ; `start` l'ancre à gauche, contre
   * un rail de rubriques (fiche, Paramètres) : le rail et sa zone se lisent d'un bloc.
   */
  align?: 'center' | 'start';
}

/**
 * Le corps d'une page sous son `PageHeader` : la largeur et la gouttière,
 * les mêmes partout. Seize pixels de gouttière sur un téléphone, vingt-quatre
 * au-delà ; l'espace entre les blocs se règle par `className` (`gap-lg`).
 */
export function PageBody({ width = 'page', align = 'center', className, ...props }: PageBodyProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-base px-base pt-lg pb-xl sm:px-xl',
        // Une colonne bornée se CENTRE (Louis, 12/10/2026) ; son PageHeader prend la même largeur.
        // Contre un rail de rubriques, elle reste ancrée à gauche (align="start").
        width === 'page' && 'max-w-page',
        width === 'reading' && 'max-w-reading',
        width !== 'full' && align === 'center' && 'mx-auto',
        className,
      )}
      {...props}
    />
  );
}
