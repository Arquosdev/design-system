import * as React from 'react';

import { cn } from '../_lib/cn';

/**
 * Le champ de saisie d'un formulaire.
 *
 * Repris de shadcn/ui, habillé aux tokens. Deux écarts assumés avec leur
 * version :
 *
 * - **36 px de haut** (`h-9`), pour que le champ et le bouton posés côte à côte
 *   aient la même hauteur. Les formulaires de la fiche mêlent les deux à chaque
 *   ligne, et 2 px d'écart se voient.
 * - **Le focus suit la convention du dépôt** — anneau de 2 px en `primary` —
 *   plutôt que l'anneau translucide de shadcn. Un seul motif de focus dans tout
 *   le produit vaut mieux que deux corrects.
 */
export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-control border border-border bg-bg px-sm text-small text-text',
        'outline-none transition-colors',
        'placeholder:text-text-subtle',
        'selection:bg-primary selection:text-text-on-dark',
        'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary',
        // `disabled` retire le pointeur : un champ grisé qui garde le curseur
        // texte promet une saisie qui n'arrivera pas.
        'disabled:pointer-events-none disabled:opacity-50',
        // L'erreur se dit par la bordure, jamais par la couleur seule du texte.
        'aria-invalid:border-danger aria-invalid:focus-visible:ring-danger',
        className,
      )}
      {...props}
    />
  );
}
