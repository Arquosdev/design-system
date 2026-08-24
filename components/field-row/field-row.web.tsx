'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { Button } from '../button/button.web';

export type FieldKind = 'text' | 'number' | 'choice' | 'multi';
export type FieldStatut = 'renseigne' | 'manquant' | 'a_verifier';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldRowProps {
  label: string;
  value: string | string[] | null;
  kind?: FieldKind;
  options?: readonly FieldOption[];
  onSave?: (valeur: string | string[]) => void;
  statut?: FieldStatut;
  /** Provenance de la valeur, affichée en infobulle (ex. « Relevé du 12/03 »). */
  origine?: string;
  readOnly?: boolean;
  className?: string;
}

const STATUTS: Record<FieldStatut, { texte: string; classe: string }> = {
  renseigne: { texte: 'Renseigné', classe: 'bg-success-bg text-success' },
  manquant: { texte: 'Manquant', classe: 'bg-danger-bg text-danger' },
  a_verifier: { texte: 'À vérifier', classe: 'bg-orange-50 text-orange-700' },
};

/**
 * Une valeur absente s'annonce en toutes lettres. Un tiret laisse croire à une
 * donnée sans objet ; « Non renseigné » dit qu'il manque quelque chose, et reste
 * cliquable pour le combler.
 */
const VIDE = 'Non renseigné';

function afficher(value: string | string[] | null): string {
  if (Array.isArray(value)) return value.length ? value.join(', ') : VIDE;
  return value && value.trim() !== '' ? value : VIDE;
}

