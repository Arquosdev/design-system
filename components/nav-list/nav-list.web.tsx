'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

export interface NavItem {
  cle: string;
  label: string;
  /**
   * Ce que contient la rubrique. Une chaîne est acceptée pour pouvoir dire
   * « … » tant qu'on ne sait pas — `0` affirmerait qu'il n'y a rien.
   */
  compteur?: number | string;
  desactive?: boolean;
  /**
   * La rubrique existe mais n'a encore rien à montrer : son libellé s'atténue,
   * et elle RESTE cliquable — c'est en y allant qu'on la remplit. À ne pas
   * confondre avec `desactive`, qui dit « hors sujet sur cet objet » et retire
   * le clic. Né dans la fiche équipement le 21/09/2026 : un client trouvait
   * les champs vides « trop lourds » ; la fiche les cache désormais en lecture,
   * et le menu doit alors dire, sans interdire, où il n'y a rien.
   */
  vide?: boolean;
  /**
   * Les sous-rubriques de cette entrée. L'entrée devient dépliante : elle
   * garde l'aspect des autres — même casse, même hauteur, même pastille quand
   * elle est courante — et porte un chevron à droite. Un clic ouvre la rubrique
   * ET déplie ; il n'y a donc pas deux gestes à apprendre pour une seule ligne.
   *
   * À ne pas confondre avec `titre` + `repliable`, qui coiffe une LISTE d'un
   * intitulé en capitales : celui-ci est un titre de section, et il jure au
   * milieu d'entrées écrites en minuscules — c'est ce qu'a montré le rail de la
   * fiche équipement le 21/09/2026.
   */
  enfants?: NavItem[];
}

export interface NavListProps {
  /**
   * Intitulé du groupe. À omettre quand ce qui précède le dit déjà — un onglet
   * « Composants » suivi d'un intitulé « COMPOSANTS » ne fait que répéter.
   */
  titre?: string;
  items: readonly NavItem[];
  courant?: string;
  onChoisir: (cle: string) => void;
  /** Rend l'intitulé cliquable, pour replier le groupe. */
  repliable?: boolean;
  /** Ouvert au premier rendu. Sans effet si le groupe n'est pas repliable. */
  ouvertParDefaut?: boolean;
  className?: string;
}

export function NavList({
  titre,
  items,
  courant,
  onChoisir,
  repliable = false,
  ouvertParDefaut = true,
  className,
}: NavListProps) {
  const [ouvert, setOuvert] = React.useState(ouvertParDefaut);
  // Un groupe replié qui contient la rubrique ouverte la cacherait : on le
  // laisse déplié tant qu'elle est dedans.
  const contientCourant = items.some((i) => i.cle === courant);
  const deplie = !repliable || ouvert || contientCourant;

  const intitule = (
    <span className="flex-1 text-left text-caption font-bold tracking-wide uppercase">
      {titre}
    </span>
  );

  return (
    <div className={cn('shrink-0', className)}>
      {!titre ? null : repliable ? (
        <button
          type="button"
          aria-expanded={deplie}
          onClick={() => setOuvert(!deplie)}
          className="flex w-full items-center gap-sm rounded-control px-md pb-sm text-text-muted outline-none hover:text-text focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon
            role="deplier"
            size="xs"
            className={cn('transition-transform duration-(--arq-duration-normal)', deplie ? 'rotate-0' : '-rotate-90')}
          />
          {intitule}
          <span className="shrink-0 tabular-nums text-small">{items.length}</span>
        </button>
      ) : (
        <div className="flex px-md pb-sm text-text-muted">{intitule}</div>
      )}

      <div className={cn('flex flex-col gap-xxs', !deplie && 'hidden')}>
        {items.map((item) =>
          item.enfants?.length ? (
            <EntreeDepliante
              key={item.cle}
              item={item}
              courant={courant}
              onChoisir={onChoisir}
            />
          ) : (
            <Entree key={item.cle} item={item} courant={courant} onChoisir={onChoisir} />
          ),
        )}
      </div>
    </div>
  );
}

/**
 * Une entrée qui porte des sous-rubriques.
 *
 * Elle reste ouverte tant que la rubrique courante est l'une des siennes —
 * sinon ouvrir une sous-rubrique refermerait le chemin qu'on vient de prendre.
 */
