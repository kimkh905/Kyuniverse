import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function TabItem({ label, active, onPress, onLayout }) {
  return (
    <Pressable
      style={({ pressed, hovered }) => [styles.item, hovered && styles.hovered, pressed && styles.pressed]}
      onPress={onPress}
      onLayout={onLayout}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingTop: 2,
    paddingBottom: 6,
  },
  hovered: {
    transform: [{ translateY: -1 }],
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  textActive: {
    color: colors.white,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
