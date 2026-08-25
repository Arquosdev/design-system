'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '../command/command.web';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.web';

export interface ComboboxOption {
  valeur: string;
  libelle: string;
}

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  /** La valeur retenue. Une valeur hors catalogue s'affiche telle quelle. */
  valeur: string;
  onValeur: (valeur: string) => void;
  /** Ce que la gâchette dit quand rien n'est retenu. */
  placeholder?: string;
  /** Ce que le champ de recherche invite à taper. */
  invite?: string;
  /** Nomme la gâchette quand aucun libellé visible ne le fait. */
  ariaLabel?: string;
  /** Le champ s'ouvre-t-il ? */
  desactive?: boolean;
  className?: string;
}

/**
 * Le motif « combobox » de shadcn — `Popover` + `Command` — empaqueté.
 *
 * shadcn le donne en recette à recopier ; on en fait un composant, parce qu'une
 * recette recopiée à dix endroits diverge à dix endroits, et que le seul choix
 * qui compte à l'appel est « quelle liste, quelle valeur ».
 *
 * **C'est le menu des listes longues.** `Select` s'arrête vers la douzaine de
 * choix ; au-delà, faire défiler n'est plus choisir. Le modèle de machine en
 * compte trois cent soixante-seize : sans champ de recherche, la bonne valeur
 * est introuvable autrement qu'en la sachant déjà.
 */
export function Combobox({
  options,
  valeur,
  onValeur,
  placeholder = '— choisir —',
  invite = 'Rechercher…',
  ariaLabel,
  desactive = false,
  className,
}: ComboboxProps) {
  const [ouvert, setOuvert] = React.useState(false);
  const retenue = options.find((o) => o.valeur === valeur);

  return (
    <Popover open={ouvert} onOpenChange={setOuvert}>
      <PopoverTrigger
        // Un `button` et non un `input` : on ne saisit pas ici, on ouvre. La
        // frappe se fait dans la liste, où elle filtre.
        type="button"
        role="combobox"
        aria-expanded={ouvert}
        aria-label={ariaLabel}
        disabled={desactive}
        className={cn(
          'flex h-[28px] w-full items-center justify-between gap-sm rounded-control',
          'border border-border bg-bg px-xs text-left text-small font-medium text-text',
          'outline-none transition-colors hover:bg-bg-muted',
          'focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      >
        <span className={cn('truncate', !valeur && 'font-normal text-text-subtle')}>
          {/* Une valeur hors catalogue s'écrit telle quelle : la taire
              reviendrait à effacer à l'écran ce que la base contient. */}
          {retenue?.libelle || valeur || placeholder}
        </span>
        <Icon
          role="deplier"
          size="sm"
          className={cn('shrink-0 text-text-subtle transition-transform', ouvert && 'rotate-180')}
        />
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0"
        // Le focus va au champ de recherche, pas à la première entrée : on
        // ouvre une liste longue pour y taper, pas pour la parcourir.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const champ = (e.currentTarget as HTMLElement).querySelector('input');
          champ?.focus();
        }}
      >
        <Command>
          <CommandInput placeholder={invite} />
          <CommandList>
            <CommandEmpty>Aucun choix ne correspond.</CommandEmpty>
            {options.map((o) => (
              <CommandItem
                key={o.valeur}
                value={o.libelle}
                onSelect={() => {
                  onValeur(o.valeur);
                  setOuvert(false);
                }}
                className={cn(
                  o.valeur === valeur && 'bg-blue-50 font-semibold text-blue-700',
                )}
              >
                {o.libelle}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
