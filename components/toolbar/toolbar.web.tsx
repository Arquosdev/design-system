'use client';

import * as React from 'react';

import { Icon } from '../icon/icon.web';
import { type IconRole } from '../../src/icons';
import { cn } from '../_lib/cn';

const BOUTON =
  // Le même que le bouton secondaire depuis le 07/10/2026 : gris pâle, bordure douce.
  'flex h-9 items-center gap-sm rounded-control border border-border-soft bg-bg-muted px-md ' +
  'text-small-bold whitespace-nowrap text-text hover:border-border hover:bg-border-soft ' +
  'focus-ring';

/** La barre au-dessus d'une liste : ce qu'on peut lui faire. */
export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-sm px-base py-md sm:px-xl', className)}>{children}</div>
  );
}

export interface ToolButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  icon: IconRole;
  children: React.ReactNode;
  /** Ce que le bouton porte en plus : un compte de filtres actifs. */
  count?: number;
  /** Une précision discrète, en graisse normale : « 9 / 24 ». */
  extra?: string;
  /** Le réglage qu'il ouvre est en cours : le bouton le dit. */
  active?: boolean;
}

/**
 * Un bouton de barre d'outils.
 *
 * Il transmet sa ref : sans elle, un menu ancré dessus (`PopoverTrigger asChild`)
 * n'a rien à quoi s'accrocher et ne s'ouvre jamais — sans erreur.
 */
export const ToolButton = React.forwardRef<HTMLButtonElement, ToolButtonProps>(
  function ToolButton({ icon, children, count, extra, active = false, className, ...reste }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={reste.onClick && !('aria-haspopup' in reste) ? active : undefined}
        className={cn(BOUTON, 'max-sm:px-sm', active && 'border-primary bg-info-bg text-on-info-bg hover:border-primary', className)}
        {...reste}
      >
        <Icon role={icon} className="size-4 shrink-0" aria-hidden />
        {/* Sur un téléphone, l'icône seule : le libellé reste pour un lecteur
            d'écran, et la barre tient sur une ligne au lieu de quatre (A3-14). */}
        <span className="max-sm:sr-only">{children}</span>
        {extra && <span className="font-normal max-sm:hidden">{extra}</span>}
        {count !== undefined && count > 0 && (
          <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-xs text-caption-bold text-text-on-dark">
            {count}
          </span>
        )}
      </button>
    );
  },
);

export interface ToolbarSearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Ce qu'on peut taper : « Numéro, adresse, client ». Défaut : « Rechercher ». */
  placeholder?: string;
  /** Le nom du champ pour un lecteur d'écran. Défaut : le texte d'attente. */
  label?: string;
  /**
   * Replié en loupe tant qu'on ne cherche pas (défaut). Faux : le champ reste
   * toujours ouvert, pour une page dont la recherche EST le sujet.
   */
  repliable?: boolean;
  className?: string;
}

/**
 * La recherche d'une liste, dans sa barre d'outils (audit design du
 * 11/10/2026, A1-02, A2-04, A3-15 : aucune liste n'en avait).
 *
 * **Repliée en loupe, comme chez ClickUp** (Louis, 12/10/2026 : « la double
 * barre de recherche noie un peu l'utilisateur »). Sous la recherche globale de
 * l'en-tête, un second champ ouvert se lisait comme un doublon. La loupe
 * s'ouvre au clic en champ, d'un glissement de sa largeur, et se replie quand
 * on la quitte vide ; une recherche en cours la garde ouverte, pour qu'on voie
 * ce qui filtre la liste.
 *
 * La touche « / » l'ouvre et y place le curseur, comme chez Linear et GitHub,
 * tant qu'on n'écrit pas déjà ailleurs ; Échap la vide. Le champ ne l'affiche
 * plus (Louis, 13/10/2026) : le repère ne paraissait qu'une fois le champ
 * ouvert, c'est-à-dire quand on n'en avait plus besoin.
 */
export function ToolbarSearch({ value, onChange, placeholder = 'Rechercher', label, repliable = true, className }: ToolbarSearchProps) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [focus, setFocus] = React.useState(false);
  const ouverte = !repliable || focus || value !== '';
  const ouvrir = () => {
    setFocus(true);
    // Après le rendu qui déplie le champ : un champ replié ne prend pas le focus.
    requestAnimationFrame(() => ref.current?.focus());
  };
  React.useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const cible = e.target as HTMLElement | null;
      if (cible && (cible.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(cible.tagName))) return;
      e.preventDefault();
      ouvrir();
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, []);
  return (
    <label
      className={cn(
        'relative flex h-9 items-center overflow-hidden rounded-control border',
        'transition-[width,background-color,border-color] duration-200 ease-out motion-reduce:transition-none',
        ouverte
          ? 'w-full gap-sm border-border bg-bg px-md focus-ring-within sm:w-64'
          : 'w-9 cursor-pointer justify-center border-border-soft bg-bg-muted hover:border-border hover:bg-border-soft',
        className,
      )}
      onMouseDown={(e) => {
        if (!ouverte) { e.preventDefault(); ouvrir(); }
      }}
    >
      <Icon role="search" className={cn('size-4 shrink-0', ouverte ? 'text-text-muted' : 'text-text')} aria-hidden />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={(e) => {
          if (e.key !== 'Escape') return;
          e.preventDefault();
          if (value) onChange('');
          else ref.current?.blur();
        }}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        // Replié, le champ reste dans la page (le clavier et un lecteur d'écran l'atteignent) mais sans largeur.
        className={cn(
          'min-w-0 bg-transparent text-small text-text outline-none placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden',
          ouverte ? 'flex-1 opacity-100' : 'absolute inset-0 w-full cursor-pointer opacity-0',
        )}
      />
    </label>
  );
}

/** Pousse ce qui suit à droite de la barre. */
export function ToolbarSpacer() {
  return <span className="flex-1" />;
}
