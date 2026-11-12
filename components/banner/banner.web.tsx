import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';
import type { IconRole } from '../../src/icons';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

export interface BannerProps extends React.ComponentProps<'div'> {
  tone?: BannerTone;
  icon?: IconRole;
  /** Ce que la personne peut faire — un lien, un bouton. */
  action?: React.ReactNode;
}

const TONES: Record<BannerTone, string> = {
  // Le dessin des pastilles (Louis, 12/11/2026) : fond pâle, filet de 1 px de la même teinte.
  info: 'border-primary/15 bg-info-bg text-text-on-info-bg',
  // Un état réussi qui DURE sur la page (10/10/2026) : la paire de jetons du succès, jamais dissociée.
  success: 'border-success/20 bg-success-bg text-on-success-bg',
  warning: 'border-warning/25 bg-warning-bg text-on-warning-bg',
  danger: 'border-danger/20 bg-danger-bg text-on-danger-bg',
};

/**
 * Un bandeau qui informe sans interrompre.
 *
 * Il occupe le haut d'une zone et y reste tant que la condition dure — c'est ce
 * qui le distingue d'un `Toast`, qui passe. Un bandeau qui disparaît tout seul
 * laisse croire que le problème est réglé.
 *
 * Le composant est **présentationnel** : il ne détecte rien. Savoir qu'on est
 * hors ligne ou qu'une file d'envoi traîne appartient à l'app, qui a son
 * contexte réseau, ses délais et ses règles.
 */
export function Banner({
  tone = 'info',
  icon,
  action,
  className,
  children,
  ...props
}: BannerProps) {
  return (
    <div
      /*
        Un ton `danger` porte une ALERTE, pas un statut : `role="status"` est
        annoncé quand le lecteur d'écran en a le loisir, `role="alert"`
        interrompt. Un mot de passe refusé doit interrompre, sans quoi la
        personne rejoue la même saisie sans savoir pourquoi elle a échoué.
      */
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        /*
          **Arrondi par défaut, et c'est un changement du 01/09/2026.** Ce
          bandeau a été dessiné pleine largeur en tête de page, où il n'y a rien
          à arrondir — d'où l'oubli. Dès qu'il vit DANS une carte, l'angle vif se
          voit : Louis l'a signalé sur la page de connexion.

          Un emploi vraiment bord à bord passe `rounded-none`, ce qui fonctionne
          depuis que `cn` déclare l'échelle d'espacement à tailwind-merge — avant
          cette date, une surcharge de ce genre était silencieusement ignorée.
        */
        // Aligné sur les pastilles (12/11/2026) : arrondi 8, filet de 1 px, texte 13 px, icône 14 px.
        'flex w-full items-center gap-sm rounded-block border px-md py-sm text-description font-medium',
        TONES[tone],
        className,
      )}
      {...props}
    >
      {icon ? <Icon role={icon} size="sm" className="size-3.5 shrink-0" /> : null}
      <span className="min-w-0 flex-1">{children}</span>
      {action}
    </div>
  );
}
