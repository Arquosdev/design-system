'use client';

import * as React from 'react';

import { tagPalette, tagTone, type TagTone } from '../../src/colors';
import { cn } from '../_lib/cn';

export interface TagProps {
  children: React.ReactNode;
  /**
   * La teinte du point, quand elle est décidée ailleurs : un type d'équipement
   * peut mériter sa couleur fixe. Sans elle, la teinte se déduit du libellé.
   */
  tone?: TagTone;
  /**
   * Déprécié : servait aux statuts de relevé venus de Bubble avec leurs
   * couleurs. Un statut prend `StatusBadge`. Seule l'encre sert encore, au point.
   */
  colors?: { background: string | null; foreground: string | null };
  className?: string;
}

/**
 * Une pastille de valeur : un point de couleur et le mot, sur un fond neutre.
 *
 * Elle distingue, elle ne juge pas. Le point suffit à balayer un tableau de
 * trente colonnes ; le fond reste neutre pour qu'une catégorie ne se lise
 * jamais comme un état (audit design du 11/10/2026, A5-15 : « Étude sécurité »
 * en aplat vert, à côté de « Soumis » en aplat vert). Les fonds teintés sont
 * à `StatusBadge` et `Badge`.
 */
export function Tag({ children, tone, colors, className }: TagProps) {
  const texte = typeof children === 'string' ? children : '';
  const encre = colors?.foreground ?? tagPalette[tone ?? tagTone(texte)].ink;

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-xs rounded-control border border-border-soft bg-bg px-xs py-[1px]',
        'text-caption font-medium whitespace-nowrap text-text',
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: encre }} />
      <span className="truncate">{children}</span>
    </span>
  );
}
