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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen({ navigation, onCreateAccount }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    const nextErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedName) {
      nextErrors.fullName = 'Please enter your name.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Please enter your email.';
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!trimmedPassword) {
      nextErrors.password = 'Please create a password.';
    } else if (trimmedPassword.length < 6) {
      nextErrors.password = 'Use at least 6 characters.';
    }

    if (!trimmedConfirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (trimmedPassword !== trimmedConfirmPassword) {
      nextErrors.confirmPassword = 'Your passwords do not match.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onCreateAccount({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
    });
    navigation.navigate('VerifyEmail');
  };

  return (
    <AppShell>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.backgroundShapeTop} />
        <View style={styles.backgroundShapeBottom} />

        <View style={styles.card}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
            <Text style={styles.backLabel}>Back to login</Text>
          </Pressable>

          <View style={styles.iconWrap}>
            <Ionicons name="sparkles-outline" size={26} color={colors.primary} />
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Set up your learning account and we&apos;ll guide you through a quick email check.
          </Text>

          <InputField
            icon="person-outline"
            placeholder="Full name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              clearFieldError('fullName');
            }}
            onSubmitEditing={() => emailRef.current?.focus()}
            returnKeyType="next"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            error={errors.fullName}
          />

          <InputField
            icon="mail-outline"
            placeholder="Email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearFieldError('email');
            }}
            onSubmitEditing={() => passwordRef.current?.focus()}
            returnKeyType="next"
            inputRef={emailRef}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={errors.email}
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
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            returnKeyType="next"
            inputRef={passwordRef}
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            error={errors.password}
          />

          <InputField
            icon="shield-checkmark-outline"
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearFieldError('confirmPassword');
            }}
            secureTextEntry
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            inputRef={confirmPasswordRef}
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="password"
            error={errors.confirmPassword}
          />

          <View style={styles.buttonWrap}>
            <ActionButton title="Create Account" onPress={handleSubmit} />
          </View>

          <Text style={styles.footnote}>
            This app currently uses a local demo verification flow. We can connect real email delivery later.
          </Text>
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
    left: -30,
    opacity: 0.85,
  },
  backgroundShapeBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: colors.beige,
    bottom: 20,
    right: -60,
    opacity: 0.9,
  },
  card: {
    backgroundColor: colors.softSurface,
    borderRadius: tokens.radius.panel,
    padding: tokens.spacing.xl,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    ...tokens.shadow.card,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: tokens.spacing.md,
  },
  backLabel: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.text,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: tokens.spacing.lg,
    ...tokens.shadow.card,
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
  buttonWrap: {
    marginTop: 4,
    marginBottom: tokens.spacing.md,
  },
  footnote: {
    fontSize: tokens.type.caption,
    lineHeight: 20,
    color: colors.textSoft,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.86,
  },
});
