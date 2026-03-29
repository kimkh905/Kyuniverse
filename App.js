import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { FlashcardProvider } from './src/context/FlashcardContext';
import { useFlashcards } from './src/context/FlashcardContext';
import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/theme/colors';

function AppContent() {
  const { isHydrated } = useFlashcards();

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <AppNavigator />;
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
});
