'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { Icon } from '../icon/icon.web';
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
  /**
   * Un raccourci posé au bout de la barre — « 5 à renseigner », qui ouvre le
   * formulaire sur ce bloc.
   *
   * C'est un BOUTON À PART, pas une zone cliquable dans celui qui déplie : il
   * fait autre chose, et la tabulation doit l'atteindre. Un bouton dans un
   * bouton n'existe pas en HTML — la barre devient donc une rangée qui porte
   * les deux, et celui qui déplie n'occupe plus que la place qui reste.
   */
  action?: {
    libelle: string;
    onClick: () => void;
    /** Ce qu'un lecteur d'écran annonce, quand le libellé seul ne suffit pas. */
    ariaLabel?: string;
  };
}

export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, titre, meta, action, ...props }, ref) => (
  <AccordionPrimitive.Header
    className={cn('flex items-stretch', action && 'border-b border-border-soft bg-bg-subtle')}
  >
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex w-full items-center gap-sm',
        !action && 'border-b border-border-soft bg-bg-subtle',
        'px-base py-md text-left outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      {/* Replié le chevron pointe de côté, déplié vers le bas — le
          comportement de la fiche. Pivoter de 180° mettrait une pointe vers le
          haut, qui se lit « remonter » plutôt que « ouvert ». */}
      <Icon
        role="deplier"
        size="xs"
        className="-rotate-90 text-text-muted transition-transform duration-(--arq-duration-normal) group-data-[state=open]:rotate-0"
      />
      <span className="text-small font-bold text-text">{titre}</span>
      {meta ? <span className="text-caption text-text-muted">{meta}</span> : null}
    </AccordionPrimitive.Trigger>
    {action ? (
      <button
        type="button"
        onClick={action.onClick}
        aria-label={action.ariaLabel}
        /* Souligné au survol et non en permanence : la barre en porte déjà
           deux — le titre et le compte — et un troisième trait toujours visible
           ferait une ligne bavarde. La couleur suffit à dire qu'on peut cliquer,
           le soulignement confirme quand on y va. */
        className={cn(
          'shrink-0 self-center rounded-control px-base py-xs text-caption font-semibold',
          'text-primary underline decoration-transparent underline-offset-2 outline-none',
          'hover:decoration-current focus-visible:ring-2 focus-visible:ring-primary',
        )}
      >
        {action.libelle}
      </button>
    ) : null}
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

