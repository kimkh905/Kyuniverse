import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function ActionButton({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.button,
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.radius.button,
    backgroundColor: colors.secondaryDark,
    paddingVertical: 16,
    paddingHorizontal: 20,
    ...tokens.shadow.card,
  },
  label: {
    fontSize: tokens.type.body,
    fontWeight: '800',
    color: colors.white,
  },
  hovered: {
    shadowRadius: 36,
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
