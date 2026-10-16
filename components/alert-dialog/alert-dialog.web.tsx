'use client';

import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';

import { buttonVariants } from '../button/button.web';
import { cn } from '../_lib/cn';

/*
  Repris de shadcn/ui (`npx shadcn@latest add alert-dialog`), habillé aux tokens
  Arquos. Les noms exportés et la composition sont ceux de shadcn ; la primitive
  est Radix `AlertDialog`, qui ne se ferme ni d'un clic à côté ni sans réponse.

  Un écart : `AlertDialogAction` prend un `tone` — `danger` pour un geste qui
  détruit (la suppression), sinon l'action principale. shadcn laisse l'appelant
  recomposer la classe du bouton, et c'est ce qui finit en couleur posée à la main.
*/

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-(--arq-layer-plein-ecran) bg-brand/15',
        'data-[state=open]:animate-voile-entree data-[state=closed]:animate-voile-sortie',
      )}
    />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed top-1/2 left-1/2 z-(--arq-layer-plein-ecran) flex w-panel max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-base',
        'rounded-block border border-border-soft bg-bg p-lg shadow-pop outline-none',
        'data-[state=open]:animate-voile-entree data-[state=closed]:animate-voile-sortie',
        className,
      )}
      {...props}
    />
  </AlertDialogPrimitive.Portal>
));
AlertDialogContent.displayName = 'AlertDialogContent';

export function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-xs', className)} {...props} />;
}

/** Le pied : « Annuler » à gauche, l'action à droite, comme le pied d'un panneau. */
export function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-center justify-end gap-sm', className)} {...props} />;
}

export const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn('text-subhead font-bold text-text', className)} {...props} />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn('text-small text-text-muted', className)} {...props} />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

export interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  /** `danger` pour un geste qui détruit et ne se défait pas ; sinon l'action principale. */
  tone?: 'default' | 'danger';
}

export const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, tone = 'default', ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants({ variant: tone === 'danger' ? 'destructive' : 'default' }), className)}
    {...props}
  />
));
AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} className={cn(buttonVariants({ variant: 'outline' }), className)} {...props} />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';
