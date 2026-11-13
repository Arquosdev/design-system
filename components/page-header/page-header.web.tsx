'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { Trail } from '../trail/trail.web';

export interface PageHeaderProps {
  /** Le nom de l'écran. Pluriel pour une liste, singulier pour une fiche. */
  title: string;
  /**
   * D'où l'on vient. Sur une fiche, c'est la liste dont elle sort.
   *
   * Sans lui, on arrive sur un enregistrement sans savoir comment revenir —
   * et le bouton du navigateur ne suffit pas : on peut arriver là par un lien.
   */
  parent?: { label: string; href: string };
  /** Ce qu'on regarde, au bout du fil. Défaut : le titre. */
  current?: string;
  /**
   * IGNORÉ depuis l'essai « fiche en cartes » (Louis, 12/11/2026) : le total
   * d'une liste quitte le titre et passe dans son pied (`TableFooter`). Gardé
   * pour ne pas casser les appelants ; il ne s'affiche plus.
   * @deprecated
   */
  count?: string | number;
  /** Ce qui s'aligne à droite : une action sur l'écran entier. */
  actions?: React.ReactNode;
  /**
   * Le statut d'une fiche, à côté de son titre (`StatusBadge`). Stripe le pose
   * là : on sait où en est l'objet sans ouvrir une rubrique.
   */
  status?: React.ReactNode;
  /** Le chiffre qui le résume, après le statut : le montant TTC d'un devis, le prix annuel d'un contrat. */
  figure?: React.ReactNode;
  /**
   * La largeur de sa ligne, celle du `PageBody` qui le suit (12/10/2026) : sur
   * une page sans rail, la colonne se centre et le titre s'aligne sur elle. Le
   * filet du bas traverse toujours l'écran. Défaut `full` : la largeur de la page.
   */
  width?: 'page' | 'reading' | 'full';
  className?: string;
}

/**
 * LES ICÔNES DES BOUTONS D'EN-TÊTE (Louis, 12/11/2026, « Charte de design ») : deux seulement,
 * le « + » d'une création (`add`) et le chevron d'un bouton qui ouvre un menu (`expand`,
 * `collapse`) ; la roue d'un bouton qui travaille reste. Toute autre icône d'un bouton À
 * TEXTE est retirée ici, d'un coup, plutôt que dans chaque appelant ; un bouton d'icône
 * seule (`IconButton`, `Button size="icon"`) garde la sienne, puisqu'il n'a qu'elle.
 */
/**
 * LE RYTHME VERTICAL D'UNE TÊTE DE PAGE, déclaré une seule fois (Louis,
 * 13/11/2026).
 *
 * **Ce que ça répare.** Le fil d'Ariane et le nom ne tombaient pas à la même
 * hauteur selon le type de page : sur une page à `PageHeader`, le fil
 * commençait à 4 px du haut et le nom à 32 ; sur une fiche, à 20 et à 56. Seize
 * pixels d'écart sur toute la tête de page, qu'on lit en passant de l'une à
 * l'autre. Les tailles, elles, concordaient déjà.
 *
 * Les cotes sont celles de la fiche, voulues par Thomas le 04/11/2026 : vingt
 * pixels en haut, douze entre le fil et le nom, seize en bas — « ça respire pas
 * trop ». Les deux en-têtes les lisent ici, et aucun consommateur ne les
 * recopie : une cote recopiée vieillit en silence.
 *
 * `--arq-bandeau-tete` (60 px) n'est pas défait : une page SANS fil d'Ariane
 * garde son bandeau de 60, contenu centré dedans, et son filet tombe donc
 * toujours au même pixel que celui du nom de l'agence. Le fil, lui, fait
 * grandir la bande — c'est ce que la fiche de ce composant appelle « un
 * plancher, pas un plafond ».
 */
export const PAGE_HEAD = {
  /** La bande : 20 px au-dessus, 16 px au-dessous. */
  bande: 'pt-lg pb-base',
  /** L'espace entre le fil d'Ariane et le nom : 12 px. */
  ecart: 'mt-md',
} as const;

export const HEADER_ACTIONS =
  '[&_[data-arq=button]:not([data-size=icon])_svg[data-role]:not([data-role=add]):not([data-role=expand]):not([data-role=collapse]):not([data-role=loading])]:hidden';

/**
 * L'en-tête d'un écran : d'où l'on vient, ce qu'on regarde, ce qu'on peut faire.
 *
 * Il ne défile pas avec le contenu — il dit où l'on est, et cette information
 * ne doit pas disparaître au premier coup de molette.
 */
