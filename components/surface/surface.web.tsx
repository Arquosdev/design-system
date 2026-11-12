'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';

/*
  LA PAGE EN CARTES (Louis, 12/11/2026). Sur une page blanche, une carte SÉPARE
  des blocs qui s'empilent ; elle n'encadre jamais un élément seul. Son contour
  est son ombre (`shadow-surface`), sans bordure, rayon de 8 px. Le titre d'un
  bloc se pose AU-DESSUS de sa carte (`GroupTitle`, 13 px, graisse 600, gris),
  8 px plus haut, avec ses gestes à droite (`GroupLink`). Une rubrique qui n'est
  qu'un tableau ou une liste ne prend pas de carte : elle est à plat.
*/

/** La carte : fond blanc, rayon de 8 px, l'ombre pour contour. */
export const SURFACE = 'rounded-block bg-bg shadow-surface';

/*
  Les lignes de champs d'une carte : une `FieldRow` par ligne, 10 px en hauteur
  et 16 px de côté, le filet posé EN HAUT de chaque ligne et retiré à la première
  rangée (la dernière n'a donc jamais de trait orphelin). Deux colonnes de champs
  quand la carte passe 900 px (la zone 960 avec ses marges), jamais trois.
*/
const LIGNES =
  'grid grid-cols-1 [&>*]:px-base [&>*]:py-[calc(var(--spacing-sm)+var(--spacing-xxs))] ' +
  '[&>*]:border-b-0 [&>*]:border-t [&>*]:border-border-soft [&>*:first-child]:border-t-0 [&>[data-pied]]:col-span-full';
export const FIELD_ROWS =
  `${LIGNES} @min-[60rem]:grid-cols-2 sm:[&>*]:grid-cols-[200px_minmax(0,1fr)] @min-[60rem]:[&>*:nth-child(2)]:border-t-0`;
/** Les mêmes lignes sur une colonne étroite (les cotes à côté d'un schéma) : la valeur tient sur sa ligne. */
export const FIELD_ROWS_NARROW = `${LIGNES} sm:[&>*]:grid-cols-[minmax(0,1fr)_auto] [&>*>div]:whitespace-nowrap`;

/** Un tableau dans une carte : il la remplit, les coins restent arrondis, l'en-tête est blanc. */
export const SURFACE_TABLE = `${SURFACE} overflow-clip [&_tbody>tr:last-child>*]:border-b-0 [&_th]:bg-bg`;

/** Le titre d'un groupe : le troisième niveau (sous le nom de la fiche et le titre de rubrique). */
export const GROUP_TITLE = 'text-description font-semibold text-text-muted';

/** Le geste à droite d'un titre de groupe : un seul dessin, un petit lien bleu souligné au survol. */
export const GROUP_LINK = 'rounded-control text-description font-medium text-primary hover:underline focus-ring';

type Div = React.ComponentPropsWithoutRef<'div'>;

/** Une carte. */
export function Surface({ className, ...props }: Div) {
  return <div className={cn(SURFACE, className)} {...props} />;
}

/*
  À PLAT : un bloc de champs SEUL dans sa rubrique ne prend pas de carte (une carte
  sépare des blocs, elle n'encadre pas un élément seul). Les mêmes lignes, sans
  ombre ni retrait de côté, entre deux filets : le libellé tombe sur la verticale
  du nom de la fiche et des onglets.
*/
const FLAT = 'border-y border-border-soft [&>*]:px-0 @min-[60rem]:[&>*:nth-child(even)]:pl-xl';

/** Une carte de champs (`FieldRow` en lignes, deux colonnes quand elle est large) ; `flat` quand elle est seule. */
export function FieldSurface({ className, narrow = false, flat = false, ...props }: Div & { narrow?: boolean; flat?: boolean }) {
  return (
    <div
      className={cn(!flat && SURFACE, !flat && 'overflow-clip', narrow ? FIELD_ROWS_NARROW : FIELD_ROWS, flat && FLAT, className)}
      {...props}
    />
  );
}

/** Le pied d'une carte de champs : « Afficher N champs vides », sur toute sa largeur. */
export function SurfaceFooter({ className, ...props }: Div) {
  return <div data-pied className={cn('flex items-center border-t border-border-soft px-base py-sm', className)} {...props} />;
}

