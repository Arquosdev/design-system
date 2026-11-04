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
  /**
   * Le mot sur le fond de sa teinte, sans point : pour une colonne dont les
   * valeurs sont peu nombreuses et fixes, qu'on veut repérer de loin (le type
   * d'un équipement, Thomas, 04/11/2026). Jamais pour un statut : `StatusBadge`.
   */
  filled?: boolean;
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
export function Tag({ children, tone, colors, filled = false, className }: TagProps) {
  const texte = typeof children === 'string' ? children : '';
  const teinte = tagPalette[tone ?? tagTone(texte)];
  const encre = colors?.foreground ?? teinte.ink;

  if (filled) {
    return (
      <span
        className={cn(
          'inline-flex max-w-full items-center rounded-control px-xs py-[1px]',
          'text-caption font-semibold whitespace-nowrap',
          className,
        )}
        style={{ backgroundColor: teinte.bg, color: teinte.ink }}
      >
        <span className="truncate">{children}</span>
      </span>
    );
  }

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