function EntreeDepliante({
  item,
  courant,
  onChoisir,
}: {
  item: NavItem;
  courant?: string;
  onChoisir: (cle: string) => void;
}) {
  const enfants = item.enfants ?? [];
  const tientLeCourant = enfants.some((e) => e.cle === courant);
  /*
    LE REPLI APPARTIENT À CELUI QUI CLIQUE, MÊME DEPUIS UNE SOUS-RUBRIQUE.

    La première version forçait l'ouverture tant que la rubrique courante était
    l'une des siennes — `ouvert || tientLeCourant`. Conséquence : une fois sur
    « Machinerie », le chevron ne refermait plus rien. Thomas, le 21/09/2026 :
    « j'arrive pas à refermer l'accordéon photos quand je suis sur un onglet
    d'une catégorie de photos ».

    L'état suit donc le clic, et rien d'autre. Ce qu'on garde de l'intention
    première : arriver sur une sous-rubrique OUVRE le groupe — c'est l'effet
    ci-dessous, qui ne joue qu'au passage de faux à vrai, donc jamais pour
    rouvrir ce que la personne vient de fermer.
  */
  const [ouvert, setOuvert] = React.useState(tientLeCourant);
  React.useEffect(() => {
    if (tientLeCourant) setOuvert(true);
  }, [tientLeCourant]);
  const deplie = ouvert;
  /* Replié sur une sous-rubrique courante, c'est l'entrée MÈRE qui porte la
     pastille : sinon le rail ne dirait plus où l'on est, et refermer
     reviendrait à se perdre. */
  /* UN ENFANT QUI PORTE LA CLÉ DE SA MÈRE FAIT DE CELLE-CI UN CONTENEUR.
     La fiche équipement range ses sections de photos sous « Photos », et la
     première s'appelle « Toutes » : c'est la rubrique de la mère, listée en
     clair pour qu'on sache y revenir d'une section. Sans cette règle, les deux
     lignes s'allumaient ensemble — deux pastilles empilées se lisent comme un
     défaut. C'est l'enfant qui s'allume, parce que c'est lui qu'on a visé ;
     la mère ne reprend la pastille que repliée, où l'enfant ne se voit plus. */
  const enfantHomonyme = enfants.some((e) => e.cle === item.cle);
  const portePastille =
    (!enfantHomonyme && item.cle === courant) || (!deplie && tientLeCourant);
  return (
    <div className="flex flex-col gap-xxs">
      <Entree
        item={item}
        courant={portePastille ? item.cle : courant}
        /*
          TOUTE LA LIGNE REPLIE, DÈS QU'ON Y EST DÉJÀ.

          Thomas, le 21/09/2026 : « j'aimerai aussi qu'on puisse replier ou
          ouvrir en cliquant sur toute la zone bleue ». Le chevron seul demandait
          de viser seize pixels pour un geste qu'on fait souvent.

          La règle tient en une phrase : la ligne mène à sa rubrique tant qu'on
          n'y est pas, et replie une fois qu'on y est. Pastille allumée, le clic
          ne peut de toute façon plus rien ouvrir de neuf — on y est — donc il
          n'enlève rien et donne la cible large.
        */
        onChoisir={(cle) => {
          if (portePastille) {
            setOuvert(!deplie);
            return;
          }
          setOuvert(true);
          onChoisir(cle);
        }}
        chevron={deplie}
        surChevron={() => setOuvert(!deplie)}
      />
      {/* Le filet rattache les sous-rubriques à la leur : sans lui, le retrait
          seul se lit comme un défaut d'alignement. */}
      <div
        className={cn(
          'ml-md flex flex-col gap-xxs border-l border-border-soft pl-xs',
          !deplie && 'hidden',
        )}
      >
        {enfants.map((e) => (
          <Entree key={e.cle} item={e} courant={courant} onChoisir={onChoisir} />
        ))}
      </div>
    </div>
  );
}

