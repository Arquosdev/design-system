'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

export interface NavItem {
  id: string;
  label: string;
  /**
   * Ce que contient la rubrique. Une chaîne est acceptée pour pouvoir dire
   * « … » tant qu'on ne sait pas — `0` affirmerait qu'il n'y a rien.
   */
  count?: number | string;
  disabled?: boolean;
}

export interface NavListProps {
  /**
   * Intitulé du groupe. À omettre quand ce qui précède le dit déjà — un onglet
   * « Composants » suivi d'un intitulé « COMPOSANTS » ne fait que répéter.
   */
  title?: string;
  items: readonly NavItem[];
  current?: string;
  onChoose: (id: string) => void;
  /** Rend l'intitulé cliquable, pour replier le groupe. */
  collapsible?: boolean;
  /** Ouvert au premier rendu. Sans effet si le groupe n'est pas repliable. */
  defaultOpen?: boolean;
  className?: string;
}

export function NavList({
  title,
  items,
  current,
  onChoose,
  collapsible = false,
  defaultOpen = true,
  className,
}: NavListProps) {
  const [ouvert, setOuvert] = React.useState(defaultOpen);
  // Un groupe replié qui contient la rubrique ouverte la cacherait : on le
  // laisse déplié tant qu'elle est dedans.
  const containsCurrent = items.some((i) => i.id === current);
  const expanded = !collapsible || ouvert || containsCurrent;

  const heading = (
    <span className="flex-1 text-left text-caption font-bold tracking-wide uppercase">
      {title}
    </span>
  );

  return (
    <div className={cn('shrink-0', className)}>
      {!title ? null : collapsible ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setOuvert(!expanded)}
          className="flex w-full items-center gap-sm rounded-control px-md pb-sm text-text-muted outline-none hover:text-text focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon
            role="expand"
            size="xs"
            className={cn('transition-transform duration-(--arq-duration-normal)', expanded ? 'rotate-0' : '-rotate-90')}
          />
          {heading}
          <span className="shrink-0 tabular-nums text-small">{items.length}</span>
        </button>
      ) : (
        <div className="flex px-md pb-sm text-text-muted">{heading}</div>
      )}

      <div className={cn('flex flex-col gap-xxs', !expanded && 'hidden')}>
        {items.map((item) => {
          const active = item.id === current;
          return (
            <button
              key={item.id}
              type="button"
              // `aria-current` en plus du fond teinté : la couleur seule ne dit
              // rien à un lecteur d'écran.
              aria-current={active ? 'page' : undefined}
              disabled={item.disabled}
              onClick={() => onChoose(item.id)}
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
                active
                  ? 'bg-info-bg font-semibold text-on-info-bg'
                  : 'font-medium text-text hover:bg-bg-muted',
              )}
            >
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && item.count !== '' ? (
                // Chasse fixe : sans elle les nombres dansent d'une ligne à l'autre.
                // Sur la ligne courante, le compteur prend l'encre appairée du
                // fond `infoBg` : `textMuted` y tombe à 4,47 — juste sous le
                // seuil. Le fond est sur le parent et la couleur sur l'enfant,
                // donc le contrôle de contraste ne peut pas le voir.
                <span
                  className={cn(
                    'shrink-0 tabular-nums text-small',
                    active ? 'text-on-info-bg' : 'text-text-muted',
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

