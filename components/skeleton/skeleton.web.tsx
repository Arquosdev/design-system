import * as React from 'react';

import { cn } from '../_lib/cn';

export interface SkeletonProps extends React.ComponentProps<'div'> {
  /** Un bloc rond — pour une pastille, une vignette carrée, un avatar. */
  round?: boolean;
}

/**
 * Un bloc gris qui pulse, à la place de ce qui charge.
 *
 * Il dit « il y a quelque chose ici, ça arrive ». Un écran vide dit « il n'y a
 * rien », et c'est le premier mensonge des règles d'écran : **ne jamais montrer
 * ce qui n'est pas**.
 *
 * Le composant ne connaît aucune forme d'écran : il se compose. Les assemblages
 * — la liste de relevés, la fiche d'équipement — restent dans l'app, parce
 * qu'ils épousent une mise en page qui n'appartient pas au design system.
 */
export function Skeleton({ round = false, className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      // `aria-hidden` : un lecteur d'écran n'a rien à annoncer d'une forme qui
      // attend. C'est la zone en train de charger qui doit porter `aria-busy`.
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-border-soft',
        round ? 'rounded-full' : 'rounded-control',
        className,
      )}
      {...props}
    />
  );
}

const LARGEURS = ['w-3/4', 'w-1/2', 'w-2/3', 'w-3/5', 'w-4/5'];

export interface SkeletonRowsProps {
  /** Combien de lignes : 3 pour un menu ou des suggestions qui chargent. */
  count?: number;
  /** La hauteur d'une ligne : `menu` (28 px, une entrée de menu) ou `row` (36 px, une ligne de tableau). */
  density?: 'menu' | 'row';
  /** Ce que le lecteur d'écran entend, jamais affiché : « Chargement des agences ». */
  label?: string;
  className?: string;
}

/**
 * Des lignes qui chargent : un menu, une liste de suggestions, un panneau de lignes.
 * Un chargement ne s'écrit jamais, il se dessine (Louis, 12/11/2026) : plus de
 * « Chargement… » ; le texte reste pour le lecteur d'écran.
 */
export function SkeletonRows({ count = 3, density = 'menu', label = 'Chargement', className }: SkeletonRowsProps) {
  return (
    <div role="status" aria-busy="true" className={cn('flex flex-col', className)}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={cn('flex items-center px-sm', density === 'menu' ? 'h-(--arq-control-sm)' : 'h-9')}>
          <Skeleton className={cn('h-3', LARGEURS[i % LARGEURS.length])} />
        </div>
      ))}
    </div>
  );
}
