import * as React from 'react';

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
  const valeur = React.useMemo(() => ({ busy, setBusy, zone }), [busy]);
  return (
    <ContexteDeZone.Provider value={valeur}>
      {/* Deux boîtes : une requête de conteneur ne s'applique pas à l'élément qui
          EST le conteneur. L'extérieure se mesure, l'intérieure porte la colonne. */}
      <div className={`@container/fiche flex flex-col overflow-hidden bg-bg ${className}`}>
        <div className="flex min-h-0 flex-1 flex-col items-stretch overflow-hidden">
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

/*
  La rangée rentre sa marge de gauche d'autant que le premier onglet porte de
  retrait intérieur : son libellé tombe ainsi sur la verticale du titre de
  l'en-tête et du contenu, au lieu de huit pixels plus loin. Elle défile de
  côté quand la largeur manque, sans barre : l'onglet courant est ramené en vue.
*/
const RANGEE = '-mx-sm flex h-3xl min-w-0 flex-1 items-stretch gap-xxs overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

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

  return (
    <nav aria-label={ariaLabel} className="shrink-0 border-b border-border-soft bg-bg">
      <div className="flex items-center gap-sm px-base @min-[640px]/fiche:px-xl">
        <div ref={rangee} role="presentation" onKeyDown={auClavier} data-role="defilement-du-rail" className={RANGEE}>
          {items.map((i) => {
            const actif = i.id === ongletCourant;
            return (
              <NavTarget
                key={i.id}
                href={i.href}
                disabled={i.disabled}
                aria-current={actif ? 'page' : undefined}
                onActivate={() => onChoose(i.id)}
                className={cn(
                  // Le trait du courant se pose SUR le filet de la rangée, pas au-dessus : `-mb-px` est le pixel de ce filet.
                  'relative -mb-px flex shrink-0 items-center gap-xs whitespace-nowrap px-sm text-small font-medium outline-none focus-ring',
                  'disabled:pointer-events-none disabled:opacity-50',
                  // La graisse ne change pas : la rangée ne bouge pas d'un pixel quand on change d'onglet.
                  actif
                    ? 'text-primary after:absolute after:inset-x-sm after:bottom-0 after:h-xxs after:rounded-full after:bg-primary'
                    : i.empty
                      /* Atténuée, jamais éteinte : une rubrique vide se prend, c'est en y allant qu'on la remplit. */
                      ? 'text-text-subtle hover:text-text'
                      : 'text-text-muted hover:text-text',
                )}
              >
                {i.label}
                <Compteur item={i} />
              </NavTarget>
            );
          })}
        </div>

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
          /* La loupe au bout de la rangée, à la place du champ de 284 px qu'elle
             était dans le rail : le libellé devient son nom accessible et son
             infobulle. */
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
        <div className="border-t border-border-soft bg-bg-muted px-base @min-[640px]/fiche:px-xl">
          <div
            ref={sousRangee}
            role="presentation"
            onKeyDown={auClavier}
            aria-label={mere.label}
            className="-mx-sm flex items-center gap-xs overflow-x-auto py-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {mere.children.map((e) => {
              const actif = e.id === current;
              return (
                <NavTarget
                  key={e.id}
                  href={e.href}
                  disabled={e.disabled}
                  aria-current={actif ? 'page' : undefined}
                  onActivate={() => onChoose(e.id)}
                  className={cn(
                    'flex h-(--arq-control-sm) shrink-0 items-center gap-xs whitespace-nowrap rounded-control px-md text-small outline-none focus-ring',
                    'disabled:pointer-events-none disabled:opacity-50',
                    actif ? 'bg-info-bg font-semibold text-on-info-bg' : 'text-text-muted hover:bg-bg hover:text-text',
                  )}
                >
                  {e.label}
                  <Compteur item={e} />
                </NavTarget>
              );
            })}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

/** Le compteur, s'il y en a un : « … » tant qu'on ne sait pas, jamais un « 0 » qui affirme. */
function Compteur({ item }: { item: NavItem }) {
  if (item.count === undefined || item.count === '') return null;
  return (
    <span className="inline-flex h-lg min-w-lg items-center justify-center rounded-full bg-bg-muted px-xs text-caption tabular-nums text-text-muted">
      {item.count}
    </span>
  );
}

/**
 * La rangée pendant le chargement, à la même hauteur : sans elle, la fiche
 * s'ouvre sans onglets, puis ils surgissent et la zone saute.
 */
export function RecordRailSkeleton() {
  return (
    <div aria-hidden="true" className="shrink-0 border-b border-border-soft bg-bg px-base @min-[640px]/fiche:px-xl">
      <div className="flex h-3xl items-center gap-base">
        {/* Cinq traits : de quoi occuper la rangée sans prétendre dire combien de rubriques arrivent. */}
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-base w-5xl shrink-0 animate-pulse rounded-control bg-bg-muted" />
        ))}
      </div>
    </div>
  );
}

export interface RecordZoneProps {
  children: React.ReactNode;
}

/**
 * La zone, avec son propre défilement.
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
