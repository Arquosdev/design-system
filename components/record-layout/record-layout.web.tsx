import * as React from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '../icon/icon.web';
import { IconButton } from '../icon-button/icon-button.web';
import { NavTarget, type NavItem } from '../nav-list/nav-list.web';
import { SegmentedTabs, type Segment } from '../segmented-tabs/segmented-tabs.web';
import { Skeleton } from '../skeleton/skeleton.web';
import { cn } from '../_lib/cn';

/*
  LE CHARGEMENT D'UNE RUBRIQUE SE VOIT (audit design du 11/10/2026, A1-03,
  A1-B-02). Une rubrique vient du serveur : entre le clic et sa réponse, rien
  ne bougeait, et la nouvelle s'ouvrait au défilement de l'ancienne. Le cadre
  partage donc avec sa zone un état « en chargement » : la rangée l'allume au
  clic, la zone remonte en haut et montre un squelette jusqu'à la réponse.
*/
type ChargementDeZone = {
  busy: boolean; setBusy: (busy: boolean) => void; zone: React.RefObject<HTMLDivElement | null>;
  /** Où se pose la colonne d'informations : à droite du cadre, à côté des onglets ET de la zone. */
  aside: HTMLElement | null;
};
const ContexteDeZone = React.createContext<ChargementDeZone | null>(null);

/**
 * Pour la rangée d'une application : dire que la zone charge (le squelette
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
  LA MISE EN PAGE D'UNE FICHE : LES RUBRIQUES EN RANGÉE SOUS L'EN-TÊTE, LA ZONE
  DESSOUS, SUR TOUTE LA LARGEUR (Thomas, 04/11/2026).

  Jusque-là, les rubriques vivaient dans un rail de 284 px à gauche, et la zone
  lue se partageait ce qui restait. Thomas veut tous les menus de page à
  l'horizontale, comme les onglets d'une fiche Intercom ou Linear : la rangée
  se lit d'un coup d'œil sous le nom de l'objet, et la zone prend la page. Les
  sous-rubriques (les sections de Photos, les composants sous Données
  techniques, les cinq entrées de la Maintenance) se lisent dans une seconde
  rangée, en pastilles, qui ne paraît que quand on est dans leur rubrique.

  Le composant garde son nom et ses props : les trente écrans qui le posent
  n'ont rien à changer. Il tient toujours le mono-zone : la page ne défile pas,
  seule la zone défile, et la rangée reste en vue.
*/

export interface RecordLayoutProps {
  children: React.ReactNode;
  /** Ce que l'hôte impose de hauteur ou de bordure. La fiche ne le sait pas. */
  className?: string;
}

/**
 * Le cadre : la rangée des rubriques, puis la zone.
 *
 * MONO-ZONE : la zone a son propre défilement, la page n'en a pas. Sans quoi
 * les rubriques disparaissent dès qu'on descend dans la fiche, et on ne sait
 * plus où l'on est.
 */
