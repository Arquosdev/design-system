'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../_lib/cn';

// Les classes viennent du thème Tailwind généré depuis les tokens
// (`@arquos/design-system/tokens.tailwind.css`) : `bg-primary`, `rounded-control`
// et `text-small` n'existent que parce que les tokens les définissent.
const button = cva(
  'inline-flex items-center justify-center gap-sm whitespace-nowrap rounded-control ' +
    'font-semibold transition-opacity outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-text-on-dark hover:opacity-85 active:opacity-70',
        soft: 'bg-blue-50 text-blue-700 hover:opacity-80 active:opacity-70',
        ghost: 'bg-transparent text-text-muted hover:text-primary',
        outline:
          'border border-border bg-bg text-text-muted hover:bg-bg-muted active:bg-bg-muted',
        danger: 'bg-danger text-text-on-dark hover:opacity-85 active:opacity-70',
      },
      size: {
        sm: 'h-[30px] px-md text-small',
        md: 'h-[36px] px-base text-small',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof button> {
  /** Rend l'enfant à la place du `<button>`, en lui passant les styles. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Composant = asChild ? Slot : 'button';
    return (
      <Composant
        ref={ref}
        // Sans ça, un bouton dans un formulaire le soumet au clic — la cause la
        // plus fréquente de « la page se recharge toute seule ».
        type={asChild ? undefined : (type ?? 'button')}
        className={cn(button({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
