import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function ActionButton({ title, onPress, variant = 'primary', disabled = false }) {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.button,
        isSecondary && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, isSecondary && styles.labelSecondary, disabled && styles.labelDisabled]}>
        {title}
      </Text>
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
  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: tokens.type.body,
    fontWeight: '800',
    color: colors.white,
  },
  labelSecondary: {
    color: colors.text,
  },
  labelDisabled: {
    color: colors.textSoft,
  },
  hovered: {
    shadowRadius: 36,
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
