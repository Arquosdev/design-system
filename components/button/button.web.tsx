'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../_lib/cn';

/**
 * Base shadcn/ui (`new-york`), habillée aux tokens Arquos.
 *
 * Les noms de variantes et de tailles sont ceux de shadcn — `default`,
 * `secondary`, `outline`, `ghost`, `destructive`, `link`. C'est ce qui permet
 * de coller un extrait de leur documentation sans le retoucher. Seules les
 * couleurs changent, et elles viennent des variables que
 * `tokens.tailwind.css` traduit depuis les tokens.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-sm whitespace-nowrap rounded-control ' +
    'text-small font-semibold transition-colors outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background text-muted-foreground hover:bg-muted',
        ghost: 'text-muted-foreground hover:text-primary',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-[36px] px-base',
        sm: 'h-[30px] px-md',
        lg: 'h-[44px] px-lg',
        icon: 'size-[36px] px-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
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
        // plus fréquente de « la page se recharge toute seule ». shadcn ne le
        // pose pas ; c'est notre seul écart de comportement, et il est voulu.
        type={asChild ? undefined : (type ?? 'button')}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
