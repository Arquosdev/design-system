import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Button } from '../../components/button/button.web';
import { Checkbox } from '../../components/checkbox/checkbox.web';
import { Input } from '../../components/input/input.web';
import { Label } from '../../components/label/label.web';
import { RadioGroup, RadioGroupItem } from '../../components/radio-group/radio-group.web';
import { Switch } from '../../components/switch/switch.web';
import { Textarea } from '../../components/textarea/textarea.web';

/**
 * Les six primitives réunies, parce qu'elles ne se regardent jamais seules :
 * un formulaire les mélange, et ce qui se voit là est leur **alignement** —
 * hauteurs, écarts, poids des intitulés.
 *
 * Chacune a sa page et sa fiche. Celle-ci sert à vérifier qu'elles tiennent
 * ensemble.
 */
const meta = {
  title: 'Générique/Formulaire',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Un formulaire réel — l'ajout d'une donnée manquante à un relevé.
 *
 * Le contenu n'est pas inventé : ce sont les champs de « Compléter » dans la
 * fiche d'équipement, aujourd'hui écrits en balises brutes.
 */
export const UnFormulaireEntier: Story = {
  render: function Formulaire() {
    const [immediat, setImmediat] = React.useState(false);
    return (
      <form
        className="flex max-w-[520px] flex-col gap-base rounded-md border border-border-soft p-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-xs">
          <Label htmlFor="f-libelle">Ce qu’on mesure</Label>
          <Input id="f-libelle" placeholder="ex. Hauteur libre sous linteau" />
        </div>

        <div className="flex flex-col gap-xs">
          <Label htmlFor="f-valeur">Valeur relevée</Label>
          <Input id="f-valeur" type="number" placeholder="en mm" />
        </div>

        <fieldset className="flex flex-col gap-sm border-0 p-0">
          <legend className="mb-xs text-small font-medium text-text">Type d’entraînement</legend>
          <RadioGroup defaultValue="traction">
            <Label className="gap-sm font-normal">
              <RadioGroupItem value="traction" /> Traction à câbles
            </Label>
            <Label className="gap-sm font-normal">
              <RadioGroupItem value="hydraulique" /> Hydraulique
            </Label>
            <Label className="gap-sm font-normal">
              <RadioGroupItem value="inconnu" /> Non déterminé
            </Label>
          </RadioGroup>
        </fieldset>

        <Label className="gap-sm font-normal">
          <Checkbox defaultChecked /> Machinerie accessible sans clé
        </Label>

        <div className="flex flex-col gap-xs">
          <Label htmlFor="f-obs">Observation</Label>
          <Textarea id="f-obs" placeholder="Ce que le technicien a constaté sur place" />
        </div>

        {/* L'interrupteur est SOUS la barre d'action, à dessein : il s'applique
            tout de suite, alors que tout ce qui est au-dessus attend
            « Enregistrer ». Les mélanger ferait croire que le réglage est pris
            avec le reste. */}
        <div className="flex gap-sm border-t border-border-soft pt-base">
          <Button type="submit">Enregistrer</Button>
          <Button type="button" variant="secondary">
            Annuler
          </Button>
        </div>

        <Label className="justify-between font-normal text-text-muted">
          Afficher les champs vides
          <Switch checked={immediat} onCheckedChange={setImmediat} />
        </Label>
      </form>
    );
  },
};

/**
 * Champ et bouton font **la même hauteur** — 36 px. C'est la raison de l'écart
 * avec shadcn, dont le champ est calé sur sa propre échelle : les formulaires
 * de la fiche mêlent les deux à chaque ligne, et 2 px se voient.
 */
export const MemeHauteurQueLeBouton: Story = {
  render: () => (
    <div className="flex items-center gap-sm">
      <Input placeholder="N° d’appareil" className="w-[220px]" />
      <Button>Chercher</Button>
    </div>
  ),
};

/**
 * L'erreur passe par `aria-invalid` — le même attribut colore la bordure et
 * prévient le lecteur d'écran, donc les deux ne peuvent pas diverger.
 *
 * **La bordure ne suffit jamais.** Un message la suit, relié par
 * `aria-describedby` : une couleur seule ne dit ni ce qui ne va pas, ni quoi
 * faire, et ne se voit pas d'un daltonien.
 */
export const EnErreur: Story = {
  render: () => (
    <div className="flex max-w-[360px] flex-col gap-xs">
      <Label htmlFor="f-err">Hauteur libre sous linteau</Label>
      <Input id="f-err" defaultValue="35000" aria-invalid aria-describedby="f-err-msg" />
      <p id="f-err-msg" className="text-caption text-danger">
        Au-delà de 3 000 mm, vérifier la mesure — la valeur est probablement en dixièmes.
      </p>
    </div>
  ),
};

/**
 * Désactivé, chaque champ perd son pointeur en plus de son opacité : un champ
 * grisé qui garde le curseur texte promet une saisie qui n'arrivera pas.
 */
export const Desactive: Story = {
  render: () => (
    <div className="flex max-w-[360px] flex-col gap-base">
      <Input disabled defaultValue="Verrouillé par le relevé consolidé" />
      <Label className="gap-sm font-normal">
        <Checkbox disabled defaultChecked /> Case désactivée
      </Label>
      <Label className="justify-between font-normal">
        Interrupteur désactivé
        <Switch disabled />
      </Label>
    </div>
  ),
};

/**
 * La case commande un groupe : `indeterminate` dit « certaines, pas toutes ».
 * C'est le seul état à trois valeurs du lot.
 */
export const CasePartielle: Story = {
  render: function Partielle() {
    const [etats, setEtats] = React.useState([true, false, false]);
    const tout = etats.every(Boolean);
    const rien = etats.every((e) => !e);
    const noms = ['Cuvette', 'Gaine', 'Machinerie'];
    return (
      <div className="flex flex-col gap-sm">
        <Label className="gap-sm">
          <Checkbox
            checked={tout ? true : rien ? false : 'indeterminate'}
            onCheckedChange={(v) => setEtats(etats.map(() => v === true))}
          />
          Toutes les zones
        </Label>
        <div className="ml-lg flex flex-col gap-sm">
          {noms.map((nom, i) => (
            <Label key={nom} className="gap-sm font-normal">
              <Checkbox
                checked={etats[i]}
                onCheckedChange={(v) => setEtats(etats.map((e, j) => (j === i ? v === true : e)))}
              />
              {nom}
            </Label>
          ))}
        </div>
      </div>
    );
  },
};
