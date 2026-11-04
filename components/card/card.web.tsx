'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { SURFACE_A_PLAT, useFlatSurfaces } from '../_lib/flat-surfaces';

/**
 * Base shadcn/ui (`new-york`), habillée aux tokens Arquos.
 *
 * Composition plutôt que props : `Card` + `CardHeader` + `CardContent`, comme
 * chez shadcn. Un extrait de leur documentation fonctionne tel quel.
 *
 * `CardHeader` s'écarte du leur sur un point : il pose la barre teintée de la
 * fiche Arquos — titre en gras, précision à droite — au lieu d'un simple bloc
 * espacé. C'est la personnalisation qu'on assume, et c'est exactement ce que
 * shadcn attend qu'on fasse d'un composant copié.
 */
export const Card = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const aPlat = useFlatSurfaces();
    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden rounded-block border border-border-soft bg-card text-card-foreground shadow-block',
          aPlat && SURFACE_A_PLAT,
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const aPlat = useFlatSurfaces();
    return (
    <div
      ref={ref}
      className={cn(
        /* `bg-bg-subtle` et non `bg-muted` : l'ACCORDÉON pose déjà sa barre
           dans cette teinte-là, et les deux composants encadrent les mêmes
           blocs dans un même écran. Deux gris différents à quelques pixels
           l'un de l'autre se lisent comme un défaut — c'est ce que Thomas a
           relevé le 22/09/2026 : « ça semble varié d'un bloc à un autre ».
           C'est le blanc cassé qui l'emporte parce que c'est lui que la fiche
           emploie partout ailleurs, en-têtes de tableau compris. */
        'flex items-baseline gap-md border-b border-border-soft px-base py-md',
        // À plat : la tête n'est plus séparée du corps, le filet est en haut du bloc.
        aPlat && 'border-b-0 bg-transparent pt-base pb-xs',
        className,
      )}
      {...props}
    />
    );
  },
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => {
    const aPlat = useFlatSurfaces();
    return <span ref={ref} className={cn('text-small font-bold text-foreground', aPlat && 'text-body font-semibold', className)} {...props} />;
  },
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('text-caption text-text-muted', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-base', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

/**
 * Contenu sans padding, pour une liste qui touche les bords de la carte.
 * shadcn n'a pas d'équivalent ; la fiche en a besoin partout.
 */
export const CardList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(className)} {...props} />,
);
CardList.displayName = 'CardList';

export const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center border-t border-border-soft px-base py-md', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';
