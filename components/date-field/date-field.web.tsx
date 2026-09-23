'use client';

import * as React from 'react';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../popover/popover.web';
import {
  cellLabel,
  cursorFor,
  DISPLAY_FORMAT,
  inRange,
  isISO,
  mask,
  monthGrid,
  monthLabel,
  refusal,
  shiftDay,
  shiftMonth,
  shiftMonthKeepingDay,
  todayISO,
  toDisplay,
  toISO,
  TODAY_LABEL,
  WEEKDAYS,
  WEEKDAYS_LONG,
  type MonthCursor,
} from './date-field.logic';

export interface DateFieldProps {
  /**
   * La date retenue, en **ISO `AAAA-MM-JJ`**. `null` quand rien n'est renseigné.
   *
   * L'ISO et rien d'autre : c'est le format qu'une base lit de la même façon
   * quel que soit son réglage, et c'est le sens même du composant. Ce qui
   * s'affiche dans le champ est français, ce qui passe par cette prop ne l'est
   * jamais.
   */
  value: string | null;
  /**
   * Appelé quand la date retenue change. **Rend de l'ISO valide, ou `null`.**
   *
   * Jamais une frappe en cours, jamais une date impossible, jamais une chaîne à
   * interpréter. `null` dit « ce champ ne porte pas de date utilisable » — et il
   * le dit aussi quand une frappe fautive reste à l'écran, pour que l'appelant
   * ne détienne jamais une valeur que l'utilisateur ne voit pas.
   */
  onValue: (value: string | null) => void;
  /** La première date acceptée, en ISO. Le calendrier grise ce qui est avant. */
  min?: string | null;
  /** La dernière date acceptée, en ISO. */
  max?: string | null;
  /** Nomme le champ quand aucun libellé visible ne le fait. */
  ariaLabel?: string;
  /** Ce que le champ dit quand il est vide. Le format, par défaut. */
  placeholder?: string;
  disabled?: boolean;
  /** Le champ prend le focus dès qu'il paraît — il remplace une valeur. */
  autoFocus?: boolean;
  /**
   * L'appelant sait la valeur fautive pour une raison que le champ ne peut pas
   * voir — le service l'a refusée. Le refus que le champ constate lui-même
   * s'affiche sans qu'on le demande.
   */
  invalid?: boolean;
  className?: string;
}

/**
 * Un champ de date : on tape, et un calendrier répond quand on ne sait pas.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LE CONTRAT, ET IL EST TOUTE LA RAISON D'ÊTRE DU COMPOSANT
 * ─────────────────────────────────────────────────────────────────────────
 *
 * **Ce qui s'affiche est `JJ/MM/AAAA`. Ce qui entre et ce qui sort est
 * `AAAA-MM-JJ`.** La frontière est ici, et elle n'a pas de fuite.
 *
 * Jusqu'au 06/09/2026, le formulaire de `web` rendait un `Input` nu pour un
 * attribut de date. Son PostgreSQL est réglé sur `DateStyle = ISO, MDY` :
 * « 12/09/2026 » y entrait comme le 9 décembre, sans un mot — et
 * « 31/12/2026 » faisait lever une erreur brute. Les jours 1 à 12 d'un mois
 * corrompaient en silence, les suivants plantaient. Sept champs de la création
 * d'une affaire étaient dans ce cas, et la parade a été de rendre toutes les
 * dates non modifiables. C'est ce composant qui lève cette parade.
 *
 * `2026-09-12` n'a pas de seconde lecture. Tout le reste — l'analyse, le
 * masque, la grille — est dans `date-field.logic.ts`, sans une ligne de React.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA FRAPPE EST LE GESTE PRINCIPAL, LE CALENDRIER LE SECOND
 * ─────────────────────────────────────────────────────────────────────────
 *
 * On tape `12092026`, les barres se posent seules. Un technicien qui saisit
 * sept dates d'affilée tape ; il ne clique pas sept fois dans une grille. Le
 * calendrier sert à l'autre question — « c'était quel jour, le jeudi
 * d'après ? » — et il ne s'ouvre que si on le demande.
 *
 * **Et ce n'est pas un `<input type="date">`.** Deux raisons, dont la seconde
 * est la dangereuse : c'est du chrome d'OS au milieu de contrôles dessinés, ce
 * que ce dépôt refuse ; et surtout son AFFICHAGE suit la locale du poste, donc
 * la même valeur se lit `09/12/2026` sur une machine réglée en anglais. Le
 * chrome est le motif visible, la locale est le motif dangereux — c'est la même
 * ambiguïté que celle qui a corrompu les données.
 */
