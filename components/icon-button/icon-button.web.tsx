import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../_lib/cn';
import { availability, availabilityAttributes, blocksActivation } from '../button/button.logic';
import { INACTIVE_SURFACE } from '../button/button.web';

const iconButton = cva(
  'inline-flex shrink-0 items-center justify-center rounded-control outline-none ' +
    'transition-colors focus-visible:ring-2 focus-visible:ring-primary ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        outline: 'border border-border bg-bg text-text-muted hover:bg-bg-muted',
        soft: 'bg-info-bg text-on-info-bg hover:opacity-80',
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
  /**
   * Le geste est impossible ICI, MAINTENANT — voir `button.spec.md`, la règle
   * est la même. Le bouton reste focalisable et survolable, donc capable de
   * dire pourquoi.
   */
  inactive?: boolean;
  /**
   * Pourquoi le geste est impossible. Elle s'ajoute au `label` dans l'infobulle
   * plutôt que de le remplacer : sans texte visible, le nom du bouton reste la
   * première chose à annoncer.
   */
  inactiveReason?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, variant, size, className, type, inactive, inactiveReason, disabled, onClick, ...props }, ref) => {
    const state = availability({ inactive, disabled });
    return (
    <button
      ref={ref}
      type={type ?? 'button'}
      aria-label={label}
      // `title` en plus d'`aria-label` : l'un pour les lecteurs d'écran, l'autre
      // pour l'infobulle au survol. Les deux disent la même chose.
      //
      // La raison d'un état inactif s'AJOUTE au nom, elle ne le remplace pas :
      // « Supprimer — le constat est signé » se lit, « le constat est signé »
      // seul laisse chercher de quel bouton il s'agit.
      title={inactiveReason ? `${label} — ${inactiveReason}` : label}
      {...availabilityAttributes(state)}
      onClick={
        blocksActivation(state)
          ? (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : onClick
      }
      className={cn(iconButton({ variant, size }), inactive && !disabled && INACTIVE_SURFACE, className)}
      {...props}
    >
      <span aria-hidden="true" className="flex items-center justify-center">
        {icon}
      </span>
    </button>
    );
  },
);
IconButton.displayName = 'IconButton';
