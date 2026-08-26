'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Dialog } from 'radix-ui';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

/*
  Repris de shadcn/ui (`npx shadcn@latest add command`), habillé aux tokens
  Arquos. Les noms exportés et la composition sont ceux de shadcn : un extrait
  de leur documentation se colle ici sans retouche.

  Deux écarts assumés :
  - `CommandDialog` s'appuie directement sur la primitive Radix `Dialog` plutôt
    que sur le composant Dialog de shadcn, que le design system n'a pas encore.
  - Les icônes sont en SVG posé, comme partout ailleurs ici. Ajouter
    `lucide-react` pour une loupe serait une deuxième convention d'icônes.
*/

export function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn('flex h-full w-full flex-col overflow-hidden rounded-lg bg-bg text-text', className)}
      {...props}
    />
  );
}

export function CommandDialog({
  titre,
  open,
  onOpenChange,
  children,
  className,
  ...commande
}: {
  /** Nom du dialogue pour les lecteurs d'écran. Jamais affiché. */
  titre: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<typeof CommandPrimitive>, 'children' | 'className'>) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brand/35" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            'fixed top-[96px] left-1/2 z-50 w-[660px] max-w-[calc(100vw-32px)] -translate-x-1/2',
            'overflow-hidden rounded-lg bg-bg shadow-pop outline-none',
            className,
          )}
        >
          <Dialog.Title className="sr-only">{titre}</Dialog.Title>
          <Command {...commande}>{children}</Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-md border-b border-border-soft px-base">
      <Icon role="rechercher" size="sm" className="text-text-muted" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'h-[52px] w-full bg-transparent text-subhead font-normal text-text outline-none',
          'placeholder:text-text-muted',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn('max-h-[400px] scroll-py-sm overflow-x-hidden overflow-y-auto py-xs', className)}
      {...props}
    />
  );
}

export function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="px-base py-xl text-center text-small text-text-muted"
      {...props}
    />
  );
}

export function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'overflow-hidden text-text',
        '[&_[cmdk-group-heading]]:px-base [&_[cmdk-group-heading]]:pt-md [&_[cmdk-group-heading]]:pb-xxs',
        '[&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:font-bold',
        '[&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:uppercase',
        '[&_[cmdk-group-heading]]:text-text-muted',
        className,
      )}
      {...props}
    />
  );
}

export function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        'flex cursor-pointer items-center gap-base px-base py-sm text-small outline-none select-none',
        'data-[selected=true]:bg-info-bg',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn('h-px bg-border-soft', className)}
      {...props}
    />
  );
}

