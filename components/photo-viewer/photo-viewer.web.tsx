'use client';

import * as React from 'react';
import { Dialog } from 'radix-ui';

import { cn } from '../_lib/cn';

export interface PhotoVue {
  /** Ce que la photo montre — sert de légende ET de texte alternatif. */
  nom: string;
  /** Absent = la photo n'existe pas ou n'est pas affichable. */
  url?: string;
  /** D'où elle vient : « Machinerie », « Schéma de mesure · A14 »… */
  zone?: string;
}

export interface PhotoViewerProps {
  photos: readonly PhotoVue[];
  /** L'indice affiché. Piloté par l'appelant, pour qu'il sache où on en est. */
  index: number;
  onIndex: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * La photo en grand, par-dessus la fiche.
 *
 * Construite sur la primitive Radix `Dialog` — la même base que le composant
 * Dialog de shadcn : elle apporte le piège à focus, la fermeture par Échap et
 * le masquage du reste de la page aux lecteurs d'écran, qu'on réécrirait mal.
 */
export function PhotoViewer({ photos, index, onIndex, open, onOpenChange }: PhotoViewerProps) {
  const nb = photos.length;
  const courante = photos[index];

  // Une URL qui ne charge pas retombe sur le cadre « photo indisponible ».
  // L'icône brisée du navigateur laisserait croire à une panne du module.
  const [cassees, setCassees] = React.useState<Record<string, true>>({});
  const url = courante?.url && !cassees[courante.url] ? courante.url : '';

  const deplacer = React.useCallback(
    (d: number) => nb > 1 && onIndex((index + d + nb) % nb),
    [index, nb, onIndex],
  );

  /**
   * La vignette d'où l'on vient, pour lui rendre le focus.
   *
   * Radix rend le focus à son `Dialog.Trigger` — et la visionneuse n'en a pas :
   * elle s'ouvre depuis n'importe laquelle de sept vignettes. Sans ça, le focus
   * retombe sur le corps de la page et la tabulation repart du rail.
   */
  const origine = React.useRef<HTMLElement | null>(null);

  if (!courante) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-brand/80" />
        <Dialog.Content
          // Le titre porte le nom de la photo : c'est ce qu'un lecteur d'écran
          // doit entendre en arrivant, pas le mot « visionneuse ».
          aria-describedby={undefined}
          // Radix n'a pas encore déplacé le focus quand cet événement part :
          // `activeElement`, c'est encore la vignette cliquée.
          onOpenAutoFocus={() => {
            origine.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(e) => {
            // Couper la reprise de Radix — elle viserait un `Trigger` absent —
            // et rendre le focus nous-mêmes.
            e.preventDefault();
            origine.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') deplacer(-1);
            if (e.key === 'ArrowRight') deplacer(1);
          }}
          className={cn(
            'fixed inset-0 z-[60] flex flex-col items-center justify-center gap-base p-lg',
            'outline-none',
          )}
        >
          <div className="flex max-w-full items-center gap-base">
            {nb > 1 ? (
              <Fleche sens="prec" onClick={() => deplacer(-1)} />
            ) : null}

            {url ? (
              // eslint-disable-next-line @next/next/no-img-element -- photos
              // servies par un stockage externe, hors de l'optimiseur d'images.
              <img
                src={url}
                alt={courante.nom}
                onError={() => setCassees((c) => ({ ...c, [url]: true }))}
                // `contain` : ne rien rogner. Une photo de plaque de charge
                // recadrée peut perdre le chiffre qu'on est venu lire.
                className="max-h-[70vh] max-w-[76vw] rounded-md object-contain"
              />
            ) : (
              <div className="flex h-[70vh] max-h-[500px] w-[76vw] max-w-[760px] items-center justify-center rounded-md bg-grey-200 px-lg text-center text-body text-text-muted">
                Photo indisponible — {courante.nom}
              </div>
            )}

            {nb > 1 ? <Fleche sens="suiv" onClick={() => deplacer(1)} /> : null}
          </div>

          <div className="max-w-[76vw] text-center text-text-on-dark">
            <Dialog.Title className="text-subhead font-semibold text-pretty">
              {courante.nom}
            </Dialog.Title>
            <p className="mt-xxs text-small opacity-75">
              {nb > 1 ? `${index + 1}/${nb}` : null}
              {nb > 1 && courante.zone ? ' · ' : null}
              {courante.zone}
            </p>
          </div>

          <Dialog.Close
            aria-label="Fermer"
            className={cn(
              'absolute top-base right-lg size-[36px] rounded-control bg-white/15 text-body text-text-on-dark',
              'outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white',
            )}
          >
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Fleche({ sens, onClick }: { sens: 'prec' | 'suiv'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={sens === 'prec' ? 'Photo précédente' : 'Photo suivante'}
      className={cn(
        'size-[44px] shrink-0 rounded-control bg-white/15 text-subhead text-text-on-dark',
        'outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white',
      )}
    >
      {sens === 'prec' ? '‹' : '›'}
    </button>
  );
}
