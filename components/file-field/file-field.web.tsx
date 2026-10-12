'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { buttonVariants } from '../button/button.web';
import { Icon } from '../icon/icon.web';
import { aide, trier } from './file-field.logic';

/*
  Joindre un fichier : une zone qu'on clique ou sur laquelle on dépose, qui dit
  ce qu'elle accepte, et qui refuse SUR LE CHAMP, avec la raison, ce qui ne
  passerait pas (manque 11 du CLAUDE.md du web, trouvé le 30/09/2026).

  Le web dessinait cette zone treize fois à la main, et aucune copie ne
  refusait rien : `accept` n'est qu'une suggestion à la boîte de dialogue, et
  un fichier trop lourd partait pour être refusé par le serveur, loin du champ.

  Le champ natif reste dans le DOM, invisible : c'est lui qui ouvre la boîte de
  dialogue du système (aucune autre ne sait parcourir le téléphone ou le
  disque), et c'est lui qu'un formulaire envoie quand le champ porte un `name`.
  Un choix refusé le VIDE, pour qu'un envoi ne parte jamais avec ce qu'on vient
  de refuser.
*/

export interface FileFieldProps {
  /** Reçoit les fichiers d'un choix, tous acceptés. Un choix refusé n'appelle rien. */
  onFiles?: (fichiers: File[]) => void;
  /** Ce que le champ accepte, comme l'attribut `accept` : `application/pdf,.pdf`. */
  accept?: string;
  /** Les mêmes formats, pour un humain : « PDF, JPEG ou PNG ». Dit sous le champ et dans un refus. */
  acceptLabel?: string;
  /** Le poids maximal d'UN fichier, en octets. Dit sous le champ, et tenu. */
  maxSize?: number;
  /** Plusieurs fichiers par choix. */
  multiple?: boolean;
  /** Le nombre de fichiers qu'un choix peut encore porter (la place qui reste chez l'appelant). */
  max?: number;
  /** `zone` : le cadre en pointillés d'un formulaire. `compact` : un bouton, quand l'appelant liste lui-même ce qu'il a joint. */
  variant?: 'zone' | 'compact';
  /**
   * `grande` : une zone haute et centrée, pour un écran dont joindre le fichier
   * est le seul geste (l'import). La zone de 70 px sur 910 se perdait (audit
   * design A1-05).
   */
  taille?: 'normale' | 'grande';
  /** Le libellé de l'action. Par défaut « Choisir le fichier », ou « Choisir des fichiers ». */
  placeholder?: string;
  /** Le fichier déjà enregistré, quand on peut le remplacer : son nom s'affiche tant qu'on n'en choisit pas d'autre. */
  current?: string | null;
  /** Remplace la ligne d'aide calculée (formats et poids). */
  hint?: string;
  /** Le nom du champ dans un formulaire envoyé tel quel (`FormData`). */
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
}

export function FileField({
  onFiles,
  accept,
  acceptLabel,
  maxSize,
  multiple = false,
  max,
  variant = 'zone',
  taille = 'normale',
  placeholder,
  current,
  hint,
  name,
  id,
  required,
  disabled,
  'aria-label': ariaLabel,
  className,
}: FileFieldProps) {
  const entree = React.useRef<HTMLInputElement>(null);
  const idErreur = React.useId();
  const [choisis, setChoisis] = React.useState<string[]>([]);
  const [raison, setRaison] = React.useState<string | null>(null);
  const [survol, setSurvol] = React.useState(false);

  const regles = { accept, acceptLabel, maxSize, max };
  const libelle = placeholder ?? (multiple ? 'Choisir des fichiers' : 'Choisir le fichier');
  const ligneAide = hint ?? aide(regles);

  /** Trie un choix ; rend vrai s'il est retenu. */
  function recevoir(liste: File[]): boolean {
    if (!liste.length) return false;
    const { retenus, raison: r } = trier(liste, regles);
    setRaison(r);
    if (r) return false;
    // Un champ `compact` laisse l'appelant lister ce qu'il a joint : il
    // n'affiche pas les noms, et se rouvre vide pour le choix suivant.
    setChoisis(variant === 'zone' ? retenus.map((f) => f.name) : []);
    onFiles?.(retenus);
    return true;
  }

  function surChoix(e: React.ChangeEvent<HTMLInputElement>) {
    const ok = recevoir(Array.from(e.target.files ?? []));
    // Refusé : rien ne doit partir avec le formulaire. Compact : l'appelant a
    // pris les fichiers, le même fichier doit pouvoir se rechoisir.
    if (!ok || variant === 'compact') e.target.value = '';
  }

  function surDepot(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setSurvol(false);
    if (disabled) return;
    const liste = Array.from(e.dataTransfer.files);
    const deposes = multiple ? liste : liste.slice(0, 1);
    if (recevoir(deposes) && entree.current && variant === 'zone') {
      // Le dépôt rejoint le champ natif, pour qu'un formulaire l'envoie comme un choix.
      const dt = new DataTransfer();
      deposes.forEach((f) => dt.items.add(f));
      entree.current.files = dt.files;
    }
  }

  const titre = choisis.length
    ? choisis.length > 1 ? `${choisis.length} fichiers choisis` : choisis[0]
    : current ?? libelle;
  const sousTitre = choisis.length
    ? (current ? 'Remplacera le fichier enregistré' : ligneAide)
    : current ? `Enregistré · le remplacer${ligneAide ? ` (${ligneAide})` : ''}` : ligneAide;

  const champ = (
    <input
      ref={entree}
      id={id}
      name={name}
      type="file"
      accept={accept}
      multiple={multiple}
      required={required && !current}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-invalid={raison ? true : undefined}
      aria-describedby={raison ? idErreur : undefined}
      className="sr-only"
      onChange={surChoix}
    />
  );

  const erreur = raison ? (
    <p id={idErreur} role="alert" className="text-caption text-danger">{raison}</p>
  ) : null;

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-col gap-xs', className)}>
        <label
          data-slot="file-field"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'relative w-fit cursor-pointer focus-within:ring-2 focus-within:ring-primary',
            disabled && 'pointer-events-none opacity-50',
          )}
        >
          {champ}
          <Icon role="import" size="sm" aria-hidden />
          {libelle}
        </label>
        {erreur}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-xs', className)}>
      <label
        data-slot="file-field"
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setSurvol(true); }}
        onDragLeave={() => setSurvol(false)}
        onDrop={surDepot}
        className={cn(
          // Un contrôle, donc la bordure marquée ; en pointillés parce qu'on y dépose. bordure: contrôle
          'relative flex cursor-pointer items-center gap-sm rounded-block border border-dashed border-border bg-bg px-md py-base',
          taille === 'grande' && 'min-h-48 flex-col justify-center gap-md px-xl py-2xl text-center',
          // Le focus de tout le produit (P3-07), et non l'ancien anneau collé.
          'hover:bg-bg-muted focus-ring-within',
          survol && 'border-primary bg-info-bg',
          raison && 'border-danger',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {champ}
        <Icon role="import" size={taille === 'grande' ? 'xl' : 'md'} className="shrink-0 text-text-muted" aria-hidden />
        <span className={cn('flex min-w-0 flex-col', taille === 'grande' && 'items-center gap-xxs')}>
          <span className="truncate text-small font-medium text-text">{titre}</span>
          {sousTitre ? <span className="text-caption text-text-muted">{sousTitre}</span> : null}
        </span>
      </label>
      {erreur}
    </div>
  );
}
