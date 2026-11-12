'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { IconButton } from '../icon-button/icon-button.web';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/select.web';
import { cn } from '../_lib/cn';

export interface TableFooterProps {
  /**
   * À gauche, en gris : le total de ce que la liste retient, filtres compris
   * (« 828 équipements »). C'est là que vit le total d'une liste, plus à côté
   * de son titre (Louis, 12/11/2026).
   */
  summary?: React.ReactNode;
  /** La page courante, à partir de 1. Avec `pages` et `onPage`, la pagination paraît. */
  page?: number;
  pages?: number;
  onPage?: (page: number) => void;
  /** Le nombre par page. Avec `perPageOptions` et `onPerPage`, le sélecteur paraît. */
  perPage?: number;
  perPageOptions?: readonly number[];
  onPerPage?: (perPage: number) => void;
  /** Le nom accessible du sélecteur : « Nombre d'équipements par page ». */
  perPageLabel?: string;
  className?: string;
}

const nombre = (n: number) => n.toLocaleString('fr-FR');

/**
 * Le pied d'un tableau (Louis, 12/11/2026) : la pagination « ‹ 1 / 13 › » à
 * gauche, le total au centre, « 25 par page » à droite.
 *
 * Une bande de 40 px, un filet doux au-dessus, sans fond, commandes de 28 px.
 * `data-pied-de-page` permet à l'application de lui garder une place à droite
 * (un bouton flottant) sans le redessiner.
 */
export function TableFooter({
  summary, page, pages, onPage, perPage, perPageOptions, onPerPage, perPageLabel = 'Nombre par page', className,
}: TableFooterProps) {
  const pagine = page !== undefined && pages !== undefined && pages > 1 && onPage;
  const choix = perPage !== undefined && perPageOptions && perPageOptions.length > 1 && onPerPage;
  return (
    <div
      data-pied-de-page
      className={cn(
        'flex h-(--arq-control-lg) shrink-0 items-center gap-base border-t border-border-soft bg-bg px-base text-caption text-text-muted sm:px-xl',
        className,
      )}
    >
      {/* À GAUCHE, « ‹ 1 / 34 › » : deux boutons d'icône secondaires de 28 px, le compteur entre eux. */}
      {pagine ? (
        <div className="flex shrink-0 items-center gap-xs">
          <IconButton
            variant="outline"
            size="sm"
            icon={<Icon role="previous" />}
            label="Page précédente"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          />
          <span className="min-w-[5ch] text-center tabular-nums">{nombre(page)} / {nombre(pages)}</span>
          <IconButton
            variant="outline"
            size="sm"
            icon={<Icon role="next" />}
            label="Page suivante"
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
          />
        </div>
      ) : null}
      {/* AU CENTRE, le total : à égale distance de la pagination et du sélecteur, sans les chevaucher. */}
      <span className="min-w-0 flex-1 truncate text-center tabular-nums">{summary}</span>
      {/* À DROITE, « 25 par page », au format exact d'un bouton secondaire (28 px, 12 px, chevron de 14 px). */}
      {choix ? (
        <Select value={String(perPage)} onValueChange={(v) => onPerPage(Number(v))}>
          <SelectTrigger
            aria-label={perPageLabel}
            className="h-(--arq-control-sm) shrink-0 gap-[calc(var(--spacing-xs)+var(--spacing-xxs))] border-0 px-[calc(var(--spacing-sm)+var(--spacing-xxs))] text-caption font-medium shadow-control hover:bg-bg-hover hover:shadow-control-hover [&>svg]:size-3.5"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {perPageOptions.map((x) => <SelectItem key={x} value={String(x)}>{x} par page</SelectItem>)}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}
