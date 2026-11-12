'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';
import { sansAnneauALaSouris } from '../_lib/modalite';
import { useConteneurFlottant } from '../_lib/conteneur-flottant';

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
>(({ className, align = 'start', sideOffset = 4, onCloseAutoFocus, ...props }, ref) => {
  /* Dans un panneau, la liste se pose DANS le panneau : posée à la racine, le
     blocage du défilement du panneau la rendait immobile sous la molette. Voir
     `conteneur-flottant` (v2.37.0, #80). */
  const conteneur = useConteneurFlottant();
  return (
  <PopoverPrimitive.Portal container={conteneur ?? undefined}>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        /* Un seul contour : celui de l'ombre de fenêtre (`shadow-pop` porte son anneau d'1 px) ; une
           `border` de plus le doublait (Louis, 12/11/2026, sélecteur d'agence). */
        'z-(--arq-layer-flottant) rounded-block bg-bg p-base text-text shadow-pop outline-none',
      /* Même raison que dans `Select` : sur un contenu posé par le positionneur,
         l'animation de sortie ne démarre pas et Radix ne démonte donc jamais.
         Le menu restait dans la page, fermé mais présent, et les couches
         empilées finissaient par avaler le clic qui rouvrait le champ. */
        'data-[state=open]:animate-voile-entree',
        className,
      )}
      {...props}
      // Refermé à la souris, le focus ne revient pas sur la gâchette : pas d'anneau qui reste.
      onCloseAutoFocus={sansAnneauALaSouris(onCloseAutoFocus)}
    />
  </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = 'PopoverContent';
