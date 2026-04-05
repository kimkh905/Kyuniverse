import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashcardScreen from '../screens/FlashcardScreen';
import GoalsScreen from '../screens/GoalsScreen';
import HomeScreen from '../screens/HomeScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import ProgressScreen from '../screens/ProgressScreen';
import QuizScreen from '../screens/QuizScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '700',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Korean Flashcards' }} />
        <Stack.Screen name="Goals" component={GoalsScreen} options={{ title: 'Goals' }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy & Data' }} />
        <Stack.Screen name="Flashcards" component={FlashcardScreen} options={{ title: 'Flashcards' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
