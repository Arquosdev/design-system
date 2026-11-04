'use client';

import * as React from 'react';

import { tagPalette, tagTone, type TagTone } from '../../src/colors';
import { cn } from '../_lib/cn';

export interface TagProps {
  children: React.ReactNode;
  /**
   * La teinte, quand elle est décidée ailleurs : un type d'équipement peut
   * mériter sa couleur fixe. Sans elle, la teinte se déduit du libellé.
   */
  tone?: TagTone;
  /**
   * Déprécié : servait aux statuts de relevé venus de Bubble avec leurs
   * couleurs. Un statut prend `StatusBadge`.
   */
  colors?: { background: string | null; foreground: string | null };
  className?: string;
}

/**
 * Une pastille de valeur : le mot dans l'encre de sa teinte, sur le fond de
 * la même teinte (Thomas, 04/11/2026 : plus de point sur fond neutre).
 *
 * Elle distingue, elle ne juge pas : sa teinte est tirée du libellé. Les
 * états restent à `StatusBadge` et `Badge`, qui ont leurs propres couleurs.
 */
export function Tag({ children, tone, colors, className }: TagProps) {
  const texte = typeof children === 'string' ? children : '';
  const teinte = tagPalette[tone ?? tagTone(texte)];

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-control px-xs py-[1px]',
        'text-caption font-semibold whitespace-nowrap',
        className,
      )}
      style={{ backgroundColor: colors?.background ?? teinte.bg, color: colors?.foreground ?? teinte.ink }}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}
