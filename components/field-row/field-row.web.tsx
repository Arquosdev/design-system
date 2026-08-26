'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';
import {
  menuDeChoix,
  texteDeValeur,
  TEXTE_SAUVEGARDE,
  TEXTE_STATUT,
  VIDE,
  type FieldKind,
  type FieldOption,
  type FieldSauvegarde,
  type FieldStatut,
} from './field-row.logic';
import { Button } from '../button/button.web';
import { Combobox, SEUIL_RECHERCHE } from '../combobox/combobox.web';
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
const AUTRE = '__autre__';

/*
  L'entrée « — choisir — » vaut la chaîne vide, et Radix la refuse sur une entrée
  de menu : elle lui sert à dire « rien de retenu ». Une sentinelle donc, que
  `prendre` retraduit — le service ne voit rien changer.
*/
const VIDE_CHOIX = '__vide__';

export interface FieldRowProps {
  label: string;
  value: string | string[] | null;
  kind?: FieldKind;
  options?: readonly FieldOption[];
  onSave?: (valeur: string | string[]) => void;
  statut?: FieldStatut;
  /**
   * Le retour d'enregistrement, à côté de la valeur. Il appartient à la ligne :
   * un bandeau en bas d'écran ne dirait pas QUEL champ a échoué.
   */
  sauvegarde?: FieldSauvegarde;
  /** Provenance de la valeur, affichée en infobulle (ex. « Relevé du 12/03 »). */
  origine?: string;
  /**
   * Les photos qui justifient la valeur — la plaque où elle a été lue.
   * Sert au libellé du bouton ; l'ouverture appartient à l'appelant.
   */
  photos?: readonly { nom: string }[];
  onVoirPhotos?: () => void;
  /**
   * Le menu accepte-t-il une valeur hors liste ? Ajoute « Autre — saisir une
   * valeur… » en pied de menu, qui bascule en saisie libre.
   */
  autre?: boolean;
  /**
   * Rouvrir l'éditeur depuis l'extérieur — la valeur dont ce champ dépend vient
   * de changer, et celle-ci est périmée. Passer un nombre différent à chaque
   * demande : c'est le CHANGEMENT qui ouvre, pas la valeur.
   */
  demandeOuverture?: number;
  /**
   * Les schémas qui expliquent COMMENT la mesure se prend — pas où elle a été
   * lue. Distincts des photos : sur site ils servent à mesurer, au bureau ils
   * expliquent une valeur déjà relevée.
   */
  schemas?: readonly { nom: string }[];
  onVoirSchemas?: () => void;
  /**
   * Désigne la ligne : la recherche vient d'y emmener. Elle défile sous les
   * yeux une fois, puis le repère s'efface.
   */
  repere?: boolean;
  readOnly?: boolean;
  className?: string;
}

// Les mots viennent de la logique partagée, les classes restent ici : le
// vocabulaire converge entre web et mobile, l'habillage non.
const CLASSE_STATUT: Record<FieldStatut, string> = {
  renseigne: 'bg-success-bg text-on-success-bg',
  manquant: 'bg-danger-bg text-on-danger-bg',
  a_verifier: 'bg-warning-bg text-on-warning-bg',
};

