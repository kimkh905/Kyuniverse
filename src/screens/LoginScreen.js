import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ActionButton from '../components/ActionButton';
import AppShell from '../components/AppShell';
import InputField from '../components/InputField';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function LoginScreen({ navigation, onLogin }) {
  const passwordRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const clearFieldError = (field) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });
  };

  const handleSubmit = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const nextErrors = {};

    if (!trimmedUsername) {
      nextErrors.username = 'Please enter your username.';
    }

    if (!trimmedPassword) {
      nextErrors.password = 'Please enter your password.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onLogin({
      provider: 'local',
      username: trimmedUsername,
      email: '',
      rememberMe,
    });
  };

  return (
    <AppShell>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.backgroundShapeTop} />
        <View style={styles.backgroundShapeMid} />
        <View style={styles.backgroundShapeBottom} />

        <View style={styles.card}>
          <View style={styles.headerArea}>
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>Daily Korean practice</Text>
            </View>

            <View style={styles.iconWrap}>
              <View style={styles.iconInner}>
                <Ionicons name="person" size={30} color={colors.primary} />
              </View>
            </View>

            <Text style={styles.title}>Member Login</Text>
            <Text style={styles.subtitle}>
              Welcome back. Sign in to pick up where you left off and keep your streak moving.
            </Text>
          </View>

          <InputField
            icon="person-outline"
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              clearFieldError('username');
            }}
            onSubmitEditing={() => passwordRef.current?.focus()}
            returnKeyType="next"
            autoCapitalize="none"
            autoComplete="username"
            textContentType="username"
            error={errors.username}
          />

          <InputField
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearFieldError('password');
            }}
            secureTextEntry
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            inputRef={passwordRef}
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            error={errors.password}
          />

          <View style={styles.optionsRow}>
            <Pressable
              style={({ pressed }) => [styles.checkboxRow, pressed && styles.pressed]}
              onPress={() => setRememberMe((current) => !current)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
              </View>
              <Text style={styles.optionLabel}>Remember me</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
              <Text style={styles.linkLabel}>Forgot Password</Text>
            </Pressable>
          </View>

          <View style={styles.buttonWrap}>
            <ActionButton title="Login" onPress={handleSubmit} />
          </View>

          <View style={styles.helperCard}>
            <View style={styles.helperRow}>
              <View style={styles.helperIcon}>
                <Ionicons name="sparkles-outline" size={16} color={colors.primaryDark} />
              </View>
              <View style={styles.helperTextWrap}>
                <Text style={styles.helperTitle}>Keep your progress local</Text>
                <Text style={styles.helperCopy}>
                  This preview uses local state only, so you can explore the experience without a backend.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Not a member?</Text>
            <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
              <Text style={styles.footerLink}>Create an account</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundShapeTop: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: colors.lavender,
    top: 40,
    right: -30,
    opacity: 0.8,
  },
  backgroundShapeBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: colors.beige,
    bottom: 20,
    left: -60,
    opacity: 0.9,
  },
  backgroundShapeMid: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: colors.card,
    top: '28%',
    left: -40,
    opacity: 0.55,
  },
  card: {
    backgroundColor: colors.softSurface,
    borderRadius: tokens.radius.panel,
    padding: tokens.spacing.xl,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    ...tokens.shadow.card,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: tokens.radius.pill,
    backgroundColor: colors.white,
    marginBottom: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
  },
  badgeLabel: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
    ...tokens.shadow.card,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: tokens.type.body,
    lineHeight: 22,
    color: colors.textSoft,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: tokens.spacing.xl,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.backgroundAccent,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLabel: {
    fontSize: tokens.type.caption,
    color: colors.textSoft,
  },
  linkLabel: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  buttonWrap: {
    marginBottom: tokens.spacing.md,
  },
  helperCard: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.cardSm,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    marginBottom: tokens.spacing.xl,
    ...tokens.shadow.card,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.sm,
  },
  helperIcon: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperTextWrap: {
    flex: 1,
    gap: 4,
  },
  helperTitle: {
    fontSize: tokens.type.body,
    fontWeight: '700',
    color: colors.text,
  },
  helperCopy: {
    fontSize: tokens.type.caption,
    lineHeight: 18,
    color: colors.textSoft,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: tokens.type.caption,
    color: colors.textSoft,
  },
  footerLink: {
    fontSize: tokens.type.body,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  pressed: {
    opacity: 0.86,
  },
});
