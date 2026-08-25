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
  'inline-flex shrink-0 items-center rounded-control border px-xs py-xxs ' +
    'text-caption font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-danger-bg text-destructive',
        outline: 'border-border text-muted-foreground',
        success: 'border-transparent bg-success-bg text-success',
        warning: 'border-transparent bg-orange-50 text-orange-700',
        info: 'border-transparent bg-blue-50 text-blue-700',
        muted: 'border-transparent bg-muted text-muted-foreground',
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
