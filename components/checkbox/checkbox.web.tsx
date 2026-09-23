'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

/**
 * Une case à cocher.
 *
 * La coche vient du vocabulaire d'icônes (`role="check"`), pas de Lucide :
 * shadcn livre ses composants avec Lucide, et le jeu officiel d'Arquos est
 * Phosphor. Un seul dessin de coche dans tout le produit.
 *
 * `size-[18px]` plutôt que les 16 px de shadcn : la case reste petite, mais
 * l'écart avec `iconSize.md` disparaît, et la coche ne flotte plus dans son
 * carré.
 */
export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-[18px] shrink-0 rounded-sm border border-border bg-bg outline-none transition-colors',
        'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary',
        'disabled:pointer-events-none disabled:opacity-50',
        'aria-invalid:border-danger',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-text-on-dark',
        'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-text-on-dark',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        {props.checked === 'indeterminate' ? (
          // Le trait d'un état partiel : ni coché, ni décoché. Un carré de
          // 8 px, pas une icône — Phosphor n'a rien à cette taille qui ne
          // devienne illisible.
          <span aria-hidden="true" className="block h-[2px] w-[9px] rounded-full bg-current" />
        ) : (
          <Icon role="check" size="xs" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
