import * as React from 'react';
import { Linking, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../src/colors';
import { radius } from '../../src/radius';
import { spacing } from '../../src/spacing';
import { typography } from '../../src/typography';
import { Text } from '../text/text.native';
import { analyser, type Bloc, type EnLigne } from './markdown.logic';

/*
  Le texte d'une réponse de l'assistant, mis en forme, sur le téléphone : le
  même arbre que le web (markdown.logic.ts), rendu en `Text` imbriqués. Une
  réponse se lit donc pareil sur les deux (inventaire du 10/10/2026 : myArquos
  retirait les astérisques et rendait un seul paragraphe).

  `onLink` décide de ce qu'est un lien : l'application ouvre ses chemins
  internes dans son routeur. Sans lui, tout lien part au système (`Linking`).
  Le texte est SÉLECTIONNABLE : sur un téléphone, c'est ainsi qu'on copie un
  morceau de réponse.
*/

export interface MarkdownProps {
  children: string;
  /** Ouvrir un lien ; `href` est déjà vérifié (chemin, web, courriel, téléphone). */
  onLink?: (href: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function Markdown({ children, onLink, style }: MarkdownProps) {
  const blocs = React.useMemo(() => analyser(children), [children]);
  const ouvrir = (href: string) => (onLink ? onLink(href) : void Linking.openURL(href));

  const ligne = (morceaux: readonly EnLigne[], cle: string): React.ReactNode[] => morceaux.map((m, k) => {
    const c = `${cle}.${k}`;
    switch (m.type) {
      case 'texte': return m.texte;
      case 'gras': return <Text key={c} style={styles.gras}>{ligne(m.enfants, c)}</Text>;
      case 'italique': return <Text key={c} style={styles.italique}>{ligne(m.enfants, c)}</Text>;
      case 'code': return <Text key={c} mono style={styles.codeEnLigne}>{m.texte}</Text>;
      case 'lien':
        return (
          <Text key={c} style={styles.lien} accessibilityRole="link" onPress={() => ouvrir(m.href)} suppressHighlighting={false}>
            {ligne(m.enfants, c)}
          </Text>
        );
    }
  });

  const bloc = (b: Bloc, cle: string): React.ReactNode => {
    switch (b.type) {
      case 'titre':
        return (
          <Text key={cle} accessibilityRole="header" selectable style={[styles.titre, b.niveau === 1 && styles.titre1]}>
            {ligne(b.enfants, cle)}
          </Text>
        );
      case 'paragraphe':
        return <Text key={cle} selectable style={styles.texte}>{ligne(b.enfants, cle)}</Text>;
      case 'liste':
        return (
          <View key={cle} style={styles.liste}>
            {b.elements.map((e, k) => (
              <View key={k}>
                <View style={styles.element}>
                  <Text style={[styles.texte, styles.marque]}>{b.ordonnee ? `${b.debut + k}.` : '•'}</Text>
                  <Text selectable style={[styles.texte, styles.flex]}>{ligne(e.enfants, `${cle}.${k}`)}</Text>
                </View>
                {e.sousListe ? <View style={styles.sousListe}>{bloc(e.sousListe, `${cle}.${k}.s`)}</View> : null}
              </View>
            ))}
          </View>
        );
      case 'tableau':
        // Un tableau défile de côté : sur 375 points, trois colonnes ne tiennent pas toujours.
        return (
          <ScrollView key={cle} horizontal showsHorizontalScrollIndicator={false} style={styles.tableau}>
            <View>
              <View style={[styles.rangee, styles.entete]}>
                {b.entete.map((c, k) => (
                  <Text key={k} style={[styles.cellule, styles.gras]}>{ligne(c, `${cle}.h${k}`)}</Text>
                ))}
              </View>
              {b.lignes.map((r, i) => (
                <View key={i} style={[styles.rangee, i < b.lignes.length - 1 && styles.filetBas]}>
                  {r.map((c, k) => (
                    <Text key={k} selectable style={[styles.cellule, b.alignements[k] === 'droite' && styles.droite]}>{ligne(c, `${cle}.${i}.${k}`)}</Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        );
      case 'citation':
        return <View key={cle} style={styles.citation}>{b.blocs.map((x, k) => bloc(x, `${cle}.${k}`))}</View>;
      case 'code':
        return (
          <ScrollView key={cle} horizontal showsHorizontalScrollIndicator={false} style={styles.code}>
            <Text mono selectable style={styles.codeTexte}>{b.texte}</Text>
          </ScrollView>
        );
      case 'filet':
        return <View key={cle} style={styles.filet} />;
    }
  };

  return <View style={[styles.racine, style]}>{blocs.map((b, k) => bloc(b, String(k)))}</View>;
}

const styles = StyleSheet.create({
  racine: { gap: spacing.sm },
  texte: { fontSize: typography.body.fontSize, lineHeight: Math.round(typography.body.fontSize * 1.45), color: colors.text },
  gras: { fontWeight: '600' },
  italique: { fontStyle: 'italic' },
  codeEnLigne: { fontSize: typography.small.fontSize, backgroundColor: colors.bgMuted, color: colors.text },
  lien: { color: colors.primary, textDecorationLine: 'underline' },
  titre: { fontSize: typography.body.fontSize, fontWeight: '600', color: colors.text, marginTop: spacing.xs },
  titre1: { fontSize: typography.subhead.fontSize },
  liste: { gap: spacing.xs },
  element: { flexDirection: 'row', gap: spacing.sm },
  marque: { color: colors.textMuted, minWidth: 16 },
  flex: { flex: 1 },
  sousListe: { paddingLeft: spacing.xl, marginTop: spacing.xs },
  tableau: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderSoft, borderRadius: radius.block },
  rangee: { flexDirection: 'row' },
  entete: { backgroundColor: colors.bgSubtle, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderSoft },
  filetBas: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderSoft },
  cellule: { minWidth: 96, maxWidth: 220, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, fontSize: typography.small.fontSize, color: colors.text },
  droite: { textAlign: 'right' },
  citation: { borderLeftWidth: 2, borderLeftColor: colors.border, paddingLeft: spacing.md, gap: spacing.sm },
  code: { backgroundColor: colors.bgMuted, borderRadius: radius.block, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  codeTexte: { fontSize: typography.caption.fontSize, color: colors.text },
  filet: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderSoft },
});
