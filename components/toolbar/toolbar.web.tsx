'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { type IconRole } from '../../src/icons';
import { cn } from '../_lib/cn';

const BOUTON =
  'flex h-9 items-center gap-sm rounded-control border border-border bg-bg px-md ' +
  'text-small font-semibold whitespace-nowrap text-text-muted hover:border-text-subtle ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/** La barre au-dessus d'une liste : ce qu'on peut lui faire. */
export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-sm px-xl py-md', className)}>{children}</div>
  );
}

export interface ToolButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  icon: IconRole;
  children: React.ReactNode;
  /** Ce que le bouton porte en plus : un compte de filtres actifs. */
  count?: number;
  /** Une précision discrète, en graisse normale : « 9 / 24 ». */
  extra?: string;
  /** Le réglage qu'il ouvre est en cours : le bouton le dit. */
  active?: boolean;
}

/**
 * Un bouton de barre d'outils.
 *
 * Il transmet sa ref : sans elle, un menu ancré dessus (`PopoverTrigger asChild`)
 * n'a rien à quoi s'accrocher et ne s'ouvre jamais — sans erreur.
 */
export const ToolButton = React.forwardRef<HTMLButtonElement, ToolButtonProps>(
  function ToolButton({ icon, children, count, extra, active = false, className, ...reste }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={reste.onClick && !('aria-haspopup' in reste) ? active : undefined}
        className={cn(BOUTON, active && 'border-primary bg-info-bg text-on-info-bg hover:border-primary', className)}
        {...reste}
      >
        <Icon role={icon} className="size-4 shrink-0" aria-hidden />
        {children}
        {extra && <span className="font-normal">{extra}</span>}
        {count !== undefined && count > 0 && (
          <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-xs text-caption font-bold text-text-on-dark">
            {count}
          </span>
        )}
      </button>
    );
  },
);

/** Pousse ce qui suit à droite de la barre. */
export function ToolbarSpacer() {
  return <span className="flex-1" />;
}
