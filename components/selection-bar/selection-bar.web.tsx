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
        'flex shrink-0 items-center gap-md overflow-x-auto border-t border-border-soft bg-brand px-xl py-md',
        className,
      )}
    >
      <span className="shrink-0 text-small font-semibold whitespace-nowrap text-text-on-dark">
        {text}
      </span>
      <span className="h-6 w-px shrink-0 bg-primary-dark" aria-hidden />
      {children}
      <button
        type="button"
        onClick={onClear}
        aria-label="Effacer la sélection"
        className="ml-auto grid size-[30px] shrink-0 place-items-center rounded-control text-text-on-dark hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
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
          'h-[30px] shrink-0 rounded-control px-md text-small font-semibold whitespace-nowrap text-text-on-dark',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg',
          primary ? 'bg-primary hover:bg-primary-dark' : 'bg-primary-dark hover:bg-primary',
          className,
        )}
        {...reste}
      >
        {children}
      </button>
    );
  },
);
