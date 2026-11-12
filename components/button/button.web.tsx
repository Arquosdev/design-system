'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../_lib/cn';
import { availability, availabilityAttributes, blocksActivation } from './button.logic';

/**
 * Base shadcn/ui (`new-york`), habillée aux tokens Arquos.
 *
 * Les noms de variantes et de tailles sont ceux de shadcn — `default`,
 * `secondary`, `outline`, `ghost`, `destructive`, `link`. C'est ce qui permet
 * de coller un extrait de leur documentation sans le retoucher. Seules les
 * couleurs changent, et elles viennent des variables que
 * `tokens.tailwind.css` traduit depuis les tokens.
 *
 * **La forme est celle des boutons d'Intercom** (Thomas, 04/11/2026, relevée
 * sur Refero) : 32 px de haut (`controlHeight.md`), angles à 6 px
 * (`radius.control`), 14 px semi-gras, marges intérieures de 12 px. Le petit
 * fait 28, le grand 40. Les teintes restent celles d'Arquos.
 */
/*
  LES BOUTONS FAÇON SUPABASE (Louis, 12/11/2026) : une seule taille de travail,
  28 px, texte de 12 px en graisse 500, icônes de 14 px, rembourrage de 10 px,
  arrondi de 6 px — partout, panneaux et boîtes de dialogue compris.
  - secondaire (`outline`) : fond blanc, AUCUNE bordure, le contour est une
    ombre (`shadow-control`), plus franche au survol, fond `bgHover` ;
  - principal et destructif : la même forme pleine, une micro-ombre ;
  - le fantôme et le lien ne changent pas.
*/
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[calc(var(--spacing-xs)+var(--spacing-xxs))] whitespace-nowrap rounded-control ' +
    'text-caption font-medium transition-[background-color,box-shadow,color] outline-none ' +
    'focus-ring ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    '[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-control-solid hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'bg-bg text-text shadow-control hover:bg-bg-hover hover:shadow-control-hover',
        ghost: 'text-muted-foreground hover:text-primary',
        destructive: 'bg-destructive text-destructive-foreground shadow-control-solid hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-(--arq-control-sm) px-[calc(var(--spacing-sm)+var(--spacing-xxs))]',
        sm: 'h-(--arq-control-sm) px-[calc(var(--spacing-sm)+var(--spacing-xxs))]',
        lg: 'h-(--arq-control-md) px-md',
        icon: 'size-(--arq-control-sm) px-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

/**
 * L'habillage d'un bouton NON CLIQUABLE — la même plaque grise quelle que soit
 * la variante, et c'est le point.
 *
 * Louis, le 01/09/2026 : « on dirait que c'est un bouton qui est cliquable ».
 * `opacity-50` gardait la couleur de la variante — un bleu fondu reste un bouton
 * bleu, et il promet le geste. Une plaque grise pleine ne ressemble à aucune
 * variante active : elle se lit comme un état, pas comme une action de moindre
 * poids.
 *
 * **Les deux teintes sont des jetons, et c'est ce qui les rend mesurables.**
 * `check-contraste.mjs` apparie `inactiveBg` et `onInactiveBg` à la source :
 * 5,99 pour 1, contre 2,33 pour le libellé blanc sur le bleu fondu d'avant.
 * Aucun des deux contrôles ne voyait ce texte-là — le lecteur de classes ne sait
 * pas fondre une opacité, et axe exempte du contraste ce qui porte
 * `aria-disabled`.
 *
 * Exportée : `IconButton` porte le même état, et deux plaques grises qui
 * divergeraient se verraient côte à côte dans une barre d'outils.
 *
 * Les `hover:` sont neutralisés un par un : `tailwind-merge` range un
 * `hover:bg-*` dans un autre groupe qu'un `bg-*`, donc sans ça le survol
 * repeindrait le bouton en bleu — le rendant cliquable à l'œil au moment précis
 * où l'on cherche à savoir s'il l'est.
 */
export const INACTIVE_SURFACE =
  'cursor-not-allowed border border-border bg-inactive-bg text-on-inactive-bg shadow-none ' +
  'hover:border-border hover:bg-inactive-bg hover:text-on-inactive-bg hover:no-underline';

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Rend l'enfant à la place du `<button>`, en lui passant les styles. */
  asChild?: boolean;
  /**
   * Le geste est impossible ICI, MAINTENANT, et il y a une raison qu'on peut dire.
   *
   * À préférer à `disabled` chaque fois qu'une raison existe : le bouton reste
   * focalisable et survolable, donc capable de la porter. `disabled` pose
   * `pointer-events-none` et rend le bouton muet.
   */
  inactive?: boolean;
  /**
   * Pourquoi le geste est impossible — une phrase, en français, telle qu'on la
   * dirait.
   *
   * Elle devient l'infobulle et la description accessible. **Ne pas la passer
   * quand la phrase est déjà écrite à côté du bouton** : un lecteur d'écran la
   * lirait deux fois. Mais l'une des deux doit exister — un bouton inactif muet
   * est le défaut qu'on corrige, pas une variante acceptable.
   */
  inactiveReason?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type, inactive, inactiveReason, disabled, onClick, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button';
    const state = availability({ inactive, disabled });
    const bloque = blocksActivation(state);

    return (
      <Component
        ref={ref}
        // Sans ça, un bouton dans un formulaire le soumet au clic — la cause la
        // plus fréquente de « la page se recharge toute seule ». shadcn ne le
        // pose pas ; c'est notre seul écart de comportement, et il est voulu.
        type={asChild ? undefined : (type ?? 'button')}
        /*
          De quoi reconnaître un bouton du design system d'un bouton redessiné à
          la main. Un test qui compare des pixels ne fait pas la différence : un
          bouton recopié avec les bonnes valeurs passe, et se met à diverger au
          premier état — survol, désactivé — que la mesure ne prend pas. Même
          raison que `data-role` sur `Icon` et `data-colonne` sur `RecordTable`.
        */
        data-arq="button"
        {...availabilityAttributes(state, inactiveReason)}
        /*
          Un bouton inactif REÇOIT le clic — c'est le prix de son atteignabilité,
          et c'est ce qui lui permet d'ouvrir un `Popover` d'explication. Le
          composant l'avale donc lui-même : un `onClick` posé dessus ne part pas,
          et l'appelant n'a rien à se rappeler.

          `stopPropagation` en plus de `preventDefault` : sans lui, un bouton
          inactif posé dans une ligne cliquable ouvrirait la fiche.
        */
        onClick={
          bloque
            ? (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
              }
            : onClick
        }
        className={cn(buttonVariants({ variant, size }), inactive && !disabled && INACTIVE_SURFACE, className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
