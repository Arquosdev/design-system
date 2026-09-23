import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Fondation, Section, group } from '../atelier';

const meta: Meta = {
  title: 'Fondations/Mouvement',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Mouvement: Story = {
  name: 'Mouvement',
  render: function Page() {
    const [parti, setParti] = React.useState(false);
    return (
      <Fondation
        title="Mouvement"
        what="Trois durées, chacune attachée à ce qu'elle accompagne. Au-delà de 300 ms une transition se remarque au lieu d'accompagner ; en deçà de 100 elle ne se voit pas et vaut autant que rien."
      >
        <Section
          title="Les trois durées"
          what="Cliquez pour les comparer côte à côte — c'est le seul moyen de sentir la différence, qu'aucun chiffre ne rend."
        >
          <button
            type="button"
            onClick={() => setParti((v) => !v)}
            className="mb-lg rounded-control bg-primary px-base py-sm text-small font-semibold text-text-on-dark outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {parti ? 'Revenir' : 'Lancer'}
          </button>
          <div className="flex flex-col gap-md">
            {group('duration').map(([name, t]) => (
              <div key={name} className="flex items-center gap-md">
                <span className="w-[80px] shrink-0 text-small text-text-muted">{name}</span>
                <span className="w-[64px] shrink-0 text-caption tabular-nums text-text-muted">
                  {t.$value}
                </span>
                <div className="h-[24px] flex-1 rounded-sm bg-bg-muted">
                  <span
                    className="block size-[24px] rounded-sm bg-primary transition-transform ease-arquos"
                    style={{
                      transitionDuration: t.$value,
                      transform: parti ? 'translateX(calc(100% * 8))' : 'translateX(0)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-md flex flex-col gap-xxs">
            {group('duration').map(([name, t]) => (
              <p key={name} className="text-caption text-text-muted">
                <code className="font-semibold text-text">{name}</code> — {t.$description}
              </p>
            ))}
          </div>
        </Section>

        <Section
          title="La courbe"
          what="Une seule, et une sortie douce : le mouvement démarre franchement et s'arrête sans à-coup, ce qui se lit comme « posé » plutôt que « stoppé »."
        >
          <code className="text-small text-text">cubic-bezier(0.2, 0, 0, 1)</code>
        </Section>

        <Section
          title="Le mouvement réduit n'est pas une option"
          what="Un utilisateur qui l'a demandé au système ne doit pas subir d'animation. Les utilitaires Tailwind employés par le dépôt le respectent d'eux-mêmes ; une animation écrite à la main doit le faire explicitement."
        >
          <pre className="overflow-x-auto rounded-md border border-border-soft bg-bg-muted p-base text-caption text-text">
{`@media (prefers-reduced-motion: reduce) {
  /* le repère cesse de pulser, mais reste visible plus longtemps */
}`}
          </pre>
        </Section>
      </Fondation>
    );
  },
};
