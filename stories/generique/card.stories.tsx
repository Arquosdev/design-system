import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardList,
  CardTitle,
} from '../../components/card/card.web';
import { Badge } from '../../components/badge/badge.web';
import specification from '../../components/card/card.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Générique/Card',
  component: Card,
  subcomponents: { CardHeader, CardTitle, CardDescription, CardContent, CardList, CardFooter },
  parameters: docsDe(specification),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** La composition de shadcn, pas des props de configuration. */
export const Defaut: Story = {
  render: () => (
    <Card className="max-w-[420px]">
      <CardHeader>
        <CardTitle>Écarts ouverts</CardTitle>
        <CardDescription>3 non résolus sur 4</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-small text-text-muted">
          Les constats relevés sur l’appareil et non encore traités.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * `CardList` remplace `CardContent` quand le contenu est une suite de lignes :
 * elle retire le rembourrage pour que chaque ligne aille d'un bord à l'autre, et
 * pose le filet qui les sépare.
 */
export const EnListe: Story = {
  render: () => (
    <Card className="max-w-[420px]">
      <CardHeader>
        <CardTitle>État par composant</CardTitle>
        <CardDescription>1 mauvais · 1 moyen · 1 bon</CardDescription>
      </CardHeader>
      <CardList>
        {[
          ['Machine', 'success', 'Bon'],
          ['Armoire de manœuvre', 'warning', 'Moyen'],
          ['Cabine', 'destructive', 'Mauvais'],
        ].map(([nom, variant, texte]) => (
          <div
            key={nom}
            className="flex items-center justify-between gap-md border-b border-border-soft px-base py-sm last:border-b-0"
          >
            <span className="text-small text-text">{nom}</span>
            <Badge variant={variant as 'success'}>{texte}</Badge>
          </div>
        ))}
      </CardList>
    </Card>
  ),
};
