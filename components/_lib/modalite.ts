/*
  À LA SOURIS, PAS D'ANNEAU DE FOCUS QUI RESTE (Louis, 12/11/2026).

  Un panneau, une boîte de dialogue ou un menu rendent le focus à ce qui les a ouverts en se
  refermant. Ce focus est donné par le script, et le navigateur le dit visible dès que ce qui
  l'avait juste avant l'était : un champ de texte l'est toujours. Ouvrir « Nouveau contact »,
  taper un nom, cliquer « Annuler » laissait donc un anneau bleu autour du bouton, sans qu'on
  ait touché à la tabulation. On retient donc le dernier geste (pointeur ou clavier) : refermé
  à la souris, le focus ne revient pas ; refermé au clavier (Échap, Entrée), il revient, comme
  il se doit pour qui navigue sans souris.
*/

let dernierGeste: 'pointeur' | 'clavier' = 'clavier';

/* Le geste se lit aussi dans la page (`<html data-modalite>`) : un anneau qui ne doit paraître
   qu'au clavier s'éteint sous `[data-modalite=pointeur]`, même quand le navigateur le juge visible
   (un focus redonné par le script après un clic sur un onglet, Louis, 12/11/2026). */
const noter = (g: 'pointeur' | 'clavier') => {
  dernierGeste = g;
  document.documentElement.dataset.modalite = g;
};

if (typeof document !== 'undefined') {
  // Rien au chargement : un attribut posé avant l'hydratation la ferait diverger du rendu serveur.
  document.addEventListener('pointerdown', () => noter('pointeur'), true);
  document.addEventListener('keydown', (e) => {
    // Un raccourci (⌘K) n'est pas une navigation au clavier.
    if (!e.metaKey && !e.ctrlKey && !e.altKey) noter('clavier');
  }, true);
}

/** Le dernier geste était-il un clic, un toucher ? */
export const aLaSouris = (): boolean => dernierGeste === 'pointeur';

/**
 * Pour `onCloseAutoFocus` : refermé à la souris, le focus ne revient pas sur la gâchette.
 * L'appelant garde la main : un `preventDefault` de sa part est respecté tel quel.
 */
export function sansAnneauALaSouris(appelant?: (e: Event) => void) {
  return (e: Event) => {
    appelant?.(e);
    if (!e.defaultPrevented && aLaSouris()) e.preventDefault();
  };
}
