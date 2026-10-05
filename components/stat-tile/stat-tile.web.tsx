import * as React from 'react';

import { cn } from '../_lib/cn';

export interface StatTileProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  valeur: string;
  unite?: string;
  /** Précision sous la mesure (« 4 personnes », « gaine maçonnée »). */
  detail?: string;
  /**
   * La tuile MÈNE quelque part — vers la donnée qu'elle résume. Donnée, elle
   * devient un bouton : survol, focus au clavier, et un nom qui dit où elle va.
   *
   * Demandé par Carole le 05/10/2026 (Att_05) : depuis la vue d'ensemble d'une
   * fiche, aller droit à la donnée technique pour la vérifier ou la corriger.
   */
  onOuvrir?: () => void;
  /** Ce que le clic fait, pour qui ne voit pas la tuile. Par défaut, « Voir {label} ». */
  libelleOuvrir?: string;
  /**
   * Ce que dit une tuile VIDE qui mène quelque part — par défaut « À compléter ».
   *
   * Vide et inerte, la tuile dit « — » : un manque constaté. Vide et cliquable,
   * elle invite à le combler, et le dit (Att_05, Thomas, 05/10/2026 : « garder
   * les vides, en les marquant À compléter et cliquables »).
   */
  libelleVide?: string;
}

export function StatTile({
  label,
  valeur,
  unite,
  detail,
  className,
  onOuvrir,
  libelleOuvrir,
  libelleVide = 'À compléter',
  ...props
}: StatTileProps) {
  const vide = !valeur;
  /* Un manque qu'on peut combler ne se dit pas comme un manque constaté. Le mot
     prend le bleu des actions et la taille du texte courant : c'est une
     invitation, pas une mesure — en caractères de mesure, il écraserait les
     tuiles voisines qui, elles, portent un chiffre. */
  const invite = vide && Boolean(onOuvrir);
  const contenu = (
    <>
      <div className="text-caption text-text-muted">{label}</div>
      <div className="mt-xs flex items-baseline gap-xs">
        <span
          className={cn(
            invite ? 'text-body font-semibold text-primary' : 'text-headline font-bold break-words',
            !invite && (vide ? 'text-text-muted' : 'text-text'),
          )}
        >
          {invite ? libelleVide : vide ? '—' : valeur}
        </span>
        {/* Une unité sans nombre devant ne veut rien dire. */}
        {unite && !vide ? <span className="text-small text-text-muted">{unite}</span> : null}
      </div>
      {detail ? <div className="mt-xxs text-caption text-text-muted">{detail}</div> : null}
    </>
  );

  const cadre = 'rounded-md border border-border-soft bg-bg p-base';

  if (onOuvrir) {
    /* Un vrai bouton, pas une div qu'on aurait rendue cliquable : il prend le
       focus, s'active à Entrée comme à Espace, et se nomme pour un lecteur
       d'écran. Le survol reprend le contour primaire des champs actifs — c'est
       ce qui dit, sans mot de plus, que la tuile mène quelque part. */
    return (
      <button
        type="button"
        onClick={onOuvrir}
        aria-label={`${libelleOuvrir ?? `Voir ${label.toLowerCase()}`} — ${vide ? libelleVide.toLowerCase() : [valeur, unite].filter(Boolean).join(' ')}`}
        className={cn(
          cadre,
          'block w-full cursor-pointer text-left outline-none',
          'transition-colors duration-(--arq-duration-normal)',
          'hover:border-primary hover:bg-bg-subtle',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className,
        )}
        {...(props as React.ComponentPropsWithoutRef<'button'>)}
      >
        {contenu}
      </button>
    );
  }

  return (
    <div className={cn(cadre, className)} {...props}>
      {contenu}
    </div>
  );
}
