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

/**
 * Le rapport de la vignette : **portrait**, et non le 4/3 d'usage.
 *
 * Mesuré le 25/08/2026 sur 125 photos de relevé prises au hasard dans la base :
 * 96 sont en portrait — rapport 0,77 en médiane, c'est-à-dire du 3/4 — et 29 en
 * paysage. Une photo de relevé se prend au téléphone, tenu droit, devant une
 * porte ou une armoire : la verticale est la règle.
 *
 * Une vignette 4/3 ne montrait donc de la plupart des photos que la bande
 * centrale : 42 % de la hauteur passait à la trappe, coupant le haut d'une porte
 * palière et le bas d'une armoire de manœuvre. On retourne le cadre.
 */
const RAPPORT = 'aspect-[3/4]';

export function PhotoTile({ nom, url, essentielle = false, onOuvrir, className }: PhotoTileProps) {
  // Une image cassée retombe sur « non prise » : l'icône brisée du navigateur
  // ne dit rien d'utile, et laisse croire à une panne plutôt qu'à un manque.
  const [cassee, setCassee] = React.useState(false);
  /*
    Le sens de la photo, lu à son chargement.

    Une photo dans le sens du cadre se recadre (`cover`) : sur du 0,77 dans du
    0,75, on rogne trois pour cent, personne ne le voit. Une photo en travers se
    contient (`contain`) : la recadrer reviendrait à n'en montrer qu'un tiers,
    et une capture d'écran ainsi réduite ne se reconnaît plus.

    Faux avant le chargement : on parie sur le cas majoritaire, et les trois
    quarts des vignettes ne changent donc jamais d'avis après coup.
  */
  const [enTravers, setEnTravers] = React.useState(false);
  const absente = !url || cassee;

  const vignette = absente ? (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded-md border text-caption',
        RAPPORT,
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
      onLoad={(e) => {
        const img = e.currentTarget;
        setEnTravers(img.naturalWidth > img.naturalHeight);
      }}
      className={cn(
        'w-full rounded-md border border-border-soft',
        RAPPORT,
        // Le fond ne se voit que sous une photo contenue, dans les deux bandes
        // que le cadre laisse libres. Sans lui, elles seraient blanches et la
        // vignette paraîtrait plus petite qu'elle n'est.
        enTravers ? 'bg-bg-muted object-contain' : 'object-cover',
      )}
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
