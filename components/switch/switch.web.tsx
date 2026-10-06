'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';

/**
 * Un interrupteur : l'état bascule et s'applique **tout de suite**.
 *
 * C'est ce qui le distingue d'une case à cocher, et ce n'est pas cosmétique :
 * une case attend un bouton « Enregistrer », un interrupteur non. Poser un
 * interrupteur dans un formulaire qui se valide promet un effet immédiat qui
 * n'arrive pas.
 */
export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer group/switch inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent',
        'outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-border',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-bg shadow-card ring-0 transition-transform',
          /* Le rond garde 2 px de marge sur ses quatre côtés : 1 px de bordure
             plus 1 px de décalage, comme les 2 px qu'il laisse en haut et en
             bas. Il glisse donc de 34 px de dedans moins ses 16 px moins 1 px,
             soit 17 px. `calc(100% - 2px)` valait 14 px — le pourcentage d'un
             translate se lit sur l'élément qui bouge, pas sur son parent — et
             le rond s'arrêtait à 5 px du bord droit. Signalé par Louis le
             06/10/2026. */
          'data-[state=checked]:translate-x-4.25 data-[state=unchecked]:translate-x-px',
        )}
      />
    </SwitchPrimitive.Root>
  );
}
