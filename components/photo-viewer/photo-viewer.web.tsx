'use client';

import * as React from 'react';
import { Dialog } from 'radix-ui';

import { cn } from '../_lib/cn';

export interface PhotoView {
  /** Ce que la photo montre — sert de légende ET de texte alternatif. */
  name: string;
  /** Absent = la photo n'existe pas ou n'est pas affichable. */
  url?: string;
  /** D'où elle vient : « Machinerie », « Schéma de mesure · A14 »… */
  zone?: string;
}

export interface PhotoViewerProps {
  photos: readonly PhotoView[];
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
  const current = photos[index];

  // Une URL qui ne charge pas retombe sur le cadre « photo indisponible ».
  // L'icône brisée du navigateur laisserait croire à une panne du module.
  const [broken, setBroken] = React.useState<Record<string, true>>({});
  const url = current?.url && !broken[current.url] ? current.url : '';

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
  const origin = React.useRef<HTMLElement | null>(null);

  if (!current) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--arq-layer-plein-ecran) bg-brand/80" />
        <Dialog.Content
          // Le titre porte le nom de la photo : c'est ce qu'un lecteur d'écran
          // doit entendre en arrivant, pas le mot « visionneuse ».
          aria-describedby={undefined}
          // Radix n'a pas encore déplacé le focus quand cet événement part :
          // `activeElement`, c'est encore la vignette cliquée.
          onOpenAutoFocus={() => {
            origin.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(e) => {
            // Couper la reprise de Radix — elle viserait un `Trigger` absent —
            // et rendre le focus nous-mêmes.
            e.preventDefault();
            origin.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') deplacer(-1);
            if (e.key === 'ArrowRight') deplacer(1);
          }}
          className={cn(
            'fixed inset-0 z-(--arq-layer-plein-ecran) flex flex-col items-center justify-center gap-base p-lg',
            'outline-none',
          )}
        >
          {/* `flex-1 min-h-0` : la photo prend toute la hauteur que la légende
              lui laisse, au lieu d'un plafond fixe. Sur une photo verticale —
              cinquante-six des cinquante-sept d'un relevé — un plafond à 70 % de
              l'écran laissait une bande vide en haut et en bas pendant que la
              photo, elle, restait petite. */}
          <div className="flex min-h-0 max-w-full flex-1 items-center gap-base">
            {nb > 1 ? (
              <Arrow direction="prec" onClick={() => deplacer(-1)} />
            ) : null}

            {url ? (
              // eslint-disable-next-line @next/next/no-img-element -- photos
              // servies par un stockage externe, hors de l'optimiseur d'images.
              <img
                src={url}
                alt={current.name}
                onError={() => setBroken((c) => ({ ...c, [url]: true }))}
                // `contain` : ne rien rogner. Une photo de plaque de charge
                // recadrée peut perdre le chiffre qu'on est venu lire.
                className="max-h-full max-w-[76vw] rounded-md object-contain"
              />
            ) : (
              // palette-brute-ok: plaque de remplacement posée sur le voile
              // sombre de la visionneuse. Aucune surface sémantique ne
              // convient — `bgMuted` disparaîtrait, `border` n'est pas un fond.
              <div className="flex h-full max-h-[500px] w-[76vw] max-w-[760px] items-center justify-center rounded-md bg-grey-200 px-lg text-center text-body text-text-muted">
                Photo indisponible — {current.name}
              </div>
            )}

            {nb > 1 ? <Arrow direction="suiv" onClick={() => deplacer(1)} /> : null}
          </div>

          <div className="max-w-[76vw] shrink-0 text-center text-text-on-dark">
            <Dialog.Title className="text-subhead font-semibold text-pretty">
              {current.name}
            </Dialog.Title>
            <p className="mt-xxs text-small opacity-75">
              {nb > 1 ? `${index + 1}/${nb}` : null}
              {nb > 1 && current.zone ? ' · ' : null}
              {current.zone}
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

function Arrow({ direction, onClick }: { direction: 'prec' | 'suiv'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prec' ? 'Photo précédente' : 'Photo suivante'}
      className={cn(
        'size-[44px] shrink-0 rounded-control bg-white/15 text-subhead text-text-on-dark',
        'outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white',
      )}
    >
      {direction === 'prec' ? '‹' : '›'}
    </button>
  );
}
