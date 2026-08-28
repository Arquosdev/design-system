'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

export interface ActiveFilter {
  id: string;
  /** Ce que le filtre dit, en clair : « Technicien : M. Grangier ». */
  label: string;
}

export interface ActiveFiltersProps {
  filters: readonly ActiveFilter[];
  onRemove: (id: string) => void;
  onRemoveAll: () => void;
  className?: string;
}

/**
 * Les filtres actifs, retirables un par un.
 *
 * **Ce n'est pas `FilterChips`.** Celui-là choisit parmi des options ; celui-ci
 * montre ce qui restreint déjà la liste et permet de le défaire. Deux barres de
 * pastilles qui se ressemblent, deux rôles opposés.
 *
 * Elles disent le filtre **tel qu'on le lit**, jamais tel qu'il s'écrit dans
 * l'URL : un identifiant de technicien devient son nom.
 */
export function ActiveFilters({ filters, onRemove, onRemoveAll, className }: ActiveFiltersProps) {
  if (filters.length === 0) return null;
  return (
    <div className={cn('flex flex-wrap items-center gap-sm px-xl pb-md', className)}>
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onRemove(f.id)}
          aria-label={`Retirer le filtre ${f.label}`}
          className="flex h-8 items-center gap-sm rounded-control border border-primary bg-info-bg px-md text-small font-semibold text-on-info-bg hover:border-primary-dark"
        >
          {f.label}
          <Icon role="close" className="size-3.5" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={onRemoveAll}
        className="h-8 rounded-control px-md text-small font-semibold text-primary hover:bg-bg-muted"
      >
        Tout retirer
      </button>
    </div>
  );
}
