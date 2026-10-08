'use client';

import * as React from 'react';
import { Dialog as SheetPrimitive } from 'radix-ui';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';
import { ConteneurFlottant } from '../_lib/conteneur-flottant';

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
  /**
   * La largeur du panneau.
   *
   * `standard` (460) pour une tâche annexe : quelques champs, une décision.
   * `large` (860) quand le panneau doit montrer le formulaire ET ce qui
   * l'explique — une planche cotée, un tableau à colonnes. En dessous de cette
   * largeur, les repères d'un dessin ne se lisent plus.
   *
   * Deux valeurs, pas un nombre libre : une largeur choisie au cas par cas
   * redevient une valeur de design en dur dans l'app, et c'est ce qui est
   * arrivé à la fiche équipement (`w-[860px]` posé à la main).
   */
  size?: 'standard' | 'large';
}

export const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = 'right', size = 'standard', ...props }, ref) => {
  /* Le panneau prête son propre nœud à ce qui flotte dedans : une liste posée
     hors de lui ne défilait plus, il bloque le défilement de tout le reste.
     Voir `conteneur-flottant` (repris de la v2.37.0, #80, le 08/10/2026). */
  const [noeud, setNoeud] = React.useState<HTMLDivElement | null>(null);
  const relier = React.useCallback(
    (el: HTMLDivElement | null) => {
      setNoeud(el);
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  return (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-(--arq-layer-panneau) bg-brand/15',
        'data-[state=open]:animate-voile-entree data-[state=closed]:animate-voile-sortie',
      )}
    />
    <SheetPrimitive.Content
      ref={relier}
      data-side={side}
      data-size={size}
      className={cn(
        'fixed inset-y-0 right-0 z-(--arq-layer-panneau) flex h-full max-w-[calc(100vw-32px)] flex-col',
        size === 'large' ? 'w-panel-wide' : 'w-panel',
        'border-l border-border-soft bg-bg shadow-pop outline-none',
        'data-[state=open]:animate-tiroir-entree data-[state=closed]:animate-tiroir-sortie',
        className,
      )}
      {...props}
    >
      <ConteneurFlottant.Provider value={noeud}>{children}</ConteneurFlottant.Provider>
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
  );
});
SheetContent.displayName = 'SheetContent';

/**
 * L'en-tête porte sa croix de fermeture (design-eu, 26/09/2026) : vingt panneaux
 * sur vingt-deux n'en avaient pas, alors que Filtres et Colonnes en ont une.
 * `close={false}` pour un panneau qu'on ne doit pas quitter sans répondre.
 */
export function SheetHeader({
  className, children, close = true, ...props
}: React.ComponentProps<'div'> & { close?: boolean }) {
  return (
    <div
      className={cn('flex shrink-0 items-start gap-md border-b border-border-soft px-lg py-base', className)}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {close ? <SheetCloseButton /> : null}
    </div>
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
  /* Dans un formulaire de panneau, une liste déroulante prend la largeur de
     sa colonne, comme le champ voisin (design-eu, 26/09/2026) : dix panneaux
     la gardaient à la largeur de son texte, « Divers », « 20 % ». Une largeur
     posée par l'écran ne l'emporte pas : dans un panneau, la règle est la colonne. */
  return (
    <div
      className={cn(
        'min-h-0 flex-1 overflow-y-auto px-lg py-base',
        '[&_button[role=combobox]]:w-full',
        className,
      )}
      {...props}
    />
  );
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
        'grid size-(--arq-control-sm) shrink-0 place-items-center rounded-control bg-bg-muted text-text-muted outline-none',
        'hover:text-text focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      <Icon role="close" className="size-3.5" aria-hidden />
    </SheetPrimitive.Close>
  );
}
