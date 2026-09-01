'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

export interface DrawerProps {
  /** Ce que le tiroir règle : « Filtres », « Colonnes ». */
  title: string;
  /** Une ligne sous le titre : ce qui est actif, ce qui est affiché. */
  detail?: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Le bouton discret, à gauche : « Tout réinitialiser », « Par défaut ». */
  secondary?: React.ReactNode;
  /** L'action attendue, à droite : « Appliquer ». */
  primary?: React.ReactNode;
  className?: string;
}

/**
 * Un panneau qui s'ouvre sur le côté pour régler ce qu'on regarde.
 *
 * **Il ne se pose pas sur la page mais sur la zone de contenu**, dont il prend
 * toute la hauteur : la navigation reste visible, et on n'a pas l'impression
 * d'avoir quitté l'écran. Son parent doit donc être `relative`.
 *
 * **Le voile ferme, il ne valide pas.** On l'emploie là où l'on manipule
 * beaucoup — des filtres, des colonnes — et où un clic à côté ne doit jamais
 * écrire quoi que ce soit.
 *
 * **Le pied est toujours là**, même quand le corps défile : ce qui applique le
 * réglage ne doit pas se chercher.
 */
export function Drawer({
  title,
  detail,
  onClose,
  children,
  secondary,
  primary,
  className,
}: DrawerProps) {
  return (
    <>
      <button
        type="button"
        aria-label={`Fermer ${title.toLowerCase()}`}
        onClick={onClose}
        className="absolute inset-0 z-(--arq-layer-flottant) cursor-default bg-brand/35"
      />
      <div
        role="dialog"
        aria-label={title}
        className={cn(
          'absolute inset-y-0 right-0 z-(--arq-layer-flottant) flex w-[460px] flex-col',
          'border-l border-border-soft bg-bg shadow-pop',
          className,
        )}
      >
        <div className="flex shrink-0 items-center gap-md border-b border-border-soft px-lg py-base">
          <div className="min-w-0 flex-1">
            <div className="text-body-large font-bold">{title}</div>
            {detail && <div className="mt-[2px] truncate text-small text-text-muted">{detail}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-(--arq-control-sm) shrink-0 place-items-center rounded-control bg-bg-muted text-text-muted hover:text-text"
          >
            <Icon role="close" className="size-3.5" aria-hidden />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-lg overflow-y-auto px-lg py-base">
          {children}
        </div>

        {(secondary || primary) && (
          <div className="flex shrink-0 items-center justify-between gap-md border-t border-border-soft px-lg py-md">
            <span>{secondary}</span>
            <span>{primary}</span>
          </div>
        )}
      </div>
    </>
  );
}

/** Un groupe de réglages dans un tiroir, avec son intitulé. */
export function DrawerSection({
  title,
  detail,
  separated,
  children,
}: {
  title: string;
  detail?: string;
  /** Un trait au-dessus. À poser dès la deuxième section. */
  separated?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[10px]',
        separated && 'border-t border-border-soft pt-base',
      )}
    >
      <div className="flex items-baseline gap-sm">
        <span className="text-caption font-bold tracking-[.5px] uppercase text-text-muted">
          {title}
        </span>
        {detail && <span className="text-caption text-text-muted">{detail}</span>}
      </div>
      {children}
    </div>
  );
}
