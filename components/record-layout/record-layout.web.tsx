import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { NavList, type NavItem } from '../nav-list/nav-list.web';
import { SegmentedTabs, type Segment } from '../segmented-tabs/segmented-tabs.web';

/*
  La mise en page d'une fiche : deux colonnes, chacune avec son défilement.

  Elle vivait dans la story « Un écran entier / Fiche d'équipement », donc en
  markup d'histoire : la première application l'a recopiée, et les neuf
  suivantes ont recopié la copie. Les dimensions en dur — la largeur du rail,
  la hauteur du bouton de recherche — se retrouvaient à deux endroits, et rien
  ne disait lequel faisait foi.

  Ce composant ne décide de rien de neuf. Il donne un nom à ce que la story
  montrait, pour que la mesure ne soit écrite qu'une fois.
*/

/**
 * La largeur du rail, tenue à un seul endroit.
 *
 * Le squelette doit la partager, sinon la fiche saute de seize pixels au moment
 * où le menu arrive.
 */
const LARGEUR_RAIL = 'w-[284px]';

export interface RecordLayoutProps {
  children: React.ReactNode;
  /** Ce que l'hôte impose de hauteur ou de bordure. La fiche ne le sait pas. */
  className?: string;
}

/**
 * Le cadre des deux colonnes.
 *
 * MONO-ZONE : le rail et la zone centrale ont chacun leur propre défilement, la
 * page n'en a pas. Sans quoi les rubriques disparaissent dès qu'on descend dans
 * la fiche, et on ne sait plus où l'on est.
 */
export function RecordLayout({ children, className = '' }: RecordLayoutProps) {
  return (
    <div className={`flex items-stretch overflow-hidden bg-bg ${className}`}>
      {children}
    </div>
  );
}

export interface RecordRailProps {
  /** Ce que ce menu parcourt, pour l'annoncer aux lecteurs d'écran. */
  ariaLabel: string;
  /**
   * La recherche de champ. Absente = pas de bouton : une loupe qui n'ouvre rien
   * vaut moins que pas de loupe.
   */
  recherche?: { label: string; onOuvrir: () => void };
  /**
   * La bascule, quand l'objet a deux familles de rubriques. Un objet qui n'en a
   * qu'une n'affiche pas un groupe d'onglets à un seul onglet.
   */
  onglets?: {
    ariaLabel: string;
    value: string;
    onChange: (id: string) => void;
    segments: readonly Segment[];
  };
  items: readonly NavItem[];
  current?: string;
  onChoose: (id: string) => void;
}

/**
 * La colonne de gauche : la recherche, une bascule optionnelle, puis les
 * rubriques avec leurs compteurs.
 *
 * La `NavList` tient à quinze entrées là où des onglets horizontaux cassent à
 * sept. C'est la raison d'être de cette colonne, et elle porte indifféremment
 * les rubriques d'attributs et les collections d'objets liés.
 */
export function RecordRail({
  ariaLabel,
  recherche,
  onglets,
  items,
  current,
  onChoose,
}: RecordRailProps) {
  return (
    <nav
      aria-label={ariaLabel}
      /* Seize pixels de marge sur les quatre côtés, et le rail élargi d'autant
         (268 → 284) pour les payer : les entrées du menu portent douze pixels
         de retrait intérieur, et sans cette rallonge « États & remplacements »
         repassait sur deux lignes. La marge de gauche valait la moitié de celle
         du haut, ce qui se voyait. */
      className={`flex h-full ${LARGEUR_RAIL} shrink-0 flex-col gap-base overflow-y-auto border-r border-border-soft bg-bg-subtle p-base`}
    >
      {recherche ? (
        <button
          type="button"
          onClick={recherche.onOuvrir}
          /* La loupe en tête. Elle a été essayée à droite, sur la colonne des
             compteurs, pour que « Rechercher un champ » tombe sur la même
             verticale que les entrées du menu ; Thomas la veut à gauche, où une
             loupe s'attend. Le libellé est donc en retrait des entrées, et
             c'est assumé : un champ de recherche se reconnaît à son icône avant
             de se lire. */
          className="flex h-[36px] shrink-0 items-center gap-sm rounded-control border border-border bg-bg px-md text-left text-small text-text-muted outline-none hover:bg-bg-muted focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon role="search" size="sm" />
          <span className="min-w-0 flex-1 truncate">{recherche.label}</span>
        </button>
      ) : null}

      {onglets ? (
        <SegmentedTabs
          ariaLabel={onglets.ariaLabel}
          value={onglets.value}
          onChange={onglets.onChange}
          segments={onglets.segments}
          className="shrink-0"
        />
      ) : null}

      <NavList items={items} current={current} onChoose={onChoose} />
    </nav>
  );
}

/**
 * Le rail pendant le chargement.
 *
 * Il fait partie du gabarit et non de chaque fiche : sans lui, la fiche s'ouvre
 * sur une colonne blanche puis un menu surgit, et la page paraît sauter.
 */
export function RecordRailSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={`flex h-full ${LARGEUR_RAIL} shrink-0 flex-col gap-sm border-r border-border-soft bg-bg-subtle p-base`}
    >
      <div className="h-[36px] animate-pulse rounded-control bg-bg-muted" />
      <div className="mt-xs h-[32px] animate-pulse rounded-md bg-bg-muted" />
      {/* Neuf lignes : assez pour occuper la colonne, sans prétendre annoncer
          le nombre exact de rubriques qu'on ne connaît pas encore. */}
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="h-[30px] animate-pulse rounded-control bg-bg-muted" />
      ))}
    </div>
  );
}

export interface RecordZoneProps {
  children: React.ReactNode;
}

/**
 * La zone centrale, avec son propre défilement.
 *
 * Un `div` et non un `main` : le shell porte déjà ce repère, et deux `main`
 * imbriqués sont une faute que les lecteurs d'écran signalent.
 */
export function RecordZone({ children }: RecordZoneProps) {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      {children}
    </div>
  );
}
