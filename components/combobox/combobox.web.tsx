'use client';

import {
  choixReels,
  contenuAffiche,
  invitAffichee,
  type ComboboxOption,
} from './combobox.logic.ts';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';
import { CommandEmpty, CommandItem, CommandList } from '../command/command.web';
import { Popover, PopoverAnchor, PopoverContent } from '../popover/popover.web';

export type { ComboboxOption };

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  /** La valeur retenue. Une valeur hors catalogue s'affiche telle quelle. */
  valeur: string;
  onValeur: (valeur: string) => void;
  /** Ce que le champ dit quand rien n'est retenu. */
  placeholder?: string;
  /** Nomme le champ quand aucun libellé visible ne le fait. */
  ariaLabel?: string;
  desactive?: boolean;
  /** Le champ prend le focus dès qu'il paraît — il remplace une valeur. */
  autoFocus?: boolean;
  className?: string;
}

/**
 * Un champ où l'on tape, et la liste qui se resserre dessous.
 *
 * **Un seul champ.** La première version en avait deux : une gâchette qu'on
 * ouvrait, puis une barre de recherche qui apparaissait dedans. Deux gestes et
 * deux boîtes pour choisir un mot — et la barre de recherche, empruntée à la
 * palette ⌘K, était deux fois plus haute que le champ qui l'avait ouverte.
 * C'est la forme que shadcn a fini par retenir aussi : `ComboboxInput` EST le
 * champ.
 *
 * **C'est le menu des listes longues.** `Select` s'arrête vers la douzaine de
 * choix ; au-delà, faire défiler n'est plus choisir. Le modèle de machine en
 * compte trois cent soixante-seize : sans frappe, la bonne valeur est
 * introuvable autrement qu'en la sachant déjà.
 *
 * L'entrée se fait sur la primitive `cmdk` plutôt que sur notre `CommandInput`,
 * qui habille la palette plein écran et porte sa hauteur.
 */
export function Combobox({
  options,
  valeur,
  onValeur,
  placeholder = 'Rechercher…',
  ariaLabel,
  desactive = false,
  autoFocus = false,
  className,
}: ComboboxProps) {
  const [ouvert, setOuvert] = React.useState(false);
  const [frappe, setFrappe] = React.useState('');
  const champ = React.useRef<HTMLInputElement>(null);

  /* Les deux règles vivent dans `combobox.logic.ts`, où elles sont éprouvées :
     ce qui compte comme choix, et ce que le champ montre. */
  const choix = React.useMemo(() => choixReels(options), [options]);
  const contenu = contenuAffiche(options, valeur, ouvert, frappe);
  const invite = invitAffichee(options, valeur, ouvert, placeholder);

  const fermer = () => {
    setOuvert(false);
    setFrappe('');
  };

  return (
    <CommandPrimitive
      // Le filtrage est celui de cmdk, sur le libellé. Une liste de trois cents
      // marques n'a pas besoin de plus : on tape le début du nom.
      loop
      className="w-full"
      onKeyDown={(e) => {
        if (e.key === 'Escape') fermer();
      }}
    >
      <Popover open={ouvert && !desactive} onOpenChange={(o) => !o && fermer()}>
        <PopoverAnchor asChild>
          <div
            className={cn(
              'flex h-[32px] w-full items-center gap-sm rounded-control',
              // Les mêmes traits que la gâchette de `Select`, au pixel : un
              // champ à menu doit avoir la même tête, court ou long.
              'border border-border bg-bg px-md shadow-card',
              'focus-within:ring-2 focus-within:ring-primary',
              desactive && 'pointer-events-none opacity-50',
              className,
            )}
          >
            <CommandPrimitive.Input
              ref={champ}
              autoFocus={autoFocus}
              disabled={desactive}
              value={contenu}
              onValueChange={(v) => {
                setFrappe(v);
                setOuvert(true);
              }}
              onFocus={() => setOuvert(true)}
              onMouseDown={() => setOuvert(true)}
              placeholder={invite}
              aria-label={ariaLabel}
              className={cn(
                'min-w-0 flex-1 bg-transparent text-small font-medium text-text outline-none',
                'placeholder:font-normal placeholder:text-text-muted',
              )}
            />
            <Icon
              role="deplier"
              size="sm"
              className={cn(
                'shrink-0 text-text-subtle transition-transform',
                ouvert && 'rotate-180',
              )}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0"
          /* Le focus ne quitte jamais le champ : on tape pendant que la liste
             se resserre. Sans ça, la première frappe partirait dans le vide. */
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          /* De quoi ne pas se coller au bord quand le champ est en bas d'un
             panneau : la liste se retourne au-dessus plutôt que de s'écraser. */
          collisionPadding={8}
        >
          {/*
            La liste prend la place disponible plutôt qu'une hauteur fixe. À 240
            pixels elle montrait sept marques sur trois cents ; chercher revenait
            à faire défiler, ce que le champ cherchable est censé éviter.
          */}
          <CommandList className="max-h-[min(320px,45vh)]">
            <CommandEmpty>Aucun choix ne correspond.</CommandEmpty>
            {choix.map((o) => (
              <CommandItem
                key={o.valeur}
                value={o.libelle}
                onSelect={() => {
                  onValeur(o.valeur);
                  fermer();
                }}
                className={cn(
                  o.valeur === valeur && 'bg-info-bg font-semibold text-on-info-bg',
                )}
              >
                {o.libelle}
              </CommandItem>
            ))}
          </CommandList>
        </PopoverContent>
      </Popover>
    </CommandPrimitive>
  );
}

/**
 * Au-delà de combien de choix un menu déroulant cesse-t-il de servir ?
 *
 * Douze, mesuré sur la fiche équipement : deux cent six champs à menu en ont
 * douze ou moins et se choisissent d'un coup d'œil ; les sept autres montent à
 * cinquante, cent quatorze, trois cent soixante-seize. Entre les deux il n'y a
 * personne, et la frontière peut donc être franche.
 */
export const SEUIL_RECHERCHE = 12;
