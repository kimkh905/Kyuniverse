import { StyleSheet, View } from 'react-native';
import tokens from '../theme/tokens';

export default function BlueHeroCard({ children, style }) {
  return (
    <View style={[styles.shell, style]}>
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderRadius: tokens.radius.panel,
    backgroundColor: tokens.colors.primaryBlueEnd,
    position: 'relative',
    ...tokens.shadow.card,
  },
  inner: {
    padding: tokens.spacing.lg + 2,
  },
  glowLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: tokens.colors.primaryBlueStart,
    top: -90,
    right: -40,
    opacity: 0.8,
  },
  glowSmall: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: '#8FB8FF',
    bottom: -90,
    left: -30,
    opacity: 0.45,
  },
});
