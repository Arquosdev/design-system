'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';
import { Input } from '../input/input.web';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.web';
import { SUGGESTIONS, blancLisible, normaliser, versHex, versTsv, type Tsv } from './color-field.logic';

/*
  Choisir une couleur de marque (Louis, 10/10/2026 : un sélecteur de couleur
  dans Paramètres › Portail client, à la place d'un code tapé à la main).

  Le motif est celui de Telegram et des outils de marque relevés sur Refero
  (Telegram, Playbook, Mailchimp) : une zone de couleur et une barre de teinte,
  le code hexadécimal, et une rangée de couleurs proposées. Rien de natif : un
  `<input type="color">` est du chrome d'OS au milieu de contrôles dessinés.

  Les DÉGRADÉS de la zone et de la barre sont du CONTENU, pas de l'habillage :
  ils montrent les couleurs qu'on peut choisir, et ne s'écrivent donc pas en
  jetons.
*/

export interface ColorFieldProps {
  /** La couleur, en `#RRGGBB` ; `null` quand aucune n'est choisie. */
  value: string | null;
  /** Rend toujours un `#RRGGBB` valide, ou `null` quand on retire la couleur. */
  onValue: (hex: string | null) => void;
  /** Le nom du champ pour le lecteur d'écran, quand aucun `Label` ne le porte. */
  ariaLabel?: string;
  id?: string;
  disabled?: boolean;
  /** Montre « Retirer la couleur » : sans couleur, l'appelant retombe sur la sienne. */
  allowClear?: boolean;
  /** Les couleurs proposées ; par défaut, dix teintes qui portent un texte blanc. */
  suggestions?: readonly string[];
  className?: string;
}

const PAS_ZONE = 0.02;
const PAS_TEINTE = 2;
const HUES = 'linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)';

/** Le glissement d'un pointeur sur un élément, en proportions de 0 à 1. */
function useGlisser(onPosition: (x: number, y: number) => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  const lire = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    onPosition(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
  };
  return {
    ref,
    onPointerDown: (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); lire(e); },
    onPointerMove: (e: React.PointerEvent) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) lire(e); },
  };
}

export function ColorField({
  value, onValue, ariaLabel, id, disabled, allowClear = false, suggestions = SUGGESTIONS, className,
}: ColorFieldProps) {
  const [ouvert, setOuvert] = React.useState(false);
  const [tsv, setTsv] = React.useState<Tsv>(() => versTsv(value ?? SUGGESTIONS[0]));
  const [texte, setTexte] = React.useState(value ?? '');

  // La valeur venue de l'appelant fait foi à chaque ouverture.
  React.useEffect(() => {
    if (!ouvert) return;
    setTsv(versTsv(value ?? SUGGESTIONS[0]));
    setTexte(value ?? '');
  }, [ouvert, value]);

  const poser = (n: Tsv) => {
    setTsv(n);
    const hex = versHex(n);
    setTexte(hex);
    onValue(hex);
  };
  const choisir = (hex: string) => { setTsv(versTsv(hex)); setTexte(hex); onValue(hex); };

  const zone = useGlisser((x, y) => poser({ ...tsv, s: x, v: 1 - y }));
  const teinte = useGlisser((x) => poser({ ...tsv, t: x * 360 }));
  const courante = versHex(tsv);
  const lisible = value ? blancLisible(value) : true;

  return (
    <Popover open={ouvert} onOpenChange={setOuvert}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            'flex h-(--arq-control-md) w-full max-w-[14rem] items-center gap-sm rounded-control border border-border bg-bg px-sm text-small text-text',
            'focus-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          <span aria-hidden className="size-5 shrink-0 rounded-control border border-border-soft" style={{ backgroundColor: value ?? 'transparent' }} />
          <span className={cn('flex-1 text-left tabular-nums', !value && 'text-text-muted')}>{value ?? 'Aucune couleur'}</span>
          <Icon role="expand" size="sm" className="text-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-[17rem] flex-col gap-sm p-sm">
        <div
          {...zone}
          role="slider"
          tabIndex={0}
          aria-label="Saturation et luminosité"
          aria-valuetext={courante}
          aria-valuenow={Math.round(tsv.s * 100)}
          onKeyDown={(e) => {
            const d = { ArrowRight: [PAS_ZONE, 0], ArrowLeft: [-PAS_ZONE, 0], ArrowUp: [0, PAS_ZONE], ArrowDown: [0, -PAS_ZONE] }[e.key];
            if (!d) return;
            e.preventDefault();
            poser({ ...tsv, s: Math.min(1, Math.max(0, tsv.s + d[0])), v: Math.min(1, Math.max(0, tsv.v + d[1])) });
          }}
          className="relative h-36 w-full cursor-crosshair touch-none rounded-control focus-ring"
          style={{
            backgroundColor: versHex({ t: tsv.t, s: 1, v: 1 }),
            backgroundImage: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #FFF, transparent)',
          }}
        >
          <span aria-hidden className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg shadow-pop"
            style={{ left: `${tsv.s * 100}%`, top: `${(1 - tsv.v) * 100}%`, backgroundColor: courante }} />
        </div>
        <div
          {...teinte}
          role="slider"
          tabIndex={0}
          aria-label="Teinte"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(tsv.t)}
          onKeyDown={(e) => {
            const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? PAS_TEINTE : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -PAS_TEINTE : 0;
            if (!d) return;
            e.preventDefault();
            poser({ ...tsv, t: (tsv.t + d + 360) % 360 });
          }}
          className="relative h-3 w-full cursor-pointer touch-none rounded-full focus-ring"
          style={{ backgroundImage: HUES }}
        >
          <span aria-hidden className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg shadow-pop"
            style={{ left: `${(tsv.t / 360) * 100}%`, backgroundColor: versHex({ t: tsv.t, s: 1, v: 1 }) }} />
        </div>
        <div className="flex items-center gap-sm">
          <span aria-hidden className="size-(--arq-control-md) shrink-0 rounded-control border border-border-soft" style={{ backgroundColor: courante }} />
          <Input
            aria-label="Code de la couleur"
            value={texte}
            maxLength={7}
            className="tabular-nums"
            onChange={(e) => {
              setTexte(e.target.value);
              const hex = normaliser(e.target.value);
              if (hex && /^#?[0-9a-f]{6}$/i.test(e.target.value.trim())) choisir(hex);
            }}
            onBlur={() => setTexte(value ?? '')}
          />
        </div>
        <div role="group" aria-label="Couleurs proposées" className="grid grid-cols-5 gap-xs">
          {suggestions.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={hex}
              aria-pressed={value === hex}
              onClick={() => choisir(hex)}
              className={cn(
                'h-7 rounded-control border border-border-soft focus-ring',
                value === hex && 'ring-2 ring-primary ring-offset-2',
              )}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
        {value ? (
          <p className={cn('flex items-center gap-xs text-caption', lisible ? 'text-text-muted' : 'text-text')}>
            <Icon role={lisible ? 'compliant' : 'warning'} size="xs" className={lisible ? '' : 'text-warning'} />
            {lisible ? 'Un texte blanc s’y lit bien.' : 'Un texte blanc s’y lit mal : choisissez plus foncé.'}
          </p>
        ) : null}
        {allowClear && value ? (
          <button type="button" onClick={() => { onValue(null); setOuvert(false); }}
            className="self-start text-caption font-semibold text-primary hover:underline">
            Retirer la couleur
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
