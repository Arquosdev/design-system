'use client';

import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';

/**
 * L'intitulé d'un champ.
 *
 * Toujours associé — soit en enveloppant le champ, soit par `htmlFor`. Un
 * intitulé qui n'est qu'un texte à côté n'agrandit pas la cible de clic et
 * n'est pas annoncé avec le champ.
 */
export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-sm text-small font-medium leading-none text-text select-none',
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
