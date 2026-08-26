import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/accordion/accordion.web';
import specification from '../../components/accordion/accordion.spec.md?raw';
import { docsDe } from '../fiche';

/*
  Pas de `satisfies Meta<typeof Accordion>` ici : la racine Radix exige des props
  que chaque story pose elle-même dans son `render`. Le typage strict réclamerait
  alors un `args` vide sur chacune, qui ne dirait rien à personne.
*/
const meta: Meta = {
  title: 'Composants/Générique/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem, AccordionTrigger, AccordionContent },
  parameters: docsDe(specification),
};

export default meta;
type Story = StoryObj<typeof meta>;

const GROUPES = [
  { cle: 'general', titre: 'Données techniques générales', meta: '33 renseignés · 20 vides' },
  { cle: 'gsm', titre: 'Module GSM et boitier téléalarme', meta: '14 renseignés' },
  { cle: 'histo', titre: 'Historique', meta: '21 renseignés · 1 vide' },
];

/**
 * Ouvert par défaut, et `type="multiple"` : sur une rubrique de cent champs, on
 * cherche une valeur — replier ce qu'on n'a pas demandé la cacherait.
 */
export const Defaut: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={GROUPES.map((g) => g.cle)} className="max-w-[560px]">
      {GROUPES.map((g) => (
        <AccordionItem key={g.cle} value={g.cle}>
          <AccordionTrigger titre={g.titre} meta={g.meta} />
          <AccordionContent>
            <p className="text-small text-text-muted">Les champs du groupe.</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** Le `meta` dit ce que contient le groupe sans qu'on ait à le déplier. */
export const Replie: Story = {
  render: () => (
    <Accordion type="multiple" className="max-w-[560px]">
      {GROUPES.map((g) => (
        <AccordionItem key={g.cle} value={g.cle}>
          <AccordionTrigger titre={g.titre} meta={g.meta} />
          <AccordionContent>
            <p className="text-small text-text-muted">Les champs du groupe.</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
