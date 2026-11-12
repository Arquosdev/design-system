'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

import { cn } from '../_lib/cn';
import { Icon } from '../icon/icon.web';

/*
  Repris de shadcn/ui (`npx shadcn@latest add select`), habillé aux tokens
  Arquos. Les noms exportés et la composition sont ceux de shadcn.

  Trois écarts, tous assumés :

  1. **La gâchette s'ajuste à son contenu.** Celle de shadcn prend toute la
     largeur ; dans une fiche, un menu de trois choix étiré sur un tiers d'écran
     promet une saisie longue là où il n'y a qu'un mot à choisir. `className`
     rend la pleine largeur à qui la veut.

  2. **L'entrée retenue se teinte au lieu de porter une coche.** shadcn met un
     `Check` à droite ; notre vocabulaire d'icônes n'a pas de coche nue — il a
     `conforme`, qui veut dire « conforme » et non « celui-ci ». Le fond bleuté
     et le demi-gras sont ce que le rail emploie déjà pour dire « vous êtes
     ici », et ça se lit sans rien apprendre.

  3. Le caret vient de notre `Icon` (`deplier`), pas de `lucide-react`.
*/

/*
  LA VALEUR SE LIT DÈS LE PREMIER RENDU (12/11/2026).

  Radix écrit le libellé de l'entrée retenue dans `SelectValue` par un portail,
  depuis une copie cachée du menu qu'il ne monte qu'APRÈS le premier rendu : rendue
  au serveur, puis jusqu'à l'effet, la gâchette était vide, et chaque écran
  recopiait le libellé en enfant de `SelectValue` pour la remplir. `Select` relève
  donc lui-même les libellés de ses `SelectItem` (en parcourant ses enfants) et la
  valeur courante, et `SelectValue` sans enfant affiche celui de la valeur retenue.
  Une entrée rendue par un composant intermédiaire n'est pas vue : Radix reprend
  alors la main, comme avant.
*/
type Releve = { value: string | undefined; libelles: Map<string, React.ReactNode> };
const ContexteDeValeur = React.createContext<Releve | null>(null);

function releverLesLibelles(noeud: React.ReactNode, libelles: Map<string, React.ReactNode>) {
  React.Children.forEach(noeud, (enfant) => {
    if (!React.isValidElement(enfant)) return;
    const props = enfant.props as { value?: unknown; children?: React.ReactNode };
    if (enfant.type === SelectItem && typeof props.value === 'string') {
      libelles.set(props.value, props.children);
    } else if (props.children !== undefined) {
      releverLesLibelles(props.children, libelles);
    }
  });
}

export function Select({ value, defaultValue, onValueChange, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const [interne, setInterne] = React.useState(defaultValue);
  const courante = value ?? interne;
  const libelles = new Map<string, React.ReactNode>();
  releverLesLibelles(children, libelles);
  return (
    <ContexteDeValeur.Provider value={{ value: courante, libelles }}>
      <SelectPrimitive.Root
        {...props}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => { setInterne(v); onValueChange?.(v); }}
      >
        {children}
      </SelectPrimitive.Root>
    </ContexteDeValeur.Provider>
  );
}
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ children, ...props }, ref) => {
  const releve = React.useContext(ContexteDeValeur);
  const libelle = children !== undefined || !releve?.value ? children : releve.libelles.get(releve.value);
  return <SelectPrimitive.Value ref={ref} {...props}>{libelle}</SelectPrimitive.Value>;
});
SelectValue.displayName = 'SelectValue';

