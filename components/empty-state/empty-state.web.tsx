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
      {/* Le carré doux plutôt que l'icône nue : posée seule au milieu du vide,
          une icône de 40 px flotte et se lit comme un défaut d'affichage. */}
      <span className="mb-sm flex size-[60px] items-center justify-center rounded-md bg-bg-muted">
        {/* `textMuted` et non `textSubtle` : sur le carré `bgMuted`, le second
            tombe à 2,93 pour 1 — sous le seuil, même pour un élément non
            textuel. Trouvé à la mesure, pas par le contrôle : celui-ci
            n'apparie que ce qui vit dans la même chaîne de classes, et ici le
            fond est sur le parent. */}
        <Icon role={icon} size="xl" weight="active" className="text-text-muted" />
      </span>
      <p className="text-subhead text-text">{title}</p>
      <p className="mt-xxs max-w-[46ch] text-body text-text-muted">{hint}</p>
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
