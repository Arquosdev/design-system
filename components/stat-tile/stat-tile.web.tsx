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
  /**
   * Vide et cliquable, la tuile dit-elle `libelleVide` en bleu d'action ? Par
   * défaut oui. `false` garde le « — » ordinaire, même cliquable : Thomas n'a
   * pas aimé « À compléter » sur la vue d'ensemble (05/10/2026) et a voulu
   * retrouver le tiret, sans perdre le clic qui mène au champ.
   */
  inviter?: boolean;
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
  inviter = true,
  ...props
}: StatTileProps) {
  const vide = !valeur;
  /* Un manque qu'on peut combler ne se dit pas comme un manque constaté. Le mot
     prend le bleu des actions et la taille du texte courant : c'est une
     invitation, pas une mesure — en caractères de mesure, il écraserait les
     tuiles voisines qui, elles, portent un chiffre. */
  const invite = vide && Boolean(onOuvrir) && inviter;
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
        aria-label={`${libelleOuvrir ?? `Voir ${label.toLowerCase()}`} — ${vide ? (inviter ? libelleVide.toLowerCase() : 'non renseigné') : [valeur, unite].filter(Boolean).join(' ')}`}
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

/** Une moitié de `StatTileDouble` — les mêmes champs qu'une tuile. */
export interface MoitieTuile {
  label: string;
  valeur: string;
  unite?: string;
  detail?: string;
  /** La moitié mène à SA donnée ; sans, elle reste inerte. */
  onOuvrir?: () => void;
  libelleOuvrir?: string;
  libelleVide?: string;
  /** Voir `StatTileProps.inviter`. */
  inviter?: boolean;
}

export interface StatTileDoubleProps extends React.ComponentPropsWithoutRef<'div'> {
  moities: readonly [MoitieTuile, MoitieTuile];
}

/**
 * DEUX MESURES SŒURS DANS UNE TUILE — le module GSM et le boîtier téléalarme.
 *
 * Deux appareils, deux marques, mais une seule question pour qui lit la fiche :
 * « comment cette cabine appelle-t-elle à l'aide ? ». En deux tuiles, la
 * téléalarme restait seule sur une quatrième rangée ; réunies, la grille
 * retombe sur trois par trois. Retenu par Thomas le 05/10/2026 parmi trois
 * maquettes : côte à côte plutôt qu'empilées, pour que la tuile garde la
 * hauteur de ses voisines.
 *
 * Chaque moitié se lit et se clique pour elle-même : un seul bouton pour deux
 * données ne saurait pas laquelle ouvrir. Le chiffre descend d'un cran
 * (`text-title`) — deux mesures en `text-headline` ne tiennent pas dans un tiers
 * de grille.
 */
export function StatTileDouble({ moities, className, ...props }: StatTileDoubleProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] gap-xs rounded-md border border-border-soft bg-bg p-sm',
        className,
      )}
      {...props}
    >
      <Moitie {...moities[0]} />
      <div className="my-xs bg-border-soft" aria-hidden="true" />
      <Moitie {...moities[1]} />
    </div>
  );
}

function Moitie({
  label,
  valeur,
  unite,
  detail,
  onOuvrir,
  libelleOuvrir,
  libelleVide = 'À compléter',
  inviter = true,
}: MoitieTuile) {
  const vide = !valeur;
  const invite = vide && Boolean(onOuvrir) && inviter;
  const contenu = (
    <>
      <div className="text-caption text-text-muted">{label}</div>
      <div className="mt-xs flex items-baseline gap-xs">
        <span
          className={cn(
            invite ? 'text-body font-semibold text-primary' : 'text-title font-bold break-words',
            !invite && (vide ? 'text-text-muted' : 'text-text'),
          )}
        >
          {invite ? libelleVide : vide ? '—' : valeur}
        </span>
        {unite && !vide ? <span className="text-small text-text-muted">{unite}</span> : null}
      </div>
      {detail ? <div className="mt-xxs text-caption text-text-muted">{detail}</div> : null}
    </>
  );
  const zone = 'h-full rounded-control px-sm py-xs';
  if (!onOuvrir) return <div className={zone}>{contenu}</div>;
  return (
    <button
      type="button"
      onClick={onOuvrir}
      aria-label={`${libelleOuvrir ?? `Voir ${label}`} — ${vide ? (inviter ? libelleVide.toLowerCase() : 'non renseigné') : [valeur, unite].filter(Boolean).join(' ')}`}
      className={cn(
        zone,
        'block w-full cursor-pointer text-left outline-none',
        'transition-colors duration-(--arq-duration-normal) hover:bg-bg-muted',
        'focus-visible:ring-2 focus-visible:ring-primary',
      )}
    >
      {contenu}
    </button>
  );
}
