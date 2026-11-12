'use client';

import * as React from 'react';

import type { IconRole } from '../../src/icons';
import { cn } from '../_lib/cn';
import {
  RecordTable,
  type RecordColumn,
  type RecordTableProps,
} from '../record-table/record-table.web';

/**
 * Une colonne de rubrique : son icône de nature est OBLIGATOIRE.
 *
 * C'est la règle que le type tient à notre place : un en-tête sans icône se
 * voyait sur la fiche équipement à côté de la fiche client, et personne ne
 * l'avait décidé. Le compilateur refuse maintenant l'oubli.
 */
export type SectionColumn<T> = RecordColumn<T> & { icon: IconRole };

export interface SectionTableProps<T> {
  /** Le nom de la rubrique : « Contrats », « États », « Relevés ». */
  title: string;
  /**
   * Le TOTAL, pas le nombre de lignes rendues : « Immeubles 25 » sur un client
   * qui en a trois cents serait un mensonge tranquille. Défaut : `rows.length`.
   */
  count?: number;
  /** Une phrase sous le titre, quand le titre ne suffit pas. */
  description?: React.ReactNode;
  /** À droite du titre : « Ajouter », « Rattacher ». Sous le titre sur un téléphone. */
  actions?: React.ReactNode;
  rows: readonly T[];
  rowKey: (row: T) => string;
  /** La colonne d'identité, avec son icône, comme les autres. */
  identity: RecordTableProps<T>['identity'] & { icon: IconRole };
  columns: readonly SectionColumn<T>[];
  /** Ouvrir l'enregistrement. Absent : l'identité n'est pas cliquable. */
  onOpen?: (row: T) => void;
  /** À la place du tableau quand il n'y a aucune ligne (un `EmptyState`). */
  empty?: React.ReactNode;
  /** Sous le tableau : « 25 sur 300 · Voir tout ». */
  footer?: React.ReactNode;
  /**
   * Trier en cliquant un en-tête : l'état appartient à l'écran (voir `RecordTable`).
   * Les Produits d'un barème se comparent par prix (Thomas, 10/11/2026).
   */
  sort?: RecordTableProps<T>['sort'];
  /** Cocher des lignes pour agir dessus (un devis sur des écarts) : voir `RecordTable`. */
  selection?: RecordTableProps<T>['selection'];
  /** Le détail d'une ligne, déplié sous elle (voir `RecordTable`). */
  detail?: (row: T) => React.ReactNode;
  /** Une bande avant chaque groupe de lignes qui se suivent (l'année). */
  group?: (row: T) => string;
  /** La ligne choisie : fond d'information et filet bleu à gauche. */
  activeKey?: string | null;
  /** Entre le titre et le tableau : des puces de filtre, un bandeau. */
  toolbar?: React.ReactNode;
  /** Le titre en `h2` par défaut ; `h3` sous une sous-rubrique déjà titrée. */
  headingLevel?: 2 | 3;
  className?: string;
}

/**
 * Le tableau d'une rubrique de fiche : le titre et son compte, puis le tableau
 * d'un bord à l'autre de la zone, un filet au-dessus.
 *
 * Le modèle est la rubrique Contrats d'une fiche client (Thomas, 09/11/2026 :
 * « on utilise toujours ce tableau »). Il tient en un composant pour que rien
 * ne se règle au cas par cas :
 *
 * - **le retrait de côté va au titre et au pied, pas au tableau** : ses lignes
 *   touchent les bords de la zone, comme la Facturation ;
 * - **un seul filet, au-dessus** : celui du dessous doublait le bas de la zone ;
 * - **la densité est celle des listes**, jamais `compact` : une rubrique se lit,
 *   elle ne se balaie pas comme un export ;
 * - **chaque en-tête porte l'icône de sa nature** (`fieldText`, `fieldNumber`…),
 *   imposée par le type de `columns` et d'`identity`.
 */
export function SectionTable<T>({
  title,
  count,
  description,
  actions,
  rows,
  rowKey,
  identity,
  columns,
  onOpen,
  empty,
  footer,
  sort,
  selection,
  detail,
  group,
  activeKey,
  toolbar,
  headingLevel = 2,
  className,
}: SectionTableProps<T>) {
  const Titre = headingLevel === 2 ? 'h2' : 'h3';
  /* PLUS DE DÉCOMPTE À CÔTÉ D'UN TITRE, ni de phrase qui décrit le tableau (Louis, 12/11/2026) :
     un tableau de rubrique n'est pas une liste de premier niveau. `count` et `description` sont
     acceptés et ignorés. */
  void count; void description;
  return (
    <section className={cn('@container flex w-full flex-col gap-md pt-xl pb-lg', className)}>
      <div className="flex flex-col gap-sm px-base sm:px-xl @min-[36rem]:flex-row @min-[36rem]:items-start @min-[36rem]:justify-between @min-[36rem]:gap-base">
        <div className="min-w-0 flex-1">
          {/* La hauteur d'un contrôle, centrée : le titre tombe au même endroit que
              celui des autres rubriques de la fiche, qu'un bouton l'accompagne ou non. */}
          <Titre className="flex min-h-(--arq-control-md) items-center gap-xs text-title">
            {title}
          </Titre>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-sm">{actions}</div> : null}
      </div>

      {toolbar ? <div className="px-base sm:px-xl">{toolbar}</div> : null}

      {rows.length === 0 && empty ? (
        <div className="px-base sm:px-xl">{empty}</div>
      ) : (
        <RecordTable<T>
          className="border-t border-border-soft"
          rows={rows}
          rowKey={rowKey}
          identity={identity}
          /* Une colonne sans en-tête (les gestes d'une ligne) ne montre pas d'icône seule. */
          columns={columns.map((c) => (c.header ? c : { ...c, icon: undefined }))}
          onOpen={onOpen}
          sort={sort}
          selection={selection}
          detail={detail}
          group={group}
          activeKey={activeKey}
        />
      )}

      {footer ? <div className="px-base text-small text-text-muted sm:px-xl">{footer}</div> : null}
    </section>
  );
}
