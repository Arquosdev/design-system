import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fondation, Section, groupe } from '../atelier';

const meta: Meta = {
  title: 'Fondations/Typographie',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Typographie: Story = {
  name: 'Typographie',
  render: () => (
    <Fondation
      titre="Typographie"
      quoi="DM Sans, et des préréglages plutôt que des briques à recombiner. L'échelle est calibrée sur l'usage réel du produit — ne jamais y ajouter de taille, toute taille supplémentaire est du drift."
    >
      <Section
        titre="Préréglages"
        quoi="Chacun combine une taille, une graisse et un interligne. Préférer `typography.body` à la recomposition manuelle : c'est ce qui empêche deux écrans d'avoir deux « textes courants » différents."
      >
        <div className="flex flex-col gap-base">
          {groupe('typography').map(([nom, t]) => {
            const p = t as unknown as Record<string, string>;
            return (
              <div key={nom} className="border-b border-border-soft pb-base last:border-b-0">
                <div className="text-caption tabular-nums text-text-muted">
                  {nom} — {p.fontSize ?? ''} / {p.fontWeight ?? ''}
                </div>
                <div
                  className="mt-xxs text-text"
                  style={{
                    fontSize: p.fontSize,
                    fontWeight: p.fontWeight,
                    lineHeight: p.lineHeight,
                    letterSpacing: p.letterSpacing,
                  }}
                >
                  Ascenseur ORONA — 630 kg, 7 niveaux
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        titre="Côté mobile, la graisse se nomme"
        quoi="React Native ne synthétise pas correctement le gras sur Android : il faut désigner la variante chargée, d'où `fontFamilyNative`. Sur le web, `fontWeight` suffit."
      >
        <div className="flex flex-wrap gap-md">
          {[400, 500, 600, 700].map((g) => (
            <div key={g} className="rounded-md border border-border-soft px-base py-sm">
              <div className="text-body text-text" style={{ fontWeight: g }}>
                Aa
              </div>
              <code className="text-caption text-text-muted">{g}</code>
            </div>
          ))}
        </div>
      </Section>
    </Fondation>
  ),
};
