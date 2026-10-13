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
   * `start` (défaut) ancre la colonne bornée à gauche, au même bord que les listes et
   * les fiches (Louis, 13/10/2026 : « aligne sur la gauche ») ; `center` la centre,
   * pour une page à part qui n'a pas d'autre page à côté (le portail client).
   */
  align?: 'center' | 'start';
}

/**
 * Le corps d'une page sous son `PageHeader` : la largeur et la gouttière,
 * les mêmes partout. Seize pixels de gouttière sur un téléphone, vingt-quatre
 * au-delà ; l'espace entre les blocs se règle par `className` (`gap-lg`).
 */
export function PageBody({ width = 'page', align = 'start', className, ...props }: PageBodyProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-base px-base pt-lg pb-xl sm:px-xl',
        // Une colonne bornée s'ANCRE À GAUCHE, comme les listes et les fiches (Louis,
        // 13/10/2026, qui revient sur le centrage du 12/10) ; son PageHeader prend la même largeur.
        width === 'page' && 'max-w-page',
        width === 'reading' && 'max-w-reading',
        width !== 'full' && align === 'center' && 'mx-auto',
        className,
      )}
      {...props}
    />
  );
}
