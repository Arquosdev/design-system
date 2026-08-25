'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';

/*
  Repris de shadcn/ui (`npx shadcn@latest add select`), habillé aux tokens
  Arquos. Les noms exportés et la composition sont ceux de shadcn.

  Trois écarts, tous assumés :

  1. **La gâchette s'ajuste à son contenu.** Celle de shadcn prend toute la
     largeur ; dans une fiche, un menu de trois choix étiré sur un tiers d'écran
     promet une saisie longue là où il n'y a qu'un mot à choisir. `className`
     rend la pleine largeur à qui la veut.

  2. **L'entrée retenue se teinte au lieu de porter une coche.** shadcn met un
     `Check` à droite ; notre vocabulaire d'icônes n'a pas de coche nue — il a
     `conforme`, qui veut dire « conforme » et non « celui-ci ». Le fond bleuté
     et le demi-gras sont ce que le rail emploie déjà pour dire « vous êtes
     ici », et ça se lit sans rien apprendre.

  3. Le caret vient de notre `Icon` (`deplier`), pas de `lucide-react`.
*/

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-[28px] w-fit items-center justify-between gap-sm rounded-control',
      'border border-border bg-bg px-xs text-small font-medium text-text',
      'outline-none transition-colors hover:bg-bg-muted',
      'focus-visible:ring-2 focus-visible:ring-primary',
      'disabled:pointer-events-none disabled:opacity-50',
      // Le caret pivote quand le menu s'ouvre — c'est lui qui dit que ce champ
      // en cache d'autres.
      '[&>svg]:shrink-0 [&>svg]:text-text-subtle [&[data-state=open]>svg]:rotate-180',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <Icon role="deplier" size="sm" className="transition-transform" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-[320px] min-w-[8rem] overflow-hidden rounded-md',
        'border border-border-soft bg-bg text-text shadow-pop',
        'data-[state=open]:animate-voile-entree data-[state=closed]:animate-voile-sortie',
        position === 'popper' && 'data-[side=bottom]:translate-y-xs data-[side=top]:-translate-y-xs',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-xxs',
          // La liste ne doit jamais être plus étroite que la gâchette : un menu
          // qui rétrécit sous le champ qu'il ouvre se lit comme un défaut.
          position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = 'SelectContent';

export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-sm py-xs text-caption font-bold text-text-subtle', className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer items-center rounded-control px-sm py-xs',
      'text-small text-text outline-none select-none',
      'data-[highlighted]:bg-bg-muted',
      // L'entrée retenue, au motif du rail : fond bleuté, demi-gras.
      'data-[state=checked]:bg-info-bg data-[state=checked]:font-semibold data-[state=checked]:text-on-info-bg',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-xxs my-xxs h-px bg-border-soft', className)}
    {...props}
  />
));
SelectSeparator.displayName = 'SelectSeparator';
