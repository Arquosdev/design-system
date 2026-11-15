import * as React from 'react';

import { cn } from '../_lib/cn';

/**
 * La saisie d'un texte long — une observation, un commentaire de relevé.
 *
 * `field-sizing-content` fait grandir le champ avec son contenu : sur un
 * commentaire de trois lignes, une barre de défilement interne cache ce qu'on
 * vient d'écrire.
 */
export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-control border border-border bg-bg px-sm py-xs',
        // Le texte d'`Input`, 12 px (Louis, 14/11/2026) : une saisie longue ne s'écrit pas plus gros qu'une courte.
        'text-caption text-text outline-none transition-colors',
        'placeholder:text-text-muted',
        'focus-visible:border-primary focus-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        'aria-invalid:border-danger aria-invalid:focus-visible:outline-danger',
        className,
      )}
      {...props}
    />
  );
}
