'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

export interface NavItem {
  id: string;
  label: string;
  /**
   * Ce que contient la rubrique. Une chaîne est acceptée pour pouvoir dire
   * « … » tant qu'on ne sait pas — `0` affirmerait qu'il n'y a rien.
   */
  count?: number | string;
  disabled?: boolean;
  /**
   * La rubrique existe mais n'a encore rien à montrer : son libellé s'atténue,
   * et elle RESTE cliquable — c'est en y allant qu'on la remplit. À ne pas
   * confondre avec `disabled`, qui dit « hors sujet sur cet objet » et retire
   * le clic. Né dans la fiche équipement le 21/09/2026 : un client trouvait
   * les champs vides « trop lourds » ; la fiche les cache désormais en lecture,
   * et le menu doit alors dire, sans interdire, où il n'y a rien.
   */
  empty?: boolean;
  /**
   * Les sous-rubriques de cette entrée. L'entrée devient dépliante : elle
   * garde l'aspect des autres — même casse, même hauteur, même pastille quand
   * elle est courante — et porte un chevron à droite. Un clic ouvre la rubrique
   * ET déplie ; il n'y a donc pas deux gestes à apprendre pour une seule ligne.
   *
   * À ne pas confondre avec `title` + `collapsible`, qui coiffe une LISTE d'un
   * intitulé en capitales : celui-ci est un titre de section, et il jure au
   * milieu d'entrées écrites en minuscules — c'est ce qu'a montré le rail de la
   * fiche équipement le 21/09/2026.
   */
  children?: NavItem[];
}

export interface NavListProps {
  /**
   * Intitulé du groupe. À omettre quand ce qui précède le dit déjà — un onglet
   * « Composants » suivi d'un intitulé « COMPOSANTS » ne fait que répéter.
   */
  title?: string;
  items: readonly NavItem[];
  current?: string;
  onChoose: (id: string) => void;
  /** Rend l'intitulé cliquable, pour replier le groupe. */
  collapsible?: boolean;
  /** Ouvert au premier rendu. Sans effet si le groupe n'est pas repliable. */
  defaultOpen?: boolean;
  className?: string;
}

