'use client';

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';

/**
 * Un choix unique parmi quelques options, toutes visibles.
 *
 * Radix apporte ce qui compte et qui se réécrit toujours mal : les flèches
 * naviguent entre les options, le groupe ne prend qu'une seule tabulation, et
 * l'option cochée est annoncée comme telle.
 */
export function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-sm', className)}
      {...props}
    />
  );
}

export function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'aspect-square size-[18px] shrink-0 rounded-full border border-border bg-bg text-primary',
        'outline-none transition-colors',
        'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary',
        'disabled:pointer-events-none disabled:opacity-50',
        'aria-invalid:border-danger',
        'data-[state=checked]:border-primary',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex h-full w-full items-center justify-center"
      >
        {/* Le point plein est dessiné, pas importé : un cercle de 8 px n'a
            besoin d'aucune icône, et en importer une le rendrait flou. */}
        <span aria-hidden="true" className="block size-2 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