/** La taille de la gâchette : `md` (32 px) dans un formulaire, `sm` (28 px, 12 px) sur une barre d'outils ou un en-tête. */
export type SelectSize = 'md' | 'sm';

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { size?: SelectSize }
>(({ className, children, size = 'md', ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      /*
        **36 px, et c'est la taille de référence des contrôles.**

        Elle valait 32 jusqu'à la v2.12.0, et c'était l'anomalie du produit :
        aucune taille de `Button` ni d'`IconButton` ne tombait dessus, donc trois
        contrôles posés sur une même barre ne pouvaient pas s'aligner sans qu'un
        écran écrive une hauteur à la main. La pagination le faisait depuis le
        30/08/2026, avec un `size-[32px]` signé et un renvoi au lot 27.

        La hauteur vient de l'échelle (`src/control.ts`) et non d'un nombre :
        changer l'une change les autres, ce qui est le seul moyen qu'elles
        restent d'accord.
      */
      'flex w-fit items-center justify-between rounded-control',
      // Une ligne, toujours : dans une colonne étroite, « + (ajoute au prix) »
      // passait sur deux lignes et débordait du champ (design-eu).
      'whitespace-nowrap [&>span]:min-w-0 [&>span]:truncate',
      // `px-md` comme le `px-3` de shadcn : à quatre pixels, le mot touchait
      // son contour et le champ se lisait comme une étiquette serrée.
      size === 'md' && 'h-(--arq-control-md) gap-sm border border-border bg-bg px-md text-small font-medium text-text shadow-card hover:bg-bg-muted',
      /*
        `sm` : À LA TAILLE DES BOUTONS D'UNE LIGNE (Louis, 12/11/2026, « Commandes de
        l'en-tête ») : 28 px, 12 px graisse 500, rembourrage 10, et le contour d'un bouton
        secondaire, son ombre. Un sélecteur posé entre deux boutons d'une barre d'outils ou
        d'un en-tête (la période du Tableau de bord) s'aligne sur eux.
      */
      size === 'sm' && 'h-(--arq-control-sm) gap-xs bg-bg px-[calc(var(--spacing-sm)+var(--spacing-xxs))] text-caption font-medium text-text shadow-control hover:bg-bg-hover hover:shadow-control-hover',
      'outline-none transition-colors',
      'focus-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      // Le caret pivote quand le menu s'ouvre — c'est lui qui dit que ce champ
      // en cache d'autres.
      '[&>svg]:shrink-0 [&>svg]:text-text-subtle [&[data-state=open]>svg]:rotate-180',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <Icon role="expand" size="sm" className="transition-transform" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-(--arq-layer-flottant) max-h-[320px] min-w-[8rem] overflow-hidden rounded-block',
        /* Un seul contour, celui de `shadow-pop` (Louis, 12/11/2026). */
        'bg-bg text-text shadow-pop',
      /*
        PAS d'animation de sortie ici. Mesuré le 07/09/2026 dans la fiche : sur
        un contenu posé par le positionneur (`data-radix-popper-content-wrapper`),
        l'animation déclarée à la fermeture ne DÉMARRE jamais — `getAnimations()`
        revient vide alors que `animation-name` vaut bien `voile-sortie` et que
        ses images-clés existent. Radix attend `animationend` pour démonter :
        il attend indéfiniment, et la liste reste dans la page, fermée mais
        présente.

        Ce qu'elle y fait est loin d'être cosmétique. Radix garde alors la
        surface qui l'a ouverte inerte — `pointer-events: none` sur le panneau —
        et le panneau de complétion ne répondait plus au clic. C'est le « il bug
        un peu quand on clique » signalé le 04/09/2026.

        Deux dixièmes de seconde de fondu ne valent pas un panneau mort.
      */
        'data-[state=open]:animate-voile-entree',
        position === 'popper' && 'data-[side=bottom]:translate-y-xs data-[side=top]:-translate-y-xs',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-xxs',
          // La liste ne doit jamais être plus étroite que la gâchette : un menu
          // qui rétrécit sous le champ qu'il ouvre se lit comme un défaut.
          position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = 'SelectContent';

export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-sm py-xs text-caption font-bold text-text-muted', className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // À la densité d'un menu (Louis, 12/11/2026) : 28 px, 13 px.
      'relative flex min-h-(--arq-control-sm) cursor-pointer items-center rounded-control px-sm',
      'text-description text-text outline-none select-none',
      'data-[highlighted]:bg-bg-muted',
      // L'entrée retenue, au motif du rail : fond bleuté, demi-gras.
      'data-[state=checked]:bg-info-bg data-[state=checked]:font-semibold data-[state=checked]:text-on-info-bg',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-xxs my-xxs h-px bg-border-soft', className)}
    {...props}
  />
));
SelectSeparator.displayName = 'SelectSeparator';