export function DateField({
  value,
  onValue,
  min,
  max,
  ariaLabel,
  placeholder = DISPLAY_FORMAT,
  disabled = false,
  autoFocus = false,
  invalid = false,
  className,
}: DateFieldProps) {
  const today = todayISO();

  /*
    Ce que le champ affiche. Un état à lui, et non `toDisplay(value)` calculé à
    chaque rendu : entre le premier et le huitième chiffre, la frappe n'est pas
    encore une date, donc `value` ne peut pas la porter. Sans cet état, taper le
    « 1 » de « 12 » l'effacerait aussitôt.
  */
  const [frappe, setFrappe] = React.useState(() => toDisplay(value));

  /*
    Une valeur venue de l'extérieur — un enregistrement qui revient, un
    formulaire réinitialisé. Réalignée PENDANT le rendu et non dans un effet :
    l'effet afficherait d'abord l'ancienne date, puis la nouvelle au rendu
    suivant, et ce clignement se voit sur un champ qu'on vient de corriger.
    Même idiome que `requestOpen` dans `FieldRow`.
  */
  const [connue, setConnue] = React.useState(value);
  if (value !== connue) {
    setConnue(value);
    // La frappe en cours ne se réécrit que si elle dit autre chose que la
    // nouvelle valeur : sinon, le rembourrage remettrait « 01 » là où
    // l'utilisateur vient de taper « 1 », curseur compris.
    if (toISO(frappe) !== value) setFrappe(toDisplay(value));
  }

  const [ouvert, setOuvert] = React.useState(false);
  const [touche, setTouche] = React.useState(false);

  /*
    Le refus ne s'affiche qu'après la sortie du champ. Reprocher « date
    incomplète » au deuxième chiffre d'une saisie qui va très bien se terminer
    fait clignoter une alerte sous les doigts de quelqu'un qui n'a rien fait de
    mal.
  */
  const refus = touche ? refusal(frappe, min, max) : null;
  const enFaute = invalid || refus !== null;

  const changer = (brut: string) => {
    const texte = mask(brut);
    setFrappe(texte);

    /*
      On remonte dès que la frappe fait une date acceptable — la valeur suit la
      saisie, sans attendre une validation. Et on remonte `null` dès qu'elle
      cesse d'en faire une : c'est la règle qui empêche l'appelant de détenir
      une date que l'utilisateur ne voit plus à l'écran. Un champ vidé dit « je
      ne sais pas », ce qui est une réponse, et c'est le même `null`.
    */
    const iso = toISO(texte);
    const retenu = iso && inRange(iso, min, max) ? iso : null;
    if (retenu !== value) onValue(retenu);
  };

  const choisir = (iso: string) => {
    setFrappe(toDisplay(iso));
    setTouche(true);
    setOuvert(false);
    if (iso !== value) onValue(iso);
  };

  return (
    <div className={cn('w-full', className)}>
      <Popover open={ouvert && !disabled} onOpenChange={setOuvert}>
        <PopoverAnchor asChild>
          <div
            data-slot="date-field"
            className={cn(
              'flex h-(--arq-control-md) w-full items-stretch overflow-hidden rounded-control',
              'border border-border bg-bg transition-colors',
              /*
                La mise au point se voit sur l'enveloppe, comme sur
                `PasswordInput` : le champ n'a pas de bordure à lui, et un
                anneau posé dessus serait avalé par le `overflow-hidden`.
              */
              'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary',
              // L'erreur se dit par la bordure, jamais par la seule couleur du
              // texte — la convention d'`Input`.
              enFaute && 'border-danger focus-within:ring-danger',
              disabled && 'opacity-50',
            )}
          >
            <input
              type="text"
              /*
                `inputMode` et non `type="number"` : on veut le pavé numérique
                du téléphone SANS les flèches d'incrément, qui n'ont aucun sens
                sur une date masquée — et sans la molette, qui changerait la
                date en faisant défiler la page.
              */
              inputMode="numeric"
              autoComplete="off"
              value={frappe}
              disabled={disabled}
              autoFocus={autoFocus}
              aria-label={ariaLabel}
              aria-invalid={enFaute || undefined}
              // La marque de réserve porte le format, et elle le porte pour les
              // deux publics : elle se lit tant que le champ est vide, et un
              // lecteur d'écran l'annonce avec le nom du champ.
              placeholder={placeholder}
              onChange={(e) => changer(e.currentTarget.value)}
              onBlur={() => setTouche(true)}
              onKeyDown={(e) => {
                // Flèche bas depuis le champ : le geste attendu pour dérouler
                // le calendrier sans lâcher le clavier.
                if (e.key === 'ArrowDown' && !disabled) {
                  e.preventDefault();
                  setOuvert(true);
                }
              }}
              className={cn(
                'h-full min-w-0 flex-1 bg-transparent px-sm text-small text-text',
                'outline-none placeholder:text-text-muted',
                'selection:bg-primary selection:text-text-on-dark',
                'disabled:pointer-events-none',
              )}
            />
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                aria-label="Choisir dans le calendrier"
                title="Choisir dans le calendrier"
                className={cn(
                  'flex w-(--arq-control-md) shrink-0 items-center justify-center',
                  'border-l border-border text-text-muted outline-none',
                  'hover:bg-bg-muted hover:text-text',
                  'focus-visible:bg-bg-muted focus-visible:text-primary',
                  'disabled:pointer-events-none',
                )}
              >
                <Icon role="fieldDate" size="sm" />
              </button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>

        <PopoverContent align="start" className="w-auto p-sm">
          <Calendar
            selected={isISO(value) ? value : null}
            today={today}
            min={min}
            max={max}
            onChoose={choisir}
          />
        </PopoverContent>
      </Popover>

      {/*
        Le refus, sous le champ. `role="alert"` parce qu'il paraît après coup, à
        la sortie du champ : sans lui, quelqu'un qui navigue au clavier quitte
        une date fautive sans rien entendre.
      */}
      {refus ? (
        <p role="alert" className="mt-xxs text-caption font-semibold text-danger">
          {refus}
        </p>
      ) : null}
    </div>
  );
}

