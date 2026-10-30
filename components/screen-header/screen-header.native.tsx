import * as React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { controlHeight } from '../../src/control';
import { spacing } from '../../src/spacing';
import { IconButton } from '../icon-button/icon-button.native';
import { Text } from '../text/text.native';

export interface ScreenHeaderProps {
  /** Ce qu'est l'écran : l'adresse d'un relevé, « Nouvel équipement ». */
  title: string;
  /** Une précision discrète sous le titre : les numéros. Jamais une redite du titre. */
  subtitle?: string;
  /** Le retour. Absent, pas de flèche (un écran racine). */
  onBack?: () => void;
  /** Ce que dit la flèche : « Retour », ou « Fermer » pour une feuille. */
  backLabel?: string;
  /** Des `IconButton` en `ghost`, à droite de la flèche. Jamais l'action principale : elle va dans le pied. */
  actions?: React.ReactNode;
  /** Un appui sur le titre (montrer l'adresse entière, par exemple). */
  onTitlePress?: () => void;
  /**
   * Le titre en petit, sur la rangée de la flèche, sans sous-titre : pour une
   * page INTERNE d'un parcours (la rubrique d'un formulaire), dont l'écran
   * parent a déjà dit l'objet. La place va au contenu (Thomas, 19/10/2026).
   */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * L'en-tête d'un écran de myArquos, le même partout (audit A4-11) : une
 * rangée avec la flèche de retour et des boutons d'icône, puis le titre DANS
 * LE CORPS, aligné à gauche, sur deux lignes au plus. C'est le gabarit de
 * Linear mobile : le titre centré et tronqué entre deux boutons
 * (« 66 Rue du Por… ») ne disait plus de quel relevé il s'agissait.
 */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  backLabel = 'Retour',
  actions,
  onTitlePress,
  compact = false,
  style,
}: ScreenHeaderProps) {
  if (compact) {
    return (
      <View style={[styles.entete, styles.enteteCompact, style]}>
        <View style={[styles.rangee, styles.rangeeCompacte]}>
          {onBack ? (
            <IconButton label={backLabel} icon={backLabel === 'Fermer' ? 'close' : 'previous'} variant="ghost" onPress={onBack} style={styles.retour} />
          ) : null}
          {/* Deux lignes : « Cheminement relatif à l'IMMEUBLE » se coupait en « …IMMEUB… » sur la
              page d'une zone de l'étude de sécurité (revue de Thomas, 30/10/2026). */}
          <Text variant="subhead" numberOfLines={2} accessibilityRole="header" style={styles.titreCompact}>
            {title}
          </Text>
          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </View>
      </View>
    );
  }
  const titre = (
    <>
      <Text variant="titleLarge" numberOfLines={2} accessibilityRole="header">
        {title}
      </Text>
      {subtitle && subtitle !== title ? (
        // Deux lignes : « État des lieux et étude de sécurité · Équipement 53 A 00145 01 » se coupait
        // sur téléphone (revue de Thomas, 30/10/2026).
        <Text variant="caption" tone="muted" numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
    </>
  );
  return (
    <View style={[styles.entete, style]}>
      {onBack || actions ? (
        <View style={styles.rangee}>
          {onBack ? (
            <IconButton label={backLabel} icon={backLabel === 'Fermer' ? 'close' : 'previous'} variant="ghost" onPress={onBack} style={styles.retour} />
          ) : (
            <View />
          )}
          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </View>
      ) : null}
      {onTitlePress ? (
        <Pressable onPress={onTitlePress} style={({ pressed }) => [styles.titre, pressed && styles.presse]}>
          {titre}
        </Pressable>
      ) : (
        <View style={styles.titre}>{titre}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entete: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgMuted,
  },
  rangee: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: controlHeight.lg,
  },
  // La flèche s'aligne sur la gouttière du corps, pas sur le bord de son bouton.
  retour: { marginLeft: -spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  titre: { gap: spacing.xxs, marginTop: spacing.xs },
  enteteCompact: { paddingBottom: spacing.xs },
  rangeeCompacte: { justifyContent: 'flex-start', gap: spacing.xs },
  titreCompact: { flex: 1 },
  presse: { opacity: 0.6 },
});
