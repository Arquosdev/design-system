'use client';

import {
  realChoices,
  displayedText,
  displayedPlaceholder,
  type ComboboxOption,
} from './combobox.logic.ts';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';
import {
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandSizeProvider,
} from '../command/command.web';
import { Popover, PopoverAnchor, PopoverContent } from '../popover/popover.web';

export type { ComboboxOption };

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
  const ancre = React.useRef<HTMLDivElement>(null);

  /* Les deux règles vivent dans `combobox.logic.ts`, où elles sont éprouvées :
     ce qui compte comme choix, et ce que le champ montre. */
  const choices = React.useMemo(() => realChoices(options), [options]);
  const contenu = displayedText(options, value, ouvert, frappe);
  const invite = displayedPlaceholder(options, value, ouvert, placeholder);

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
            ref={ancre}
            className={cn(
              'flex h-(--arq-control-md) w-full items-center gap-sm rounded-control',
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
              placeholder={invite}
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
          /*
            Le clic qui OUVRE le champ tombe « hors » de la liste — elle vient à
            peine de paraître, et le curseur est resté sur le champ. Radix la
            refermait donc aussitôt : le champ gardait sa valeur affichée, et la
            première frappe s'y ajoutait — « SEMATIC » puis « FERMA » donnait
            « SEMATICFERMA », et plus aucun choix ne correspondait.

            Sur un champ vide le défaut ne se voyait pas, ce qui explique qu'il
            ait survécu au correctif du 04/09/2026.
          */
          onInteractOutside={(e) => {
            if (ancre.current?.contains(e.target as Node)) e.preventDefault();
          }}
          /* De quoi ne pas se coller au bord quand le champ est en bas d'un
             panneau : la liste se retourne au-dessus plutôt que de s'écraser. */
          collisionPadding={8}
        >
          {/*
            **La densité d'un MENU, pas celle de la palette.** Sans ce
            fournisseur, `CommandItem` et `CommandEmpty` héritaient de la taille
            par défaut : entrées de 35,6 px, retraits de seize, état vide à
            `px-base py-xl` pour une ligne de texte. Louis, le 30/08/2026 : « je
            les trouve grossiers, avec un padding de tous les côtés inutile ».

            Ce composant s'adresse directement à `cmdk` — il lui faut son champ
            et son ancrage — donc il ne pouvait pas hériter de la taille par
            `Command`. Il la déclare.
          */}
          <CommandSizeProvider size="sm">
            {/*
              **Treize entières, et pas douze et demie.** Deux exigences se
              rejoignent ici. Une entrée coupée en deux se lit comme un défaut
              même quand elle sert d'indice de défilement — Louis l'a signalé deux
              fois, sur le sélecteur d'agence. Et la liste doit montrer assez de
              choix pour qu'on n'ait pas à faire défiler pour chercher : à 240
              pixels elle montrait sept marques sur trois cents. 13 × 24 + 4 + 4
              = 320, la hauteur que `main` avait retenue, tombe juste.
            */}
            <CommandList className="max-h-[320px]">
              <CommandEmpty>Aucun choix ne correspond.</CommandEmpty>
              {choices.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.label}
                  keywords={o.keywords ? [...o.keywords] : undefined}
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
          </CommandSizeProvider>
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
