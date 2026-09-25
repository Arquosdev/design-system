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
   * Les teintes servies avec la valeur — les statuts de relevé arrivent de
   * Bubble avec les leurs. On les emploie telles quelles plutôt que d'en
   * choisir d'autres : la pastille doit être la même ici et là-bas.
   */
  colors?: { background: string | null; foreground: string | null };
  className?: string;
}

/**
 * Une pastille de valeur.
 *
 * Elle distingue, elle ne juge pas. Un tableau de trente colonnes en texte gris
 * se lit ligne par ligne ; les mêmes colonnes avec une couleur par valeur se
 * lisent en balayant. C'est le seul intérêt de la couleur ici, et c'est
 * pourquoi elle est catégorielle et non sémantique : voir `Badge` pour un état.
 */
export function Tag({ children, tone, colors, className }: TagProps) {
  const texte = typeof children === 'string' ? children : '';
  const paire = tagPalette[tone ?? tagTone(texte)];
  const fond = colors?.background ?? paire.bg;
  const encre = colors?.foreground ?? paire.ink;

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-xs truncate',
        'text-small whitespace-nowrap text-text',
        className,
      )}
      /* Variante design-eu : la couleur est un POINT, le texte reste en encre.
         Le fond de la paire sert de halo au point pour que les teintes claires
         restent visibles sur le blanc. */
      data-tag-background={fond}
    >
      <span
        aria-hidden
        className="size-[8px] shrink-0 rounded-full"
        style={{ backgroundColor: encre, boxShadow: `0 0 0 2px ${fond}` }}
      />
      <span className="truncate">{children}</span>
    </span>
  );
}
