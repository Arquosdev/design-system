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
const LARGEUR_RAIL = 'w-full min-[768px]:w-[284px]';

/*
  SUR UN TÉLÉPHONE, LE RAIL PASSE EN TÊTE ET SES RUBRIQUES EN ONGLETS.

  Sous 768 pixels, le rail gardait ses 284 pixels de large : à 375, une fiche
  à plusieurs rubriques ne montrait QUE son rail, et la zone partait hors de
  l'écran (manque n° 12 du web, mesuré le 06/10/2026 sur la fiche Appel).
  Les deux colonnes s'empilent donc, et les rubriques se lisent en une rangée
  d'onglets qui défile de côté — le motif des fiches mobiles. Choix par défaut
  du 07/10/2026, réversible : un menu déroulant tiendrait aussi.
*/
const ETROIT = 'min-[768px]:hidden';
const LARGE = 'hidden min-[768px]:block';
// La rangée elle-même n'est rendue que sous 768 px (voir `estEtroit`) : la classe ne sert qu'à la transition.

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
    <div className={`flex flex-col items-stretch overflow-hidden bg-bg min-[768px]:flex-row ${className}`}>
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
  /*
    Un menu d'UNE rubrique ne mène nulle part (design-eu, critique
    indépendante P9) : sur une fiche Écart, « Constat » seul occupait 284 px de
    large. Sans recherche ni onglets, il se retire et le contenu prend la
    place. Deux rubriques et plus, il revient.
  */
  /* La rangée d'onglets n'existe QUE sur un écran étroit, et pas seulement
     cachée : rendue partout, elle doublait chaque libellé de rubrique dans la
     page, et une recherche par texte en trouvait deux. Côté serveur, on rend
     le rail large ; un téléphone bascule à l'hydratation. */
  const etroit = React.useSyncExternalStore(abonnerAuxLargeurs, estEtroit, () => false);
  if (items.length <= 1 && !recherche && !onglets) return null;
  return (
    <nav
      aria-label={ariaLabel}
      /* Seize pixels de marge sur les quatre côtés, et le rail élargi d'autant
         (268 → 284) pour les payer : les entrées du menu portent douze pixels
         de retrait intérieur, et sans cette rallonge « États & remplacements »
         repassait sur deux lignes. La marge de gauche valait la moitié de celle
         du haut, ce qui se voyait. */
      className={`flex ${LARGEUR_RAIL} shrink-0 flex-col gap-base border-b border-border-soft bg-bg-subtle p-base min-[768px]:h-full min-[768px]:overflow-y-auto min-[768px]:border-r min-[768px]:border-b-0`}
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
          className="flex h-(--arq-control-md) shrink-0 items-center gap-sm rounded-control border border-border bg-bg px-md text-left text-small text-text-muted outline-none hover:bg-bg-muted focus-visible:ring-2 focus-visible:ring-primary"
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

      <NavList items={items} current={current} onChoose={onChoose} className={LARGE} />
      {etroit ? <OngletsEtroits items={items} current={current} onChoose={onChoose} /> : null}
    </nav>
  );
}

const REQUETE_ETROITE = '(max-width: 767px)';
const abonnerAuxLargeurs = (rappel: () => void) => {
  const m = window.matchMedia(REQUETE_ETROITE);
  m.addEventListener('change', rappel);
  return () => m.removeEventListener('change', rappel);
};
const estEtroit = () => window.matchMedia(REQUETE_ETROITE).matches;

/**
 * Les rubriques en une rangée d'onglets, sur un écran étroit. Les
 * sous-rubriques se lisent à plat : une rangée qui défile n'a pas de place pour
 * un dépliant.
 */
function OngletsEtroits({ items, current, onChoose }: { items: readonly NavItem[]; current?: string; onChoose: (id: string) => void }) {
  // Une entrée à sous-rubriques se lit par elles ; elle-même aussi, sauf si l'une porte déjà sa clé.
  const aPlat = items.flatMap((i) => {
    const enfants = i.children ?? [];
    if (!enfants.length) return [i];
    return enfants.some((e) => e.id === i.id) ? enfants : [i, ...enfants];
  });
  // L'onglet courant se montre : sans cela, une rubrique du bout de la rangée s'ouvrait coupée au bord.
  const rangee = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    rangee.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [current]);
  return (
    <div ref={rangee} className={`-mx-base flex gap-xs overflow-x-auto px-base ${ETROIT}`}>
      {aPlat.map((i) => {
        const actif = i.id === current;
        return (
          <button
            key={i.id}
            type="button"
            disabled={i.disabled}
            aria-current={actif ? 'page' : undefined}
            onClick={() => onChoose(i.id)}
            className={`flex h-(--arq-control-sm) shrink-0 items-center gap-xs whitespace-nowrap rounded-control px-md text-small outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${actif ? 'bg-info-bg font-semibold text-on-info-bg' : 'text-text-muted hover:bg-bg-muted hover:text-text'}`}
          >
            {i.label}
            {i.count !== undefined ? <span className="tabular-nums text-caption">{i.count}</span> : null}
          </button>
        );
      })}
    </div>
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
      className={`flex ${LARGEUR_RAIL} shrink-0 flex-col gap-sm border-b border-border-soft bg-bg-subtle p-base min-[768px]:h-full min-[768px]:border-r min-[768px]:border-b-0`}
    >
      <div className="h-(--arq-control-md) animate-pulse rounded-control bg-bg-muted" />
      <div className="mt-xs h-[32px] animate-pulse rounded-control bg-bg-muted" />
      {/* Neuf lignes : assez pour occuper la colonne, sans prétendre annoncer
          le nombre exact de rubriques qu'on ne connaît pas encore. */}
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className={`h-(--arq-control-sm) animate-pulse rounded-control bg-bg-muted ${i > 0 ? 'hidden min-[768px]:block' : ''}`} />
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
    <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
      {children}
    </div>
  );
}
