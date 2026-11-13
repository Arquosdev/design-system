'use client';

/*
  LE GESTE DE CRÉATION, DOUBLÉ DANS LE CORPS DE LA PAGE (Louis, 12/11/2026, d'après ClickUp,
  Notion et Linear) : le bouton de création reste en haut à droite de l'en-tête, et il se
  retrouve aussi là où l'on regarde ce qui manque : dans l'état vide (« + Nouvelle note »),
  et en fin de tableau, la ligne « + » discrète de `RecordTable` (`onAdd`, Louis, 13/11/2026,
  façon Airtable), à qui l'écran passe le `trigger` de `useHeaderCreation`.

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
// « Couvrir » : couvrir un équipement par un contrat est l'ajout de sa rubrique (13/11/2026).
export const LIBELLE_DE_CREATION = /^(Nouveau|Nouvelle|Nouvel|Ajouter|Couvrir|Déposer|Déclarer|Noter)\b/;

type Creation = { label: string; trigger: () => void };

/** Les zones de boutons des en-têtes : `PageHeader` et l'en-tête de fiche les marquent. */
export const ZONE_D_EN_TETE = '[data-actions-en-tete]';

/** Ce qui fait naître un objet, parmi ce que le doublon recopie : « Nouveau … ». */
const LIBELLE_DE_NAISSANCE = /^(Nouveau|Nouvelle|Nouvel)\b/;

/**
 * Le bouton de création actif des zones désignées, tel qu'il est À CET INSTANT.
 *
 * **Quand plusieurs répondent, CRÉER passe avant RATTACHER.** La rubrique Relevés d'une
 * affaire porte les deux (« Ajouter un relevé » et « Nouveau relevé ») : la ligne « + »
 * d'un tableau fait naître une ligne, comme chez Airtable, et le rattachement reste le
 * bouton de l'en-tête. Sans aucun « Nouveau … », le premier venu — « Couvrir un
 * équipement » est bien l'ajout de sa rubrique.
 */
function boutonDeCreation(zones: string): { label: string; el: HTMLElement } | null {
  let premier: { label: string; el: HTMLElement } | null = null;
  for (const zone of document.querySelectorAll<HTMLElement>(zones)) {
    for (const el of zone.querySelectorAll<HTMLElement>('button, a')) {
      const label = el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      const inactif = el instanceof HTMLButtonElement && el.disabled;
      if (inactif || !LIBELLE_DE_CREATION.test(label)) continue;
      if (LIBELLE_DE_NAISSANCE.test(label)) return { label, el };
      premier ??= { label, el };
    }
  }
  return premier;
}

/**
 * Le bouton de création de l'en-tête de la page, s'il y en a un, actif. `zones` resserre la
 * lecture (un sélecteur CSS) : une fiche n'y lit que l'emplacement de la rubrique affichée,
 * pour qu'un tableau ne déclenche pas le bouton d'une autre rubrique.
 */
export function useHeaderCreation(enabled = true, zones: string = ZONE_D_EN_TETE): Creation | null {
  // Le LIBELLÉ seulement : React remplace le bouton d'en-tête à son gré, et un clic sur un
  // nœud détaché ne fait rien. Le bouton se relit au moment du clic.
  const [label, setLabel] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!enabled) { setLabel(null); return; }
    const lire = () => setLabel(boutonDeCreation(zones)?.label ?? null);
    lire();
    // Les boutons d'un onglet montent dans l'en-tête après coup (un portail) : on suit la zone.
    const veille = new MutationObserver(lire);
    document.querySelectorAll(zones).forEach((z) => veille.observe(z, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['disabled'] }));
    return () => veille.disconnect();
  }, [enabled, zones]);
  return label ? { label, trigger: () => boutonDeCreation(zones)?.el.click() } : null;
}

/**
 * @deprecated Plus posée nulle part depuis le 13/11/2026 : la fin d'un tableau prend la ligne
 * « + » de `RecordTable` (`onAdd`, `addLabel`), façon Airtable. Gardée exportée pour ne casser
 * aucun appelant.
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
