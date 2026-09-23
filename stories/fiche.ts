/**
 * La fiche d'un composant, prête à s'afficher dans sa page de documentation.
 *
 * La vitrine ne réécrit rien : elle montre `components/<nom>/<nom>.spec.md` tel
 * quel. Une documentation recopiée à la main diverge de la fiche au premier
 * changement — et c'est alors la vitrine qu'on croit, pas le dépôt.
 */
export function specFile(markdown: string): string {
  return (
    markdown
      // L'en-tête YAML sert au catalogue, pas au lecteur : il liste des
      // mots-clés et des chemins de fichiers qu'un humain n'a rien à faire de
      // lire ici.
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
      // Le titre de premier niveau non plus : Storybook affiche déjà le nom du
      // composant juste au-dessus, et le voir deux fois se lit comme un doublon.
      .replace(/^\s*#\s+\S.*\r?\n/, '')
      .trimStart()
  );
}

/** Les paramètres de page communs à tous les composants. */
export function docsDe(markdown: string) {
  return { docs: { description: { component: specFile(markdown) } } };
}

/**
 * Un menu de contrôle pour une variante `cva`.
 *
 * Le lecteur de props de Storybook ne suit pas `VariantProps<typeof …>` — les
 * variantes, qui sont justement ce qu'on vient voir, n'apparaîtraient pas. On
 * les déclare donc, une fois, à côté de la liste qui fait foi dans le composant.
 */
export const choices = (values: readonly string[], description: string) => ({
  control: { type: 'select' as const },
  options: values,
  description,
  table: { type: { summary: values.join(' | ') } },
});
