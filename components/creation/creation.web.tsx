'use client';

/*
  LE GESTE DE CRÉATION, DOUBLÉ DANS LE CORPS DE LA PAGE (Louis, 12/11/2026, d'après ClickUp,
  Notion et Linear) : le bouton de création reste en haut à droite de l'en-tête, et il se
  retrouve aussi là où l'on regarde ce qui manque : dans l'état vide (« + Nouvelle note »),
  et en dernière ligne d'un tableau (« + Nouvelle note », discrète).

  Rien à câbler écran par écran : les en-têtes (`PageHeader`, l'en-tête de fiche) marquent
  leur zone de boutons (`data-actions-en-tete`), et l'on y lit le bouton dont le libellé
  CRÉE (« Nouveau … », « Nouvelle … », « Ajouter … »). Le doublon le déclenche : c'est le même
  geste, avec son panneau et ses droits, jamais une seconde porte qui pourrait diverger.
*/

import * as React from 'react';

import { Button } from '../button/button.web';
import { Icon } from '../icon/icon.web';
import { cn } from '../_lib/cn';

/** Le libellé d'un bouton qui crée : c'est ce que le doublon recopie. */
export const LIBELLE_DE_CREATION = /^(Nouveau|Nouvelle|Nouvel|Ajouter|Déposer|Déclarer|Noter)\b/;

type Creation = { label: string; trigger: () => void };

/** Le bouton de création actif des en-têtes de la page, tel qu'il est À CET INSTANT. */
function boutonDeCreation(): { label: string; el: HTMLElement } | null {
  for (const zone of document.querySelectorAll<HTMLElement>('[data-actions-en-tete]')) {
    for (const el of zone.querySelectorAll<HTMLElement>('button, a')) {
      const label = el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      const inactif = el instanceof HTMLButtonElement && el.disabled;
      if (!inactif && LIBELLE_DE_CREATION.test(label)) return { label, el };
    }
  }
  return null;
}

/** Le bouton de création de l'en-tête de la page, s'il y en a un, actif. */
export function useHeaderCreation(enabled = true): Creation | null {
  // Le LIBELLÉ seulement : React remplace le bouton d'en-tête à son gré, et un clic sur un
  // nœud détaché ne fait rien. Le bouton se relit au moment du clic.
  const [label, setLabel] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!enabled) { setLabel(null); return; }
    const lire = () => setLabel(boutonDeCreation()?.label ?? null);
    lire();
    // Les boutons d'un onglet montent dans l'en-tête après coup (un portail) : on suit la zone.
    const veille = new MutationObserver(lire);
    document.querySelectorAll('[data-actions-en-tete]').forEach((z) => veille.observe(z, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['disabled'] }));
    return () => veille.disconnect();
  }, [enabled]);
  return label ? { label, trigger: () => boutonDeCreation()?.el.click() } : null;
}

/**
 * La dernière ligne d'un tableau qui accepte des créations : « + Nouvelle note », discrète,
 * pleine largeur, aux marges de la page. Elle déclenche le bouton de création de l'en-tête ;
 * sans lui, elle ne paraît pas.
 */
export function AddRow({ className }: { className?: string }) {
  const creation = useHeaderCreation();
  if (!creation) return null;
  return (
    <button
      type="button"
      data-ligne-d-ajout
      onClick={creation.trigger}
      className={cn(
        'flex h-9 w-full items-center gap-xs border-b border-border-soft px-base text-left text-description text-text-muted transition-colors hover:bg-bg-hover hover:text-text focus-ring sm:px-xl',
        className,
      )}
    >
      <Icon role="add" size="sm" aria-hidden />
      {creation.label}
    </button>
  );
}

/** Le bouton de création dans un état vide : le même geste que celui de l'en-tête. */
export function CreationButton({ className }: { className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [dansUnPanneau, setDansUnPanneau] = React.useState(true);
  React.useEffect(() => { setDansUnPanneau(!!ref.current?.closest('[role=dialog],[data-sans-creation]')); }, []);
  const creation = useHeaderCreation(!dansUnPanneau);
  return (
    <span ref={ref} className={cn('contents', className)}>
      {creation ? (
        <Button variant="outline" size="sm" className="mt-base" onClick={creation.trigger}>
          <Icon role="add" size="sm" aria-hidden />
          {creation.label}
        </Button>
      ) : null}
    </span>
  );
}
