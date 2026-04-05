import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function PrimaryButton({ title, onPress, variant = 'primary' }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered, focused }) => [
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        hovered && styles.hovered,
        focused && styles.focused,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' ? styles.secondaryLabel : styles.primaryLabel,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: tokens.radius.button,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    alignItems: 'center',
    ...tokens.shadow.card,
  },
  primaryButton: {
    backgroundColor: colors.secondary,
  },
  secondaryButton: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
  },
  label: {
    fontSize: tokens.type.body,
    fontWeight: '700',
  },
  primaryLabel: {
    color: colors.text,
  },
  secondaryLabel: {
    color: colors.text,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  hovered: {
    shadowRadius: 36,
    elevation: 4,
  },
  focused: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
