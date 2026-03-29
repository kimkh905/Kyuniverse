import { StatusBar } from 'expo-status-bar';
import { FlashcardProvider } from './src/context/FlashcardContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <FlashcardProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </FlashcardProvider>
  );
}
