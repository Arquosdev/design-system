import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import type { IconRole } from '../../src/icons';
import { spacing } from '../../src/spacing';
import { Button } from '../button/button.native';
import { Icon } from '../icon/icon.native';
import { Text } from '../text/text.native';
import { FAILURES, failureKind, RETRY } from './empty-state.logic';

export interface EmptyStateProps {
  icon: IconRole;
  title: string;
  hint: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

/*
  Le même dessin que le web : l'icône nue en trait, le titre en `subhead`, le
  conseil en `small` muté, le bouton en dessous. Voir `empty-state.web.tsx`
  pour ce qui a été retiré le 22/09/2026 — le carré gris de 60 — et pourquoi.
*/
export function EmptyState({ icon, title, hint, actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <View style={[styles.conteneur, style]}>
      <Icon role={icon} size="xl" weight="subtle" color={colors.textSubtle} style={styles.icon} />
      <Text variant="subhead" style={[styles.centre, styles.title]}>
        {title}
      </Text>
      <Text variant="small" tone="muted" style={[styles.centre, styles.hint]}>
        {hint}
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
export function EmptyStateError({
  error,
  onRetry,
  style,
}: {
  error: unknown;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { icon, title, hint } = FAILURES[failureKind(error)];
  return (
    <EmptyState
      icon={icon}
      title={title}
      hint={hint}
      actionLabel={onRetry ? RETRY : undefined}
      onAction={onRetry}
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
  icon: {
    marginBottom: spacing.md,
  },
  centre: {
    textAlign: 'center',
  },
  title: {
    fontWeight: '600',
  },
  hint: {
    marginTop: spacing.xs,
    maxWidth: 280,
  },
  action: {
    marginTop: spacing.base,
  },
});