/*
  LA MISE EN FORME D'UNE LIGNE, ÉCRITE UNE FOIS.

  `px-md` et non `px-xs` : le fond teinté de l'entrée courante est une pastille,
  et une pastille qui touche ses mots se lit comme un défaut d'alignement.

  Une entrée au repos est en `medium`, pas en normal. C'est un menu, pas du
  texte courant : ses mots se balaient du regard. L'entrée courante garde
  `semibold` — un échelon la sépare toujours des autres, et c'est ce contraste,
  pas la graisse en soi, qui dit où l'on est.
*/
const LIGNE = 'flex w-full items-center gap-sm rounded-control text-left text-small';
const ETAT = (actif: boolean, vide?: boolean) =>
  actif
    ? 'bg-info-bg font-semibold text-on-info-bg'
    : vide
      ? /* Atténuée, jamais éteinte : `textMuted` reste un texte lisible
           (5,34 sur blanc), et le survol la rend à l'encre pleine — c'est une
           entrée qu'on peut prendre, pas une entrée qui refuse. */
        'font-medium text-text-muted hover:bg-bg-muted hover:text-text'
      : 'font-medium text-text hover:bg-bg-muted';

/** Le compteur, s'il y en a un. */
function Compteur({ item, actif }: { item: NavItem; actif: boolean }) {
  if (item.compteur === undefined || item.compteur === '') return null;
  return (
    // Chasse fixe : sans elle les nombres dansent d'une ligne à l'autre. Sur la
    // ligne courante, le compteur prend l'encre appairée du fond `infoBg` :
    // `textMuted` y tombe à 4,47 — juste sous le seuil. Le fond est sur le
    // parent et la couleur sur l'enfant, donc le contrôle de contraste ne peut
    // pas le voir.
    <span
      className={cn('shrink-0 tabular-nums text-small', actif ? 'text-on-info-bg' : 'text-text-muted')}
    >
      {item.compteur}
    </span>
  );
}

function Entree({
  item,
  courant,
  onChoisir,
  chevron,
  surChevron,
}: {
  item: NavItem;
  courant?: string;
  onChoisir: (cle: string) => void;
  /** Présent : l'entrée porte un chevron, tourné vers le bas quand c'est vrai. */
  chevron?: boolean;
  surChevron?: () => void;
}) {
  const actif = item.cle === courant;

  if (chevron === undefined) {
    return (
      <button
        type="button"
        // `aria-current` en plus du fond teinté : la couleur seule ne dit rien à
        // un lecteur d'écran.
        aria-current={actif ? 'page' : undefined}
        disabled={item.desactive}
        onClick={() => onChoisir(item.cle)}
        className={cn(
          LIGNE,
          'px-md py-sm outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          ETAT(actif, item.vide),
        )}
      >
        <span className="flex-1">{item.label}</span>
        <Compteur item={item} actif={actif} />
      </button>
    );
  }

  /*
    DEUX BOUTONS, PAS UN SEUL AVEC UNE ZONE CLIQUABLE DEDANS.

    Le chevron replie sans changer de rubrique : c'est une action à part, donc
    une cible à part. Posé en `<span onClick>` dans le bouton — ce qu'il était
    au premier jet — la tabulation ne l'atteignait jamais, et replier devenait
    impossible au clavier. Un bouton dans un bouton n'existe pas en HTML : la
    ligne devient donc une boîte qui porte la pastille, et les deux boutons
    vivent dedans.
  */
  return (
    <div className={cn(LIGNE, ETAT(actif, item.vide), 'pr-xxs', item.desactive && 'opacity-50')}>
      <button
        type="button"
        aria-current={actif ? 'page' : undefined}
        disabled={item.desactive}
        onClick={() => onChoisir(item.cle)}
        className={cn(
          'flex flex-1 items-center gap-sm rounded-control py-sm pl-md text-left outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none',
        )}
      >
        <span className="flex-1">{item.label}</span>
        <Compteur item={item} actif={actif} />
      </button>
      <button
        type="button"
        aria-expanded={chevron}
        aria-label={`${chevron ? 'Replier' : 'Déplier'} ${item.label}`}
        disabled={item.desactive}
        onClick={() => surChevron?.()}
        className={cn(
          'shrink-0 rounded-control p-xs outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none',
          actif ? 'text-on-info-bg' : 'text-text-muted hover:text-text',
        )}
      >
        <Icon
          role="deplier"
          size="xs"
          className={cn(
            'transition-transform duration-(--arq-duration-normal)',
            chevron ? 'rotate-0' : '-rotate-90',
          )}
        />
      </button>
    </div>
  );
}

