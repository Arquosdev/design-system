import type { Meta, StoryObj } from '@storybook/react-vite';

import { Metric, MetricRow } from '../../components/metric/metric.web';
import { Surface } from '../../components/surface/surface.web';
import specification from '../../components/metric/metric.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/Metric',
  component: Metric,
  parameters: docsDe(specification),
  args: { label: 'Dépannages', value: '47', caption: 'dont 29 pannes' },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnTeteDeCarte: Story = {
  render: () => (
    <Surface className="max-w-[56rem] overflow-clip">
      <MetricRow>
        <Metric label="Dépannages" value="47" caption="dont 29 pannes" />
        <Metric label="Délai d’intervention" value="1 j 6 h" caption="moyen, de 0 min à 6 j" />
        <Metric label="Remise en service" value="2 j 14 h" caption="moyenne" />
        <Metric label="Délais garantis tenus" value="65,4 %" caption="17 sur 26 dépannages" tone="danger" />
      </MetricRow>
    </Surface>
  ),
};

export const Choisissable: Story = {
  render: () => (
    <Surface className="max-w-[56rem] overflow-clip">
      <MetricRow>
        <Metric as="button" selected label="Montant gagné" value="449 000 €" caption="7 affaires gagnées" />
        <Metric as="button" label="Affaires" value="122" caption="7 gagnées · 12 perdues" />
        <Metric as="button" label="Taux de transformation" value="37 %" caption="sur 19 affaires décidées" />
      </MetricRow>
    </Surface>
  ),
};
