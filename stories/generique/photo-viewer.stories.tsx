import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { PhotoViewer, type PhotoView } from '../../components/photo-viewer/photo-viewer.web';
import { Button } from '../../components/button/button.web';
import specification from '../../components/photo-viewer/photo-viewer.spec.md?raw';
import { docsDe } from '../fiche';

const meta = {
  title: 'Composants/Générique/PhotoViewer',
  component: PhotoViewer,
  parameters: { ...docsDe(specification), layout: 'centered' },
} satisfies Meta<typeof PhotoViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Des photos posées, plutôt qu'un stockage externe : la vitrine doit marcher
   hors du réseau Arquos, et une image manquante y ferait passer le composant
   pour cassé. */
const carre = (fond: string, texte: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="${fond}"/><text x="400" y="310" font-family="sans-serif" font-size="42" fill="#ffffff" text-anchor="middle">${texte}</text></svg>`,
  );

const SERIE: PhotoView[] = [
  { name: 'Façade de l’immeuble', url: carre('#0D5AB7', 'Façade'), zone: 'Environnement' },
  { name: 'Plaque de charge', url: carre('#00295B', 'Plaque de charge'), zone: 'Cabine' },
  { name: 'Machinerie', url: carre('#17A679', 'Machinerie'), zone: 'Machinerie' },
];

export const Defaut: Story = {
  args: { photos: SERIE, index: 0, open: false, onIndex: () => {}, onOpenChange: () => {} },
  render: function Rendu(args) {
    const [vue, setVue] = React.useState({ ouverte: false, index: 0 });
    return (
      <>
        <Button onClick={() => setVue({ ouverte: true, index: 0 })}>Agrandir</Button>
        <PhotoViewer
          photos={args.photos}
          index={vue.index}
          onIndex={(index) => setVue((v) => ({ ...v, index }))}
          open={vue.ouverte}
          onOpenChange={(ouverte) => setVue((v) => ({ ...v, ouverte }))}
        />
      </>
    );
  },
};

/** Une seule photo : les flèches et le compteur disparaissent. */
export const UneSeule: Story = { ...Defaut, args: { ...Defaut.args, photos: [SERIE[1]] } };

/** Image absente ou illisible — un HEIC, par exemple. On nomme quand même. */
export const Indisponible: Story = {
  ...Defaut,
  args: { ...Defaut.args, photos: [{ name: 'Toit de cabine', zone: 'Cabine' }] },
};
