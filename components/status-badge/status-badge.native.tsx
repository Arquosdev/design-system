import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { Badge } from '../badge/badge.native';
import { statusEntry, statusKey, type StatusObject } from './status-badge.logic';

export interface StatusBadgeProps {
  /** L'objet dont on dit le statut : sa table vit dans `status-badge.logic.ts`. */
  object: StatusObject;
  /** Le statut tel que l'application le reçoit : clé, code de la base ou mot de Bubble. */
  status: string | null | undefined;
  /** Ce qui s'affiche, en gris, pour un statut que la table ne connaît pas. */
  fallback?: string;
  style?: StyleProp<ViewStyle>;
}

/** Le statut d'un objet, du même mot et de la même couleur que sur le web. */
export function StatusBadge({ object, status, fallback, style }: StatusBadgeProps) {
  const entry = statusEntry(object, statusKey(object, status));
  if (!entry) {
    const mot = fallback ?? status;
    return mot ? <Badge variant="muted" style={style}>{mot}</Badge> : null;
  }
  return <Badge variant={entry.tone} style={style}>{entry.label}</Badge>;
}
