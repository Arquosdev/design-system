'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';
import { passwordToggleLabel } from './password-input.logic';

export interface PasswordInputProps
  extends Omit<React.ComponentProps<'input'>, 'type'> {
  /**
   * Classes de l'ENVELOPPE, celle qui porte la bordure — pas du champ.
   *
   * C'est l'enveloppe que l'appelant veut régler (largeur, marge), et le champ
   * est un détail d'implémentation : la bordure et l'anneau de mise au point
   * vivent dessus, pas dessous.
   */
  className?: string;
}

/**
 * Un champ de mot de passe, avec la bascule masqué / en clair.
 *
 * **La bordure est sur l'ENVELOPPE, et le champ n'en a aucune.** C'est ce qui
 * fait que le bouton de l'œil partage la bordure du champ au lieu de flotter
 * par-dessus lui. La page de connexion de l'app Bubble est construite exactement
 * ainsi — un groupe bordé contenant un champ `border_style: none` et le bouton —
 * et c'est la seule façon d'obtenir un bouton carré collé au bord droit sans
 * qu'un remplissage automatique du navigateur vienne s'empiler dessus.
 *
 * **L'état « en clair » est interne et repart FAUX à chaque montage.** Rien ne le
 * mémorise, ni ici ni ailleurs : se souvenir de ce choix afficherait le mot de
 * passe de quelqu'un sur un poste partagé, la fois suivante, sans qu'il l'ait
 * demandé. C'est la bascule qui doit être facile, pas son souvenir.
 */
export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <div
      data-slot="password-input"
      className={cn(
        'flex h-9 w-full items-stretch overflow-hidden rounded-control border border-border bg-bg',
        // La mise au point se voit sur l'enveloppe : le champ n'a pas de bordure,
        // un anneau posé sur lui serait avalé par le `overflow-hidden`.
        'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary',
        'transition-colors',
        // L'erreur se dit par la bordure, comme sur `Input`. Elle est lue sur le
        // champ parce que c'est LUI que l'appelant marque `aria-invalid` — le
        // porter sur l'enveloppe le retirerait de ce qu'annonce un lecteur
        // d'écran, qui lit le champ et non son décor.
        'has-[input[aria-invalid="true"]]:border-danger',
        'has-[input[aria-invalid="true"]]:focus-within:ring-danger',
        'has-[input:disabled]:opacity-50',
        className,
      )}
    >
      <input
        type={revealed ? 'text' : 'password'}
        disabled={disabled}
        className={cn(
          'h-full min-w-0 flex-1 bg-transparent px-sm text-small text-text',
          'outline-none placeholder:text-text-muted',
          'selection:bg-primary selection:text-text-on-dark',
          'disabled:pointer-events-none',
          /*
            **Edge pose SON PROPRE bouton d'affichage** (`::-ms-reveal`), et il
            se serait retrouvé juste à gauche du nôtre : deux yeux côte à côte,
            dont un seul suit le style du produit. Chrome et Safari n'en posent
            pas.
          */
          '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden',
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        /*
          `disabled` suit le champ : un œil actionnable sur un champ grisé
          promet de révéler une saisie qu'on ne peut pas faire.

          `tabIndex={-1}` serait tentant pour que la tabulation aille du champ au
          bouton suivant du formulaire. On ne le met PAS : la bascule est le seul
          moyen de relire ce qu'on a tapé, et la retirer du clavier la réserve à
          la souris.
        */
        disabled={disabled}
        aria-pressed={revealed}
        aria-label={passwordToggleLabel(revealed)}
        className={cn(
          'flex w-9 shrink-0 items-center justify-center border-l border-border',
          'text-text-muted transition-colors',
          'hover:bg-bg-muted hover:text-text',
          // L'anneau est vers l'INTÉRIEUR : posé dehors, il serait coupé par le
          // `overflow-hidden` de l'enveloppe et la mise au point deviendrait
          // invisible au clavier.
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
          'disabled:pointer-events-none',
        )}
      >
        <Icon role={revealed ? 'hidePassword' : 'revealPassword'} size="sm" />
      </button>
    </div>
  );
}
