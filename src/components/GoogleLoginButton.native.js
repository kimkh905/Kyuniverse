import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import ActionButton from './ActionButton';
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

export default function GoogleLoginButton({ onLogin, onError }) {
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

    if (!hasGoogleConfig) {
      onError('Add your EXPO_PUBLIC_GOOGLE client IDs to enable Google sign-in.');
      return;
    }

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
      <Text style={styles.hint}>Google sign-in uses your configured Expo OAuth client IDs.</Text>
    </>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: 10,
    fontSize: tokens.type.caption,
    color: colors.textSoft,
    textAlign: 'center',
  },
});
