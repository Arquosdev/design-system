// Ce qu'un bouton indisponible expose, et pourquoi il y a deux façons de
// l'être. Sans React : la règle est la même sur les deux plateformes, seules
// les classes changent.

/**
 * Les trois disponibilités d'un bouton.
 *
 * - `active` — le geste se fait.
 * - `inactive` — le geste ne se fait pas ICI, MAINTENANT, et il y a une raison
 *   qu'on peut dire. Le bouton reste atteignable : il prend le focus, il reçoit
 *   le survol, il peut porter une infobulle ou déclencher un `Popover`.
 * - `disabled` — le contrôle n'est pas là pour l'utilisateur. Il sort de l'ordre
 *   de tabulation et ne reçoit plus rien.
 *
 * **La distinction n'est pas cosmétique.** `disabled` pose
 * `pointer-events-none` : un bouton désactivé ne peut PAS dire pourquoi il l'est,
 * puisqu'il ne reçoit ni survol ni focus. C'est exactement le défaut que Louis a
 * décrit le 01/09/2026 — il fallait tenter le geste pour apprendre qu'il était
 * impossible.
 */
export type Availability = 'active' | 'inactive' | 'disabled';

/**
 * La disponibilité, quand l'appelant a passé les deux drapeaux.
 *
 * `disabled` gagne : c'est l'attribut natif, il est plus fort que le nôtre, et
 * un bouton qui ne reçoit rien ne peut de toute façon pas montrer sa raison.
 */
export function availability(flags: { inactive?: boolean; disabled?: boolean }): Availability {
  if (flags.disabled) return 'disabled';
  if (flags.inactive) return 'inactive';
  return 'active';
}

/**
 * Les attributs à poser, hors styles.
 *
 * `aria-disabled` et non `disabled` pour l'état inactif : c'est ce qui garde le
 * bouton dans l'ordre de tabulation tout en le disant indisponible aux
 * technologies d'assistance. Le blocage du geste, lui, revient à
 * l'implémentation — voir `blocksActivation`.
 *
 * @param reason La raison, quand elle n'est pas déjà écrite à l'écran à côté du
 *               bouton. Elle devient l'infobulle et la description accessible.
 *               Ne rien passer quand la phrase est visible : la répéter la ferait
 *               lire deux fois par un lecteur d'écran.
 */
export function availabilityAttributes(
  state: Availability,
  reason?: string,
): { disabled?: true; 'aria-disabled'?: true; title?: string; 'data-arq-state'?: Availability } {
  if (state === 'disabled') return { disabled: true, 'data-arq-state': 'disabled' };
  if (state === 'inactive') {
    return {
      'aria-disabled': true,
      'data-arq-state': 'inactive',
      ...(reason ? { title: reason } : {}),
    };
  }
  return {};
}

/**
 * Le geste doit-il être avalé ?
 *
 * Un bouton `inactive` reçoit bel et bien le clic — c'est le prix de son
 * atteignabilité — donc quelqu'un doit le neutraliser. Le composant le fait,
 * l'appelant n'a pas à s'en souvenir : un `onClick` posé sur un bouton inactif
 * ne part pas.
 */
export function blocksActivation(state: Availability): boolean {
  return state !== 'active';
}
