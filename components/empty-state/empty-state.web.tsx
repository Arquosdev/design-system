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
  /** Ce qu'il faut comprendre, et si possible ce qu'on peut faire. */
  hint: string;
  actionLabel?: string;
  onAction?: () => void;
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
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-xl py-2xl text-center', className)}>
      {/*
        **L'icône nue, en trait, et non pleine dans un carré gris.**

        Louis, le 22/09/2026 : « est-ce que l'empty state est cohérent avec le
        nouveau design ? je le trouve moche. » Le carré doux de 60 px était le
        motif de 2018 : il encadre une icône qui n'a rien à encadrer, et il
        ajoute une surface là où l'écran est déjà vide. Les états vides des
        produits qu'on regarde n'en ont plus — Figma n'a pas d'icône du tout,
        Family en garde une, grande et en trait, sans cadre.

        `subtle` (le trait) et non `active` (le plein) : posée seule, une icône
        pleine pèse comme un pictogramme d'alerte, alors qu'un vide n'est pas
        un incident. `textSubtle` est sa couleur — la fiche du vocabulaire la
        réserve aux icônes, et elle est ici décorative : le titre dit tout.
      */}
      <Icon role={icon} size="xl" weight="subtle" className="mb-md text-text-subtle" />
      <p className="text-subhead font-semibold text-text">{title}</p>
      {/*
        `small` et non `body` : à 16 sur un titre de 18, le conseil concurrençait
        ce qu'il précise et les deux lignes faisaient un pavé. La hiérarchie se
        creuse d'un cran, et la largeur se resserre pour qu'il tienne en deux
        lignes courtes.
      */}
      <p className="mt-xs max-w-[38ch] text-small text-text-muted">{hint}</p>
      {actionLabel && onAction ? (
        <Button className="mt-base" onClick={onAction}>
          {actionLabel}
        </Button>
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
