import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function StatCard({ value, label, tone = 'lavender' }) {
  return (
    <View style={[styles.card, tone === 'beige' ? styles.beige : styles.lavender]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: tokens.radius.card,
    padding: 20,
    minHeight: 118,
    justifyContent: 'space-between',
  },
  lavender: {
    backgroundColor: colors.lavender,
  },
  beige: {
    backgroundColor: colors.beige,
  },
  value: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
  },
  label: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.textSoft,
  },
});
