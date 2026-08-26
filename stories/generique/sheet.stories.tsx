import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Sheet,
  SheetBody,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../../components/sheet/sheet.web';
import { Button } from '../../components/button/button.web';
import specification from '../../components/sheet/sheet.spec.md?raw';
import { docsDe } from '../fiche';

const meta: Meta = {
  title: 'Composants/Générique/Sheet',
  component: SheetContent,
  subcomponents: { SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter },
  parameters: { ...docsDe(specification), layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Le panneau « Compléter » de la fiche : les champs vides d'une rubrique, sans
 * quitter l'écran d'où l'on vient. Seul le corps défile — l'en-tête et le pied
 * restent en place, pour que « Enregistrer » ne parte pas hors de l'écran.
 */
export const Defaut: Story = {
  render: function Rendu() {
    const [ouvert, setOuvert] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOuvert(true)}>Compléter</Button>
        <Sheet open={ouvert} onOpenChange={setOuvert}>
          <SheetContent>
            <SheetHeader>
              <div className="flex items-start justify-between gap-md">
                <SheetTitle>Compléter — Machine</SheetTitle>
                <SheetCloseButton />
              </div>
              <SheetDescription>
                4 champs à renseigner sur cette section uniquement.
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="flex flex-col gap-base">
              {['Marque', 'Modèle', 'Année de mise en service', 'Puissance (kW)'].map(
                (label) => (
                  <label key={label} className="flex flex-col gap-xxs">
                    <span className="text-small font-semibold text-text-muted">{label}</span>
                    <input className="h-[38px] rounded-control border border-border px-sm text-small text-text outline-none focus-visible:border-primary" />
                  </label>
                ),
              )}
            </SheetBody>
            <SheetFooter>
              <span className="text-small text-text-muted">0 renseigné</span>
              <div className="flex gap-sm">
                <Button variant="outline" onClick={() => setOuvert(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setOuvert(false)}>Enregistrer</Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </>
    );
  },
};
