import * as React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import type { IconRole } from '../../src/icons';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { Icon } from '../icon/icon.native';
import { Text } from '../text/text.native';

/*
  La section repliable d'une fiche, en natif.

  **Elle remplace SEPT copies du même en-tête** dans myArquos — données
  techniques, catégories essentielles, écarts, photos complémentaires,
  contrat, informations, rubriques du formulaire complet — chacune portant son
  propre `CardHeader` avec, en commentaire, « on duplique plutôt que de
  factoriser ». Les sept avaient dérivé : trois teintes de chevron, deux
  tailles d'icône, des compteurs tantôt en pastille tantôt en texte.

  **Le contrôle vient de l'appelant** (`ouvert` / `onBasculer`), là où le web
  gère l'état lui-même par Radix. Les écrans de myArquos décident déjà quelle
  section est ouverte — la première qui manque de champs, celle qu'une
  recherche a désignée — et un composant qui garderait son propre état les
  obligerait à le lui reprendre.
*/

export interface AccordionProps {
  /**
   * Le rôle de l'icône, à gauche du titre. **Facultative, et absente par
   * défaut** : un titre de section se lit seul, et l'icône posée à côté ne
   * lui ajoutait rien — Louis, le 23/09/2026, devant « Données techniques » :
   * « enlève les icônes inutiles ». On la garde pour le cas où elle DIT
   * quelque chose que le titre ne dit pas.
   */
  icon?: IconRole;
  title: string;
  /** Sous le titre : ce que la section contient. */
  description?: string;
  /** À droite du titre : un compte, une progression (« 4 / 12 »). */
  meta?: string | number;
  /** La progression est atteinte : le compteur passe au vert. */
  metaReached?: boolean;
  open: boolean;
  onToggle: () => void;
  /**
   * La section OUVRE UNE PAGE au lieu de se déplier.
   *
   * **Divergence mobile, et elle vient du support.** Sur un téléphone, une
   * rubrique de trente champs dépliée sur place enterre tout ce qui la suit :
   * le formulaire rapide de myArquos ouvre donc une page, là où la tablette
   * déplie dans un volet. Le chevron cède alors la place à une flèche, qui est
   * ce que dit un lien. Le web n'a pas ce cas — il a la place.
   */
  link?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Accordion({
  icon,
  title,
  description,
  meta,
  metaReached = false,
  open,
  onToggle,
  link = false,
  children,
  style,
}: AccordionProps) {
  return (
    <View style={[styles.section, open && !link && styles.sectionOuverte, style]}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={link ? undefined : { expanded: open }}
        accessibilityLabel={meta !== undefined ? `${title}, ${meta}` : title}
        style={({ pressed }) => [styles.entete, pressed && styles.entetePressee]}
      >
        {icon ? <Icon role={icon} size="lg" weight="active" color={colors.primary} /> : null}

        <View style={styles.textes}>
          <Text variant="body" style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {description ? (
            /* `small` et non `caption` : c'est la phrase qui dit ce que la
               rubrique contient, pas une mention en marge. En légende elle
               tombait à 12 sur un téléphone lu à bout de bras (Louis,
               23/09/2026). Deux lignes permises : à 15 une phrase courte peut
               déborder, et la couper la rendrait muette. */
            <Text variant="small" tone="muted" numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>

        {meta !== undefined && meta !== '' ? (
          <View style={[styles.meta, metaReached && styles.metaReached]}>
            <Text
              variant="caption"
              style={{ color: metaReached ? colors.onSuccessBg : colors.onInfoBg, fontWeight: '600' }}
            >
              {meta}
            </Text>
          </View>
        ) : null}

        <Icon
          role={link ? 'go' : open ? 'collapse' : 'expand'}
          size="md"
          color={colors.textSubtle}
        />
      </Pressable>

      {open && !link ? <View style={styles.corps}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  /*
    Ouverte, la section se signale par sa BORDURE et non par une ombre portée.
    Les sept copies posaient une ombre de 12 de flou à l'ouverture ; sur une
    page qui en empile six, cela faisait un escalier de gris. Le filet
    `primary` dit la même chose sans peser.
  */
  sectionOuverte: {
    borderColor: colors.primary,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  entetePressee: {
    backgroundColor: colors.bgMuted,
  },
  textes: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  title: {
    fontWeight: '600',
  },
  meta: {
    borderRadius: radius.control,
    backgroundColor: colors.infoBg,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  metaReached: {
    backgroundColor: colors.successBg,
  },
  corps: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    padding: spacing.base,
    gap: spacing.md,
  },
});