export function FieldRow({
  label,
  value,
  kind = 'text',
  options = [],
  onSave,
  statut,
  origine,
  readOnly = false,
  className,
}: FieldRowProps) {
  const [enSaisie, setEnSaisie] = React.useState(false);
  const editable = Boolean(onSave) && !readOnly;
  const estVide = value === null || value === '' || (Array.isArray(value) && value.length === 0);

  const ouvrir = () => editable && setEnSaisie(true);
  const valider = (valeur: string | string[]) => {
    onSave?.(valeur);
    setEnSaisie(false);
  };

  return (
    <div
      className={cn(
        'grid grid-cols-[190px_1fr] items-start gap-md py-sm',
        'border-b border-border-soft last:border-b-0',
        className,
      )}
    >
      <div className="flex items-center gap-xs pt-xxs text-small text-text-muted">
        <IconeType kind={kind} />
        <span className="min-w-0 break-words">{label}</span>
      </div>

      <div className="min-w-0">
        {enSaisie ? (
          <Editeur
            kind={kind}
            label={label}
            value={value}
            options={options}
            onValider={valider}
            onAnnuler={() => setEnSaisie(false)}
          />
        ) : (
          <div className="flex flex-wrap items-center gap-sm">
            <span
              role={editable ? 'button' : undefined}
              tabIndex={editable ? 0 : undefined}
              title={origine}
              onClick={ouvrir}
              onKeyDown={(e) => {
                if (!editable) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  ouvrir();
                }
              }}
              className={cn(
                'min-w-0 text-small font-medium break-words',
                // Le soulignement pointillé est LE signal « cette valeur se
                // corrige d'un clic ». Sans lui, rien ne distingue une donnée
                // modifiable d'une donnée figée. Il pâlit avec la valeur quand
                // le champ est vide, pour ne pas attirer l'œil sur un manque.
                editable && 'cursor-text border-b border-dashed pb-px outline-none focus-visible:ring-2 focus-visible:ring-primary',
                estVide
                  ? 'text-text-subtle border-border'
                  : 'text-text border-text-subtle',
              )}
            >
              {afficher(value)}
            </span>
            {statut ? (
              <span
                className={cn(
                  'shrink-0 rounded-control px-xs py-xxs text-caption font-semibold',
                  STATUTS[statut].classe,
                )}
              >
                {STATUTS[statut].texte}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ éditeurs

interface EditeurProps {
  kind: FieldKind;
  label: string;
  value: string | string[] | null;
  options: readonly FieldOption[];
  onValider: (v: string | string[]) => void;
  onAnnuler: () => void;
}

function Editeur({ kind, label, value, options, onValider, onAnnuler }: EditeurProps) {
  if (kind === 'multi') {
    return (
      <EditeurMulti
        label={label}
        value={Array.isArray(value) ? value : []}
        options={options}
        onValider={onValider}
        onAnnuler={onAnnuler}
      />
    );
  }

  if (kind === 'choice') {
    return (
      <div className="flex flex-wrap items-center gap-sm">
        <select
          autoFocus
          aria-label={label}
          defaultValue={typeof value === 'string' ? value : ''}
          onChange={(e) => onValider(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && onAnnuler()}
          className="h-[30px] min-w-0 flex-1 cursor-pointer rounded-control border-[1.5px] border-primary bg-bg px-xs text-small text-text outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Button variant="secondary" size="sm" onClick={onAnnuler}>
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <input
      autoFocus
      aria-label={label}
      type={kind === 'number' ? 'number' : 'text'}
      defaultValue={typeof value === 'string' ? value : ''}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onValider(e.currentTarget.value);
        if (e.key === 'Escape') onAnnuler();
      }}
      // Valider à la perte de focus : le réflexe est de cliquer ailleurs, pas
      // d'appuyer sur Entrée. Sans ça, la saisie est silencieusement perdue.
      onBlur={(e) => onValider(e.currentTarget.value)}
      className="h-[30px] w-full rounded-control border-[1.5px] border-primary px-sm text-small text-text outline-none"
    />
  );
}

function EditeurMulti({
  label,
  value,
  options,
  onValider,
  onAnnuler,
}: {
  label: string;
  value: string[];
  options: readonly FieldOption[];
  onValider: (v: string[]) => void;
  onAnnuler: () => void;
}) {
  const [choisis, setChoisis] = React.useState<string[]>(value);

  const basculer = (v: string) =>
    setChoisis((actuels) =>
      actuels.includes(v) ? actuels.filter((x) => x !== v) : [...actuels, v],
    );

  return (
    <div
      role="group"
      aria-label={label}
      onKeyDown={(e) => e.key === 'Escape' && onAnnuler()}
      className="rounded-control border-[1.5px] border-primary bg-bg p-sm"
    >
      <div className="flex flex-wrap gap-xs">
        {options.map((o) => {
          const actif = choisis.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={actif}
              onClick={() => basculer(o.value)}
              className={cn(
                'rounded-control px-sm py-xxs text-caption font-semibold outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary',
                actif
                  ? 'bg-primary text-text-on-dark'
                  : 'bg-bg-muted text-text-muted hover:bg-blue-50',
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <div className="mt-sm flex flex-wrap items-center gap-sm">
        <Button size="sm" onClick={() => onValider(choisis)}>
          Enregistrer
        </Button>
        <Button variant="secondary" size="sm" onClick={onAnnuler}>
          Annuler
        </Button>
        <span className="text-caption text-text-subtle">
          {choisis.length === 0
            ? 'Aucun choix'
            : `${choisis.length} choix sélectionné${choisis.length > 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------- icônes

const TITRES: Record<FieldKind, string> = {
  text: 'Texte libre',
  number: 'Nombre',
  choice: 'Liste de choix',
  multi: 'Choix multiples',
};

function IconeType({ kind }: { kind: FieldKind }) {
  const chemins: Record<FieldKind, string> = {
    text: 'M40 64h176M40 128h176M40 192h176',
    number: 'M80 96l48-48 48 48M80 160l48 48 48-48',
    choice: 'M48 96l80 80 80-80',
    multi: 'M48 96l80 80 80-80',
  };

  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-text-subtle"
    >
      <title>{TITRES[kind]}</title>
      <path d={chemins[kind]} />
    </svg>
  );
}
