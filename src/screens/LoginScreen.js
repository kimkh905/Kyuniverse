import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from 'react';
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

WebBrowser.maybeCompleteAuthSession();

const googleConfig = {
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

const hasGoogleConfig = Object.values(googleConfig).some(Boolean);

function GoogleLoginButton({ onLogin, onError }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [, response, promptAsync] = Google.useAuthRequest({
    ...googleConfig,
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (!response) {
        return;
      }

      if (response.type !== 'success') {
        setIsGoogleLoading(false);
        if (response.type === 'error') {
          onError('Google sign-in did not complete. Please try again.');
        }
        return;
      }

      const accessToken = response.authentication?.accessToken;

      if (!accessToken) {
        onError('Google sign-in finished, but no profile token was returned.');
        setIsGoogleLoading(false);
        return;
      }

      try {
        const profileResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Could not load your Google profile.');
        }

        const profile = await profileResponse.json();

        onLogin({
          provider: 'google',
          username: profile.name || profile.email || 'Google Member',
          email: profile.email || '',
          rememberMe: true,
        });
      } catch (error) {
        onError(error.message || 'Google sign-in did not complete.');
      } finally {
        setIsGoogleLoading(false);
      }
    };

    handleGoogleResponse();
  }, [onError, onLogin, response]);

  const handleGoogleLogin = async () => {
    onError('');
    setIsGoogleLoading(true);

    try {
      await promptAsync();
    } catch (error) {
      onError(error.message || 'Google sign-in could not start.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <ActionButton
        title={isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
        onPress={handleGoogleLogin}
        variant="secondary"
        disabled={isGoogleLoading}
      />
      <Text style={styles.googleHint}>Google sign-in uses your configured Expo OAuth client IDs.</Text>
    </>
  );
}

export default function LoginScreen({ navigation, onLogin }) {
  const passwordRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [googleError, setGoogleError] = useState('');

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
        <View style={styles.backgroundShapeBottom} />

        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>

          <Text style={styles.title}>Member Login</Text>
          <Text style={styles.subtitle}>
            Welcome back. Sign in to keep building toward your learning goals.
          </Text>

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

          <View style={styles.googleBlock}>
            {hasGoogleConfig && Platform.OS !== 'web' ? (
              <GoogleLoginButton onLogin={onLogin} onError={setGoogleError} />
            ) : (
              <>
                <ActionButton title="Continue with Google" variant="secondary" disabled />
                <Text style={styles.googleHint}>
                  {Platform.OS === 'web'
                    ? 'Google sign-in is disabled in the web preview so the interface can render safely.'
                    : 'Add your EXPO_PUBLIC_GOOGLE client IDs to enable Google sign-in.'}
                </Text>
              </>
            )}
            {googleError ? <Text style={styles.googleError}>{googleError}</Text> : null}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Not a member?</Text>
            <Pressable
              style={({ pressed }) => [pressed && styles.pressed]}
              onPress={() => navigation.navigate('SignUp')}
            >
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
  googleBlock: {
    marginBottom: tokens.spacing.xl,
  },
  googleHint: {
    marginTop: 10,
    fontSize: tokens.type.caption,
    color: colors.textSoft,
    textAlign: 'center',
  },
  googleError: {
    marginTop: 10,
    fontSize: tokens.type.caption,
    color: '#D24D57',
    textAlign: 'center',
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
