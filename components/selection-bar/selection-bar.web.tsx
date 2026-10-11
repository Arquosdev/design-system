'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

import { spacing } from '../../src/spacing';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

/**
 * Ce qu'on peut faire de ce qui est coché.
 *
 * **Elle est dans le flux, pas flottante.** Une barre flottante masque la
 * dernière ligne du tableau — souvent celle qu'on vient de cocher.
 */
export function SelectionBar({
  text,
  onClear,
  children,
  className,
}: {
  /** Le décompte, en clair : « 12 équipements sélectionnés ». */
  text: string;
  onClear: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [ouvert, setOuvert] = React.useState(false);
  const barre = React.useRef<HTMLDivElement>(null);
  const [place, setPlace] = React.useState<{ gauche: number; largeur: number; bas: number } | null>(null);
  const basculer = () => {
    const r = barre.current?.getBoundingClientRect();
    if (r) setPlace({ gauche: r.left, largeur: r.width, bas: window.innerHeight - r.top + spacing.sm });
    setOuvert((o) => !o);
  };
  React.useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: KeyboardEvent) => { if (e.key === 'Escape') setOuvert(false); };
    document.addEventListener('keydown', fermer);
    return () => document.removeEventListener('keydown', fermer);
  }, [ouvert]);
  return (
    <div
      ref={barre}
      role="region"
      aria-label="Actions sur la sélection"
      className={cn(
        // Variante design-eu : une barre FLOTTANTE, compacte et centrée, à la
        // manière de Linear et Mercury, au lieu d'un bandeau marine pleine
        // largeur. Elle flotte, donc elle garde un arrondi et une ombre.
        //
        // **Sombre, comme l'infobulle du rail** (Louis, 09/10/2026) : l'encre
        // en fond et le fond en encre. Blanche, elle se confondait avec le
        // tableau qu'elle survole ; sombre, ce qui flotte au-dessus de la page
        // parle d'une seule voix, et la barre ressort.
        'absolute bottom-5xl left-1/2 z-(--arq-layer-barre) flex max-w-[calc(100%-48px)] -translate-x-1/2 items-center gap-sm overflow-x-auto',
        'rounded-block bg-text py-xs pr-xs pl-base text-bg shadow-pop',
        className,
      )}
    >
      <span className="shrink-0 text-small font-semibold whitespace-nowrap text-bg">
        {text}
      </span>
      <span className="mx-xxs h-5 w-px shrink-0 bg-bg/20" aria-hidden />
      {/* Au-delà de 640 px, les actions dans la barre. */}
      <div className="hidden sm:contents">{children}</div>
      {/*
        **Sur un téléphone, un bouton « Actions »** qui les ouvre en colonne
        au-dessus de la barre (audit A1-10) : en ligne, elles sortaient de
        l'écran et rien ne disait qu'on pouvait les faire glisser.
      */}
      <div className="relative sm:hidden">
        <button
          type="button"
          aria-expanded={ouvert}
          onClick={basculer}
          className="flex h-(--arq-control-sm) shrink-0 items-center gap-xs rounded-control px-md text-small font-semibold whitespace-nowrap text-bg hover:bg-bg/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
        >
          Actions
          <Icon role={ouvert ? 'collapse' : 'expand'} className="size-4" aria-hidden />
        </button>
        {ouvert && place
          ? createPortal(
              // Par un portail : la barre est décalée par une transformation et
              // coupe ce qui dépasse. Le panneau se cale sur sa position réelle.
              <div
                className="fixed z-(--arq-layer-flottant) flex flex-col items-stretch gap-xxs rounded-block bg-text p-xs shadow-pop [&>button]:text-left"
                style={{ left: place.gauche, width: place.largeur, bottom: place.bas }}
              >
                {children}
              </div>,
              document.body,
            )
          : null}
      </div>
      <button
        type="button"
        onClick={onClear}
        aria-label="Effacer la sélection"
        className="ml-xs grid size-(--arq-control-sm) shrink-0 place-items-center rounded-control text-bg/70 hover:bg-bg/10 hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
      >
        <Icon role="close" className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export interface SelectionActionProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  children: React.ReactNode;
  /** L'action attendue. Une seule par barre, sinon aucune ne se détache. */
  primary?: boolean;
}

export const SelectionAction = React.forwardRef<HTMLButtonElement, SelectionActionProps>(
  function SelectionAction({ children, primary, className, ...reste }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'h-(--arq-control-sm) shrink-0 rounded-control px-md text-small font-semibold whitespace-nowrap',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg',
          'disabled:opacity-50',
          primary
            ? 'bg-primary text-text-on-dark hover:bg-primary-dark'
            : 'text-bg hover:bg-bg/10',
          className,
        )}
        {...reste}
      >
        {children}
      </button>
    );
  },
);
