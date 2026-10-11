import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusBadge } from '../../components/status-badge/status-badge.web';
import { STATUSES, type StatusObject } from '../../components/status-badge/status-badge.logic';
import specification from '../../components/status-badge/status-badge.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Métier/StatusBadge',
  component: StatusBadge,
  parameters: docsDe(specification),
  args: { object: 'survey', status: 'relev_s_en_cours' },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/** Toute la table, objet par objet : la même teinte dit le même sens d'une ligne à l'autre. */
export const LaTable: Story = {
  render: () => (
    <div className="flex flex-col gap-sm">
      {(Object.keys(STATUSES) as StatusObject[]).map((o) => (
        <div key={o} className="flex flex-wrap items-center gap-xs">
          <span className="w-32 text-caption text-text-muted">{o}</span>
          {Object.keys(STATUSES[o]).map((k) => <StatusBadge key={k} object={o} status={k} />)}
        </div>
      ))}
    </div>
  ),
};
