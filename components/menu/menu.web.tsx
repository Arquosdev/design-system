'use client';

import * as React from 'react';

import type { IconRole } from '../../src/icons';
import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

/*
  UN MENU À LA DENSITÉ D'UN MENU (Louis, 12/11/2026). Le contenant est un `PopoverContent`
  (arrondi 8, ombre de fenêtre, un seul contour) avec `MENU_CONTENT` (4 px de rembourrage) ;
  chaque entrée fait 28 px en 13 px, son icône 14 px en gris, et une entrée sans icône
  garde la gouttière pour rester alignée. Une entrée destructive est rouge, isolée en bas
  après un séparateur.
*/

/** Les classes du contenant d'un menu : à poser sur `PopoverContent`. */
export const MENU_CONTENT = 'w-56 p-xs';

export interface MenuItemProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  /** L'icône de l'entrée ; absente, sa place est gardée. */
  icon?: IconRole;
  /** Un geste qui détruit : rouge, et posé en bas après un `MenuSeparator`. */
  destructive?: boolean;
  /** Un lien plutôt qu'un bouton. */
  href?: string;
  children: React.ReactNode;
}

const ENTREE =
  'flex h-(--arq-control-sm) w-full items-center gap-sm rounded-control px-sm text-left text-description text-text ' +
  'outline-none hover:bg-bg-muted focus-visible:bg-bg-muted ' +
  'disabled:cursor-not-allowed disabled:text-text-subtle disabled:hover:bg-transparent';

function Gouttiere({ icon, destructive }: { icon?: IconRole; destructive?: boolean }) {
  if (!icon) return <span aria-hidden className="invisible shrink-0"><Icon role="moreActions" size="sm" className="size-3.5" /></span>;
  return <Icon role={icon} size="sm" className={cn('size-3.5 shrink-0', destructive ? 'text-danger' : 'text-text-muted')} aria-hidden />;
}

/** Une entrée de menu : 28 px, 13 px, icône de 14 px en gris. */
export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ icon, destructive, href, className, children, type, ...props }, ref) => {
    const classes = cn(ENTREE, destructive && 'text-danger', className);
    if (href) {
      return (
        <a href={href} className={classes} onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}>
          <Gouttiere icon={icon} destructive={destructive} />
          <span className="min-w-0 truncate">{children}</span>
        </a>
      );
    }
    return (
      <button ref={ref} type={type ?? 'button'} className={classes} {...props}>
        <Gouttiere icon={icon} destructive={destructive} />
        <span className="min-w-0 truncate">{children}</span>
      </button>
    );
  },
);
MenuItem.displayName = 'MenuItem';

/** Un filet fin entre deux groupes d'entrées. */
export function MenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn('-mx-xs my-xs h-px bg-border-soft', className)} />;
}
