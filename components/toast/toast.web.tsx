'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';

/**
 * Une confirmation se lit d'un œil et disparaît ; un refus doit être lu.
 * D'où deux durées, et deux façons de l'annoncer à un lecteur d'écran.
 */
export type ToastTon = 'info' | 'echec';

/** Reprises du module actuel (index.html:3908) — 2,2 s et 12 s. */
const DUREES: Record<ToastTon, number> = { info: 2200, echec: 12000 };

/**
 * Au-delà, l'empilement couvre le bas de l'écran et cache ce qui vient d'être
 * corrigé. Le plus ancien s'efface.
 */
const MAX_VISIBLES = 3;

export interface Annonce {
  id: number;
  message: string;
  ton: ToastTon;
}

export interface ToastContexte {
  /** Un message passager en bas d'écran. */
  annoncer: (message: string, options?: { ton?: ToastTon }) => void;
}

const Contexte = React.createContext<ToastContexte | null>(null);

/**
 * Le raccourci qui donne accès aux annonces.
 *
 * Hors `ToastProvider`, il ne lève pas : un composant du design system ne doit
 * pas faire tomber l'écran parce que l'hôte n'a pas monté le fournisseur. Le
 * message part alors dans la console, où on le retrouvera.
 */
export function useToast(): ToastContexte {
  const ctx = React.useContext(Contexte);
  return (
    ctx ?? {
      annoncer: (message) =>
        console.warn('[design-system] Toast hors ToastProvider :', message),
    }
  );
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * À monter une fois, autour de l'écran. Il porte le contexte ET la zone
 * d'affichage : deux composants séparés laisseraient monter l'un sans l'autre,
 * et les messages partiraient dans le vide sans que rien ne le signale.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [annonces, setAnnonces] = React.useState<Annonce[]>([]);
  const prochain = React.useRef(0);

  const annoncer = React.useCallback(
    (message: string, options?: { ton?: ToastTon }) => {
      const id = ++prochain.current;
      const ton = options?.ton ?? 'info';
      setAnnonces((liste) => [...liste, { id, message, ton }].slice(-MAX_VISIBLES));
    },
    [],
  );

  const retirer = React.useCallback((id: number) => {
    setAnnonces((liste) => liste.filter((a) => a.id !== id));
  }, []);

  const valeur = React.useMemo(() => ({ annoncer }), [annoncer]);

  return (
    <Contexte.Provider value={valeur}>
      {/* Balayage vers le bas : le bandeau est ancré en bas, l'écarter d'un
          geste doit aller dans le sens où il sort de l'écran. */}
      <ToastPrimitive.Provider swipeDirection="down">
        {children}

        {annonces.map((a) => (
          <ToastPrimitive.Root
            key={a.id}
            duration={DUREES[a.ton]}
            // `foreground` interrompt le lecteur d'écran, `background` attend
            // qu'il ait fini. Un refus ne peut pas attendre.
            type={a.ton === 'echec' ? 'foreground' : 'background'}
            onOpenChange={(ouvert) => !ouvert && retirer(a.id)}
            className={cn(
              'pointer-events-auto flex max-w-[min(640px,calc(100vw-48px))] items-start gap-md',
              'rounded-control bg-text py-sm pr-sm pl-base text-small font-medium text-text-on-dark shadow-pop',
              'data-[state=closed]:opacity-0 data-[swipe=end]:opacity-0',
              'transition-opacity duration-150',
            )}
          >
            <ToastPrimitive.Title className="text-pretty">{a.message}</ToastPrimitive.Title>
            <ToastPrimitive.Close
              aria-label="Masquer ce message"
              title="Masquer ce message"
              className={cn(
                'size-[22px] shrink-0 rounded-control bg-white/15 text-caption leading-none',
                'outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white',
              )}
            >
              ✕
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}

        {/* `pointer-events-none` sur la zone, rétabli sur chaque bandeau : sinon
            une bande invisible au bas de l'écran avalerait les clics. */}
        <ToastPrimitive.Viewport
          className={cn(
            'pointer-events-none fixed bottom-lg left-1/2 z-[70] flex -translate-x-1/2',
            'flex-col-reverse items-center gap-sm outline-none',
          )}
        />
      </ToastPrimitive.Provider>
    </Contexte.Provider>
  );
}
