import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../components/button/button.web';
import { Icon } from '../../components/icon/icon.web';
import { IconButton } from '../../components/icon-button/icon-button.web';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/select/select.web';

/**
 * **La barre d'une liste : un sélecteur, deux boutons d'icône, un bouton.**
 *
 * C'est l'assemblage qui a révélé le manque, le 30/08/2026. `Select` rendait 32
 * pixels, `IconButton` 36 ou 30, `Button` 36, 30 ou 44 : aucune taille de bouton
 * ne tombait sur celle d'un sélecteur, et la pagination a dû écrire
 * `size-[32px]` à la main sur ses deux boutons d'icône pour que la ligne tienne.
 *
 * Depuis la v2.13.0 les quatre contrôles lisent la même échelle
 * (`--arq-control-md`, 36 px) et s'alignent sans que personne n'écrive de
 * hauteur.
 */
const meta = {
  title: 'Patterns/Une barre de contrôles',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Les quatre contrôles à la taille de référence. Le filet gris passe par le haut
 * et le bas de la barre : ce qui dépasse se voit.
 */
export const Alignes: Story = {
  render: () => (
    <div className="relative inline-flex items-center gap-sm border-y border-dashed border-danger py-0">
      <Select defaultValue="30">
        <SelectTrigger aria-label="Lignes par page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30">30 par page</SelectItem>
          <SelectItem value="60">60 par page</SelectItem>
        </SelectContent>
      </Select>
      <IconButton label="Page précédente" icon={<Icon role="previous" size="sm" />} />
      <IconButton label="Page suivante" icon={<Icon role="next" size="sm" />} />
      <Button variant="outline">Exporter</Button>
      <Button>
        <Icon role="add" size="sm" aria-hidden />
        Nouvel équipement
      </Button>
    </div>
  ),
};

/**
 * La même barre quand rien n'est encore choisi : le dernier bouton ne peut pas
 * créer, et il le dit. La plaque grise garde exactement la hauteur des autres —
 * un état ne déforme pas la ligne.
 */
export const AvecUnControleInactif: Story = {
  render: () => (
    <div className="relative inline-flex items-center gap-sm border-y border-dashed border-danger py-0">
      <Select defaultValue="30">
        <SelectTrigger aria-label="Lignes par page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30">30 par page</SelectItem>
          <SelectItem value="60">60 par page</SelectItem>
        </SelectContent>
      </Select>
      <IconButton
        label="Page précédente"
        inactive
        inactiveReason="vous êtes sur la première page"
        icon={<Icon role="previous" size="sm" />}
      />
      <IconButton label="Page suivante" icon={<Icon role="next" size="sm" />} />
      <Button variant="outline">Exporter</Button>
      <Button inactive inactiveReason="Choisissez une agence pour créer un équipement">
        <Icon role="add" size="sm" aria-hidden />
        Nouvel équipement
      </Button>
    </div>
  ),
};
