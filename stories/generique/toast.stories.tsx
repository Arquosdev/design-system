import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToastProvider, useToast } from '../../components/toast/toast.web';
import { Button } from '../../components/button/button.web';
import specification from '../../components/toast/toast.spec.md?raw';
import { docsDe } from '../fiche';

const meta: Meta = {
  title: 'Composants/Générique/Toast',
  component: ToastProvider,
  parameters: { ...docsDe(specification), layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function Banc() {
  const { announce } = useToast();
  return (
    <div className="flex gap-md">
      <Button onClick={() => announce('Document poussé vers le téléchargement.')}>
        Une confirmation
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          announce("Ce champ est verrouillé par l’agence.", { tone: 'error' })
        }
      >
        Un refus
      </Button>
    </div>
  );
}

/**
 * Deux durées : 2,2 s pour une confirmation, qu'on lit d'un œil ; 12 s pour un
 * refus, qu'il faut avoir le temps de lire. Trois messages au plus s'empilent —
 * au-delà, la pile couvrirait ce qu'on vient de corriger.
 */
export const Defaut: Story = {
  render: () => (
    <ToastProvider>
      <Banc />
    </ToastProvider>
  ),
};
