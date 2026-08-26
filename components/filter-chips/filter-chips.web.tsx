'use client';

import * as React from 'react';
import { ToggleGroup } from 'radix-ui';

import { cn } from '../_lib/cn';

export interface FilterChip {
  value: string;
  label: string;
  /** Compteur affiché après le libellé (« Cabine 18 »). */
  compteur?: number | string;
}

export interface FilterChipsProps {
  chips: readonly FilterChip[];
  value: string;
  onValueChange: (value: string) => void;
  /** Nom du groupe pour les lecteurs d'écran (« Filtrer par section »). */
  label: string;
  className?: string;
}

/**
 * Une barre de puces qui restreint ce qu'on regarde — les photos d'une section,
 * les écarts d'un composant.
 *
 * Bâtie sur la primitive Radix `ToggleGroup` (`type="single"`), la même base que
 * le ToggleGroup de shadcn. Elle en rend un `radiogroup` : navigation aux
 * flèches, `aria-checked`, et un seul arrêt de tabulation pour le groupe entier
 * — sur huit puces, huit arrêts seraient huit obstacles avant le contenu.
 */
export function FilterChips({ chips, value, onValueChange, label, className }: FilterChipsProps) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      // Radix rend la valeur vide quand on reclique la puce active. Un filtre
      // sans valeur n'a pas de sens ici : on ignore, la puce reste active.
      onValueChange={(v) => v && onValueChange(v)}
      aria-label={label}
      className={cn('flex flex-wrap gap-sm', className)}
    >
      {chips.map((chip) => (
        <ToggleGroup.Item
          key={chip.value}
          value={chip.value}
          className={cn(
            'h-[32px] rounded-control border px-md text-small font-semibold outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary',
            'border-border bg-bg text-text-muted hover:bg-bg-muted',
            'data-[state=on]:border-primary data-[state=on]:bg-info-bg data-[state=on]:text-on-info-bg',
          )}
        >
          {chip.label}
          {chip.compteur !== undefined ? (
            // Pas d'`opacity` : elle mélange la couleur au fond et fait tomber
            // le compteur à 2,9 pour 1. La graisse suffit à le mettre en retrait,
            // et elle ne coûte rien à la lisibilité.
            <span className="ml-xs font-normal">{chip.compteur}</span>
          ) : null}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
