import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function TopIconButton({
  label,
  icon,
  onPress,
  variant = 'light',
  size = 52,
  children,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered, focused }) => [
        styles.button,
        variant === 'ghost' ? styles.ghost : styles.light,
        { width: size, height: size },
        hovered && styles.hovered,
        focused && styles.focused,
        pressed && styles.pressed,
      ]}
    >
      {children ?? (
        <Ionicons
          name={icon ?? 'ellipse'}
          size={20}
          color={variant === 'ghost' ? colors.white : colors.text}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  light: {
    backgroundColor: colors.white,
    ...tokens.shadow.card,
  },
  ghost: {
    minWidth: 52,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
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