// ----------------------------------------------------------------- calendrier

/**
 * La grille d'un mois, et les deux flèches qui la font défiler.
 *
 * Le motif de la grille de dates suit les recommandations ARIA : un `grid`, un
 * `tabindex` roulant, et les flèches qui déplacent le focus de jour en jour.
 * **Le `tabindex` roulant n'est pas un raffinement** : quarante-deux boutons
 * tous atteignables par Tab feraient quarante-deux arrêts entre le champ et le
 * reste du formulaire.
 */
function Calendar({
  selected,
  today,
  min,
  max,
  onChoose,
}: {
  selected: string | null;
  today: string;
  min?: string | null;
  max?: string | null;
  onChoose: (iso: string) => void;
}) {
  const [curseur, setCurseur] = React.useState<MonthCursor>(() => cursorFor(selected, today));
  /* Le jour qui porte le focus — la valeur retenue, ou aujourd'hui à défaut.
     Il n'est pas « choisi » : le parcourir aux flèches n'écrit rien. */
  const [pointe, setPointe] = React.useState<string>(selected ?? today);

  const grille = monthGrid(curseur);
  const intitule = monthLabel(curseur);
  const titreId = React.useId();

  /*
    Rendre le focus au jour pointé après un déplacement. Un effet est ici le bon
    outil : le bouton doit exister dans le DOM avant qu'on puisse le focaliser,
    et changer de mois le remplace entièrement.
  */
  const grilleRef = React.useRef<HTMLDivElement>(null);
  const deplace = React.useRef(false);
  React.useEffect(() => {
    if (!deplace.current) return;
    deplace.current = false;
    grilleRef.current?.querySelector<HTMLButtonElement>(`[data-jour="${pointe}"]`)?.focus();
  }, [pointe]);

  const pointer = (iso: string) => {
    deplace.current = true;
    setPointe(iso);
    // Suivre le focus hors du mois affiché : sans ça, la flèche droite du 30
    // septembre pointerait un jour d'octobre que la grille ne montre pas.
    const { year, month } = cursorFor(iso, today);
    if (year !== curseur.year || month !== curseur.month) setCurseur({ year, month });
  };

  const auClavier = (e: React.KeyboardEvent) => {
    const pas: Record<string, number> = {
      ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7,
    };
    if (e.key in pas) {
      e.preventDefault();
      pointer(shiftDay(pointe, pas[e.key]));
      return;
    }
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      pointer(shiftMonthKeepingDay(pointe, e.key === 'PageUp' ? -1 : 1));
    }
  };

  const glisser = (delta: number) => {
    const suivant = shiftMonth(curseur, delta);
    setCurseur(suivant);
    /* Le focus suit le mois affiché, en gardant le jour : sans ça, le
       `tabindex` roulant resterait sur un jour absent de la grille, et Tab
       ressortirait du calendrier au lieu d'y entrer. */
    setPointe(shiftMonthKeepingDay(pointe, delta));
  };

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center justify-between gap-sm">
        <Fleche label="Mois précédent" role="previous" onClick={() => glisser(-1)} />
        {/* Le mois ne se capitalise pas : « Septembre 2026 » se lirait comme un
            titre de section plutôt que comme le repère qu'il est. */}
        <span id={titreId} aria-live="polite" className="text-small font-semibold text-text">
          {intitule}
        </span>
        <Fleche label="Mois suivant" role="next" onClick={() => glisser(1)} />
      </div>

      <div
        ref={grilleRef}
        role="grid"
        aria-labelledby={titreId}
        onKeyDown={auClavier}
        className="flex flex-col gap-xxs"
      >
        <div role="row" className="flex gap-xxs">
          {WEEKDAYS.map((jour, i) => (
            <span
              key={jour}
              role="columnheader"
              aria-label={WEEKDAYS_LONG[i]}
              className="flex w-(--arq-control-sm) justify-center text-caption font-semibold text-text-muted"
            >
              {jour}
            </span>
          ))}
        </div>

        {grille.map((semaine) => (
          <div role="row" key={semaine[0].iso} className="flex gap-xxs">
            {semaine.map((jour) => {
              const retenu = jour.iso === selected;
              const cejour = jour.iso === today;
              const permis = inRange(jour.iso, min, max);
              return (
                <button
                  key={jour.iso}
                  type="button"
                  role="gridcell"
                  data-jour={jour.iso}
                  disabled={!permis}
                  aria-selected={retenu}
                  aria-label={cellLabel(jour.iso)}
                  // Le `tabindex` roulant : un seul arrêt de Tab pour la grille
                  // entière, les flèches font le reste.
                  tabIndex={jour.iso === pointe ? 0 : -1}
                  onClick={() => onChoose(jour.iso)}
                  onFocus={() => setPointe(jour.iso)}
                  className={cn(
                    'flex size-(--arq-control-sm) shrink-0 items-center justify-center rounded-control',
                    'text-small outline-none transition-colors',
                    'focus-visible:ring-2 focus-visible:ring-primary',
                    'disabled:pointer-events-none',
                    retenu
                      ? 'bg-primary font-semibold text-text-on-dark'
                      : !permis
                      /*
                        HORS BORNES — une plaque grise nommée, et SURTOUT PAS
                        `opacity-50`.

                        C'est la leçon d'`INACTIVE_SURFACE` sur `Button`, et
                        elle a été payée : un fondu garde la couleur d'origine,
                        et **aucun des deux gardes du dépôt ne sait le voir** —
                        le lecteur de classes ne fond pas une opacité, et axe
                        exempte du contraste tout ce qui porte `disabled`.
                        Mesuré ici au rendu avant la correction : `text-muted`
                        fondu de moitié donnait **2,06 pour 1**, un chiffre que
                        `npm run check` passait en vert.

                        `inactiveBg`/`onInactiveBg` est une paire de jetons, donc
                        `check-contraste.mjs` la mesure À LA SOURCE : 5,99. Et la
                        plaque dit mieux ce qu'elle veut dire — une région fermée
                        du calendrier se lit d'un coup d'œil, là où des chiffres
                        pâles se lisent comme un autre mois.
                      */
                      ? 'bg-inactive-bg text-on-inactive-bg'
                      : cn(
                          'hover:bg-bg-muted',
                          /*
                            Le jour courant se dit par le poids et la couleur du
                            chiffre, sans pastille : une pastille grise à côté
                            d'une pastille bleue se lit comme un second choix.
                            Et il cède au jour retenu, qui est l'information
                            qu'on vient chercher.
                          */
                          cejour && 'font-bold text-primary',
                          /*
                            Hors du mois affiché : `textMuted` (5,34) et non
                            `textSubtle` (3,14 sur blanc), qui n'est pas une
                            couleur de texte — voir `CLAUDE.md`. Ces jours
                            restent choisissables : cliquer le 1er octobre depuis
                            la grille de septembre est un geste légitime.
                          */
                          !jour.inMonth && !cejour && 'text-text-muted',
                          jour.inMonth && !cejour && 'text-text',
                        ),
                  )}
                >
                  {jour.day}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Le raccourci du cas le plus fréquent : la date qu'on saisit est
          souvent celle du jour, et la chercher dans la grille est absurde. */}
      <button
        type="button"
        disabled={!inRange(today, min, max)}
        onClick={() => onChoose(today)}
        className={cn(
          'h-(--arq-control-sm) rounded-control px-md text-small font-semibold text-primary outline-none',
          'hover:bg-bg-muted focus-visible:ring-2 focus-visible:ring-primary',
          // Même règle que les cases : la paire nommée, pas le fondu. Ce bouton
          // est inerte quand aujourd'hui tombe hors des bornes.
          'disabled:pointer-events-none disabled:bg-inactive-bg disabled:text-on-inactive-bg',
        )}
      >
        {TODAY_LABEL}
      </button>
    </div>
  );
}

/** Une des deux flèches de mois. Nommée, parce qu'un chevron seul ne dit rien. */
function Fleche({
  label,
  role,
  onClick,
}: {
  label: string;
  role: 'previous' | 'next';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex size-(--arq-control-sm) shrink-0 items-center justify-center rounded-control',
        'text-text-muted outline-none hover:bg-bg-muted hover:text-text',
        'focus-visible:ring-2 focus-visible:ring-primary',
      )}
    >
      <Icon role={role} size="sm" />
    </button>
  );
}
