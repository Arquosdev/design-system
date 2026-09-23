'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import type { IconRole } from '../../src/icons';
import { cn } from '../_lib/cn';
import { DateField } from '../date-field/date-field.web';
import { toISO } from '../date-field/date-field.logic';
import {
  choiceMenu,
  dateText,
  splitMultipleChoice,
  valueText,
  SAVE_TEXT,
  STATUS_TEXT,
  EMPTY,
  type FieldKind,
  type FieldOption,
  type FieldSave,
  type FieldStatus,
} from './field-row.logic';
import { Button } from '../button/button.web';
import { Combobox, SEARCH_THRESHOLD } from '../combobox/combobox.web';
import { Input } from '../input/input.web';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select/select.web';


/** Où en est l'enregistrement de la dernière correction, sur CETTE ligne. */


/**
 * L'entrée « Autre » du menu.
 *
 * Ce n'est pas une valeur qu'on écrirait — aucun jeu d'options ne la porte —
 * mais un marqueur : la choisir fait passer l'éditeur du menu à la saisie libre.
 */
const OTHER = '__autre__';

/*
  L'entrée « — choisir — » vaut la chaîne vide, et Radix la refuse sur une entrée
  de menu : elle lui sert à dire « rien de retenu ». Une sentinelle donc, que
  `prendre` retraduit — le service ne voit rien changer.
*/
const EMPTY_CHOICE = '__vide__';

export interface FieldRowProps {
  label: string;
  value: string | string[] | null;
  kind?: FieldKind;
  options?: readonly FieldOption[];
  onSave?: (value: string | string[]) => void;
  status?: FieldStatus;
  /**
   * Le retour d'enregistrement, à côté de la valeur. Il appartient à la ligne :
   * un bandeau en bas d'écran ne dirait pas QUEL champ a échoué.
   */
  save?: FieldSave;
  /** Provenance de la valeur, affichée en infobulle (ex. « Relevé du 12/03 »). */
  origin?: string;
  /**
   * Les photos qui justifient la valeur — la plaque où elle a été lue.
   * Sert au libellé du bouton ; l'ouverture appartient à l'appelant.
   */
  photos?: readonly { name: string }[];
  onViewPhotos?: () => void;
  /**
   * Le menu accepte-t-il une valeur hors liste ? Ajoute « Autre — saisir une
   * valeur… » en pied de menu, qui bascule en saisie libre.
   */
  other?: boolean;
  /**
   * Rouvrir l'éditeur depuis l'extérieur — la valeur dont ce champ dépend vient
   * de changer, et celle-ci est périmée. Passer un nombre différent à chaque
   * demande : c'est le CHANGEMENT qui ouvre, pas la valeur.
   */
  requestOpen?: number;
  /**
   * Les schémas qui expliquent COMMENT la mesure se prend — pas où elle a été
   * lue. Distincts des photos : sur site ils servent à mesurer, au bureau ils
   * expliquent une valeur déjà relevée.
   */
  schematics?: readonly { name: string }[];
  onViewSchematics?: () => void;
  /**
   * UNE action propre à cette ligne-là, à côté des photos et des schémas.
   *
   * Photos et schémas sont deux affordances NOMMÉES parce qu'elles reviennent
   * partout et veulent dire la même chose partout. Celle-ci est le cas
   * particulier : « Calculer » sur la course d'une gaine, que rien d'autre ne
   * porte. Une seule, et l'appelant dit le rôle d'icône et le mot — le système
   * ne prétend pas connaître d'avance ce que l'écran sait faire.
   */
  action?: {
    role: IconRole;
    label: string;
    onClick: () => void;
    /** Le mot affiché, quand le libellé complet est trop long pour la ligne —
     *  « Calculer » pour « Calculer la course ». Par défaut, le libellé. */
    word?: string;
  };
  /**
   * Désigne la ligne : la recherche vient d'y emmener. Elle défile sous les
   * yeux une fois, puis le repère s'efface.
   */
  landmark?: boolean;
  readOnly?: boolean;
  className?: string;
}

