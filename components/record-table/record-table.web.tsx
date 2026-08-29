'use client';

import * as React from 'react';

import { Checkbox } from '../checkbox/checkbox.web';
import { Icon } from '../icon/icon.web';
import type { IconRole } from '../../src/icons';
import { cn } from '../_lib/cn';
import {
  compare,
  selectionLabel,
  nextSort,
  type SortState,
} from './record-table.logic';

export interface RecordColumn<T> {
  id: string;
  header: string;
  /** Ce qui s'affiche dans la cellule. */
  render: (row: T) => React.ReactNode;
  /** Ce sur quoi on trie, quand ce n'est pas ce qui s'affiche. */
  value?: (row: T) => string | number | null | undefined;
  /** Largeur minimale, en CSS. Sans elle, la colonne suit son contenu. */
  width?: string;
  /** Aligne à droite et met les chiffres à chasse fixe. */
  numeric?: boolean;
  sortable?: boolean;
  /**
   * La nature de ce qu'on va lire, dite par une icône dans l'en-tête.
   *
   * Un tableau du produit peut proposer près de cinq cents colonnes, presque
   * toutes techniques : « Course » avec une règle est une mesure, « Marque
   * machine » avec un A est du texte. On le sait avant d'avoir lu la première
   * cellule. Les rôles `field*` sont là pour ça.
   */
  icon?: IconRole;
}

export interface RecordTableProps<T> {
  rows: readonly T[];
  columns: readonly RecordColumn<T>[];
  rowKey: (row: T) => string;
  /**
   * La colonne qui nomme la ligne. Elle reste visible au défilement
   * horizontal : sans elle, on ne sait plus de quelle ligne on lit les valeurs.
   */
  identity: {
    header: string;
    render: (row: T) => React.ReactNode;
    value?: (row: T) => string | number;
    /** La nature de la colonne d'identité, comme pour les autres. */
    icon?: IconRole;
  };
  /** Ouvrir un enregistrement. Sans lui, l'identité ne devient pas cliquable. */
  onOpen?: (row: T) => void;
  /** Sélection multiple. Sans elle, pas de colonne de cases. */
  selection?: {
    values: ReadonlySet<string>;
    onChange: (values: Set<string>) => void;
    /** Le singulier de ce qui est listé, pour le décompte : « équipement ». */
    name: string;
    plural?: string;
    /** Le genre de ce qui est listé : « 3 affaires sélectionnéEs ». */
    feminine?: boolean;
  };
  sort?: {
    state: SortState | null;
    onChange: (state: SortState | null) => void;
  };
  /** Ce qui s'affiche quand il n'y a aucune ligne. Un `EmptyState`, en général. */
  empty?: React.ReactNode;
  /**
   * Les largeurs réglées à la main, par identifiant de colonne, en pixels.
   *
   * Le composant ne les retient pas : elles appartiennent à l'écran, qui sait
   * où les ranger — dans l'URL, dans une vue enregistrée. Un tableau qui
   * oublierait ses largeurs à chaque changement de page n'aurait rien réglé.
   */
  widths?: Record<string, number>;
  onWidths?: (w: Record<string, number>) => void;
  className?: string;
}

