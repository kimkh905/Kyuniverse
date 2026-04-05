import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  onSubmitEditing,
  returnKeyType = 'next',
  inputRef,
  error,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.fieldShell, error && styles.fieldShellError]}>
        <Ionicons name={icon} size={18} color={colors.textSoft} />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSoft}
          secureTextEntry={secureTextEntry}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: tokens.spacing.md,
  },
  fieldShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: tokens.radius.cardSm,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...tokens.shadow.card,
  },
  fieldShellError: {
    borderColor: '#E16A6A',
  },
  input: {
    flex: 1,
    fontSize: tokens.type.body,
    color: colors.text,
    paddingVertical: 2,
  },
  errorText: {
    marginTop: 8,
    fontSize: tokens.type.caption,
    color: '#D24D57',
    paddingHorizontal: 4,
  },
});
