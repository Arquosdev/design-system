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

/**
 * Deux tailles, et la raison n'est pas cosmétique.
 *
 * Ces pièces ont été dessinées pour la palette ⌘K : six cent soixante pixels
 * de large, une entrée de cinquante-deux pixels de haut, du texte de sous-titre
 * et des retraits de seize. Posées dans un menu de deux cent quatre-vingts
 * pixels, elles débordent — l'invite se coupe, et dix lignes remplissent
 * l'écran.
 *
 * `Combobox` avait déjà rencontré le problème et l'avait contourné en
 * s'adressant directement à la primitive `cmdk`, ce que sa fiche explique. La
 * taille est maintenant déclarée plutôt que contournée, et le contournement
 * peut disparaître le jour où quelqu'un y reviendra.
 *
 * `default` est la palette, `sm` un menu. La taille se pose UNE FOIS sur
 * `Command` et descend à ses pièces : la poser cellule par cellule laisserait
 * une entrée de palette au-dessus d'une liste de menu.
 */
export type CommandSize = 'default' | 'sm';

const TailleCommand = React.createContext<CommandSize>('default');

export function Command({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof CommandPrimitive> & { size?: CommandSize }) {
  return (
    <TailleCommand.Provider value={size}>
      <CommandPrimitive
        data-slot="command"
        data-size={size}
        className={cn('flex h-full w-full flex-col overflow-hidden rounded-lg bg-bg text-text', className)}
        {...props}
      />
    </TailleCommand.Provider>
  );
}

export function CommandDialog({
  title,
  open,
  onOpenChange,
  children,
  className,
  ...command
}: {
  /** Nom du dialogue pour les lecteurs d'écran. Jamais affiché. */
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<typeof CommandPrimitive>, 'children' | 'className'>) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--arq-layer-plein-ecran) bg-brand/35" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            'fixed top-[96px] left-1/2 z-(--arq-layer-plein-ecran) w-[660px] max-w-[calc(100vw-32px)] -translate-x-1/2',
            'overflow-hidden rounded-lg bg-bg shadow-pop outline-none',
            className,
          )}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Command {...command}>{children}</Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const taille = React.useContext(TailleCommand);
  return (
    <div
      className={cn(
        'flex items-center border-b border-border-soft',
        taille === 'sm' ? 'gap-sm px-sm' : 'gap-md px-base',
      )}
    >
      <Icon role="search" size="sm" className="shrink-0 text-text-muted" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'w-full bg-transparent font-normal text-text outline-none',
          // `min-w-0` : sans lui l'entrée garde sa largeur intrinsèque, la
          // boîte déborde, et c'est l'invite qui se coupe.
          'min-w-0',
          taille === 'sm' ? 'h-[36px] text-small' : 'h-[52px] text-subhead',
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
  const taille = React.useContext(TailleCommand);
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'scroll-py-sm overflow-x-hidden overflow-y-auto py-xs',
        /*
          Un menu ne monte pas à quatre cents pixels : dix agences y
          rempliraient l'écran.

          **Et la borne tombe sur un nombre entier de lignes.** Une entrée
          coupée en deux se lit comme un défaut, même quand elle sert d'indice
          de défilement : Louis l'a signalé le 30/08/2026 sur le sélecteur
          d'agence.

          Le compte, mesuré dans le navigateur plutôt que déduit : une entrée
          fait 23,59 px et la liste porte 4 px de marge en haut comme en bas.
          Onze entières valent donc 267,5 px, arrondis à 268. La hauteur d'une
          entrée n'étant pas un entier, l'alignement est juste au pixel près et
          non exact — il se refera le jour où le design system portera une
          échelle de hauteur de contrôle (lot 27).
        */
        taille === 'sm' ? 'max-h-[268px]' : 'max-h-[400px]',
        className,
      )}
      {...props}
    />
  );
}

export function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  const taille = React.useContext(TailleCommand);
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        'text-center text-small text-text-muted',
        taille === 'sm' ? 'px-sm py-sm' : 'px-base py-xl',
      )}
      {...props}
    />
  );
}

export function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  const taille = React.useContext(TailleCommand);
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'overflow-hidden text-text',
        /* L'intitulé suit la taille comme le reste : à `sm`, il était retiré
           de seize pixels pendant que ses propres entrées l'étaient de douze,
           et il ajoutait de la respiration en haut d'un menu dont tout le
           propos est de ne pas respirer. */
        taille === 'sm'
          ? '[&_[cmdk-group-heading]]:px-sm [&_[cmdk-group-heading]]:pt-xs [&_[cmdk-group-heading]]:pb-xxs'
          : '[&_[cmdk-group-heading]]:px-base [&_[cmdk-group-heading]]:pt-md [&_[cmdk-group-heading]]:pb-xxs',
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
  const taille = React.useContext(TailleCommand);
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        'flex cursor-pointer items-center text-small outline-none select-none',
        taille === 'sm' ? 'gap-sm px-sm py-xxs' : 'gap-base px-base py-sm',
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