/**
 * Ce qu'une ligne pose à côté de sa valeur — et il y en a DEUX SORTES.
 *
 * Une RÉFÉRENCE — la photo où la valeur a été lue, le schéma qui explique la
 * mesure — reste une icône nue : rien à l'écran tant qu'on ne la cherche pas,
 * sans quoi une rubrique de cent lignes serait constellée de pictos.
 *
 * Une ACTION porte son mot. Sans lui elle ne se trouve pas : « Calculer » posé
 * en icône grise de quatorze pixels à côté d'une valeur est passé inaperçu de
 * celui qui l'avait demandé la veille (14/09/2026). On ne cherche pas ce dont
 * on ignore l'existence — une référence répond à une question qu'on se pose,
 * une action doit s'annoncer.
 */
function RowButton({
  role,
  label,
  onClick,
  word,
}: {
  role: IconRole;
  label: string;
  onClick: () => void;
  /** Le mot à montrer. Absent : l'icône seule, pour les références. */
  word?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-[24px] shrink-0 items-center justify-center rounded-control',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary',
        word
          ? 'gap-xxs border border-border bg-bg px-xs text-caption font-semibold text-primary hover:bg-bg-muted'
          : 'w-[24px] text-text-subtle hover:bg-bg-muted hover:text-text-muted',
      )}
    >
      <Icon role={role} size="xs" />
      {word ? <span>{word}</span> : null}
    </button>
  );
}

// Les mots viennent de la logique partagée, les classes restent ici : le
// vocabulaire converge entre web et mobile, l'habillage non.
const STATUS_CLASS: Record<FieldStatus, string> = {
  filled: 'bg-success-bg text-on-success-bg',
  missing: 'bg-danger-bg text-on-danger-bg',
  to_check: 'bg-warning-bg text-on-warning-bg',
};

// Formulations reprises telles quelles du module actuel (index.html:4671) : le
// wording de la fiche ne change pas parce qu'on la réécrit.
const SAVE_CLASS: Record<FieldSave, string> = {
  saving: 'text-text-muted',
  ok: 'text-success',
  error: 'text-danger',
};



/*
  Le texte de la ligne en lecture.

  `kind` n'entre en jeu que pour les dates, et c'est délibéré : elles sont le
  seul genre dont la valeur STOCKÉE n'est pas la valeur LISIBLE. `2026-09-12`
  s'affiche « 12/09/2026 ». Les quatre autres genres passent par le chemin
  qu'ils ont toujours pris, à la ligne près.
*/
function afficher(value: string | string[] | null, kind: FieldKind): string {
  if (kind === 'date') return dateText(value);
  if (Array.isArray(value)) return value.length ? value.join(', ') : EMPTY;
  return value && value.trim() !== '' ? value : EMPTY;
}

