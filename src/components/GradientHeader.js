import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function GradientHeader({
  title,
  left,
  right,
  children,
  minHeight = '32%',
}) {
  return (
    <View style={[styles.header, { minHeight }]}>
      <View style={styles.topRow}>
        <View>{left}</View>
        <View>{right}</View>
      </View>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderRadius: tokens.radius.panel,
    backgroundColor: colors.primary,
    padding: tokens.spacing.xl,
    overflow: 'hidden',
    ...tokens.shadow.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: colors.white,
    marginBottom: tokens.spacing.xl,
    maxWidth: 220,
  },
});
