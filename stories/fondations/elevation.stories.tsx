import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fondation, Section, group } from '../atelier';

const meta: Meta = {
  title: 'Fondations/Élévation',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Elevation: Story = {
  name: 'Élévation',
  render: () => (
    <Fondation
      title="Élévation"
      what="Trois ombres, chacune attachée à un usage précis. L'ombre est le token le plus facile à réinventer au call site : s'en tenir à ces trois-là est ce qui garde les surfaces cohérentes."
    >
      <Section title="Les trois niveaux">
        <div className="flex flex-wrap gap-xl bg-bg-muted p-xl">
          {group('shadow').map(([name, t]) => (
            <div
              key={name}
              className="flex size-[150px] flex-col items-center justify-center gap-xs rounded-md bg-bg p-sm"
              style={{ boxShadow: t.$value }}
            >
              <span className="text-small font-semibold text-text">{name}</span>
              {t.$description ? (
                <span className="text-center text-caption text-text-muted">{t.$description}</span>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Côté mobile, l'ombre se déclare deux fois"
        what="React Native ne comprend pas `box-shadow` : `elevation` est la propriété Android, les `shadow*` sont lues par iOS, et il faut les deux pour un rendu identique. `shadowNative` porte les deux jeux."
      >
        <pre className="overflow-x-auto rounded-md border border-border-soft bg-bg-muted p-base text-caption text-text">
{`import { shadowNative } from '@arquos/design-system';

<View style={[styles.carte, shadowNative.card]} />`}
        </pre>
      </Section>
    </Fondation>
  ),
};
