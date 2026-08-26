import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fondation, Section, groupe } from '../atelier';

const meta: Meta = {
  title: 'Fondations/Empilement',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Empilement: Story = {
  name: 'Empilement',
  render: () => (
    <Fondation
      titre="Empilement"
      quoi="Quatre niveaux nommés par intention. Un `z-50` écrit à la main ne dit pas au-dessus de quoi il doit passer ; un nom, si."
    >
      <Section
        titre="Ce que ça répare"
        quoi="Le 25/08/2026, le panneau latéral, la palette de recherche, le menu déroulant et l'infobulle étaient tous à `z-50`. Un menu ouvert dans un panneau passait donc devant ou derrière selon l'ordre du DOM — et la fiche a exactement ce cas, avec ses champs à choix dans le panneau « Compléter »."
      >
        <div className="flex flex-col gap-xs">
          {groupe('layers').map(([nom, t]) => (
            <div
              key={nom}
              className="flex items-center gap-md rounded-md border border-border-soft p-sm"
              style={{ marginLeft: `${Number(t.$value) / 4}px` }}
            >
              <span className="w-[110px] shrink-0 text-small font-semibold text-text">{nom}</span>
              <span className="w-[40px] shrink-0 text-caption tabular-nums text-text-muted">
                {t.$value}
              </span>
              <span className="text-pretty text-caption text-text-muted">{t.$description}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        titre="La règle qui tient l'échelle"
        quoi="Un élément flottant doit passer au-dessus de la surface qui l'a ouvert. Toute surface capable de contenir un menu, une infobulle ou un sélecteur se place donc SOUS `flottant` — c'est pour ça que `panneau` est à 50 et pas à 60."
      >
        <pre className="overflow-x-auto rounded-md border border-border-soft bg-bg-muted p-base text-caption text-text">
{`<div className="z-(--arq-layer-flottant)">   {/* ✅ */}
<div className="z-50">                       {/* ❌ au-dessus de quoi ? */}`}
        </pre>
      </Section>
    </Fondation>
  ),
};
