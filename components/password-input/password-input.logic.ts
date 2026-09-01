// PasswordInput — la logique, sans React.
//
// Deux mots et une règle. Ils vivent ici plutôt que dans l'implémentation web
// parce qu'un libellé est du métier au sens de ce dépôt : c'est ce partage qui
// empêche « Afficher le mot de passe » de devenir « Voir » sur l'autre
// plateforme. Voir `CONVERGENCE.md`.

/**
 * Les deux libellés de la bascule.
 *
 * **Ils nomment l'ACTION, jamais l'état.** « Masquer le mot de passe » quand il
 * est en clair : c'est ce que le bouton va faire, pas ce qu'il montre. Un
 * libellé qui décrit l'état — « Mot de passe visible » — laisse le lecteur
 * deviner ce que le clic produira, et l'œil dessiné est déjà ambigu de ce
 * côté-là.
 */
export const passwordToggleLabels = {
  reveal: 'Afficher le mot de passe',
  hide: 'Masquer le mot de passe',
} as const;

/**
 * Le libellé accessible du bouton, selon que le mot de passe est en clair.
 *
 * **« le mot de passe » est dans le libellé et n'est pas de trop.** Le bouton
 * n'a qu'une icône : lu seul dans la liste des contrôles d'une page, « Afficher »
 * ne dit pas quoi.
 */
export function passwordToggleLabel(revealed: boolean): string {
  return revealed ? passwordToggleLabels.hide : passwordToggleLabels.reveal;
}
