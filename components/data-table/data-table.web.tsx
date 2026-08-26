import * as React from 'react';

import { cn } from '../_lib/cn';

export interface DataTableProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'children'> {
  titre: string;
  /** Précision affichée à côté du titre (« Les cotes sont en mm »). */
  note?: string;
  colonnes: readonly string[];
  /** Une entrée par ligne, chacune dans l'ordre des colonnes. */
  lignes: readonly (readonly string[])[];
}

/** Une valeur absente s'annonce, elle ne laisse pas une case blanche. */
const VIDE = '—';

export function DataTable({
  titre,
  note,
  colonnes,
  lignes,
  className,
  ...props
}: DataTableProps) {
  return (
    <section
      className={cn('overflow-hidden rounded-md border border-border-soft bg-bg', className)}
      {...props}
    >
      <div className="flex items-baseline gap-md border-b border-border-soft bg-bg-subtle px-base py-md">
        <span className="text-small font-bold text-text">{titre}</span>
        {note ? <span className="text-caption text-text-muted">{note}</span> : null}
      </div>

      {/* Le défilement vit ici, jamais sur la page : des cotes comprimées
          deviennent illisibles, et une cote mal lue est une cote fausse. */}
      <div className="overflow-x-auto px-base py-md">
        {lignes.length === 0 ? (
          <p className="text-small text-text-muted">Aucune mesure relevée.</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {colonnes.map((colonne) => (
                  <th
                    key={colonne}
                    scope="col"
                    className="whitespace-nowrap px-sm pb-sm text-caption font-bold tracking-wide text-text-muted uppercase first:pl-0"
                  >
                    {colonne}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne, i) => (
                <tr key={i} className="border-t border-border-soft">
                  {colonnes.map((colonne, j) => {
                    const valeur = ligne[j];
                    const absente = valeur == null || valeur === '';
                    return (
                      <td
                        key={colonne}
                        className={cn(
                          'whitespace-nowrap px-sm py-sm text-small first:pl-0',
                          absente ? 'text-text-muted' : 'text-text',
                        )}
                      >
                        {absente ? VIDE : valeur}
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
