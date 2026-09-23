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
        'animate-pulse bg-bg-muted',
        round ? 'rounded-full' : 'rounded-sm',
        className,
      )}
      {...props}
    />
  );
}
