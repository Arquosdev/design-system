'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';

/*
  UN INDICATEUR DANS SA CARTE (Louis, 12/11/2026 : « pas de bande de grands chiffres
  isolés »). Un chiffre de tableau de bord ne flotte pas seul : il se pose en tête de la
  carte qu'il résume (les dépannages du mois au-dessus de leur tableau, les mesures d'une
  période au-dessus de leur graphique), en rangée, séparé de ses voisins par un filet.
  Le libellé en 12 px gris, la valeur en 20 px, une précision en 12 px ; la couleur est
  réservée à l'alerte. Choisissable (il pilote un graphique), il se souligne comme un onglet.
*/

/** La rangée d'indicateurs d'une carte : filets entre eux, retour à la ligne quand la carte rétrécit. */
export const METRIC_ROW =
  'flex flex-wrap overflow-clip [&>*]:-mt-px [&>*]:-ml-px [&>*]:min-w-[10rem] [&>*]:flex-1 [&>*]:basis-[10rem] [&>*]:border-t [&>*]:border-l [&>*]:border-border-soft';

export function MetricRow({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cn(METRIC_ROW, className)} {...props} />;
}

export interface MetricProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Ce que le chiffre mesure. */
  label: React.ReactNode;
  /** Le chiffre, déjà mis en forme (« 47 », « 1 j 6 h », « 99,59 % »). « — » quand il n'y a rien à mesurer. */
  value: React.ReactNode;
  /** Une précision : la période, la base du taux (« 17 sur 26 dépannages »). */
  caption?: React.ReactNode;
  /** `danger` : le chiffre est hors de son objectif, et seulement alors en couleur. */
  tone?: 'default' | 'danger' | 'success';
  /** Ce qu'il pilote est affiché (le graphique sous la rangée) : souligné comme un onglet. */
  selected?: boolean;
  /** Un lien ou un bouton (`Link` de l'app) : l'indicateur ouvre ce qu'il compte. */
  as?: React.ElementType;
  href?: string;
  scroll?: boolean;
}

const TONES = { default: 'text-text', danger: 'text-danger', success: 'text-success' } as const;

export function Metric({ label, value, caption, tone = 'default', selected, as: Element = 'div', className, ...props }: MetricProps) {
  const interactive = Element !== 'div';
  return (
    <Element
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex min-w-0 flex-col gap-xxs px-base py-md text-left',
        interactive && 'transition-colors hover:bg-bg-subtle focus-ring',
        selected && 'shadow-[inset_0_-2px_0_var(--color-primary)]',
        className,
      )}
      {...props}
    >
      <span className="text-caption font-medium text-text-muted">{label}</span>
      <span className={cn('text-title-large tabular-nums', TONES[tone])}>{value}</span>
      {caption ? <span className="text-caption text-text-muted">{caption}</span> : null}
    </Element>
  );
}
