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
 *
 * **Pas de `leading-none` ici**, et ce n'est pas un détail. C'est l'interligne
 * que shadcn pose sur son `Label`, et il n'avait jamais été repassé sur
 * l'échelle Arquos : il vaut 1, soit 14 px, quand `text-small` en déclare 19,6.
 * Les glyphes débordaient donc de presque trois pixels au-dessus et au-dessous
 * de leur ligne, et les champs voisins — qui ont un fond — peignaient par
 * dessus. Le haut des mots était coupé dans tous les formulaires du produit.
 */
export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-sm text-small font-medium text-text select-none',
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
