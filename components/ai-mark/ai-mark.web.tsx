import * as React from 'react';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';
import { ThinkingDots } from '../thinking-dots/thinking-dots.web';

/*
  La MARQUE de l'assistant d'Arquos : la constellation `aiAssist`, en blanc, sur
  le dégradé du marine au bleu de la marque. C'est le dégradé que Louis a choisi
  pour le bouton de l'assistant au pied du rail (08/10/2026, parmi sept essais) :
  la marque le reprend pour que l'assistant se reconnaisse partout où il parle —
  l'en-tête de son panneau, son accueil, le début de chacune de ses réponses.

  Quand l'assistant travaille, la constellation s'anime (`thinking`) : la marque
  dit « c'est moi, et je réfléchis » à la place où sa réponse va s'écrire
  (refonte du panneau, 10/10/2026 ; référence Claude, dont l'étincelle tourne
  au même endroit).
*/

const TAILLES = {
  sm: { boite: 'size-[20px]', icone: 'xs' },
  md: { boite: 'size-[28px]', icone: 'sm' },
  lg: { boite: 'size-[40px]', icone: 'lg' },
} as const;

export interface AiMarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `sm` (20) dans une ligne de texte, `md` (28) en tête d'une réponse, `lg` (40) sur un accueil. */
  size?: keyof typeof TAILLES;
  /** L'assistant travaille : la constellation s'anime. */
  thinking?: boolean;
}

export function AiMark({ size = 'md', thinking = false, className, ...props }: AiMarkProps) {
  const t = TAILLES[size];
  return (
    <span
      data-slot="ai-mark"
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-control bg-linear-135 from-primary-dark to-primary text-primary-foreground',
        t.boite, className,
      )}
      {...props}
    >
      {thinking ? <ThinkingDots size={t.icone} /> : <Icon role="aiAssist" size={t.icone} weight="active" />}
    </span>
  );
}