export function PageHeader({
  title,
  parent,
  current,
  count,
  actions,
  status,
  figure,
  width = 'full',
  className,
}: PageHeaderProps) {
  const borne = width !== 'full';
  return (
    <div
      /*
        LA HAUTEUR DU BANDEAU DE TÊTE, déclarée une fois (`--arq-bandeau-tete`, Louis,
        13/11/2026) : le filet de cet en-tête et celui du nom de l'agence, dans la barre
        latérale, tombent alors au même pixel. Ils se rejoignent à la verticale de la barre,
        et cinq pixels et demi d'écart s'y voyaient. Le contenu se centre dedans plutôt que de
        s'y poser par ses marges : les deux bandeaux n'ont pas le même contenu, donc le même
        rembourrage ne donne pas la même hauteur. Un contenu plus haut que le jeton (un fil
        d'Ariane) l'emporte, et le bandeau grandit : c'est un plancher, pas un plafond.
      */
      className={cn(
        'flex min-h-(--arq-bandeau-tete) shrink-0 flex-col',
        /*
          AVEC un fil d'Ariane, la bande prend le rythme commun aux deux
          en-têtes (`PAGE_HEAD`) : le fil et le nom tombent alors exactement où
          ils tombent sur une fiche. SANS fil, elle garde le bandeau de 60 px et
          centre son contenu dedans : c'est ce qui fait tomber son filet au même
          pixel que celui du nom de l'agence, dans la barre latérale.

          **Et une bande qui porte un fil n'a PAS de filet** : cent pixels de
          tête ne tiennent pas dans un bandeau de soixante, donc son trait
          tomberait quarante pixels sous celui de la barre latérale, qui est
          juste à sa gauche. Elle se fond alors dans ce qui suit, comme l'en-tête
          d'une fiche — c'est ce que les pages de paramètres faisaient déjà à la
          main (`border-b-0`).
        */
        parent ? PAGE_HEAD.bande : 'justify-center border-b border-border-soft py-xs',
        !borne && 'px-base sm:px-xl',
        className,
      )}
      data-compte={count ?? undefined}
    >
      {/* Bornée, la ligne du titre garde la largeur de la colonne, ancrée à gauche comme elle (13/10/2026). */}
      <div className={borne ? cn('w-full px-base sm:px-xl', width === 'page' ? 'max-w-page' : 'max-w-reading') : 'contents'}>
      {/*
        UN SEUL FIL D'ARIANE DANS LE PRODUIT (Louis, 13/11/2026). Celui-ci
        dessinait son parent en BLEU et son rang en 14 px, l'en-tête d'une
        fiche le dessinait en gris et en 12 : deux fils pour une seule notion,
        vus l'un après l'autre en passant d'un écran à l'autre. Le dessin des
        fiches l'emporte — « le discret, qui ne tire pas l'oeil » — et il vit
        maintenant dans `Trail`, que les deux en-têtes posent.
      */}
      {parent && <Trail steps={[parent]} current={current ?? title} />}
      {/*
        La ligne du titre a une hauteur MINIMALE, celle d'un bouton.

        Sans elle, l'en-tête mesurait 65 pixels sur une liste qui porte un
        bouton de création et 55 sur une liste qui n'en a pas : on passait de
        l'une à l'autre et le titre sautait de six pixels. Deux écrans qui font
        la même chose ne doivent pas se dessiner différemment selon ce qu'ils
        ont à offrir.

        La hauteur vient de `--arq-control-md`, la référence de `src/control.ts` :
        c'est exactement celle d'un `Button` en taille normale, et c'est ce que
        cette ligne doit valoir. Le commentaire disait encore, jusqu'au
        01/09/2026, que « le design system n'a pas de token de hauteur de
        contrôle » — il en a un depuis, et quatre composants le lisent.
      */}
      {/*
        Sur un écran étroit, les actions PASSENT À LA LIGNE sous le titre, et
        entre elles. Sans cela, une liste qui porte deux boutons en plus de sa
        création les poussait hors de l'écran à 375 pixels : vu le 07/10/2026
        sur la liste Factures, « Journal des ventes » et « Configuration »
        sortaient à droite. Les envelopper chez l'appelant n'y faisait rien,
        la ligne du titre ne se repliait pas.
      */}
      {/*
        Au-delà d'un téléphone, la ligne NE SE REPLIE PLUS : le titre se tronque
        (deux lignes au plus) et les actions restent à droite, à hauteur
        constante (audit design du 11/10/2026, A2-10 : sur un appel au titre
        long, les boutons passaient sous le titre, et sur une visite à droite).
      */}
      <div className={cn('flex min-h-(--arq-control-md) flex-wrap items-center gap-sm sm:flex-nowrap', parent && PAGE_HEAD.ecart)}>
        {/*
          Le titre et ce qui le suit s'alignent sur la LIGNE DE BASE entre eux —
          deux corps différents alignés autrement se lisent de travers — mais
          le groupe entier se centre dans la ligne.

          Ils étaient alignés sur la ligne de base des ACTIONS, ce qui faisait
          descendre le titre de six pixels dès qu'un bouton paraissait. La
          hauteur minimale de la ligne réglait la hauteur de l'en-tête ; celle-ci
          règle la place du titre dedans.
        */}
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-sm gap-y-xxs">
          <h1 className="line-clamp-2 min-w-0 text-headline text-brand [overflow-wrap:anywhere]" title={title}>{title}</h1>
          {status || figure ? (
            <span className="flex shrink-0 items-center gap-sm self-center">
              {status}
              {figure ? <span className="text-title tabular-nums text-text">{figure}</span> : null}
            </span>
          ) : null}
        </span>
        {/* Sur un téléphone, les actions prennent leur ligne entière, alignées à
            gauche sous le titre : à droite, chacune passait sur sa propre ligne
            et le contenu commençait à 330 px (A3-14). */}
        {actions && <span data-actions-en-tete className={cn('flex w-full shrink-0 flex-wrap items-center gap-sm sm:ml-auto sm:w-auto sm:max-w-full sm:justify-end', HEADER_ACTIONS)}>{actions}</span>}
      </div>
      </div>
    </div>
  );
}