export function FieldRow({
  label,
  value,
  kind = 'text',
  options = [],
  onSave,
  status,
  save,
  origin,
  photos,
  onViewPhotos,
  schematics,
  onViewSchematics,
  action,
  other = false,
  requestOpen,
  landmark = false,
  readOnly = false,
  className,
}: FieldRowProps) {
  const [enSaisie, setEnSaisie] = React.useState(false);
  const editable = Boolean(onSave) && !readOnly;

  /*
    Une demande d'ouverture venue de l'extérieur. Ajustée pendant le rendu et
    non dans un effet : l'effet dessinerait d'abord la ligne fermée, et l'éditeur
    apparaîtrait après coup — sur un champ qu'on vient de désigner, ce clignement
    se voit.
  */
  const [derniereDemande, setDerniereDemande] = React.useState(requestOpen);
  if (requestOpen !== derniereDemande) {
    setDerniereDemande(requestOpen);
    if (requestOpen !== undefined && editable) setEnSaisie(true);
  }
  const isEmpty = value === null || value === '' || (Array.isArray(value) && value.length === 0);

  /*
    Amener la ligne sous les yeux — UNE fois. Sans ça, la recherche change
    d'écran, allume son repère, et le repère s'éteint hors de l'écran : sur une
    rubrique de cent lignes, la recherche a l'air de n'avoir rien fait.

    Une seule fois, parce que le `ref` est rappelé à chaque rendu : redéfiler à
    chaque frappe empêcherait de bouger la page à la main.
  */
  const deja = React.useRef(false);
  const amener = React.useCallback((el: HTMLDivElement | null) => {
    if (!el || deja.current) return;
    deja.current = true;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);
  React.useEffect(() => {
    if (!landmark) deja.current = false;
  }, [landmark]);

  const ouvrir = () => editable && setEnSaisie(true);
  const valider = (value: string | string[]) => {
    onSave?.(value);
    setEnSaisie(false);
  };

  return (
    <div
      ref={landmark ? amener : undefined}
      className={cn(
        'grid grid-cols-[190px_1fr] items-start gap-md py-sm',
        /*
          Le filet, et le `last:` qui le retire en bas de la pile.

          **`last:` désigne le dernier enfant du DOM**, donc le bas de la colonne
          DROITE dans une grille à deux colonnes : le bas de la gauche garde son
          filet et se lit comme un champ manquant. Le composant ne peut pas le
          deviner, le nombre de colonnes est une décision de l'écran — c'est à la
          grille de poser `[&>*:nth-last-child(-n+2)]:border-b-0`. Dit dans la
          fiche, section « `FieldRow` suppose une pile ».
        */
        'border-b border-border-soft last:border-b-0',
        // Marges négatives compensées : le fond du repère doit déborder de la
        // colonne, sinon il s'arrête au ras du libellé et se lit comme un défaut.
        landmark && '-mx-sm animate-repere rounded-control px-sm',
        className,
      )}
    >
      <span
        className={cn(
          'min-w-0 pt-xxs text-small break-words text-text-muted',
          landmark && 'animate-repere-libelle underline decoration-transparent decoration-2 underline-offset-4',
        )}
      >
        {label}
      </span>

      <div className="min-w-0">
        {enSaisie ? (
          <Editor
            kind={kind}
            label={label}
            value={value}
            options={options}
            other={other}
            onValider={valider}
            onAnnuler={() => setEnSaisie(false)}
          />
        ) : (
          <div className="flex flex-wrap items-center gap-sm">
            <span
              role={editable ? 'button' : undefined}
              tabIndex={editable ? 0 : undefined}
              title={origin}
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
                isEmpty
                  ? 'text-text-muted border-border'
                  : 'text-text border-text-subtle',
              )}
            >
              {afficher(value, kind)}
            </span>
            {onViewPhotos && photos && photos.length > 0 ? (
              // Discret par construction : rien à l'écran tant qu'on ne le
              // cherche pas. La photo explique la valeur, elle ne la remplace
              // pas — l'imposer encombrerait une rubrique de cent lignes.
              <RowButton
                role="photo"
                label={photosLabel(photos)}
                onClick={onViewPhotos}
              />
            ) : null}
            {onViewSchematics && schematics && schematics.length > 0 ? (
              <RowButton
                role="measure"
                label={schematicsLabel(schematics)}
                onClick={onViewSchematics}
              />
            ) : null}
            {action ? (
              <RowButton
                role={action.role}
                label={action.label}
                onClick={action.onClick}
                word={action.word ?? action.label}
              />
            ) : null}
            {status ? (
              <span
                className={cn(
                  'shrink-0 rounded-control px-xs py-xxs text-caption font-semibold',
                  STATUS_CLASS[status],
                )}
              >
                {STATUS_TEXT[status]}
              </span>
            ) : null}
            {save ? (
              // `status` et non `alert` : l'échec est déjà visible — la valeur
              // d'avant est revenue sous les yeux de l'utilisateur. Interrompre
              // le lecteur d'écran une deuxième fois n'apporterait rien.
              <span
                role="status"
                className={cn(
                  'shrink-0 text-caption font-bold',
                  SAVE_CLASS[save],
                )}
              >
                {SAVE_TEXT[save]}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/** « Photo source — Plaque de charge », ou « 3 photos sources · A · B · C ». */
function photosLabel(photos: readonly { name: string }[]): string {
  if (photos.length === 1) return `Photo source — ${photos[0].name}`;
  return `${photos.length} photos sources · ${photos.map((p) => p.name).join(' · ')}`;
}

/** « Schéma de mesure — MA2LV », ou « 3 schémas de mesure · A · B · C ». */
function schematicsLabel(schematics: readonly { name: string }[]): string {
  if (schematics.length === 1) return `Schéma de mesure — ${schematics[0].name}`;
  return `${schematics.length} schémas de mesure · ${schematics.map((p) => p.name).join(' · ')}`;
}

// ------------------------------------------------------------------ éditeurs

interface EditorProps {
  kind: FieldKind;
  label: string;
  value: string | string[] | null;
  options: readonly FieldOption[];
  other?: boolean;
  onValider: (v: string | string[]) => void;
  onAnnuler: () => void;
}

function Editor({ kind, label, value, options, other, onValider, onAnnuler }: EditorProps) {
  // « Autre » bascule le menu en saisie libre, sans refermer la ligne.
  const [free, setLibre] = React.useState(false);
  if (kind === 'multi') {
    return (
      <MultiEditor
        label={label}
        value={Array.isArray(value) ? value : []}
        options={options}
        other={other}
        onValider={onValider}
        onAnnuler={onAnnuler}
      />
    );
  }

  if (kind === 'choice' && !free) {
    const { choices, chosen } = choiceMenu(value, options);
    if (other) choices.push({ value: OTHER, label: 'Autre — saisir une valeur…' });

    /* Choisir la valeur, ou l'ouvrir en saisie libre. Le même geste pour les
       deux menus, qui ne diffèrent que par la façon de trouver l'entrée. */
    const prendre = (brut: string) => {
      const v = brut === EMPTY_CHOICE ? '' : brut;
      if (v === OTHER) {
        setLibre(true);
        return;
      }
      /* Reprendre la valeur déjà retenue ferme sans écrire : c'est ce que le
         geste veut dire. Réenregistrer à l'identique coûterait un aller-retour
         et daterait la fiche d'une correction qui n'en est pas une. */
      if (v === chosen) onAnnuler();
      else onValider(v);
    };

    return (
      <div
        className="flex flex-wrap items-center gap-sm"
        onKeyDown={(e) => e.key === 'Escape' && onAnnuler()}
      >
        {choices.length > SEARCH_THRESHOLD ? (
          /* Trois cent soixante-seize modèles de machine : sans champ de
             recherche, la bonne valeur est introuvable autrement qu'en la
             sachant déjà — et il faudrait la faire défiler pour la retrouver. */
          <div className="min-w-0 flex-1">
            <Combobox
              options={choices.map((o) => ({ value: o.value, label: o.label }))}
              value={chosen}
              onValue={prendre}
              ariaLabel={label}
              autoFocus
              placeholder={`Rechercher — ${label.toLowerCase()}`}
              className="h-(--arq-control-sm) border-(length:--arq-border-epais) border-primary"
            />
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <Select value={chosen} onValueChange={prendre}>
              <SelectTrigger
                autoFocus
                aria-label={label}
                className="h-(--arq-control-sm) w-full border-(length:--arq-border-epais) border-primary"
              >
                <SelectValue placeholder="— choisir —" />
              </SelectTrigger>
              <SelectContent>
                {choices.map((o) => (
                  <SelectItem key={o.value} value={o.value || EMPTY_CHOICE}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Button variant="secondary" size="sm" onClick={onAnnuler}>
          Annuler
        </Button>
      </div>
    );
  }

  if (kind === 'date') {
    return <DateEditor label={label} value={value} onValider={onValider} onAnnuler={onAnnuler} />;
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
      className="h-(--arq-control-sm) w-full rounded-control border-(length:--arq-border-epais) border-primary px-sm text-small text-text outline-none"
    />
  );
}

function MultiEditor({
  label,
  value,
  options,
  other,
  onValider,
  onAnnuler,
}: {
  label: string;
  value: string[];
  options: readonly FieldOption[];
  /** Le jeu porte « Autre » : une valeur saisie s'ajoute aux cases cochées. */
  other?: boolean;
  onValider: (v: string[]) => void;
  onAnnuler: () => void;
}) {
  /*
    UNE VALEUR SAISIE, À CÔTÉ DES CASES.

    Un jeu d'options ouvert porte « Autre » : le relevé coche l'option et écrit
    le texte dans une colonne jumelle. Sur un choix MULTIPLE, ce texte revient
    mêlé aux valeurs connues — et les pastilles ne montrant que le catalogue, il
    était invisible ici, donc perdu au premier enregistrement.

    On le sort donc de la liste pour le mettre dans sa propre saisie, et on le
    remet dedans en enregistrant. Une seule valeur libre : la colonne jumelle
    n'en porte qu'une, et le service refuse au-delà.
  */
  const initial = splitMultipleChoice(value, options);
  const [chosen, setChosen] = React.useState<string[]>(initial.known);
  const [otherText, setOtherText] = React.useState(initial.free);
  const [inputOpen, setInputOpen] = React.useState(
    Boolean(initial.free) || initial.marked,
  );

  const toggle = (v: string) =>
    setChosen((current) =>
      current.includes(v) ? current.filter((x) => x !== v) : [...current, v],
    );

  /* Ce qui part : les cases cochées, puis la valeur libre. L'ordre n'a pas
     d'importance pour Bubble, qui range selon son jeu d'options ; il en a pour
     la relecture, où l'on veut retrouver le catalogue avant l'exception. */
  const retained = () => {
    if (otherText.trim()) return [...chosen, otherText.trim()];
    /* La pastille cochée sans texte : on REMET le mot tel qu'il était stocké,
       plutôt que de l'effacer au passage. Le relevé l'a écrit, et la valeur
       saisie vit dans sa propre colonne — que la fiche montre à côté. */
    return initial.marked && inputOpen ? [...chosen, 'Autre'] : chosen;
  };

  return (
    <div
      role="group"
      aria-label={label}
      onKeyDown={(e) => e.key === 'Escape' && onAnnuler()}
      className="rounded-control border-(length:--arq-border-epais) border-primary bg-bg p-sm"
    >
      <div className="flex flex-wrap gap-xs">
        {options.map((o) => {
          const active = chosen.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(o.value)}
              className={cn(
                'rounded-control px-sm py-xxs text-caption font-semibold outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary',
                active
                  ? 'bg-primary text-text-on-dark'
                  : 'bg-bg-muted text-text-muted hover:bg-info-bg',
              )}
            >
              {o.label}
            </button>
          );
        })}
        {other ? (
          <button
            type="button"
            aria-pressed={inputOpen}
            onClick={() => {
              /* Refermer la saisie EFFACE la valeur libre : laisser un texte
                 invisible partir à l'enregistrement serait pire que de le
                 perdre sous les yeux. */
              if (inputOpen) setOtherText('');
              setInputOpen((o) => !o);
            }}
            className={cn(
              'rounded-control px-sm py-xxs text-caption font-semibold outline-none',
              'focus-visible:ring-2 focus-visible:ring-primary',
              inputOpen
                ? 'bg-primary text-text-on-dark'
                : 'bg-bg-muted text-text-muted hover:bg-info-bg',
            )}
          >
            Autre
          </button>
        ) : null}
      </div>
      {other && inputOpen ? (
        <div className="mt-sm">
          <Input
            autoFocus
            aria-label={`${label} — autre`}
            value={otherText}
            placeholder="Saisir une valeur…"
            onChange={(e) => setOtherText(e.target.value)}
            className="h-[30px]"
          />
        </div>
      ) : null}
      <div className="mt-sm flex flex-wrap items-center gap-sm">
        <Button size="sm" onClick={() => onValider(retained())}>
          Enregistrer
        </Button>
        <Button variant="secondary" size="sm" onClick={onAnnuler}>
          Annuler
        </Button>
        {/* Les libellés retenus, pas leur nombre : on relit ce qu'on vient de
            cocher sans reparcourir les pastilles. Et quand il n'en reste aucun,
            on dit pourquoi ça ne partira pas — le service refuse une valeur
            vide, la consolidation la repeuplerait au calcul suivant. */}
        <span className="text-caption text-text-muted">
          {retained().length === 0
            ? 'Aucune valeur retenue — un champ ne peut pas être vidé depuis la fiche.'
            : retained()
                .map((v) => options.find((o) => o.value === v)?.label ?? v)
                .join(' · ')}
        </span>
      </div>
    </div>
  );
}

/**
 * L'éditeur d'une date : un `DateField`, et deux boutons.
 *
 * **Pas de validation à la perte de focus**, contrairement au champ texte. Le
 * réflexe y est de cliquer ailleurs, mais ici « ailleurs » est souvent le
 * bouton de calendrier du champ lui-même : la sortie de focus enregistrerait la
 * date d'avant et refermerait la ligne au moment précis où l'utilisateur ouvre
 * la grille pour la changer. Deux boutons explicites, comme `MultiEditor`.
 *
 * Ce que `onSave` reçoit est de l'**ISO**, jamais ce que la ligne affichait.
 */
function DateEditor({
  label,
  value,
  onValider,
  onAnnuler,
}: {
  label: string;
  value: string | string[] | null;
  onValider: (v: string) => void;
  onAnnuler: () => void;
}) {
  /*
    La valeur de départ passe par `toISO`, qui accepte les DEUX écritures. C'est
    ce qui permet à `FieldRow` de vivre avec son unique prop `value` : que
    l'appelant l'ait donnée en ISO (`2026-09-12`) ou en français (`12/09/2026`),
    l'éditeur s'ouvre sur la bonne date. Une valeur illisible ouvre un champ
    vide plutôt que de refuser la correction.
  */
  const initiale = toISO(typeof value === 'string' ? value : '');
  const [iso, setIso] = React.useState<string | null>(initiale);

  /* Le même geste que le bouton, et la même règle de reclic : réenregistrer la
     date déjà en place ferme sans écrire. */
  const enregistrer = () => {
    if (iso === null || iso === initiale) onAnnuler();
    else onValider(iso);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-sm"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onAnnuler();
        /*
          Entrée enregistre, comme sur l'éditeur texte : on tape la date, on
          valide, sans chercher le bouton. Le calendrier est monté dans un
          portail, donc son propre Entrée — celui qui choisit un jour — ne
          remonte pas jusqu'ici et ne peut pas déclencher les deux.
        */
        if (e.key === 'Enter') {
          e.preventDefault();
          enregistrer();
        }
      }}
    >
      <div className="min-w-0 flex-1">
        <DateField value={iso} onValue={setIso} ariaLabel={label} autoFocus />
      </div>
      <Button
        size="sm"
        // Rien à enregistrer tant que la frappe ne fait pas une date. Le champ
        // dit déjà pourquoi, juste en dessous — le bouton n'a pas à le répéter.
        disabled={iso === null}
        /* Réenregistrer la même date daterait la fiche d'une correction qui
           n'en est pas une — la règle du menu à choix, pour la même raison. */
        onClick={enregistrer}
      >
        Enregistrer
      </Button>
      <Button variant="secondary" size="sm" onClick={onAnnuler}>
        Annuler
      </Button>
    </div>
  );
}
