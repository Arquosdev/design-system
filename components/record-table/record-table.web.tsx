'use client';

import * as React from 'react';

import { Checkbox } from '../checkbox/checkbox.web';
import { Icon } from '../icon/icon.web';
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
  };
  sort?: {
    state: SortState | null;
    onChange: (state: SortState | null) => void;
  };
  /** Ce qui s'affiche quand il n'y a aucune ligne. Un `EmptyState`, en général. */
  empty?: React.ReactNode;
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
  const allChecked = keys.length > 0 && keys.every((c) => selection!.values.has(c));
  const checkedCount = selection ? keys.filter((c) => selection.values.has(c)).length : 0;

  function toggle(id: string) {
    if (!selection) return;
    const s = new Set(selection.values);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    selection.onChange(s);
  }

  // La case et l'identité restent en place quand les colonnes défilent, et
  // l'en-tête quand on défile verticalement. Les deux se croisent au coin haut
  // gauche : il lui faut un cran de plus, sinon une cellule passe par-dessus.
  const stickyBox = 'sticky left-0 z-20';
  const stickyIdentity = cn('sticky z-20', selection ? 'left-10' : 'left-0');

  // Les en-têtes : petites capitales, sur le fond discret, collées en haut.
  const headerStyle =
    'sticky top-0 z-30 border-b border-border-soft bg-bg-subtle px-md py-sm ' +
    'text-caption font-bold tracking-[.5px] whitespace-nowrap text-text-muted uppercase';

  // Rendu, pas composant : un sous-composant défini dans le corps du parent
  // change d'identité à chaque rendu, et React remonte alors tout l'en-tête —
  // le focus se perd au premier tri, et le bouton cliqué n'est plus le même.
  function header(id: string, label: React.ReactNode) {
    if (!sort) return label;
    const active = sort.state?.column === id;
    return (
      <button
        type="button"
        onClick={() => sort.onChange(nextSort(sort.state, id))}
        className="inline-flex items-center gap-xxs rounded-control hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {label}
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
      <table className="w-max min-w-full border-separate border-spacing-0 text-left text-small">
        <thead>
          <tr>
            {selection && (
              <th
                scope="col"
                className={cn(stickyBox, headerStyle, 'z-40 w-10 py-sm pr-0 pl-xl')}
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
              className={cn(stickyIdentity, headerStyle, 'z-40')}
              aria-sort={
                sort?.state?.column === 'identity'
                  ? sort.state.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              }
            >
              {header('identity', identity.header)}
            </th>
            {columns.map((c, i) => (
              <th
                key={c.id}
                scope="col"
                style={c.width ? { minWidth: c.width } : undefined}
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
                {c.sortable === false ? c.header : header(c.id, c.header)}
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
              <tr key={id} className={cn(fond, !check && 'hover:bg-bg-muted')}>
                {selection && (
                  <td className={cn(stickyBox, fond, 'border-b border-border-soft py-0 pr-0 pl-xl')}>
                    <Checkbox
                      checked={check}
                      onCheckedChange={() => toggle(id)}
                      aria-label={`Sélectionner ${id}`}
                    />
                  </td>
                )}
                <td
                  className={cn(
                    stickyIdentity,
                    fond,
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
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {selection && checkedCount > 0 && (
        <p className="sr-only" aria-live="polite">
          {selectionLabel(checkedCount, selection.name, selection.plural)}
        </p>
      )}
    </div>
  );
}
