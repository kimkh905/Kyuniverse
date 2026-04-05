import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import CelebrationBanner from './src/components/CelebrationBanner';
import { FlashcardProvider } from './src/context/FlashcardContext';
import { useFlashcards } from './src/context/FlashcardContext';
import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/theme/colors';
import { configureNotifications } from './src/utils/notifications';

function AppContent() {
  const { isHydrated, celebration, dismissCelebration } = useFlashcards();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    configureNotifications();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.appShell}>
      <AppNavigator
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
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
