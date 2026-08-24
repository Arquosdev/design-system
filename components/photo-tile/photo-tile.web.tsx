'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';

export interface PhotoTileProps {
  nom: string;
  /** Absent = emplacement non pris. */
  url?: string;
  essentielle?: boolean;
  onOuvrir?: () => void;
  className?: string;
}

export function PhotoTile({ nom, url, essentielle = false, onOuvrir, className }: PhotoTileProps) {
  // Une image cassée retombe sur « non prise » : l'icône brisée du navigateur
  // ne dit rien d'utile, et laisse croire à une panne plutôt qu'à un manque.
  const [cassee, setCassee] = React.useState(false);
  const absente = !url || cassee;

  const vignette = absente ? (
    <div
      className={cn(
        'flex aspect-[4/3] w-full items-center justify-center rounded-md border text-caption',
        essentielle
          ? 'border-danger bg-bg text-danger'
          : 'border-border-soft bg-bg-muted text-text-subtle',
      )}
    >
      Non prise
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- photos servies par
    // un stockage externe, hors des domaines de l'optimiseur d'images.
    <img
      src={url}
      alt={nom}
      loading="lazy"
      onError={() => setCassee(true)}
      className="aspect-[4/3] w-full rounded-md border border-border-soft object-cover"
    />
  );

  const legende = <span className="mt-xxs line-clamp-2 text-caption text-text-muted">{nom}</span>;

  if (!onOuvrir || absente) {
    return (
      <figure className={cn('flex flex-col', className)}>
        {vignette}
        <figcaption className="flex flex-col">{legende}</figcaption>
      </figure>
    );
  }

  return (
    <button
      type="button"
      onClick={onOuvrir}
      aria-label={`Agrandir : ${nom}`}
      className={cn(
        'flex flex-col text-left outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      {vignette}
      {legende}
    </button>
  );
}
