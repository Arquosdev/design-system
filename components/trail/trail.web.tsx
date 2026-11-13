'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

/** Un cran du fil : ce qu'on lit, et où il mène. */
export interface TrailStep {
  label: string;
  href: string;
}

export interface TrailProps {
  /** Ce qui précède, dans l'ordre de lecture. Chaque cran est un lien. */
  steps: TrailStep[];
  /** Ce qu'on regarde, au bout du fil. Jamais un lien : il mènerait ici. */
  current: string;
  /**
   * Ce que le fil DIT, pour un lecteur d'écran.
   *
   * Deux formulations vivent dans le produit, et elles ne se valent pas : une
   * page dit sa STRUCTURE (« Fil d'Ariane »), une fiche dit le chemin
   * PARCOURU, qui est différent pour deux personnes qui regardent la même
   * fiche. Le dessin est le même, la phrase ne l'est pas.
   */
  label?: string;
  /**
   * Comment un cran se rend. Défaut : une ancre.
   *
   * Une application à routeur passe le sien (`next/link`) pour garder la
   * navigation côté client ; le design system, lui, n'en connaît aucun.
   */
  link?: React.ElementType;
  className?: string;
}

/**
 * Le fil d'Ariane : d'où l'on vient, et ce qu'on regarde au bout.
 *
 * **Un seul dessin dans tout le produit, depuis le 13/11/2026** (Louis : il y
 * en avait deux). Une page à `PageHeader` montrait son parent en BLEU, une
 * fiche le montrait en gris : deux fils pour une seule notion, et le bleu
 * tirait l'oeil vers un lien de retour qu'on ne suit presque jamais. C'est le
 * gris discret qui a été retenu, celui des fiches.
 *
 * Il ne décide rien : ni d'où viennent les crans, ni s'il faut se replier sur
 * la structure quand aucun parcours n'existe. Cela appartient à l'application,
 * qui seule sait ce qu'elle a traversé.
 */
export function Trail({
  steps,
  current,
  label = 'Fil d’Ariane',
  link: Lien = 'a',
  className,
}: TrailProps) {
  return (
    <nav
      aria-label={label}
      /*
        Une hauteur PLANCHER, pas une hauteur fixe : le fil mesure alors la
        même chose sur une liste et sur une fiche — c'est ce qu'on lit en
        passant de l'une à l'autre — sans rogner le second rang le jour où il
        se replie sur un écran étroit.
      */
      className={cn('flex min-h-5 flex-wrap items-center gap-xs text-caption text-text-muted', className)}
    >
      {/*
        Le RANG entre dans la clé : une même adresse peut revenir dans un fil
        de parcours (une fiche rouverte après un rechargement), et deux clés
        égales font crier React.
      */}
      {steps.map((e, rang) => (
        <span key={`${rang}-${e.href}`} className="flex items-center gap-xs">
          <Lien href={e.href} className="rounded-control font-medium text-text hover:underline focus-ring">
            {e.label}
          </Lien>
          <Icon role="next" size="sm" className="text-text-subtle" aria-hidden />
        </span>
      ))}
      <span className="truncate font-medium text-text" aria-current="page">{current}</span>
    </nav>
  );
}
