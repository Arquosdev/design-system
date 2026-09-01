'use client';

import * as React from 'react';
import { Dialog as SheetPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';

/*
  Repris de shadcn/ui (`npx shadcn@latest add sheet`), habillé aux tokens Arquos.
  Les noms exportés et la composition sont ceux de shadcn.

  Deux écarts : les icônes sont en SVG posé, comme partout ici plutôt que via
  `lucide-react` ; et l'animation vient de nos tokens — celle de shadcn s'appuie
  sur `tw-animate-css`, une dépendance de plus pour quatre keyframes.
*/

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  /** Le bord d'où le panneau entre. Seule la droite est habillée pour l'instant. */
  side?: 'right';
}

export const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = 'right', ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-(--arq-layer-panneau) bg-brand/35',
        'data-[state=open]:animate-voile-entree data-[state=closed]:animate-voile-sortie',
      )}
    />
    <SheetPrimitive.Content
      ref={ref}
      data-side={side}
      className={cn(
        'fixed inset-y-0 right-0 z-(--arq-layer-panneau) flex h-full w-[460px] max-w-[calc(100vw-32px)] flex-col',
        'border-l border-border-soft bg-bg shadow-pop outline-none',
        'data-[state=open]:animate-tiroir-entree data-[state=closed]:animate-tiroir-sortie',
        className,
      )}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
));
SheetContent.displayName = 'SheetContent';

export function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('shrink-0 border-b border-border-soft px-lg py-base', className)}
      {...props}
    />
  );
}

export const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-subhead font-bold text-text', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('mt-xs text-small text-text-muted', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

/** Le corps qui défile. Le panneau, lui, garde son en-tête et son pied en place. */
export function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('min-h-0 flex-1 overflow-y-auto px-lg py-base', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between gap-md border-t border-border-soft px-lg py-md',
        className,
      )}
      {...props}
    />
  );
}

/** La croix en haut à droite. À poser dans l'en-tête, à côté du titre. */
export function SheetCloseButton({ className }: { className?: string }) {
  return (
    <SheetPrimitive.Close
      aria-label="Fermer"
      className={cn(
        'size-(--arq-control-sm) shrink-0 rounded-control bg-bg-muted text-text-muted outline-none',
        'hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      <span aria-hidden="true">✕</span>
    </SheetPrimitive.Close>
  );
}