export function RecordLayout({ children, className = '' }: RecordLayoutProps) {
  const [busy, setBusy] = React.useState(false);
  const zone = React.useRef<HTMLDivElement | null>(null);
  const [aside, setAside] = React.useState<HTMLElement | null>(null);
  const valeur = React.useMemo(() => ({ busy, setBusy, zone, aside }), [busy, aside]);
  return (
    <ContexteDeZone.Provider value={valeur}>
      {/* Deux boîtes : une requête de conteneur ne s'applique pas à l'élément qui
          EST le conteneur. L'extérieure se mesure, l'intérieure porte la colonne.
          LA COLONNE D'INFORMATIONS MONTE JUSQU'À L'EN-TÊTE (Louis, 12/11/2026, comme Attio) :
          à gauche les onglets et la zone, à droite la colonne, sur toute la hauteur, sous le
          filet de l'en-tête de la fiche. `RecordZone` l'envoie dans cet emplacement. */}
      <div className={`@container/fiche flex flex-col overflow-hidden bg-bg ${className}`}>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col items-stretch overflow-hidden">
            {children}
          </div>
          <div ref={setAside} className="contents" />
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

/*
  La rangée rentre sa marge de gauche d'autant que le premier onglet porte de
  retrait intérieur : son libellé tombe ainsi sur la verticale du titre de
  l'en-tête et du contenu, au lieu de huit pixels plus loin. Elle défile de
  côté quand la largeur manque, sans barre : l'onglet courant est ramené en vue.
*/
const RANGEE = '-mx-sm flex h-[calc(var(--arq-control-md)+var(--spacing-xs))] min-w-0 flex-1 items-stretch gap-xxs overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

/** La rubrique mère de `current` : celle dont les enfants le portent, ou qui le porte elle-même. */
function mereDe(items: readonly NavItem[], current?: string): NavItem | undefined {
  if (!current) return undefined;
  return items.find((i) => i.children?.length && (i.id === current || i.children.some((e) => e.id === current)));
}

/**
 * Les rubriques en une rangée d'onglets, sous l'en-tête de la fiche. L'onglet
 * courant porte la couleur d'action et un trait ; les autres se lisent en
 * retrait. La recherche de champ, s'il y en a une, est une loupe au bout de la
 * rangée. Une rubrique à sous-rubriques les déplie dans une seconde rangée,
 * en pastilles sur le gris de la surface.
 */
export function RecordRail({
  ariaLabel,
  recherche,
  onglets,
  items,
  current,
  onChoose,
}: RecordRailProps) {
  const rangee = React.useRef<HTMLDivElement>(null);
  const sousRangee = React.useRef<HTMLDivElement>(null);

  // L'onglet courant se montre : une rubrique du bout de la rangée s'ouvrait coupée au bord.
  React.useEffect(() => {
    for (const r of [rangee.current, sousRangee.current]) {
      r?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [current]);

  // Les flèches passent d'un onglet à l'autre sans tabuler à travers chacun.
  // Elles déplacent le FOCUS, pas la rubrique : un onglet est un lien, et un
  // lien s'ouvre quand on le choisit, pas quand on le survole au clavier.
  const auClavier = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const pas = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    const onglets = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a, button:not([disabled])'));
    const i = onglets.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    onglets[(i + pas + onglets.length) % onglets.length]?.focus();
  };

  /*
    Un menu d'UNE rubrique ne mène nulle part (design-eu, critique
    indépendante P9) : sur une fiche Écart, « Constat » seul occupait une
    rangée. Sans recherche ni bascule, il se retire et le contenu prend la
    place. Deux rubriques et plus, il revient.
  */
  if (items.length <= 1 && !recherche && !onglets) return null;

  const mere = mereDe(items, current);
  /* UN ENFANT QUI PORTE LA CLÉ DE SA MÈRE FAIT DE CELLE-CI UN CONTENEUR
     (« Toutes » sous Photos, « Synthèse » sous Maintenance, « Générales » sous
     Données techniques) : l'onglet de la mère s'allume dès qu'on est chez elle
     ou chez l'un des siens, et c'est la pastille du dessous qui dit lequel. */
  const ongletCourant = mere ? mere.id : current;

  /*
    LES ONGLETS, PRINCIPAUX ET SECONDAIRES, D'UN SEUL DESSIN (Louis, 12/11/2026) :
    texte, trait de 2 px sous l'onglet choisi, collé au filet de la rangée, droit ;
    l'onglet choisi passe en graisse 600 (celle de l'entrée active de la barre
    latérale) sans pousser ses voisins, la place du gras étant réservée. Plus de
    pastilles pour les sous-rubriques. Fond blanc : le gris est réservé à la barre
    latérale. Une rangée qui déborde montre ses chevrons.
  */
  const onglet = (i: NavItem, actif: boolean) => (
    <NavTarget
      key={i.id}
      href={i.href}
      disabled={i.disabled}
      aria-current={actif ? 'page' : undefined}
      onActivate={() => onChoose(i.id)}
      className={classeDOnglet(actif, i.empty)}
    >
      <TexteDOnglet label={i.label} />
    </NavTarget>
  );

  return (
    <nav aria-label={ariaLabel} className="shrink-0 border-b border-border-soft bg-bg">
      <div className="relative flex items-center gap-sm px-base @min-[640px]/fiche:px-xl">
        <div ref={rangee} role="presentation" onKeyDown={auClavier} data-role="defilement-du-rail" className={RANGEE}>
          {items.map((i) => onglet(i, i.id === ongletCourant))}
        </div>
        <Chevrons rangee={rangee} />

        {onglets ? (
          <SegmentedTabs
            ariaLabel={onglets.ariaLabel}
            value={onglets.value}
            onChange={onglets.onChange}
            segments={onglets.segments}
            className="shrink-0"
          />
        ) : null}

        {recherche ? (
          /* La loupe au bout de la rangée : le libellé devient son nom accessible et son infobulle. */
          <IconButton
            variant="ghost"
            size="sm"
            label={recherche.label}
            title={recherche.label}
            icon={<Icon role="search" size="sm" />}
            onClick={recherche.onOuvrir}
            className="shrink-0"
          />
        ) : null}
      </div>

      {mere?.children?.length ? (
        <div className="relative flex items-center border-t border-border-soft px-base @min-[640px]/fiche:px-xl">
          <div
            ref={sousRangee}
            role="presentation"
            onKeyDown={auClavier}
            aria-label={mere.label}
            data-role="defilement-du-rail"
            className={RANGEE}
          >
            {mere.children.map((e) => onglet(e, e.id === current))}
          </div>
          <Chevrons rangee={sousRangee} />
        </div>
      ) : null}
    </nav>
  );
}

/** Le dessin d'un onglet, principal ou secondaire : un seul, partagé par `RecordRail` et `SubTabs`. */
function classeDOnglet(actif: boolean, vide?: boolean) {
  return cn(
    /* Le trait du courant (2 px) se pose au ras du filet de la rangée. Il le recouvrait par un
       `-mb-px`, mais la rangée défile de côté, donc rogne aussi en hauteur : le pixel débordant
       était coupé et le trait se lisait à 1 px (Louis, 12/11/2026). */
    /* Le focus, au clavier seulement, en anneau fin DANS l'onglet : un contour extérieur était
       rogné haut et bas par la rangée qui défile, et ne laissait que deux traits verticaux
       bleus de part et d'autre de l'onglet (Louis, 12/11/2026). */
    'relative flex shrink-0 items-center gap-xs whitespace-nowrap rounded-control px-sm text-small font-medium outline-none',
    'focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-primary)]',
    'disabled:pointer-events-none disabled:opacity-50',
    actif
      ? 'font-semibold text-primary after:absolute after:inset-x-sm after:bottom-0 after:h-xxs after:bg-primary'
      : vide
        /* Atténuée, jamais éteinte : une rubrique vide se prend, c'est en y allant qu'on la remplit. */
        ? 'text-text-subtle hover:text-text'
        : 'text-text-muted hover:text-text',
  );
}

/** Le libellé d'un onglet, la place du gras réservée : l'onglet choisi passe en gras sans pousser ses voisins. */
function TexteDOnglet({ label }: { label: string }) {
  return <span data-texte={label} className="inline-grid after:invisible after:h-0 after:overflow-hidden after:font-semibold after:content-[attr(data-texte)]">{label}</span>;
}

export interface SubTab {
  id: string;
  label: string;
  /** Ignoré : les onglets ne portent plus de compte (Louis, 12/11/2026). */
  count?: number | string;
}

export interface SubTabsProps {
  /** Ce que la rangée choisit : « Filtrer le fil », « Source ». */
  ariaLabel: string;
  value: string;
  onChange: (id: string) => void;
  tabs: readonly SubTab[];
  className?: string;
}

/**
 * Une barre d'onglets secondaire : la vue d'un contenu, choisie parmi plusieurs
 * (Louis, 12/11/2026 : une rangée de pastilles à sélection EXCLUSIVE est une barre
 * d'onglets, pas des boutons). Le dessin des sous-rubriques de `RecordRail` :
 * texte, l'onglet choisi en gras avec son trait de 2 px collé au filet, même
 * hauteur, chevrons quand elle déborde. Posée sous la barre principale, d'un bord
 * à l'autre. Les pastilles à sélection MULTIPLE restent des `FilterChips`.
 */
export function SubTabs({ ariaLabel, value, onChange, tabs, className }: SubTabsProps) {
  const rangee = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    rangee.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [value]);
  // Un tablist : les flèches passent d'un onglet à l'autre et le choisissent.
  const auClavier = (e: React.KeyboardEvent, i: number) => {
    const pas = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const j = (i + pas + tabs.length) % tabs.length;
    rangee.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[j]?.focus();
    onChange(tabs[j].id);
  };
  return (
    <div className={cn('relative flex shrink-0 items-center border-b border-border-soft bg-bg px-base @min-[640px]/fiche:px-xl', className)}>
      <div ref={rangee} role="tablist" aria-label={ariaLabel} className={RANGEE}>
        {tabs.map((t, i) => {
          const actif = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={actif}
              tabIndex={actif ? 0 : -1}
              onClick={() => onChange(t.id)}
              onKeyDown={(e) => auClavier(e, i)}
              className={classeDOnglet(actif)}
            >
              <TexteDOnglet label={t.label} />
            </button>
          );
        })}
      </div>
      <Chevrons rangee={rangee} />
    </div>
  );
}

/**
 * Les chevrons d'une rangée qui déborde (Louis, 12/11/2026) : à droite tant qu'il
 * reste des onglets à droite, à gauche dès qu'on a défilé, sur un fondu blanc ;
 * un clic avance d'un peu plus d'une demi-rangée. Ils disparaissent en bout de course.
 */
function Chevrons({ rangee }: { rangee: React.RefObject<HTMLDivElement | null> }) {
  const [bords, setBords] = React.useState({ avant: false, apres: false, gauche: 0, droite: 0 });
  React.useEffect(() => {
    const r = rangee.current;
    const parent = r?.parentElement;
    if (!r || !parent) return;
    const mesurer = () => {
      const a = r.getBoundingClientRect();
      const p = parent.getBoundingClientRect();
      const suivant = {
        avant: r.scrollLeft > 1,
        apres: r.scrollLeft + r.clientWidth < r.scrollWidth - 1,
        gauche: Math.round(a.left - p.left),
        droite: Math.round(p.right - a.right),
      };
      setBords((b) => (b.avant === suivant.avant && b.apres === suivant.apres && b.gauche === suivant.gauche && b.droite === suivant.droite ? b : suivant));
    };
    mesurer();
    r.addEventListener('scroll', mesurer, { passive: true });
    const taille = new ResizeObserver(mesurer);
    taille.observe(r);
    taille.observe(parent);
    return () => { r.removeEventListener('scroll', mesurer); taille.disconnect(); };
  }, [rangee]);
  const aller = (sens: 1 | -1) => {
    const r = rangee.current;
    r?.scrollBy({ left: sens * Math.round(r.clientWidth * 0.6), behavior: 'smooth' });
  };
  return (
    <>
      {bords.avant ? (
        <span className="pointer-events-none absolute inset-y-0 z-10 flex items-center bg-linear-to-r from-bg from-60% to-transparent pr-xl" style={{ left: bords.gauche }}>
          <IconButton variant="ghost" size="sm" className="pointer-events-auto" label="Onglets précédents" icon={<Icon role="previous" size="sm" />} onClick={() => aller(-1)} />
        </span>
      ) : null}
      {bords.apres ? (
        <span className="pointer-events-none absolute inset-y-0 z-10 flex items-center justify-end bg-linear-to-l from-bg from-60% to-transparent pl-xl" style={{ right: bords.droite }}>
          <IconButton variant="ghost" size="sm" className="pointer-events-auto" label="Onglets suivants" icon={<Icon role="next" size="sm" />} onClick={() => aller(1)} />
        </span>
      ) : null}
    </>
  );
}

/*
  PLUS DE COMPTE DANS LES ONGLETS (Louis, 12/11/2026) : « Immeubles 2 », « Notes 0 » se
  retirent des barres d'onglets, principales et secondaires. Le `count` d'un `NavItem` ou d'un
  `SubTab` est accepté et ignoré ici ; une liste ou une rubrique dit son nombre elle-même.
*/

/**
 * La rangée pendant le chargement, à la même hauteur : sans elle, la fiche
 * s'ouvre sans onglets, puis ils surgissent et la zone saute.
 */
export function RecordRailSkeleton() {
  return (
    <div aria-hidden="true" className="shrink-0 border-b border-border-soft bg-bg px-base @min-[640px]/fiche:px-xl">
      <div className="flex h-[calc(var(--arq-control-md)+var(--spacing-xs))] items-center gap-base">
        {/* Cinq traits : de quoi occuper la rangée sans prétendre dire combien de rubriques arrivent. */}
        {Array.from({ length: 5 }, (_, i) => (
          /* Le squelette du design system, d'une seule couleur partout (Louis, 12/11/2026). */
          <Skeleton key={i} className="h-base w-5xl shrink-0 rounded-control" />
        ))}
      </div>
    </div>
  );
}

export interface RecordZoneProps {
  children: React.ReactNode;
  /**
   * La colonne d'informations, à droite de la zone (Louis, 12/11/2026, d'après Attio) :
   * 340 px, sous la barre d'onglets, séparée par un filet doux, avec son propre
   * défilement ; la même quel que soit l'onglet. Absente : la zone prend toute la largeur.
   */
  aside?: React.ReactNode;
  /** Le nom de la colonne pour un lecteur d'écran. */
  asideLabel?: string;
}

/**
 * La zone, avec son propre défilement.
 *
 * Un `div` et non un `main` : le shell porte déjà ce repère, et deux `main`
 * imbriqués sont une faute que les lecteurs d'écran signalent.
 */
export function RecordZone({ children, aside, asideLabel = 'Informations' }: RecordZoneProps) {
  const c = React.useContext(ContexteDeZone);
  const busy = c?.busy ?? false;
  const zone = (
    <RecordZoneBody busy={busy} zoneRef={c?.zone}>{children}</RecordZoneBody>
  );
  if (!aside) return zone;
  const colonne = (
    <aside aria-label={asideLabel} className="flex w-[340px] shrink-0 flex-col gap-xl overflow-y-auto border-l border-border-soft px-lg py-base">
      {aside}
    </aside>
  );
  // Dans un `RecordLayout`, la colonne se pose à droite du cadre, à la hauteur des onglets.
  if (c?.aside) return <>{zone}{createPortal(colonne, c.aside)}</>;
  return (
    <div className="flex min-h-0 flex-1">
      {zone}
      {colonne}
    </div>
  );
}

function RecordZoneBody({ busy, zoneRef, children }: { busy: boolean; zoneRef?: React.RefObject<HTMLDivElement | null>; children: React.ReactNode }) {
  const c = { zone: zoneRef };
  return (
    // `@container` : ce qui s'y pose se règle sur la largeur de la zone, pas sur celle de
    // la fenêtre. Un panneau ouvert à côté (l'assistant) la rétrécit sans changer la fenêtre.
    <div ref={c?.zone} aria-busy={busy || undefined} className="@container min-h-0 min-w-0 flex-1 overflow-y-auto">
      {busy ? (
        /* Les marges de la page chargée (24 px de côté et sous les onglets), pas un dessin à part. */
        <div aria-hidden className="flex flex-col gap-xl px-base pt-xl sm:px-xl">
          <Skeleton className="h-40 w-full rounded-block" />
          <Skeleton className="h-24 w-full rounded-block" />
        </div>
      ) : null}
      {/* `contents` : l'enveloppe n'existe pas pour la mise en page tant qu'on ne charge pas. */}
      <div className={busy ? 'hidden' : 'contents'}>{children}</div>
    </div>
  );
}
