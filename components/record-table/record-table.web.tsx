'use client';

import * as React from 'react';

import { Checkbox } from '../checkbox/checkbox.web';
import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';
import {
  comparer,
  libelleSelection,
  triSuivant,
  type EtatTri,
} from './record-table.logic';

export interface ColonneRecord<T> {
  cle: string;
  entete: string;
  /** Ce qui s'affiche dans la cellule. */
  rendu: (ligne: T) => React.ReactNode;
  /** Ce sur quoi on trie, quand ce n'est pas ce qui s'affiche. */
  valeur?: (ligne: T) => string | number | null | undefined;
  /** Largeur minimale, en CSS. Sans elle, la colonne suit son contenu. */
  largeur?: string;
  /** Aligne à droite et met les chiffres à chasse fixe. */
  numerique?: boolean;
  triable?: boolean;
}

export interface RecordTableProps<T> {
  lignes: readonly T[];
  colonnes: readonly ColonneRecord<T>[];
  cleDe: (ligne: T) => string;
  /**
   * La colonne qui nomme la ligne. Elle reste visible au défilement
   * horizontal : sans elle, on ne sait plus de quelle ligne on lit les valeurs.
   */
  identite: {
    entete: string;
    rendu: (ligne: T) => React.ReactNode;
    valeur?: (ligne: T) => string | number;
  };
  /** Ouvrir un enregistrement. Sans lui, l'identité ne devient pas cliquable. */
  onOuvrir?: (ligne: T) => void;
  /** Sélection multiple. Sans elle, pas de colonne de cases. */
  selection?: {
    valeurs: ReadonlySet<string>;
    onChange: (valeurs: Set<string>) => void;
    /** Le singulier de ce qui est listé, pour le décompte : « équipement ». */
    nom: string;
    pluriel?: string;
  };
  tri?: {
    etat: EtatTri | null;
    onChange: (etat: EtatTri | null) => void;
  };
  /** Ce qui s'affiche quand il n'y a aucune ligne. Un `EmptyState`, en général. */
  vide?: React.ReactNode;
  className?: string;
}

export function RecordTable<T>({
  lignes,
  colonnes,
  cleDe,
  identite,
  onOuvrir,
  selection,
  tri,
  vide,
  className,
}: RecordTableProps<T>) {
  const rangees = React.useMemo(() => {
    if (!tri?.etat) return lignes;
    const col = colonnes.find((c) => c.cle === tri.etat!.cle);
    const lire =
      col?.valeur ??
      (tri.etat.cle === 'identite' ? identite.valeur : undefined) ??
      (() => null);
    return [...lignes].sort((a, b) => comparer(lire(a), lire(b), tri.etat!.sens));
  }, [lignes, colonnes, tri?.etat, identite]);

  if (lignes.length === 0 && vide) return <>{vide}</>;

  const cles = rangees.map(cleDe);
  const toutes = cles.length > 0 && cles.every((c) => selection!.valeurs.has(c));
  const nbCoche = selection ? cles.filter((c) => selection.valeurs.has(c)).length : 0;

  function basculer(cle: string) {
    if (!selection) return;
    const s = new Set(selection.valeurs);
    if (s.has(cle)) s.delete(cle);
    else s.add(cle);
    selection.onChange(s);
  }

  // La case et l'identité restent en place quand les colonnes défilent, et
  // l'en-tête quand on défile verticalement. Les deux se croisent au coin haut
  // gauche : il lui faut un cran de plus, sinon une cellule passe par-dessus.
  const colleCase = 'sticky left-0 z-20';
  const colleIdentite = cn('sticky z-20', selection ? 'left-10' : 'left-0');

  // Les en-têtes : petites capitales, sur le fond discret, collées en haut.
  const styleEntete =
    'sticky top-0 z-30 border-b border-border-soft bg-bg-subtle px-md py-sm ' +
    'text-caption font-bold tracking-[.5px] whitespace-nowrap text-text-muted uppercase';

  // Rendu, pas composant : un sous-composant défini dans le corps du parent
  // change d'identité à chaque rendu, et React remonte alors tout l'en-tête —
  // le focus se perd au premier tri, et le bouton cliqué n'est plus le même.
  function entete(cle: string, libelle: React.ReactNode) {
    if (!tri) return libelle;
    const actif = tri.etat?.cle === cle;
    return (
      <button
        type="button"
        onClick={() => tri.onChange(triSuivant(tri.etat, cle))}
        className="inline-flex items-center gap-xxs rounded-control hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {libelle}
        {actif && (
          <Icon
            role={tri.etat!.sens === 'croissant' ? 'replier' : 'deplier'}
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
                className={cn(colleCase, styleEntete, 'z-40 w-10 py-sm pr-0 pl-xl')}
              >
                <Checkbox
                  checked={toutes}
                  onCheckedChange={() =>
                    selection.onChange(toutes ? new Set() : new Set(cles))
                  }
                  aria-label={toutes ? 'Tout désélectionner' : 'Tout sélectionner'}
                />
              </th>
            )}
            <th
              scope="col"
              className={cn(colleIdentite, styleEntete, 'z-40')}
              aria-sort={
                tri?.etat?.cle === 'identite'
                  ? tri.etat.sens === 'croissant'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              }
            >
              {entete('identite', identite.entete)}
            </th>
            {colonnes.map((c, i) => (
              <th
                key={c.cle}
                scope="col"
                style={c.largeur ? { minWidth: c.largeur } : undefined}
                className={cn(
                  styleEntete,
                  c.numerique && 'text-right',
                  i === colonnes.length - 1 && 'pr-xl',
                )}
                aria-sort={
                  tri?.etat?.cle === c.cle
                    ? tri.etat.sens === 'croissant'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {c.triable === false ? c.entete : entete(c.cle, c.entete)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rangees.map((ligne) => {
            const cle = cleDe(ligne);
            const coche = selection?.valeurs.has(cle) ?? false;
            const fond = coche ? 'bg-info-bg' : 'bg-bg';
            return (
              <tr key={cle} className={cn(fond, !coche && 'hover:bg-bg-muted')}>
                {selection && (
                  <td className={cn(colleCase, fond, 'border-b border-border-soft py-0 pr-0 pl-xl')}>
                    <Checkbox
                      checked={coche}
                      onCheckedChange={() => basculer(cle)}
                      aria-label={`Sélectionner ${cle}`}
                    />
                  </td>
                )}
                <td
                  className={cn(
                    colleIdentite,
                    fond,
                    'border-b border-border-soft px-md py-[10px] font-semibold whitespace-nowrap',
                  )}
                >
                  {onOuvrir ? (
                    <button
                      type="button"
                      onClick={() => onOuvrir(ligne)}
                      className="rounded-control text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {identite.rendu(ligne)}
                    </button>
                  ) : (
                    <span>{identite.rendu(ligne)}</span>
                  )}
                </td>
                {colonnes.map((c, i) => (
                  <td
                    key={c.cle}
                    className={cn(
                      'border-b border-border-soft px-md py-[10px] whitespace-nowrap',
                      c.numerique && 'text-right tabular-nums',
                      i === colonnes.length - 1 && 'pr-xl',
                    )}
                  >
                    {c.rendu(ligne)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {selection && nbCoche > 0 && (
        <p className="sr-only" aria-live="polite">
          {libelleSelection(nbCoche, selection.nom, selection.pluriel)}
        </p>
      )}
    </div>
  );
}
