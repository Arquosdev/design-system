'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { type IconRole } from '../../src/icons';
import { cn } from '../_lib/cn';

export interface Segment {
  id: string;
  label: string;
  count?: number | string;
  /** Un dessin devant le libellé, quand le mot seul ne suffit pas à distinguer
   *  deux vues — « Liste » et « Carte » se lisent mieux avec. */
  icon?: IconRole;
}

export interface SegmentedTabsProps {
  segments: readonly Segment[];
  value: string;
  onChange: (id: string) => void;
  /** Ce que ce groupe sépare, pour l'annoncer aux lecteurs d'écran. */
  ariaLabel: string;
  className?: string;
}

export function SegmentedTabs({
  segments,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedTabsProps) {
  // Les flèches déplacent la sélection : c'est ce qu'un lecteur d'écran attend
  // d'un groupe d'onglets, et ce qui évite de tabuler à travers chaque segment.
  const auClavier = (e: React.KeyboardEvent) => {
    const pas = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const i = segments.findIndex((s) => s.id === value);
    const next = segments[(i + pas + segments.length) % segments.length];
    onChange(next.id);
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={auClavier}
      className={cn('flex gap-xxs rounded-md bg-bg-muted p-xxs', className)}
    >
      {segments.map((segment) => {
        const active = segment.id === value;
        return (
          <button
            key={segment.id}
            type="button"
            role="tab"
            aria-selected={active}
            // Un seul segment est atteignable au Tab ; les flèches font le reste.
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(segment.id)}
            className={cn(
              // `flex-1` et non la largeur du texte : sinon la piste tressaute
              // d'un onglet à l'autre quand les libellés sont inégaux.
              'flex flex-1 items-center justify-center gap-sm rounded-control px-sm py-sm text-small outline-none',
              'focus-visible:ring-2 focus-visible:ring-primary',
              // Même règle que `NavList` : un segment au repos est en `medium`,
              // le segment courant garde `semibold`. Les deux composants se
              // touchent en haut du rail, un écart de graisse entre eux se
              // verrait tout de suite.
              active
                ? 'bg-bg font-semibold text-text shadow-card'
                : 'font-medium text-text-muted',
            )}
          >
            {segment.icon && <Icon role={segment.icon} className="size-4 shrink-0" aria-hidden />}
            <span>{segment.label}</span>
            {segment.count !== undefined && segment.count !== '' ? (
              <span
                className={cn(
                  'tabular-nums',
                  active ? 'font-semibold text-primary' : 'text-text-muted',
                )}
              >
                {segment.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
