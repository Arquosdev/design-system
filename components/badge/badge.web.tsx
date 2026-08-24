'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../_lib/cn';

/**
 * Base shadcn/ui (`new-york`), habillée aux tokens Arquos.
 *
 * Ses quatre variantes sont celles de shadcn. Deux s'y ajoutent — `success` et
 * `warning` — parce qu'une fiche d'équipement parle sans cesse de conformité et
 * de vigilance, et que shadcn n'a rien pour ça. C'est l'extension que leur
 * documentation invite à faire, pas un fork.
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
