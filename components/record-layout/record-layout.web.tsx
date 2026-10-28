import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { NavList, NavTarget, type NavItem } from '../nav-list/nav-list.web';
import { SegmentedTabs, type Segment } from '../segmented-tabs/segmented-tabs.web';
import { Skeleton } from '../skeleton/skeleton.web';

/*
  LE CHARGEMENT D'UNE RUBRIQUE SE VOIT (audit design du 11/10/2026, A1-03,
  A1-B-02). Une rubrique vient du serveur : entre le clic et sa réponse, rien
  ne bougeait, et la nouvelle s'ouvrait au défilement de l'ancienne. Le cadre
  partage donc avec sa zone un état « en chargement » : le rail l'allume au
  clic, la zone remonte en haut et montre un squelette jusqu'à la réponse.
*/
type ChargementDeZone = {
  busy: boolean; setBusy: (busy: boolean) => void; zone: React.RefObject<HTMLDivElement | null>;
  /** La FICHE est étroite (voir `SEUIL_ETROIT`), quelle que soit la fenêtre. */
  etroit: boolean;
};
const ContexteDeZone = React.createContext<ChargementDeZone | null>(null);

/**
 * Pour le rail d'une application : dire que la zone charge (le squelette
 * paraît, le défilement remonte). Nul hors d'un `RecordLayout`.
 */
export function useRecordZone() {
  const c = React.useContext(ContexteDeZone);
  return React.useMemo(() => (c ? {
    busy: c.busy,
    setBusy: (busy: boolean) => {
      c.setBusy(busy);
      if (busy) c.zone.current?.scrollTo({ top: 0 });
    },
  } : null), [c]);
}

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
const LARGEUR_RAIL = 'w-full @min-[640px]/fiche:w-[284px]';