/** La ligne de titre d'un groupe, seule. */
export function GroupTitle({ title, count, actions, as: Titre = 'h3' }: {
  title: React.ReactNode;
  count?: React.ReactNode;
  actions?: React.ReactNode;
  as?: 'h2' | 'h3' | 'h4';
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-md gap-y-xs">
      {/* Plus de décompte à côté d'un titre de groupe (Louis, 12/11/2026) : `count` est ignoré. */}
      <Titre className={GROUP_TITLE} data-compte={count ?? undefined}>
        {title}
      </Titre>
      {actions ? <div className="flex flex-wrap items-center gap-sm">{actions}</div> : null}
    </div>
  );
}

/** Un groupe : son titre au-dessus, son contenu (une carte) 8 px plus bas. */
export function Group({ title, count, actions, children, className, ...props }: {
  title: React.ReactNode;
  count?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<'section'>, 'title'>) {
  return (
    <section aria-label={typeof title === 'string' ? title : undefined} className={cn('flex min-w-0 flex-col gap-sm', className)} {...props}>
      <GroupTitle title={title} count={count} actions={actions} />
      {children}
    </section>
  );
}

/** Le geste d'un titre de groupe : « Tout voir », « 3 à renseigner ». */
export const GroupLink = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  ({ className, type = 'button', ...props }, ref) => <button ref={ref} type={type} className={cn(GROUP_LINK, className)} {...props} />,
);
GroupLink.displayName = 'GroupLink';

/*
  LA COLONNE D'INFORMATIONS D'UNE FICHE (Louis, 12/11/2026, d'après les « Record details »
  d'Attio). Rien en carte : une liste de lignes attribut / valeur, sans bordure ni ombre ;
  les groupes se séparent par leur titre de niveau 3 et un espace. Lignes de 32 px, texte de
  13 px, libellé sur 120 px à gauche, précédé d'une petite icône grise quand il y en a une.
*/

/** Un groupe de la colonne : son titre (niveau 3), ses lignes, ses gestes à droite du titre. */
export function DetailGroup({ title, actions, children }: { title: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-label={typeof title === 'string' ? title : undefined} className="flex min-w-0 flex-col gap-xs">
      {/* Un filet doux SOUS le titre, et aucun entre les lignes (Louis, 12/11/2026) : la colonne
          prend de la structure sans devenir une pile de cartes. */}
      {/* 8 px d'air sous le titre (Louis, 12/11/2026 : « trop proche ») ; c'est la colonne qui pose
          le premier titre assez haut pour que ce filet tombe sur celui des onglets secondaires. */}
      <div className="border-b border-border-soft pb-sm">
        <GroupTitle title={title} actions={actions} />
      </div>
      <div className="flex min-w-0 flex-col">{children}</div>
    </section>
  );
}

/*
  LE LIBELLÉ SUR LA PREMIÈRE LIGNE DE SA VALEUR (Louis, 12/11/2026) : une valeur qui passe
  sur deux ou trois lignes (un nom, une adresse email) ne fait plus flotter son libellé au
  milieu. Alignement sur la ligne de base, et un retrait qui garde 32 px à une ligne seule :
  32 px (xl + sm) moins une hauteur de ligne, partagés en haut et en bas.
*/
const LIGNE_DE_32 = 'py-[calc((var(--spacing-xl)+var(--spacing-sm)-1lh)/2)]';

/** Une ligne de la colonne : l'icône et le libellé à gauche (120 px), la valeur à droite. */
export function DetailRow({ icon, label, children }: { icon?: React.ReactNode; label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={`grid min-h-8 grid-cols-[120px_minmax(0,1fr)] items-baseline gap-sm text-description ${LIGNE_DE_32}`}>
      <span className="flex min-w-0 items-center gap-xs text-text-muted">
        {icon ? <span className="shrink-0 [&_svg]:size-3.5" aria-hidden>{icon}</span> : null}
        <span className="truncate">{label}</span>
      </span>
      <span className="min-w-0 text-text">{children}</span>
    </div>
  );
}

/**
 * Des `FieldRow` au format de la colonne : 120 px de libellé, 32 px de haut, 13 px, sans
 * filet. À poser sur leur conteneur ; elles restent corrigibles en place.
 */
export const DETAIL_FIELD_ROWS =
  'flex min-w-0 flex-col [&>*]:grid [&>*]:min-h-8 [&>*]:grid-cols-[120px_minmax(0,1fr)] [&>*]:items-baseline [&>*]:gap-sm [&>*]:border-0 [&>*]:px-0 [&>*]:py-[calc((var(--spacing-xl)+var(--spacing-sm)-1lh)/2)] [&>*]:text-description';