export function RecordTable<T>({
  rows,
  columns,
  rowKey,
  identity,
  onOpen,
  selection,
  sort,
  empty,
  widths,
  onWidths,
  className,
}: RecordTableProps<T>) {
  const sorted = React.useMemo(() => {
    if (!sort?.state) return rows;
    const col = columns.find((c) => c.id === sort.state!.column);
    const read =
      col?.value ??
      (sort.state.column === 'identity' ? identity.value : undefined) ??
      (() => null);
    return [...rows].sort((a, b) => compare(read(a), read(b), sort.state!.direction));
  }, [rows, columns, sort?.state, identity]);

  if (rows.length === 0 && empty) return <>{empty}</>;

  const keys = sorted.map(rowKey);
  // `selection` est optionnelle — « sans elle, pas de colonne de cases », dit
  // la fiche — et elle est gardée partout ailleurs. Ici elle ne l'était pas :
  // un tableau sans sélection plantait dès la première ligne. Trouvé par la
  // rubrique de collection d'une fiche, premier appelant à s'en passer.
  const allChecked =
    selection !== undefined && keys.length > 0 && keys.every((c) => selection.values.has(c));
  const checkedCount = selection ? keys.filter((c) => selection.values.has(c)).length : 0;

  function toggle(id: string) {
    if (!selection) return;
    const s = new Set(selection.values);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    selection.onChange(s);
  }

  /**
   * Dès qu'une largeur est réglée, la mise en page passe en `fixed`.
   *
   * En `auto`, une largeur n'est qu'une suggestion : le tableau redistribue
   * l'espace disponible, et rétrécir une colonne ne la rapproche pas de la
   * suivante — le geste semble ne rien faire. En `fixed`, chaque colonne prend
   * exactement ce qu'on lui donne, ce qui oblige à en donner à toutes.
   */
  /*
    Les largeurs PENDANT le glissement, tant que l'appelant n'a pas rattrapé.

    `onWidths` était appelé à chaque mouvement de souris. L'écran des
    Équipements y écrit l'URL : un glissement de vingt-quatre pas déclenchait
    vingt-quatre navigations, donc vingt-quatre requêtes sur trente et un mille
    lignes. Sur une vraie machine, la souris en émet bien davantage, l'interface
    n'a plus le temps de peindre, et le glissement paraît ne rien faire — c'est
    exactement ce que Louis a vu.

    On garde donc la largeur ici le temps du geste, et on ne prévient l'appelant
    qu'au relâchement. `enCours` s'efface quand ce qu'il porte revient par les
    props : jusque-là, l'effacer ferait clignoter la colonne à son ancienne
    largeur le temps d'une image.
  */
  const [enCours, setEnCours] = React.useState<Record<string, number> | null>(null);

  const memesLargeurs = (a: Record<string, number>, b?: Record<string, number>) => {
    const cles = Object.keys(a);
    return !!b
      && cles.length === Object.keys(b).length
      && cles.every((k) => a[k] === b[k]);
  };

  React.useEffect(() => {
    if (enCours && memesLargeurs(enCours, widths)) setEnCours(null);
  });

  const largeurs = enCours ?? widths;

  const regle = largeurs && Object.keys(largeurs).length > 0;
  const LARGEUR_PAR_DEFAUT = 160;
  /*
    La largeur RÉELLE de la colonne des cases, et non celle qu'on souhaite.

    Elle valait 40 pendant que la colonne en mesurait 42 — vingt-quatre pixels
    de retrait à gauche plus la case de dix-huit. Le décalage de la colonne
    d'identité, lui, était écrit `left-10`, soit 40 : les deux colonnes figées
    se chevauchaient donc de deux pixels dès qu'on défilait, et l'identité
    passait par-dessus les cases.

    Une seule valeur, posée sur la cellule ET sur le décalage : les deux ne
    peuvent plus diverger. Changer le retrait de la case oblige à changer ce
    nombre, et le test le dit.
  */
  const LARGEUR_CASE = 42;
  const enPixels = (v?: string) => {
    if (!v) return undefined;
    const rem = /^([\d.]+)rem$/.exec(v);
    if (rem) return Math.round(Number(rem[1]) * 16);
    const px = /^([\d.]+)px$/.exec(v);
    return px ? Math.round(Number(px[1])) : undefined;
  };
  const largeurNum = (id: string, indice?: string) =>
    largeurs?.[id] ?? enPixels(indice) ?? LARGEUR_PAR_DEFAUT;
  const largeurDe = (id: string, indice?: string) =>
    regle ? `${largeurNum(id, indice)}px` : indice;

  // En mise en page fixe, le tableau doit avoir une largeur définie : sur une
  // largeur `max-content`, le navigateur ignore les colonnes qu'on lui donne.
  const largeurTable = regle
    ? (selection ? LARGEUR_CASE : 0)
      + largeurNum('identity')
      + columns.reduce((t, c) => t + largeurNum(c.id, c.width), 0)
    : undefined;

  // La case et l'identité restent en place quand les colonnes défilent, et
  // l'en-tête quand on défile verticalement. Les deux se croisent au coin haut
  // gauche : il lui faut un cran de plus, sinon une cellule passe par-dessus.
  /*
    Les deux colonnes figées, et l'ordre de leurs plans.

    La case passe AU-DESSUS de l'identité : elles ne se recouvrent plus, mais
    si un arrondi de sous-pixel les faisait se toucher, c'est la case qui doit
    gagner — l'identité qui déborde sur la case est ce que l'œil attrape.
    Toutes deux restent au-dessus des colonnes qui défilent, dont le plan est
    automatique.
  */
  const stickyBox = 'sticky left-0 z-20';
  const stickyIdentity = 'sticky z-10';
  // Le décalage vient du même nombre que la largeur : voir `LARGEUR_CASE`.
  const decalageIdentite = { left: selection ? LARGEUR_CASE : 0 };

  // Les en-têtes : petites capitales, sur le fond discret, collées en haut.
  const headerStyle =
    'sticky top-0 z-30 border-b border-border-soft bg-bg-subtle px-md py-sm ' +
    'text-caption font-bold tracking-[.5px] whitespace-nowrap text-text-muted uppercase';

  /**
   * La poignée de redimensionnement, au bord droit d'un en-tête.
   *
   * On suit le pointeur plutôt que d'écouter le survol : une fois la poignée
   * saisie, le curseur sort largement de la colonne, et un `mouseleave`
   * interromprait le geste au premier écart.
   */
  function poignee(id: string, largeurActuelle?: number) {
    if (!onWidths) return null;
    return (
      <span
        role="separator"
        aria-label="Régler la largeur de la colonne"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const th = (e.currentTarget.parentElement as HTMLElement | null);
          const depart = e.clientX;
          const initiale = largeurActuelle ?? th?.getBoundingClientRect().width ?? 120;
          let dernier: Record<string, number> = { ...widths, [id]: initiale };
          const bouger = (m: MouseEvent) => {
            // Un plancher : une colonne réduite à zéro ne se rattrape plus.
            const l = Math.max(64, Math.round(initiale + m.clientX - depart));
            dernier = { ...widths, [id]: l };
            // Pendant le geste, la largeur reste ICI : prévenir l'appelant à
            // chaque mouvement lui ferait recharger son écran soixante fois par
            // seconde.
            setEnCours(dernier);
          };
          const lacher = () => {
            document.removeEventListener('mousemove', bouger);
            document.removeEventListener('mouseup', lacher);
            // Une seule fois, au relâchement : c'est là que la largeur devient
            // une décision, et non plus un geste en cours.
            onWidths(dernier);
          };
          document.addEventListener('mousemove', bouger);
          document.addEventListener('mouseup', lacher);
        }}
        onDoubleClick={() => {
          // Double-clic : la colonne reprend sa largeur naturelle.
          const reste = { ...widths };
          delete reste[id];
          setEnCours(reste);
          onWidths(reste);
        }}
        className="absolute inset-y-0 right-0 w-[5px] cursor-col-resize hover:bg-primary/40"
      />
    );
  }

  // Rendu, pas composant : un sous-composant défini dans le corps du parent
  // change d'identité à chaque rendu, et React remonte alors tout l'en-tête —
  // le focus se perd au premier tri, et le bouton cliqué n'est plus le même.
  function header(id: string, label: React.ReactNode, icone?: IconRole) {
    const contenu = icone ? (
      <>
        <Icon role={icone} aria-hidden className="size-3.5 shrink-0 text-text-subtle" />
        <span className="truncate">{label}</span>
      </>
    ) : (
      label
    );
    if (!sort) return <span className="inline-flex items-center gap-xs">{contenu}</span>;
    const active = sort.state?.column === id;
    return (
      <button
        type="button"
        onClick={() => sort.onChange(nextSort(sort.state, id))}
        // `uppercase` explicite : un bouton n'hérite pas de `text-transform`,
        // et les en-têtes triables s'affichaient en casse normale à côté des
        // non triables, en capitales.
        className="inline-flex max-w-full items-center gap-xs rounded-control uppercase hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {contenu}
        {active && (
          <Icon
            role={sort.state!.direction === 'asc' ? 'collapse' : 'expand'}
            aria-hidden
            className="size-3"
          />
        )}
      </button>
    );
  }

  return (
    <div className={cn('min-h-0 flex-1 overflow-auto', className)}>
      <table
        style={largeurTable ? { width: largeurTable } : undefined}
        className={cn(
          'border-separate border-spacing-0 text-left text-small',
          regle ? 'table-fixed' : 'w-max min-w-full',
        )}
      >
        <thead>
          <tr>
            {selection && (
              <th
                scope="col"
                style={{ width: LARGEUR_CASE }}
                className={cn(stickyBox, headerStyle, 'z-40 py-sm pr-0 pl-xl')}
              >
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={() =>
                    selection.onChange(allChecked ? new Set() : new Set(keys))
                  }
                  aria-label={allChecked ? 'Tout désélectionner' : 'Tout sélectionner'}
                />
              </th>
            )}
            <th
              scope="col"
              style={{
                ...decalageIdentite,
                ...(regle ? { width: largeurDe('identity') } : {}),
              }}
              // Pas de `relative` ici : `sticky` sert déjà de repère aux
              // enfants positionnés, et les deux classes se disputeraient — la
              // dernière gagne, et l'en-tête cesserait de coller au défilement.
              className={cn(stickyIdentity, headerStyle, 'z-40')}
              aria-sort={
                sort?.state?.column === 'identity'
                  ? sort.state.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              }
            >
              {header('identity', identity.header, identity.icon)}
              {poignee('identity', widths?.identity)}
            </th>
            {columns.map((c, i) => (
              <th
                key={c.id}
                scope="col"
                style={
                  regle
                    ? { width: largeurDe(c.id, c.width) }
                    : c.width
                      ? { minWidth: c.width }
                      : undefined
                }
                className={cn(
                  headerStyle,
                  c.numeric && 'text-right',
                  i === columns.length - 1 && 'pr-xl',
                )}
                aria-sort={
                  sort?.state?.column === c.id
                    ? sort.state.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <span className="block overflow-hidden text-ellipsis">
                  {c.sortable === false
                    ? <span className="inline-flex items-center gap-xs">
                        {c.icon
                          ? <Icon role={c.icon} aria-hidden className="size-3.5 shrink-0 text-text-subtle" />
                          : null}
                        <span className="truncate">{c.header}</span>
                      </span>
                    : header(c.id, c.header, c.icon)}
                </span>
                {poignee(c.id, widths?.[c.id])}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sorted.map((row) => {
            const id = rowKey(row);
            const check = selection?.values.has(id) ?? false;
            const fond = check ? 'bg-info-bg' : 'bg-bg';
            return (
              // `group` : les cellules figées portent leur propre fond opaque, sans
              // quoi le contenu défilant passerait dessous. Ce fond recouvre le
              // survol de la ligne, et seule une partie du tableau grisait.
              <tr key={id} className={cn('group', fond, !check && 'hover:bg-bg-muted')}>
                {selection && (
                  <td
                    style={{ width: LARGEUR_CASE }}
                    className={cn(
                      stickyBox,
                      fond,
                      !check && 'group-hover:bg-bg-muted',
                      'border-b border-border-soft py-0 pr-0 pl-xl',
                    )}
                  >
                    <Checkbox
                      checked={check}
                      onCheckedChange={() => toggle(id)}
                      // Le nom de la ligne, pas sa clé : un lecteur d'écran qui
                      // annonce « Sélectionner 84b01673-fa05… » ne dit rien.
                      aria-label={`Sélectionner ${identity.value?.(row) ?? id}`}
                    />
                  </td>
                )}
                <td
                  style={decalageIdentite}
                  className={cn(
                    stickyIdentity,
                    fond,
                    !check && 'group-hover:bg-bg-muted',
                    'border-b border-border-soft px-md py-[10px] font-semibold whitespace-nowrap',
                  )}
                >
                  {onOpen ? (
                    <button
                      type="button"
                      onClick={() => onOpen(row)}
                      className="rounded-control text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {identity.render(row)}
                    </button>
                  ) : (
                    <span>{identity.render(row)}</span>
                  )}
                </td>
                {columns.map((c, i) => (
                  <td
                    key={c.id}
                    className={cn(
                      'border-b border-border-soft px-md py-[10px] whitespace-nowrap',
                      c.numeric && 'text-right tabular-nums',
                      i === columns.length - 1 && 'pr-xl',
                    )}
                  >
                    {regle ? (
                      <span className="block overflow-hidden text-ellipsis">{c.render(row)}</span>
                    ) : (
                      c.render(row)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {selection && checkedCount > 0 && (
        <p className="sr-only" aria-live="polite">
          {selectionLabel(checkedCount, selection.name, selection.plural, selection.feminine)}
        </p>
      )}
    </div>
  );
}
