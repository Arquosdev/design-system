import * as React from 'react';

import { cn } from '../_lib/cn';

export interface DataTableProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'children'> {
  title: string;
  /** Précision affichée à côté du titre (« Les cotes sont en mm »). */
  note?: string;
  columns: readonly string[];
  /** Une entrée par ligne, chacune dans l'ordre des colonnes. */
  rows: readonly (readonly string[])[];
}

/** Une valeur absente s'annonce, elle ne laisse pas une case blanche. */
const EMPTY = '—';

export function DataTable({
  title,
  note,
  columns,
  rows,
  className,
  ...props
}: DataTableProps) {
  return (
    <section
      className={cn('overflow-hidden rounded-md border border-border-soft bg-bg', className)}
      {...props}
    >
      <div className="flex items-baseline gap-md border-b border-border-soft bg-bg-subtle px-base py-md">
        <span className="text-small font-bold text-text">{title}</span>
        {note ? <span className="text-caption text-text-muted">{note}</span> : null}
      </div>

      {/* Le défilement vit ici, jamais sur la page : des cotes comprimées
          deviennent illisibles, et une cote mal lue est une cote fausse. */}
      <div className="overflow-x-auto px-base py-md">
        {rows.length === 0 ? (
          <p className="text-small text-text-muted">Aucune mesure relevée.</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="whitespace-nowrap px-sm pb-sm text-caption font-bold tracking-wide text-text-muted uppercase first:pl-0"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-border-soft">
                  {columns.map((column, j) => {
                    const value = row[j];
                    const missing = value == null || value === '';
                    return (
                      <td
                        key={column}
                        className={cn(
                          'whitespace-nowrap px-sm py-sm text-small first:pl-0',
                          missing ? 'text-text-muted' : 'text-text',
                        )}
                      >
                        {missing ? EMPTY : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
