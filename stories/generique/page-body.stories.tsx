import type { Meta, StoryObj } from '@storybook/react-vite';

import { PageBody } from '../../components/page-body/page-body.web';
import specification from '../../components/page-body/page-body.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/PageBody',
  component: PageBody,
  parameters: { ...docsDe(specification), layout: 'fullscreen' },
} satisfies Meta<typeof PageBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  render: () => (
    <PageBody className="gap-lg">
      <div className="rounded-block bg-bg-muted p-base text-small text-text">Un bloc de réglages</div>
      <div className="rounded-block bg-bg-muted p-base text-small text-text">Un autre bloc</div>
    </PageBody>
  ),
};
