'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '../_lib/cn';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'mb-md overflow-hidden rounded-md border border-border-soft last:mb-0',
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>, 'children'> {
  titre: string;
  /** Compteur ou précision affichée à droite du titre (« 4 champs renseignés »). */
  meta?: string;
}

export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, titre, meta, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex w-full items-center gap-sm border-b border-border-soft bg-bg-muted',
        'px-base py-md text-left outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:-ring-offset-2',
        className,
      )}
      {...props}
    >
      <ChevronBas />
      <span className="text-small font-bold text-text">{titre}</span>
      {meta ? <span className="text-caption text-text-subtle">{meta}</span> : null}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    // Les deux animations sont définies dans tokens.tailwind.css : Radix expose
    // la hauteur du contenu en variable CSS, seul moyen d'animer vers `auto`.
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('px-base pt-md pb-sm', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

function ChevronBas() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="22"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      // Replié le chevron pointe de côté, déplié il pointe vers le bas — le
      // comportement de la fiche actuelle. Le faire pivoter de 180° mettrait
      // une pointe vers le haut, qui se lit « remonter » plutôt que « ouvert ».
      className="shrink-0 -rotate-90 text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-0"
    >
      <path d="M48 96l80 80 80-80" />
    </svg>
  );
}
