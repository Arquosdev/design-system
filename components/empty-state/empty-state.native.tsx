import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import type { IconRole } from '../../src/icons';
import { spacing } from '../../src/spacing';
import { Button } from '../button/button.native';
import { Icon } from '../icon/icon.native';
import { Text } from '../text/text.native';
import { ECHECS, natureDeLEchec, REESSAYER } from './empty-state.logic';

export interface EmptyStateProps {
  icone: IconRole;
  titre: string;
  conseil: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

/*
  Le même dessin que le web : l'icône nue en trait, le titre en `subhead`, le
  conseil en `small` muté, le bouton en dessous. Voir `empty-state.web.tsx`
  pour ce qui a été retiré le 22/09/2026 — le carré gris de 60 — et pourquoi.
*/
export function EmptyState({ icone, titre, conseil, actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <View style={[styles.conteneur, style]}>
      <Icon role={icone} size="xl" weight="discret" color={colors.textSubtle} style={styles.icone} />
      <Text variant="subhead" style={[styles.centre, styles.titre]}>
        {titre}
      </Text>
      <Text variant="small" tone="muted" style={[styles.centre, styles.conseil]}>
        {conseil}
      </Text>
      {actionLabel && onAction ? (
        <Button onPress={onAction} style={styles.action}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

/*
  Le mot de l'échec vient de `empty-state.logic.ts`, le même que sur le web :
  « Pas de connexion » ne devient pas « — » d'une plateforme à l'autre. La
  détection, elle, regarde d'abord `navigator.onLine`, que React Native ne pose
  pas — elle retombe alors sur le message de l'erreur, ce que faisait déjà
  `lib/errors.ts` de myArquos.
*/
export function EmptyStateErreur({
  erreur,
  onReessayer,
  style,
}: {
  erreur: unknown;
  onReessayer?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { icone, titre, conseil } = ECHECS[natureDeLEchec(erreur)];
  return (
    <EmptyState
      icone={icone}
      titre={titre}
      conseil={conseil}
      actionLabel={onReessayer ? REESSAYER : undefined}
      onAction={onReessayer}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  conteneur: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  icone: {
    marginBottom: spacing.md,
  },
  centre: {
    textAlign: 'center',
  },
  titre: {
    fontWeight: '600',
  },
  conseil: {
    marginTop: spacing.xs,
    maxWidth: 280,
  },
  action: {
    marginTop: spacing.base,
  },
});
