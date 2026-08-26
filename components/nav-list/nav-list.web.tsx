'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

export interface NavItem {
  cle: string;
  label: string;
  /**
   * Ce que contient la rubrique. Une chaîne est acceptée pour pouvoir dire
   * « … » tant qu'on ne sait pas — `0` affirmerait qu'il n'y a rien.
   */
  compteur?: number | string;
  desactive?: boolean;
}

export interface NavListProps {
  /**
   * Intitulé du groupe. À omettre quand ce qui précède le dit déjà — un onglet
   * « Composants » suivi d'un intitulé « COMPOSANTS » ne fait que répéter.
   */
  titre?: string;
  items: readonly NavItem[];
  courant?: string;
  onChoisir: (cle: string) => void;
  /** Rend l'intitulé cliquable, pour replier le groupe. */
  repliable?: boolean;
  /** Ouvert au premier rendu. Sans effet si le groupe n'est pas repliable. */
  ouvertParDefaut?: boolean;
  className?: string;
}

export function NavList({
  titre,
  items,
  courant,
  onChoisir,
  repliable = false,
  ouvertParDefaut = true,
  className,
}: NavListProps) {
  const [ouvert, setOuvert] = React.useState(ouvertParDefaut);
  // Un groupe replié qui contient la rubrique ouverte la cacherait : on le
  // laisse déplié tant qu'elle est dedans.
  const contientCourant = items.some((i) => i.cle === courant);
  const deplie = !repliable || ouvert || contientCourant;

  const intitule = (
    <span className="flex-1 text-left text-caption font-bold tracking-wide uppercase">
      {titre}
    </span>
  );

  return (
    <div className={cn('shrink-0', className)}>
      {!titre ? null : repliable ? (
        <button
          type="button"
          aria-expanded={deplie}
          onClick={() => setOuvert(!deplie)}
          className="flex w-full items-center gap-sm rounded-control px-md pb-sm text-text-muted outline-none hover:text-text focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon
            role="deplier"
            size="xs"
            className={cn('transition-transform duration-(--arq-duration-normal)', deplie ? 'rotate-0' : '-rotate-90')}
          />
          {intitule}
          <span className="shrink-0 tabular-nums text-small">{items.length}</span>
        </button>
      ) : (
        <div className="flex px-md pb-sm text-text-muted">{intitule}</div>
      )}

      <div className={cn('flex flex-col gap-xxs', !deplie && 'hidden')}>
        {items.map((item) => {
          const actif = item.cle === courant;
          return (
            <button
              key={item.cle}
              type="button"
              // `aria-current` en plus du fond teinté : la couleur seule ne dit
              // rien à un lecteur d'écran.
              aria-current={actif ? 'page' : undefined}
              disabled={item.desactive}
              onClick={() => onChoisir(item.cle)}
              className={cn(
                /*
                  `px-md` et non `px-xs` : le fond teinté de l'entrée courante
                  est une pastille, et une pastille qui touche ses mots se lit
                  comme un défaut d'alignement. Quatre pixels ne suffisaient ni à
                  gauche du libellé ni à droite du compteur.

                  Les intitulés de groupe prennent le même retrait, sinon leur
                  texte ne tombe plus sur celui des entrées.
                */
                'flex w-full items-center gap-sm rounded-control px-md py-sm text-left text-small outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary',
                'disabled:pointer-events-none disabled:opacity-50',
                /*
                  Une entrée au repos est en `medium`, pas en normal. C'est un
                  menu, pas du texte courant : ses mots se balaient du regard, ils
                  ne se lisent pas en phrase. Le demi-échelon leur donne de quoi
                  tenir contre les grands titres de la page.

                  L'entrée courante garde `semibold` : un échelon la sépare
                  toujours des autres, et c'est ce contraste — pas la graisse en
                  soi — qui dit où l'on est.
                */
                actif
                  ? 'bg-info-bg font-semibold text-on-info-bg'
                  : 'font-medium text-text hover:bg-bg-muted',
              )}
            >
              <span className="flex-1">{item.label}</span>
              {item.compteur !== undefined && item.compteur !== '' ? (
                // Chasse fixe : sans elle les nombres dansent d'une ligne à l'autre.
                // Sur la ligne courante, le compteur prend l'encre appairée du
                // fond `infoBg` : `textMuted` y tombe à 4,47 — juste sous le
                // seuil. Le fond est sur le parent et la couleur sur l'enfant,
                // donc le contrôle de contraste ne peut pas le voir.
                <span
                  className={cn(
                    'shrink-0 tabular-nums text-small',
                    actif ? 'text-on-info-bg' : 'text-text-muted',
                  )}
                >
                  {item.compteur}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

