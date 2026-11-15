import * as React from 'react';

import { cn } from '../_lib/cn';

/**
 * Le champ de saisie d'un formulaire.
 *
 * Repris de shadcn/ui, habillé aux tokens. Deux écarts assumés avec leur
 * version :
 *
 * - **La hauteur ET le texte du bouton par défaut** (`controlHeight.sm`, 28 px, `caption`, 12 px),
 *   pour que le champ et le bouton posés côte à côte se lisent d'une même main
 *   (Louis, 14/11/2026 : « tous les inputs sont un peu gros par rapport au reste
 *   de l'application, les boutons, les textes »). Il était à 32 px en 14 px.
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
        'h-(--arq-control-sm) w-full min-w-0 rounded-control border border-border bg-bg px-sm text-caption text-text',
        'outline-none transition-colors',
        'placeholder:text-text-muted',
        'selection:bg-primary selection:text-text-on-dark',
        'focus-visible:border-primary focus-ring',
        // `disabled` retire le pointeur : un champ grisé qui garde le curseur
        // texte promet une saisie qui n'arrivera pas.
        'disabled:pointer-events-none disabled:opacity-50',
        // L'erreur se dit par la bordure, jamais par la couleur seule du texte.
        'aria-invalid:border-danger aria-invalid:focus-visible:outline-danger',
        className,
      )}
      {...props}
    />
  );
}
