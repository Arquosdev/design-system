'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

/**
 * Ce qu'on peut faire de ce qui est coché.
 *
 * **Elle est dans le flux, pas flottante.** Une barre flottante masque la
 * dernière ligne du tableau — souvent celle qu'on vient de cocher.
 */
export function SelectionBar({
  text,
  onClear,
  children,
  className,
}: {
  /** Le décompte, en clair : « 12 équipements sélectionnés ». */
  text: string;
  onClear: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label="Actions sur la sélection"
      className={cn(
        // Variante design-eu : une barre FLOTTANTE, compacte et centrée, à la
        // manière de Linear et Mercury, au lieu d'un bandeau marine pleine
        // largeur. Elle flotte, donc elle garde un arrondi et une ombre.
        'absolute bottom-5xl left-1/2 z-(--arq-layer-barre) flex max-w-[calc(100%-48px)] -translate-x-1/2 items-center gap-sm overflow-x-auto',
        'rounded-lg border border-border bg-bg py-xs pr-xs pl-base shadow-pop',
        className,
      )}
    >
      <span className="shrink-0 text-small font-semibold whitespace-nowrap text-text">
        {text}
      </span>
      <span className="mx-xxs h-5 w-px shrink-0 bg-border" aria-hidden />
      {children}
      <button
        type="button"
        onClick={onClear}
        aria-label="Effacer la sélection"
        className="ml-xs grid size-(--arq-control-sm) shrink-0 place-items-center rounded-control text-text-muted hover:bg-bg-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon role="close" className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export interface SelectionActionProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  children: React.ReactNode;
  /** L'action attendue. Une seule par barre, sinon aucune ne se détache. */
  primary?: boolean;
}

export const SelectionAction = React.forwardRef<HTMLButtonElement, SelectionActionProps>(
  function SelectionAction({ children, primary, className, ...reste }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'h-(--arq-control-sm) shrink-0 rounded-control px-md text-small font-semibold whitespace-nowrap',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          primary
            ? 'bg-primary text-text-on-dark hover:bg-primary-dark'
            : 'text-text hover:bg-bg-muted',
          className,
        )}
        {...reste}
      >
        {children}
      </button>
    );
  },
);
