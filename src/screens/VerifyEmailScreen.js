import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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

function maskEmail(email) {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return email;
  }

  const visible = localPart.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(localPart.length - 2, 1))}@${domain}`;
}

export default function VerifyEmailScreen({
  navigation,
  pendingVerification,
  onVerifyEmail,
  onResendVerification,
  onCancelVerification,
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resentCode, setResentCode] = useState('');

  if (!pendingVerification) {
    return (
      <AppShell>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No verification is waiting</Text>
          <Text style={styles.emptyText}>
            Start from the sign-up screen and we&apos;ll guide you through the email verification step.
          </Text>
          <ActionButton title="Go to Login" onPress={() => navigation.navigate('Login')} />
        </View>
      </AppShell>
    );
  }

  const handleVerify = () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError('Please enter the verification code.');
      return;
    }

    const isValid = onVerifyEmail(trimmedCode);

    if (!isValid) {
      setError('That code does not match yet. Please try again.');
      return;
    }

    setError('');
  };

  const handleResend = () => {
    const nextCode = onResendVerification();
    setResentCode(nextCode);
    setError('');
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
          <View style={styles.iconWrap}>
            <Ionicons name="mail-open-outline" size={28} color={colors.primary} />
          </View>

          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>
            We&apos;re holding your new account for{' '}
            <Text style={styles.subtitleHighlight}>{maskEmail(pendingVerification.email)}</Text>.
          </Text>

          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Demo verification code</Text>
            <Text style={styles.noticeCode}>{resentCode || pendingVerification.code}</Text>
            <Text style={styles.noticeText}>
              This is a local preview flow. We can swap this for real email delivery once a backend or email service is added.
            </Text>
          </View>

          <InputField
            icon="key-outline"
            placeholder="Enter 6-digit code"
            value={code}
            onChangeText={(text) => {
              const sanitized = text.replace(/[^0-9]/g, '');
              setCode(sanitized);
              if (error) {
                setError('');
              }
            }}
            onSubmitEditing={handleVerify}
            returnKeyType="done"
            keyboardType="number-pad"
            maxLength={6}
            error={error}
          />

          <View style={styles.buttonGroup}>
            <ActionButton title="Verify Email" onPress={handleVerify} />
            <View style={styles.secondaryButton}>
              <ActionButton title="Resend Code" onPress={handleResend} variant="secondary" />
            </View>
          </View>

          <View style={styles.footerLinks}>
            <Pressable
              style={({ pressed }) => [pressed && styles.pressed]}
              onPress={() => {
                onCancelVerification();
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.footerLink}>Cancel sign up</Text>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    gap: tokens.spacing.md,
  },
  emptyTitle: {
    fontSize: tokens.type.headerTitle,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: tokens.type.body,
    lineHeight: 22,
    color: colors.textSoft,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  backgroundShapeTop: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: colors.lavender,
    top: 50,
    right: -30,
    opacity: 0.8,
  },
  backgroundShapeBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: colors.beige,
    bottom: 30,
    left: -60,
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
    marginBottom: tokens.spacing.lg,
  },
  subtitleHighlight: {
    color: colors.text,
    fontWeight: '700',
  },
  noticeCard: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  noticeTitle: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  noticeCode: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  noticeText: {
    fontSize: tokens.type.caption,
    lineHeight: 20,
    color: colors.textSoft,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: tokens.spacing.sm,
  },
  secondaryButton: {
    marginTop: 4,
  },
  footerLinks: {
    alignItems: 'center',
    marginTop: tokens.spacing.lg,
  },
  footerLink: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  pressed: {
    opacity: 0.86,
  },
});
