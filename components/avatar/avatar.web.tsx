import * as React from 'react';

import { cn } from '../_lib/cn';

export interface AvatarProps extends React.ComponentProps<'span'> {
  /** Une ou deux lettres. Au-delà, elles ne se lisent plus dans un rond. */
  initials?: string;
  photo?: string;
  /** Le nom de la personne — pour que la pastille ne soit pas muette. */
  label?: string;
}

/**
 * La pastille d'une personne : sa photo, ou ses initiales.
 *
 * Les initiales sont **toujours rendues, dessous**. La photo se pose par-dessus :
 * si elle ne charge pas — lien expiré, hors ligne — les initiales restent
 * visibles au lieu d'une bulle vide.
 */
export function Avatar({ initials, photo, label, className, ...props }: AvatarProps) {
  const [broken, setBroken] = React.useState(false);
  const visible = photo && !broken;

  return (
    <span
      role="img"
      aria-label={label ?? initials ?? 'Utilisateur'}
      className={cn(
        'relative inline-flex size-[44px] shrink-0 items-center justify-center overflow-hidden',
        'rounded-full bg-info-bg text-body font-semibold text-primary',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{(initials ?? '').slice(0, 2).toUpperCase()}</span>
      {visible ? (
        // eslint-disable-next-line @next/next/no-img-element -- photos servies
        // par le stockage Bubble, hors du domaine ; l'optimiseur ne s'applique pas.
        <img
          src={photo}
          alt=""
          onError={() => setBroken(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </span>
  );
}
