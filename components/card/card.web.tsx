import * as React from 'react';

import { cn } from '../_lib/cn';

export interface CardProps extends React.ComponentPropsWithoutRef<'section'> {
  titre?: string;
  /** Précision affichée à droite du titre (« 4 documents »). */
  meta?: string;
  /** Retire le padding du contenu, pour une liste qui touche les bords. */
  plat?: boolean;
}

export const Card = React.forwardRef<HTMLElement, CardProps>(
  ({ titre, meta, plat = false, className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn('overflow-hidden rounded-md border border-border-soft bg-bg', className)}
      {...props}
    >
      {titre ? (
        <div className="flex items-baseline gap-md border-b border-border-soft bg-bg-muted px-base py-md">
          <span className="text-small font-bold text-text">{titre}</span>
          {meta ? <span className="text-caption text-text-subtle">{meta}</span> : null}
        </div>
      ) : null}
      <div className={plat ? undefined : 'p-base'}>{children}</div>
    </section>
  ),
);
Card.displayName = 'Card';
