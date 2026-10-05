'use client';

import * as React from 'react';

/**
 * Où poser ce qui flotte — menu, liste d'un champ cherchable.
 *
 * Par défaut, à la racine du document : c'est ce que fait Radix, et c'est ce qui
 * permet à une liste de dépasser du bloc qui l'a ouverte. Mais un PANNEAU
 * (`Sheet`) bloque le défilement de tout ce qui est hors de lui — c'est ce qui
 * empêche la page de bouger derrière. Une liste posée à la racine est hors du
 * panneau : la molette n'y faisait plus rien, ni le doigt sur une tablette.
 * Signalé par Thomas le 05/10/2026 sur le choix du client, dans « Modifier ».
 *
 * Le panneau fournit donc son propre nœud, et ce qui flotte s'y pose. Hors de
 * tout panneau, rien ne change.
 */
export const ConteneurFlottant = React.createContext<HTMLElement | null>(null);

export const useConteneurFlottant = () => React.useContext(ConteneurFlottant);
