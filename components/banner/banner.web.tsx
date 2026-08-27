import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';
import type { IconRole } from '../../src/icons';

export type BannerTone = 'info' | 'warning' | 'danger';

export interface BannerProps extends React.ComponentProps<'div'> {
  tone?: BannerTone;
  icon?: IconRole;
  /** Ce que la personne peut faire — un lien, un bouton. */
  action?: React.ReactNode;
}

const TONES: Record<BannerTone, string> = {
  info: 'bg-info-bg text-on-info-bg',
  warning: 'bg-warning-bg text-on-warning-bg',
  danger: 'bg-danger-bg text-on-danger-bg',
};

/**
 * Un bandeau qui informe sans interrompre.
 *
 * Il occupe le haut d'une zone et y reste tant que la condition dure — c'est ce
 * qui le distingue d'un `Toast`, qui passe. Un bandeau qui disparaît tout seul
 * laisse croire que le problème est réglé.
 *
 * Le composant est **présentationnel** : il ne détecte rien. Savoir qu'on est
 * hors ligne ou qu'une file d'envoi traîne appartient à l'app, qui a son
 * contexte réseau, ses délais et ses règles.
 */
export function Banner({
  tone = 'info',
  icon,
  action,
  className,
  children,
  ...props
}: BannerProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex w-full items-center gap-sm px-base py-sm text-small font-medium',
        TONES[tone],
        className,
      )}
      {...props}
    >
      {icon ? <Icon role={icon} size="sm" /> : null}
      <span className="min-w-0 flex-1">{children}</span>
      {action}
    </div>
  );
}
