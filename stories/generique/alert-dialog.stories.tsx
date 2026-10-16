import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/alert-dialog/alert-dialog.web';
import { Button } from '../../components/button/button.web';
import specification from '../../components/alert-dialog/alert-dialog.spec.md?raw';
import { docsDe } from '../fiche';

const meta: Meta = {
  title: 'Composants/Générique/AlertDialog',
  component: AlertDialogContent,
  subcomponents: { AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel },
  parameters: { ...docsDe(specification), layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** La suppression d'un contact : ce qu'elle emporte, puis la réponse. */
export const Suppression: Story = {
  render: function Rendu() {
    const [ouvert, setOuvert] = React.useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOuvert(true)}>Supprimer le contact</Button>
        <AlertDialog open={ouvert} onOpenChange={setOuvert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le contact Jean Dupont ?</AlertDialogTitle>
              <AlertDialogDescription>Ses 3 notes partent avec lui. Ce geste ne se défait pas.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction tone="danger">Supprimer définitivement</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  },
};
