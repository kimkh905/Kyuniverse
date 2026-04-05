import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import CelebrationBanner from './src/components/CelebrationBanner';
import { FlashcardProvider } from './src/context/FlashcardContext';
import { useFlashcards } from './src/context/FlashcardContext';
import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/theme/colors';
import { configureNotifications } from './src/utils/notifications';

function AppContent() {
  const { isHydrated, celebration, dismissCelebration } = useFlashcards();
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(null);
  const [isClientReady, setIsClientReady] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      configureNotifications();
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsClientReady(true);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser({
      name: user?.username || user?.name || 'Member',
      email: user?.email || '',
      provider: user?.provider || 'local',
      rememberMe: Boolean(user?.rememberMe),
    });
    setPendingVerification(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleCreateAccount = (account) => {
    const nextCode = String(Math.floor(100000 + Math.random() * 900000));

    setPendingVerification({
      name: account.name,
      email: account.email,
      password: account.password,
      code: nextCode,
    });
  };

  const handleVerifyEmail = (code) => {
    if (!pendingVerification) {
      return false;
    }

    if (pendingVerification.code !== code) {
      return false;
    }

    setCurrentUser({
      name: pendingVerification.name,
      email: pendingVerification.email,
      provider: 'email',
      rememberMe: true,
    });
    setPendingVerification(null);
    return true;
  };

  const handleResendVerification = () => {
    if (!pendingVerification) {
      return '';
    }

    const nextCode = String(Math.floor(100000 + Math.random() * 900000));
    setPendingVerification((current) =>
      current
        ? {
            ...current,
            code: nextCode,
          }
        : current
    );
    return nextCode;
  };

  const handleCancelVerification = () => {
    setPendingVerification(null);
  };

  if (!isHydrated || !isClientReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.appShell}>
      <AppNavigator
        isAuthenticated={Boolean(currentUser)}
        currentUser={currentUser}
        pendingVerification={pendingVerification}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onCreateAccount={handleCreateAccount}
        onVerifyEmail={handleVerifyEmail}
        onResendVerification={handleResendVerification}
        onCancelVerification={handleCancelVerification}
      />
      <CelebrationBanner celebration={celebration} onDismiss={dismissCelebration} />
    </View>
  );
}

export default function App() {
  return (
    <FlashcardProvider>
      <StatusBar style="dark" />
      <AppContent />
    </FlashcardProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  appShell: {
    flex: 1,
  },
});
