import * as React from 'react';

import { Text, type TextProps } from '../text/text.native';

export type LabelProps = Omit<TextProps, 'variant'>;

/*
  Le web agrandit la cible de clic à tout l'intitulé par `htmlFor`. React
  Native n'a pas de lien label/champ : c'est l'appelant qui pose
  `accessibilityLabel` sur le champ, et ce composant ne fait que l'écrire au
  bon corps et à la bonne graisse — `small`, `medium`, `text`.
*/
export function Label({ style, ...props }: LabelProps) {
  return <Text variant="small" style={[{ fontWeight: '500' }, style]} {...props} />;
}