/*
  SUR UN TÉLÉPHONE, LE RAIL PASSE EN TÊTE ET SES RUBRIQUES EN ONGLETS.

  Sous 768 pixels, le rail gardait ses 284 pixels de large : à 375, une fiche
  à plusieurs rubriques ne montrait QUE son rail, et la zone partait hors de
  l'écran (manque n° 12 du web, mesuré le 06/10/2026 sur la fiche Appel).
  Les deux colonnes s'empilent donc, et les rubriques se lisent en une rangée
  d'onglets qui défile de côté — le motif des fiches mobiles. Choix par défaut
  du 07/10/2026, réversible : un menu déroulant tiendrait aussi.
*/
/*
  **ÉTROITE SE JUGE SUR LA FICHE, PAS SUR LA FENÊTRE** (Recette V2 du web,
  1246t8yt5hx). Le seuil était la fenêtre, 768 px : un panneau ouvert à côté
  de la fiche (l'assistant) la réduisait à 400 px dans une fenêtre de 1 024, le
  rail gardait ses 284 px, et la zone tombait à 90 px, un mot par ligne. La
  fiche se replie donc sous 640 px de LARGE À ELLE : 284 de rail et une zone
  qui se lit. Une requête de conteneur pour la mise en page, et la mesure du
  cadre pour la rangée d'onglets, qui n'est rendue que sur une fiche étroite.
*/
const SEUIL_ETROIT = 640;
const ETROIT = '@min-[640px]/fiche:hidden';
const LARGE = 'hidden @min-[640px]/fiche:block';
// La rangée elle-même n'est rendue que sur une fiche étroite : la classe ne sert qu'à la transition.

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
  const [busy, setBusy] = React.useState(false);
  const zone = React.useRef<HTMLDivElement | null>(null);
  const cadre = React.useRef<HTMLDivElement | null>(null);
  // Côté serveur, la fiche est large ; la mesure tranche à l'hydratation.
  const [etroit, setEtroit] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = cadre.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const mesurer = () => setEtroit(el.getBoundingClientRect().width < SEUIL_ETROIT);
    mesurer();
    const o = new ResizeObserver(mesurer);
    o.observe(el);
    return () => o.disconnect();
  }, []);
  const valeur = React.useMemo(() => ({ busy, setBusy, zone, etroit }), [busy, etroit]);
  return (
    <ContexteDeZone.Provider value={valeur}>
      {/* Deux boîtes : une requête de conteneur ne s'applique pas à l'élément qui
          EST le conteneur. L'extérieure se mesure, l'intérieure porte les colonnes. */}
      <div ref={cadre} className={`@container/fiche flex flex-col overflow-hidden bg-bg ${className}`}>
        <div className="flex min-h-0 flex-1 flex-col items-stretch overflow-hidden @min-[640px]/fiche:flex-row">
          {children}
        </div>
      </div>
    </ContexteDeZone.Provider>
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
  const cadre = React.useContext(ContexteDeZone);
  const fenetreEtroite = React.useSyncExternalStore(abonnerAuxLargeurs, estEtroit, () => false);
  // Dans un cadre, sa largeur ; hors cadre, celle de la fenêtre, comme avant.
  const etroit = cadre ? cadre.etroit : fenetreEtroite;
  /*
    **La tête reste, les entrées passent DESSOUS, dans un fondu** (Louis,
    28/10/2026), comme dans le rail principal. C'était le rail entier qui
    défilait, la recherche collée en haut : les entrées se voyaient au-dessus
    d'elle, dans la marge, et sous elle, entre ses coins arrondis — « Relevés »
    et « Maintenance » coupés par le champ. Seule la liste défile maintenant, et
    chaque fondu ne paraît que s'il a quelque chose à cacher.
  */
  const zone = React.useRef<HTMLDivElement>(null);
  const [defile, setDefile] = React.useState(false);
  const [auBout, setAuBout] = React.useState(true);
  const mesurer = React.useCallback(() => {
    const z = zone.current;
    if (!z) return;
    setDefile(z.scrollTop > 0);
    setAuBout(z.scrollTop + z.clientHeight >= z.scrollHeight - 1);
  }, []);
  React.useEffect(() => {
    const z = zone.current;
    if (!z) return;
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(z);
    for (const enfant of Array.from(z.children)) observateur.observe(enfant);
    return () => observateur.disconnect();
  }, [mesurer, items]);
  if (items.length <= 1 && !recherche && !onglets) return null;
  const tete = recherche || onglets;
  return (
    <nav
      aria-label={ariaLabel}
      /* Seize pixels de marge sur les quatre côtés, et le rail élargi d'autant
         (268 → 284) pour les payer : les entrées du menu portent douze pixels
         de retrait intérieur, et sans cette rallonge « États & remplacements »
         repassait sur deux lignes. La marge de gauche valait la moitié de celle
         du haut, ce qui se voyait. */
      className={`flex ${LARGEUR_RAIL} shrink-0 flex-col border-b border-border-soft bg-bg p-base @min-[640px]/fiche:pl-xl @min-[640px]/fiche:h-full @min-[640px]/fiche:min-h-0 @min-[640px]/fiche:pb-0 @min-[640px]/fiche:border-r @min-[640px]/fiche:border-b-0`}
    >
      {tete ? (
      <div className="flex shrink-0 flex-col gap-base pb-base">
      {recherche ? (
        <button
          type="button"
          onClick={recherche.onOuvrir}
          /* La loupe en tête. Elle a été essayée à droite, sur la colonne des
             compteurs, pour que « Rechercher un champ » tombe sur la même
             verticale que les entrées du menu ; Thomas la veut à gauche, où une
             loupe s'attend. Le libellé est donc en retrait des entrées, et
             c'est assumé : un champ de recherche se reconnaît à son icône avant
             de se lire.

             **Elle reste en tête quand le rail défile** (Ergonomie du web,
             motif J) : elle sortait de l'écran avec les entrées, et il fallait
             remonter le rail pour chercher un champ. Hors du défilement depuis le
             28/10/2026, et non plus collée en haut de lui. */
          className="flex h-(--arq-control-md) shrink-0 items-center gap-sm rounded-control border border-border bg-bg px-md text-left text-small text-text-muted outline-none hover:bg-bg-muted focus-ring"
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
      </div>
      ) : null}

      {/* Le fondu du HAUT : en défilant, les entrées passent sous la tête, qui reste. */}
      <span aria-hidden className="relative z-10 block h-0 shrink-0">
        <span className={`pointer-events-none absolute -inset-x-sm top-0 h-lg bg-linear-to-b from-bg to-transparent transition-opacity duration-(--arq-duration-normal) ${defile ? 'opacity-100' : 'opacity-0'}`} />
      </span>
      {/* Seule la liste défile. Les quelques pixels de part et d'autre gardent
          entier l'anneau de focus d'une entrée, que le défilement rognerait. */}
      <div
        ref={zone}
        onScroll={mesurer}
        data-role="defilement-du-rail"
        className="-mx-xs px-xs @min-[640px]/fiche:min-h-0 @min-[640px]/fiche:flex-1 @min-[640px]/fiche:overflow-y-auto @min-[640px]/fiche:pt-xxs @min-[640px]/fiche:pb-base"
      >
        <NavList items={items} current={current} onChoose={onChoose} className={LARGE} />
        {etroit ? <OngletsEtroits items={items} current={current} onChoose={onChoose} /> : null}
      </div>
      {/* Le fondu du BAS : la liste continue et passe sous le bord du rail. */}
      <span aria-hidden className="relative z-10 block h-0 shrink-0">
        <span className={`pointer-events-none absolute -inset-x-sm bottom-0 h-2xl bg-linear-to-t from-bg via-bg/80 to-transparent transition-opacity duration-(--arq-duration-normal) ${auBout ? 'opacity-0' : 'opacity-100'}`} />
      </span>
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
          <NavTarget
            key={i.id}
            href={i.href}
            disabled={i.disabled}
            aria-current={actif ? 'page' : undefined}
            onActivate={() => onChoose(i.id)}
            className={`flex h-(--arq-control-sm) shrink-0 items-center gap-xs whitespace-nowrap rounded-control px-md text-small outline-none focus-ring disabled:opacity-50 ${actif ? 'bg-info-bg font-semibold text-on-info-bg' : 'text-text-muted hover:bg-bg-muted hover:text-text'}`}
          >
            {i.label}
            {i.count !== undefined ? <span className="tabular-nums text-caption">{i.count}</span> : null}
          </NavTarget>
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
      className={`flex ${LARGEUR_RAIL} shrink-0 flex-col gap-sm border-b border-border-soft bg-bg p-base @min-[640px]/fiche:pl-xl @min-[640px]/fiche:h-full @min-[640px]/fiche:border-r @min-[640px]/fiche:border-b-0`}
    >
      <div className="h-(--arq-control-md) animate-pulse rounded-control bg-bg-muted" />
      <div className="mt-xs h-[32px] animate-pulse rounded-control bg-bg-muted" />
      {/* Neuf lignes : assez pour occuper la colonne, sans prétendre annoncer
          le nombre exact de rubriques qu'on ne connaît pas encore. */}
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className={`h-(--arq-control-sm) animate-pulse rounded-control bg-bg-muted ${i > 0 ? 'hidden @min-[640px]/fiche:block' : ''}`} />
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
  const c = React.useContext(ContexteDeZone);
  const busy = c?.busy ?? false;
  return (
    // `@container` : ce qui s'y pose se règle sur la largeur de la zone, pas sur celle de
    // la fenêtre. Un panneau ouvert à côté (l'assistant) la rétrécit sans changer la fenêtre.
    <div ref={c?.zone} aria-busy={busy || undefined} className="@container min-h-0 min-w-0 flex-1 overflow-y-auto">
      {busy ? (
        <div aria-hidden className="flex flex-col gap-base px-base pt-lg sm:px-xl">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : null}
      {/* `contents` : l'enveloppe n'existe pas pour la mise en page tant qu'on ne charge pas. */}
      <div className={busy ? 'hidden' : 'contents'}>{children}</div>
    </div>
  );
}
