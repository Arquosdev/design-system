'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';

/**
 * Une confirmation se lit d'un œil et disparaît ; un refus doit être lu.
 * D'où deux durées, et deux façons de l'annoncer à un lecteur d'écran.
 */
export type ToastTone = 'info' | 'error';

/** Reprises du module actuel (index.html:3908) — 2,2 s et 12 s. */
const DURATIONS: Record<ToastTone, number> = { info: 2200, error: 12000 };

/**
 * Le temps de se raviser (audit design du 11/10/2026, A3-10) : cinq secondes,
 * celles de Linear et de Gmail. Un message à défaire reste plus longtemps
 * qu'une simple confirmation, sans quoi « Annuler » partirait avant d'être lu.
 */
const DUREE_ANNULABLE = 5000;

/**
 * Le geste qu'un message propose : « Annuler » le plus souvent. Il n'est pas
 * un second bouton d'action ; il défait ce qui vient d'être fait.
 */
export interface ToastAction {
  label: string;
  onAction: () => void;
}

/**
 * Au-delà, l'empilement couvre le bas de l'écran et cache ce qui vient d'être
 * corrigé. Le plus ancien s'efface.
 */
const MAX_VISIBLE = 3;

export interface Announcement {
  id: number;
  message: string;
  tone: ToastTone;
  action?: ToastAction;
}

export interface AnnounceOptions {
  tone?: ToastTone;
  /** Un geste dans le message (« Annuler ») ; il le garde cinq secondes. */
  action?: ToastAction;
  /**
   * Appelé quand le message part SANS que son action ait été prise : délai
   * écoulé ou bandeau fermé. C'est là qu'un retrait différé s'exécute.
   */
  onClose?: () => void;
}

export interface ToastContext {
  /** Un message passager en bas d'écran. */
  announce: (message: string, options?: AnnounceOptions) => void;
}

const Context = React.createContext<ToastContext | null>(null);

/**
 * Le raccourci qui donne accès aux annonces.
 *
 * Hors `ToastProvider`, il ne lève pas : un composant du design system ne doit
 * pas faire tomber l'écran parce que l'hôte n'a pas monté le fournisseur. Le
 * message part alors dans la console, où on le retrouvera.
 */
export function useToast(): ToastContext {
  const ctx = React.useContext(Context);
  return (
    ctx ?? {
      announce: (message) =>
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
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const prochain = React.useRef(0);
  /* Ce qu'il faut appeler quand un message part sans que son action ait été
     prise. Gardé hors de l'état : on l'appelle une fois, à la fermeture. */
  const fermetures = React.useRef(new Map<number, () => void>());

  const retirer = React.useCallback((id: number) => {
    const f = fermetures.current.get(id);
    fermetures.current.delete(id);
    setAnnouncements((list) => list.filter((a) => a.id !== id));
    f?.();
  }, []);

  const announce = React.useCallback(
    (message: string, options?: AnnounceOptions) => {
      const id = ++prochain.current;
      const tone = options?.tone ?? 'info';
      if (options?.onClose) fermetures.current.set(id, options.onClose);
      setAnnouncements((list) => {
        const suivante = [...list, { id, message, tone, action: options?.action }];
        /* Le plus ancien s'efface au-delà de trois : son retrait différé doit
           s'exécuter quand même, sinon il ne partirait jamais. */
        for (const vieux of suivante.slice(0, -MAX_VISIBLE)) {
          const f = fermetures.current.get(vieux.id);
          fermetures.current.delete(vieux.id);
          if (f) queueMicrotask(f);
        }
        return suivante.slice(-MAX_VISIBLE);
      });
    },
    [],
  );

  const agir = React.useCallback((a: Announcement) => {
    // L'action prise, le message part SANS sa fermeture : le geste est défait.
    fermetures.current.delete(a.id);
    setAnnouncements((list) => list.filter((x) => x.id !== a.id));
    a.action?.onAction();
  }, []);

  const value = React.useMemo(() => ({ announce }), [announce]);

  return (
    <Context.Provider value={value}>
      {/* Balayage vers le bas : le bandeau est ancré en bas, l'écarter d'un
          geste doit aller dans le sens où il sort de l'écran. */}
      <ToastPrimitive.Provider swipeDirection="down">
        {children}

        {announcements.map((a) => (
          <ToastPrimitive.Root
            key={a.id}
            duration={a.action ? DUREE_ANNULABLE : DURATIONS[a.tone]}
            // `foreground` interrompt le lecteur d'écran, `background` attend
            // qu'il ait fini. Un refus ne peut pas attendre.
            type={a.tone === 'error' ? 'foreground' : 'background'}
            onOpenChange={(ouvert) => !ouvert && retirer(a.id)}
            className={cn(
              'pointer-events-auto flex max-w-[min(640px,calc(100vw-48px))] items-start gap-md',
              'rounded-control bg-text py-sm pr-sm pl-base text-small font-medium text-text-on-dark shadow-pop',
              'data-[state=closed]:opacity-0 data-[swipe=end]:opacity-0',
              'transition-opacity duration-(--arq-duration-rapide)',
            )}
          >
            <ToastPrimitive.Title className="text-pretty">{a.message}</ToastPrimitive.Title>
            {a.action ? (
              <ToastPrimitive.Action
                altText={a.action.label}
                onClick={(e) => { e.preventDefault(); agir(a); }}
                className={cn(
                  'shrink-0 rounded-control px-xs text-small font-semibold text-text-on-dark underline-offset-2',
                  'outline-none hover:underline focus-visible:ring-2 focus-visible:ring-white',
                )}
              >
                {a.action.label}
              </ToastPrimitive.Action>
            ) : null}
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
        {/* En français, et pas « Notifications » : la zone se confondait avec la
            page Notifications du produit (Radix l'annonce « Notifications (F8) »). */}
        <ToastPrimitive.Viewport
          label="Messages ({hotkey})"
          className={cn(
            'pointer-events-none fixed bottom-lg left-1/2 z-(--arq-layer-notification) flex -translate-x-1/2',
            'flex-col-reverse items-center gap-sm outline-none',
          )}
        />
      </ToastPrimitive.Provider>
    </Context.Provider>
  );
}
