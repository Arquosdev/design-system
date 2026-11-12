'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../_lib/cn';

/**
 * Base shadcn/ui (`new-york`), habillée aux tokens Arquos.
 *
 * Ses quatre variantes sont celles de shadcn. Trois s'y ajoutent — `success`,
 * `warning` et `info` — parce qu'une fiche d'équipement parle sans cesse de
 * conformité, de vigilance et de décisions prises, et que shadcn n'a rien pour
 * ça. C'est l'extension que leur documentation invite à faire, pas un fork.
 *
 * Toutes les variantes ajoutées suivent le même principe : **un fond très clair
 * et un texte de la même teinte en foncé**. C'est ce qui les fait lire comme un
 * état — quelque chose qui *est*. `default` et `secondary`, eux, sont pleins :
 * ils lisent comme un bouton, quelque chose sur quoi on *appuie*. Se tromper de
 * famille fait promettre une action là où il n'y en a pas.
 */
export const badgeVariants = cva(
  /* La forme des badges d'Attio (Thomas, 04/11/2026), la même que `Tag` :
     20 px de haut, 4 px d'arrondi, une bordure fine de la teinte du fond. */
  /* UNE SEULE FORME DE PASTILLE (Louis, 12/11/2026), sur le modèle des pastilles
     d'en-tête d'un relevé : 22 px, arrondi de 6, fine bordure de la teinte, 12 px. */
  'inline-flex h-[calc(var(--spacing-lg)+var(--spacing-xxs))] shrink-0 items-center gap-xs rounded-control border px-sm ' +
    'text-caption font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-danger/20 bg-danger-bg text-on-danger-bg',
        outline: 'border-border text-muted-foreground',
        success: 'border-success/20 bg-success-bg text-on-success-bg',
        warning: 'border-warning/25 bg-warning-bg text-on-warning-bg',
        info: 'border-primary/15 bg-info-bg text-text-on-info-bg',
        muted: 'border-border-soft bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'muted' },
  },
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  // Un `<span>` et non le `<div>` de shadcn : un badge vit dans une phrase ou
  // à côté d'un libellé, et un bloc y casserait l'alignement du texte.
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
