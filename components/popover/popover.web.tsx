'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';

/*
  Repris de shadcn/ui (`npx shadcn@latest add popover`), habillé aux tokens
  Arquos. Les noms exportés et la composition sont ceux de shadcn ; la primitive
  est Radix `Popover`.

  Un seul écart : l'animation vient de nos tokens, celle de shadcn s'appuyant
  sur `tw-animate-css`.
*/

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'start', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-(--arq-layer-flottant) rounded-md border border-border-soft bg-bg p-base text-text shadow-pop outline-none',
      /* Même raison que dans `Select` : sur un contenu posé par le positionneur,
         l'animation de sortie ne démarre pas et Radix ne démonte donc jamais.
         Le menu restait dans la page, fermé mais présent, et les couches
         empilées finissaient par avaler le clic qui rouvrait le champ. */
        'data-[state=open]:animate-voile-entree',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = 'PopoverContent';
