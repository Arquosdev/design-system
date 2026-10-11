'use client';

import * as React from 'react';

import { Badge } from '../badge/badge.web';
import { statusEntry, statusKey, type StatusObject } from './status-badge.logic';

export interface StatusBadgeProps {
  /** L'objet dont on dit le statut : sa table vit dans `status-badge.logic.ts`. */
  object: StatusObject;
  /** Le statut tel que l'application le reçoit : clé, code de la base ou mot de Bubble. */
  status: string | null | undefined;
  /** Le portail lit les mots du client (« À valider » plutôt que « Envoyé »). */
  audience?: 'agency' | 'client';
  /** Ce qui s'affiche, en gris, pour un statut que la table ne connaît pas. */
  fallback?: string;
  className?: string;
}

/**
 * Le statut d'un objet, du même mot et de la même couleur dans toutes les
 * applications. Un statut inconnu garde son mot, en gris : on ne colore pas
 * ce qu'on ne connaît pas.
 */
export function StatusBadge({ object, status, audience = 'agency', fallback, className }: StatusBadgeProps) {
  const entry = statusEntry(object, statusKey(object, status));
  if (!entry) {
    const mot = fallback ?? status;
    return mot ? <Badge variant="muted" className={className}>{mot}</Badge> : null;
  }
  const label = audience === 'client' ? (entry.clientLabel ?? entry.label) : entry.label;
  return <Badge variant={entry.tone} className={className}>{label}</Badge>;
}
