import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function Avatar({
  label,
  size = 44,
  shape = 'circle',
  tone = 'soft',
}) {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: shape === 'rounded' ? 16 : size / 2,
        },
        tone === 'beige' ? styles.beige : tone === 'lavender' ? styles.lavender : styles.soft,
      ]}
    >
      <Text style={[styles.label, { fontSize: Math.max(14, Math.round(size * 0.38)) }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  soft: {
    backgroundColor: colors.softSurface,
  },
  beige: {
    backgroundColor: colors.beige,
  },
  lavender: {
    backgroundColor: colors.lavender,
  },
  label: {
    fontWeight: '800',
    color: colors.primary,
    includeFontPadding: false,
  },
});