export function NavList({
  title,
  items,
  current,
  onChoose,
  collapsible = false,
  defaultOpen = true,
  className,
}: NavListProps) {
  const [ouvert, setOuvert] = React.useState(defaultOpen);
  // Un groupe replié qui contient la rubrique ouverte la cacherait : on le
  // laisse déplié tant qu'elle est dedans.
  const containsCurrent = items.some((i) => i.id === current);
  const expanded = !collapsible || ouvert || containsCurrent;

  const heading = (
    <span className="flex-1 text-left font-mono text-plate uppercase">
      {title}
    </span>
  );

  return (
    <div className={cn('shrink-0', className)}>
      {!title ? null : collapsible ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setOuvert(!expanded)}
          className="flex w-full items-center gap-sm rounded-control px-md pb-sm text-text-muted outline-none hover:text-text focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon
            role="expand"
            size="xs"
            className={cn('transition-transform duration-(--arq-duration-normal)', expanded ? 'rotate-0' : '-rotate-90')}
          />
          {heading}
          <span className="shrink-0 tabular-nums text-small">{items.length}</span>
        </button>
      ) : (
        <div className="flex px-md pb-sm text-text-muted">{heading}</div>
      )}

      <div className={cn('flex flex-col gap-xxs', !expanded && 'hidden')}>
        {items.map((item) =>
          item.children?.length ? (
            <ExpandableEntry
              key={item.id}
              item={item}
              current={current}
              onChoose={onChoose}
            />
          ) : (
            <Entry key={item.id} item={item} current={current} onChoose={onChoose} />
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
function ExpandableEntry({
  item,
  current,
  onChoose,
}: {
  item: NavItem;
  current?: string;
  onChoose: (id: string) => void;
}) {
  const children = item.children ?? [];
  const tientLeCourant = children.some((e) => e.id === current);
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
  const expanded = ouvert;
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
  const enfantHomonyme = children.some((e) => e.id === item.id);
  const portePastille =
    (!enfantHomonyme && item.id === current) || (!expanded && tientLeCourant);
  return (
    <div className="flex flex-col gap-xxs">
      <Entry
        item={item}
        /* `undefined` et non `current` : cette ligne-ci ne se compare qu'à
           elle-même, et lui repasser `current` la rallumait dès que la clé
           correspondait — ce qui est justement le cas d'une mère dont un enfant
           porte sa clé. `portePastille` reste alors le seul juge. */
        current={portePastille ? item.id : undefined}
        /*
          TOUTE LA LIGNE REPLIE, DÈS QU'ON EST DANS LE GROUPE.

          Thomas, le 21/09/2026 : « j'aimerai aussi qu'on puisse replier ou
          ouvrir en cliquant sur toute la zone bleue ». Le chevron seul demandait
          de viser seize pixels pour un geste qu'on fait souvent.

          La règle tient en une phrase : **la ligne mène à sa rubrique tant
          qu'on n'y est pas, et bascule une fois qu'on y est.** Dedans, le clic
          ne peut de toute façon rien ouvrir de neuf, donc il n'enlève rien et
          donne la cible large.

          Ce n'est PAS `portePastille` qui en décide, et c'est la correction du
          22/09/2026 — « je dois pouvoir fermer la rubrique photo en cliquant
          sur toute la zone de photos ». Depuis qu'un enfant porte la clé de sa
          mère (« Toutes » sous « Photos »), la mère ne s'allume plus quand le
          groupe est ouvert : la ligne ne refermait donc jamais. La pastille dit
          où l'on est, pas ce que le clic doit faire ; les deux questions se
          séparent ici.

          « Dedans » comprend la clé de la mère elle-même : sur « Toutes », on
          est bien dans le groupe.
        */
        onChoose={(id) => {
          const dedans = tientLeCourant || item.id === current;
          if (dedans) {
            setOuvert(!expanded);
            return;
          }
          /* Dehors, la ligne mène — même si le groupe était resté ouvert
             derrière nous. La refermer alors surprendrait : on visait Photos. */
          setOuvert(true);
          onChoose(id);
        }}
        chevron={expanded}
        onChevron={() => setOuvert(!expanded)}
      />
      {/* Le filet rattache les sous-rubriques à la leur : sans lui, le retrait
          seul se lit comme un défaut d'alignement. */}
      <div
        className={cn(
          'ml-md flex flex-col gap-xxs border-l border-border-soft pl-xs',
          !expanded && 'hidden',
        )}
      >
        {children.map((e) => (
          <Entry key={e.id} item={e} current={current} onChoose={onChoose} />
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
const ROW = 'flex w-full items-center gap-sm rounded-control text-left text-small';
const STATE = (active: boolean, empty?: boolean) =>
  active
    ? 'bg-info-bg font-semibold text-on-info-bg'
    : empty
      ? /* Atténuée, jamais éteinte : `textMuted` reste un texte lisible
           (5,34 sur blanc), et le survol la rend à l'encre pleine — c'est une
           entrée qu'on peut prendre, pas une entrée qui refuse. */
        'font-medium text-text-muted hover:bg-bg-muted hover:text-text'
      : 'font-medium text-text hover:bg-bg-muted';

/** Le compteur, s'il y en a un. */
function Count({ item, active }: { item: NavItem; active: boolean }) {
  if (item.count === undefined || item.count === '') return null;
  return (
    // Chasse fixe : sans elle les nombres dansent d'une ligne à l'autre. Sur la
    // ligne courante, le compteur prend l'encre appairée du fond `infoBg` :
    // `textMuted` y tombe à 4,47 — juste sous le seuil. Le fond est sur le
    // parent et la couleur sur l'enfant, donc le contrôle de contraste ne peut
    // pas le voir.
    <span
      className={cn('shrink-0 tabular-nums text-small', active ? 'text-on-info-bg' : 'text-text-muted')}
    >
      {item.count}
    </span>
  );
}

function Entry({
  item,
  current,
  onChoose,
  chevron,
  onChevron,
}: {
  item: NavItem;
  current?: string;
  onChoose: (id: string) => void;
  /** Présent : l'entrée porte un chevron, tourné vers le haut quand c'est vrai. */
  chevron?: boolean;
  onChevron?: () => void;
}) {
  const active = item.id === current;

  if (chevron === undefined) {
    return (
      <button
        type="button"
        // `aria-current` en plus du fond teinté : la couleur seule ne dit rien à
        // un lecteur d'écran.
        aria-current={active ? 'page' : undefined}
        disabled={item.disabled}
        onClick={() => onChoose(item.id)}
        className={cn(
          ROW,
          'px-md py-sm outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          STATE(active, item.empty),
        )}
      >
        <span className="flex-1">{item.label}</span>
        <Count item={item} active={active} />
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
    <div className={cn(ROW, STATE(active, item.empty), 'pr-xxs', item.disabled && 'opacity-50')}>
      <button
        type="button"
        aria-current={active ? 'page' : undefined}
        disabled={item.disabled}
        onClick={() => onChoose(item.id)}
        className={cn(
          'flex flex-1 items-center gap-sm rounded-control py-sm pl-md text-left outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none',
        )}
      >
        <span className="flex-1">{item.label}</span>
        <Count item={item} active={active} />
      </button>
      <button
        type="button"
        aria-expanded={chevron}
        aria-label={`${chevron ? 'Replier' : 'Déplier'} ${item.label}`}
        disabled={item.disabled}
        onClick={() => onChevron?.()}
        className={cn(
          'shrink-0 rounded-control p-xs outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none',
          active ? 'text-on-info-bg' : 'text-text-muted hover:text-text',
        )}
      >
        <Icon
          role="expand"
          size="xs"
          className={cn(
            /*
              FERMÉ VERS LE BAS, OUVERT VERS LE HAUT.

              Thomas, le 22/09/2026 : « pointe vers le bas quand fermé et
              pointe vers le haut quand ouvert ». Il tournait de la droite vers
              le bas — la convention d'un CHEVRON DE GAUCHE, celui qui ouvre une
              branche d'arborescence, comme l'intitulé de groupe au-dessus.
              Posé à DROITE d'une ligne, un chevron se lit autrement : bas pour
              « ça se déplie », haut pour « ça se replie », comme un menu
              déroulant. La rotation reste une rotation, seuls les deux repères
              changent.
            */
            'transition-transform duration-(--arq-duration-normal)',
            chevron ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>
    </div>
  );
}