// Formulations reprises telles quelles du module actuel (index.html:4671) : le
// wording de la fiche ne change pas parce qu'on la réécrit.
const CLASSE_SAUVEGARDE: Record<FieldSauvegarde, string> = {
  encours: 'text-text-muted',
  ok: 'text-success',
  echec: 'text-danger',
};



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
  sauvegarde,
  origine,
  photos,
  onVoirPhotos,
  schemas,
  onVoirSchemas,
  autre = false,
  demandeOuverture,
  repere = false,
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
  const [derniereDemande, setDerniereDemande] = React.useState(demandeOuverture);
  if (demandeOuverture !== derniereDemande) {
    setDerniereDemande(demandeOuverture);
    if (demandeOuverture !== undefined && editable) setEnSaisie(true);
  }
  const estVide = value === null || value === '' || (Array.isArray(value) && value.length === 0);

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
    if (!repere) deja.current = false;
  }, [repere]);

  const ouvrir = () => editable && setEnSaisie(true);
  const valider = (valeur: string | string[]) => {
    onSave?.(valeur);
    setEnSaisie(false);
  };

  return (
    <div
      ref={repere ? amener : undefined}
      className={cn(
        'grid grid-cols-[190px_1fr] items-start gap-md py-sm',
        'border-b border-border-soft last:border-b-0',
        // Marges négatives compensées : le fond du repère doit déborder de la
        // colonne, sinon il s'arrête au ras du libellé et se lit comme un défaut.
        repere && '-mx-sm animate-repere rounded-control px-sm',
        className,
      )}
    >
      <span
        className={cn(
          'min-w-0 pt-xxs text-small break-words text-text-muted',
          repere && 'animate-repere-libelle underline decoration-transparent decoration-2 underline-offset-4',
        )}
      >
        {label}
      </span>

      <div className="min-w-0">
        {enSaisie ? (
          <Editeur
            kind={kind}
            label={label}
            value={value}
            options={options}
            autre={autre}
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
                  ? 'text-text-muted border-border'
                  : 'text-text border-text-subtle',
              )}
            >
              {afficher(value)}
            </span>
            {onVoirPhotos && photos && photos.length > 0 ? (
              // Discret par construction : rien à l'écran tant qu'on ne le
              // cherche pas. La photo explique la valeur, elle ne la remplace
              // pas — l'imposer encombrerait une rubrique de cent lignes.
              <button
                type="button"
                onClick={onVoirPhotos}
                aria-label={libellePhotos(photos)}
                title={libellePhotos(photos)}
                className={cn(
                  'inline-flex size-[24px] shrink-0 items-center justify-center rounded-control',
                  'text-text-subtle outline-none hover:bg-bg-muted hover:text-text-muted',
                  'focus-visible:ring-2 focus-visible:ring-primary',
                )}
              >
                <Icon role="photo" size="xs" />
              </button>
            ) : null}
            {onVoirSchemas && schemas && schemas.length > 0 ? (
              <button
                type="button"
                onClick={onVoirSchemas}
                aria-label={libelleSchemas(schemas)}
                title={libelleSchemas(schemas)}
                className={cn(
                  'inline-flex size-[24px] shrink-0 items-center justify-center rounded-control',
                  'text-text-subtle outline-none hover:bg-bg-muted hover:text-text-muted',
                  'focus-visible:ring-2 focus-visible:ring-primary',
                )}
              >
                <Icon role="mesure" size="xs" />
              </button>
            ) : null}
            {statut ? (
              <span
                className={cn(
                  'shrink-0 rounded-control px-xs py-xxs text-caption font-semibold',
                  CLASSE_STATUT[statut],
                )}
              >
                {TEXTE_STATUT[statut]}
              </span>
            ) : null}
            {sauvegarde ? (
              // `status` et non `alert` : l'échec est déjà visible — la valeur
              // d'avant est revenue sous les yeux de l'utilisateur. Interrompre
              // le lecteur d'écran une deuxième fois n'apporterait rien.
              <span
                role="status"
                className={cn(
                  'shrink-0 text-caption font-bold',
                  CLASSE_SAUVEGARDE[sauvegarde],
                )}
              >
                {TEXTE_SAUVEGARDE[sauvegarde]}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/** « Photo source — Plaque de charge », ou « 3 photos sources · A · B · C ». */
function libellePhotos(photos: readonly { nom: string }[]): string {
  if (photos.length === 1) return `Photo source — ${photos[0].nom}`;
  return `${photos.length} photos sources · ${photos.map((p) => p.nom).join(' · ')}`;
}

/** « Schéma de mesure — MA2LV », ou « 3 schémas de mesure · A · B · C ». */
function libelleSchemas(schemas: readonly { nom: string }[]): string {
  if (schemas.length === 1) return `Schéma de mesure — ${schemas[0].nom}`;
  return `${schemas.length} schémas de mesure · ${schemas.map((p) => p.nom).join(' · ')}`;
}

// ------------------------------------------------------------------ éditeurs

interface EditeurProps {
  kind: FieldKind;
  label: string;
  value: string | string[] | null;
  options: readonly FieldOption[];
  autre?: boolean;
  onValider: (v: string | string[]) => void;
  onAnnuler: () => void;
}

function Editeur({ kind, label, value, options, autre, onValider, onAnnuler }: EditeurProps) {
  // « Autre » bascule le menu en saisie libre, sans refermer la ligne.
  const [libre, setLibre] = React.useState(false);
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

  if (kind === 'choice' && !libre) {
    const { choix, retenue } = menuDeChoix(value, options);
    if (autre) choix.push({ value: AUTRE, label: 'Autre — saisir une valeur…' });

    /* Choisir la valeur, ou l'ouvrir en saisie libre. Le même geste pour les
       deux menus, qui ne diffèrent que par la façon de trouver l'entrée. */
    const prendre = (brut: string) => {
      const v = brut === VIDE_CHOIX ? '' : brut;
      if (v === AUTRE) {
        setLibre(true);
        return;
      }
      /* Reprendre la valeur déjà retenue ferme sans écrire : c'est ce que le
         geste veut dire. Réenregistrer à l'identique coûterait un aller-retour
         et daterait la fiche d'une correction qui n'en est pas une. */
      if (v === retenue) onAnnuler();
      else onValider(v);
    };

    return (
      <div
        className="flex flex-wrap items-center gap-sm"
        onKeyDown={(e) => e.key === 'Escape' && onAnnuler()}
      >
        {choix.length > SEUIL_RECHERCHE ? (
          /* Trois cent soixante-seize modèles de machine : sans champ de
             recherche, la bonne valeur est introuvable autrement qu'en la
             sachant déjà — et il faudrait la faire défiler pour la retrouver. */
          <div className="min-w-0 flex-1">
            <Combobox
              options={choix.map((o) => ({ valeur: o.value, libelle: o.label }))}
              valeur={retenue}
              onValeur={prendre}
              ariaLabel={label}
              autoFocus
              placeholder={`Rechercher — ${label.toLowerCase()}`}
              className="h-[30px] border-(length:--arq-border-epais) border-primary"
            />
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <Select value={retenue} onValueChange={prendre}>
              <SelectTrigger
                autoFocus
                aria-label={label}
                className="h-[30px] w-full border-(length:--arq-border-epais) border-primary"
              >
                <SelectValue placeholder="— choisir —" />
              </SelectTrigger>
              <SelectContent>
                {choix.map((o) => (
                  <SelectItem key={o.value} value={o.value || VIDE_CHOIX}>
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
      className="h-[30px] w-full rounded-control border-(length:--arq-border-epais) border-primary px-sm text-small text-text outline-none"
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
      className="rounded-control border-(length:--arq-border-epais) border-primary bg-bg p-sm"
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
                  : 'bg-bg-muted text-text-muted hover:bg-info-bg',
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
        {/* Les libellés retenus, pas leur nombre : on relit ce qu'on vient de
            cocher sans reparcourir les pastilles. Et quand il n'en reste aucun,
            on dit pourquoi ça ne partira pas — le service refuse une valeur
            vide, la consolidation la repeuplerait au calcul suivant. */}
        <span className="text-caption text-text-muted">
          {choisis.length === 0
            ? 'Aucune valeur retenue — un champ ne peut pas être vidé depuis la fiche.'
            : choisis
                .map((v) => options.find((o) => o.value === v)?.label ?? v)
                .join(' · ')}
        </span>
      </div>
    </div>
  );
}
