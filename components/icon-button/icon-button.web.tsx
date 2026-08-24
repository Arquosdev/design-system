import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../_lib/cn';

const iconButton = cva(
  'inline-flex shrink-0 items-center justify-center rounded-control outline-none ' +
    'transition-colors focus-visible:ring-2 focus-visible:ring-primary ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        outline: 'border border-border bg-bg text-text-muted hover:bg-bg-muted',
        soft: 'bg-blue-50 text-blue-700 hover:opacity-80',
        ghost: 'bg-transparent text-text-muted hover:bg-bg-muted',
      },
      size: {
        sm: 'size-[30px]',
        md: 'size-[36px]',
      },
    },
    defaultVariants: { variant: 'outline', size: 'md' },
  },
);

export interface IconButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'>,
    VariantProps<typeof iconButton> {
  /**
   * Nom accessible du bouton. Obligatoire : sans texte visible, c'est la seule
   * chose qu'un lecteur d'écran peut annoncer.
   */
  label: string;
  icon: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, variant, size, className, type, ...props }, ref) => (
    <button
      ref={ref}
      type={type ?? 'button'}
      aria-label={label}
      // `title` en plus d'`aria-label` : l'un pour les lecteurs d'écran, l'autre
      // pour l'infobulle au survol. Les deux disent la même chose.
      title={label}
      className={cn(iconButton({ variant, size }), className)}
      {...props}
    >
      <span aria-hidden="true" className="flex items-center justify-center">
        {icon}
      </span>
    </button>
  ),
);
IconButton.displayName = 'IconButton';
