'use client';

import * as React from 'react';

import { Button } from '../button/button.web';
import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';
import { FAILURES, failureKind, RETRY } from './empty-state.logic';
import type { IconRole } from '../../src/icons';

export interface EmptyStateProps {
  /** Le rôle de l'icône — voir le vocabulaire dans `src/icons.ts`. */
  icon: IconRole;
  title: string;
  /** Ce qu'il faut comprendre, et si possible ce qu'on peut faire. Une ligne ; facultatif quand le titre suffit. */
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
  /**
   * `page` (défaut) : une liste ou un écran entier qui n'a rien. `section` :
   * une rubrique ou un bloc d'une fiche, plus serré, aligné à gauche — le même
   * état vide partout au lieu d'une ligne grise ici et d'une illustration là
   * (audit design du 11/10/2026, A1-13).
   */
  density?: 'page' | 'section';
  className?: string;
}

/**
 * Ce qu'on montre quand il n'y a rien à montrer.
 *
 * Un écran vide laisse croire à une panne. Un état vide dit **pourquoi** c'est
 * vide, et si possible quoi faire — c'est ce qui le sépare d'un blanc.
 */
export function EmptyState({
  icon,
  title,
  hint,
  actionLabel,
  onAction,
  density = 'page',
  className,
}: EmptyStateProps) {
  /*
    L'ÉTAT VIDE UNIQUE (Louis, 12/11/2026, d'après Supabase, Linear et Vercel) :
    centré, une marge verticale généreuse, l'icône de l'objet dans un petit carré
    blanc contouré de l'ombre des boutons, un titre court à 14 px, une ligne qui
    dit ce qui apparaîtra ici (13 px, gris), et le geste qui remplit la rubrique
    en bouton secondaire, jamais en bleu vif. Sans cadre : dans une rubrique en
    cartes, c'est la carte qui l'entoure. `density` ne règle plus que la marge.
  */
  return (
    <div className={cn('flex flex-col items-center justify-center px-base text-center', density === 'page' ? 'py-5xl' : 'py-4xl', className)}>
      <span aria-hidden className="mb-md grid size-9 place-items-center rounded-md bg-bg text-text-muted shadow-control">
        <Icon role={icon} size="sm" />
      </span>
      <p className="text-small-bold text-text">{title}</p>
      {hint ? <p className="mt-xxs max-w-[44ch] text-pretty text-description text-text-muted">{hint}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="outline" size="sm" className="mt-base" onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </div>
  );
}

/**
 * L'état vide d'un chargement raté, qui lit l'erreur pour choisir ses mots.
 *
 * Hors ligne, réessayer tout de suite ne sert à rien : le message le dit et
 * envoie vérifier la connexion, plutôt que de faire appuyer en boucle.
 */
export function EmptyStateError({
  error,
  onReessayer,
  className,
}: {
  error: unknown;
  onReessayer?: () => void;
  className?: string;
}) {
  const { icon, title, hint } = FAILURES[failureKind(error)];
  return (
    <EmptyState
      icon={icon}
      title={title}
      hint={hint}
      actionLabel={onReessayer ? RETRY : undefined}
      onAction={onReessayer}
      className={className}
    />
  );
}
