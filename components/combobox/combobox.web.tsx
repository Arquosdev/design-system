'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';
import { CommandEmpty, CommandItem, CommandList } from '../command/command.web';
import { Popover, PopoverAnchor, PopoverContent } from '../popover/popover.web';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  /** La valeur retenue. Une valeur hors catalogue s'affiche telle quelle. */
  value: string;
  onValue: (value: string) => void;
  /** Ce que le champ dit quand rien n'est retenu. */
  placeholder?: string;
  /** Nomme le champ quand aucun libellé visible ne le fait. */
  ariaLabel?: string;
  disabled?: boolean;
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
  value,
  onValue,
  placeholder = 'Rechercher…',
  ariaLabel,
  disabled = false,
  autoFocus = false,
  className,
}: ComboboxProps) {
  const [ouvert, setOuvert] = React.useState(false);
  const [frappe, setFrappe] = React.useState('');
  const champ = React.useRef<HTMLInputElement>(null);

  const chosen = options.find((o) => o.value === value);
  const affiche = chosen?.label ?? value;

  /* Ce qu'on voit dans le champ : la valeur retenue tant qu'on n'a rien tapé,
     la frappe dès qu'on tape. Sans ça, ouvrir le champ effacerait sous les yeux
     la valeur qu'on venait consulter. */
  const contenu = ouvert ? frappe : affiche;

  const close = () => {
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
        if (e.key === 'Escape') close();
      }}
    >
      <Popover open={ouvert && !disabled} onOpenChange={(o) => !o && close()}>
        <PopoverAnchor asChild>
          <div
            className={cn(
              'flex h-[32px] w-full items-center gap-sm rounded-control',
              // Les mêmes traits que la gâchette de `Select`, au pixel : un
              // champ à menu doit avoir la même tête, court ou long.
              'border border-border bg-bg px-md shadow-card',
              'focus-within:ring-2 focus-within:ring-primary',
              disabled && 'pointer-events-none opacity-50',
              className,
            )}
          >
            <CommandPrimitive.Input
              ref={champ}
              autoFocus={autoFocus}
              disabled={disabled}
              value={contenu}
              onValueChange={(v) => {
                setFrappe(v);
                setOuvert(true);
              }}
              onFocus={() => setOuvert(true)}
              onMouseDown={() => setOuvert(true)}
              placeholder={placeholder}
              aria-label={ariaLabel}
              className={cn(
                'min-w-0 flex-1 bg-transparent text-small font-medium text-text outline-none',
                'placeholder:font-normal placeholder:text-text-muted',
              )}
            />
            <Icon
              role="expand"
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
        >
          <CommandList className="max-h-[240px]">
            <CommandEmpty>NoneA choices ne correspond.</CommandEmpty>
            {options.map((o) => (
              <CommandItem
                key={o.value}
                value={o.label}
                onSelect={() => {
                  onValue(o.value);
                  close();
                }}
                className={cn(
                  o.value === value && 'bg-info-bg font-semibold text-on-info-bg',
                )}
              >
                {o.label}
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
export const SEARCH_THRESHOLD = 12;
